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
Public Class WebServiceProductMaster
    Inherits System.Web.Services.WebService

    ReadOnly db As New DBConnection
    ReadOnly js As New JavaScriptSerializer()
    ReadOnly data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str As String

    ReadOnly GBLUserID As String = Convert.ToString(HttpContext.Current.Session("UserID"))
    ReadOnly GBLCompanyID As String = Convert.ToString(HttpContext.Current.Session("CompanyID"))
    ReadOnly GBLFYear As String = Convert.ToString(HttpContext.Current.Session("FYear"))

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetSalesPerson() As String
        Try
            str = "SELECT A.LedgerID, A.LedgerName, A.MailingName,A.LegalName, NULLIF (A.State, '') AS State, NULLIF (A.City, '') AS City FROM LedgerMaster As A Where LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=27) And Designation='SALES EXECUTIVE' And CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 Order By MailingName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetClientData() As String
        Try
            str = "SELECT A.LedgerID, A.LedgerName, A.MailingName,A.LegalName, NULLIF (A.State, '') AS State, NULLIF (A.City, '') AS City, (SELECT TOP (1) StateTinNo FROM CountryStateMaster WHERE (State = A.State)) AS CompanyStateTinNo FROM LedgerMaster As A Where LedgerGroupID IN(Select Distinct LedgerGroupID From LedgerGroupMaster Where CompanyID=" & GBLCompanyID & " AND LedgerGroupNameID=24) And CompanyID=" & GBLCompanyID & " AND IsDeletedTransaction=0 Order By MailingName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductCode() As String
        Dim MaxVoucherNo As Long
        Dim KeyField As String

        Dim prefix As String = "PCM"
        Try

            Return db.GeneratePrefixedNo("ProductCatalogMaster", prefix, "MaxProductCode", MaxVoucherNo, "", " Where IsDeletedTransaction=0 And Prefix='" & prefix & "' And  CompanyID=" & GBLCompanyID)
        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteProductMaster(ByVal TxtPOID As Integer) As String

        Dim KeyField As String
        Dim dtExist As New DataTable

        If db.CheckAuthories("ProductMaster.aspx", GBLUserID, GBLCompanyID, "CanDelete") = False Then Return "You are not authorized to delete..!"

        str = "Select BookingID From JobBooking Where CompanyID=" & GBLCompanyID & " And ProductCatalogID=" & TxtPOID & " And IsDeletedTransaction = 0"
        db.FillDataTable(dtExist, str)
        If dtExist.Rows.Count > 0 Then
            Return "This product is used in another process..! Record can't be delete..."
        End If

        Try

            str = "Update ProductCatalogMaster Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " And ProductCatalogID=" & TxtPOID
            str += ";Update ProductVendorWiseRateSetting Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & TxtPOID
            str += ";Update ProductConfigurationMaster Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1  WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & TxtPOID
            KeyField = db.ExecuteNonSQLQuery(str)

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProductMasterData(ByVal ObjMain As Object, ByVal ObjProductConfig As Object, ByVal ObjVendorRate As Object, ByVal objProductConfigNew As Object, ByVal ObjVendorRateNew As Object, ByVal ProductID As Integer) As String

        Dim dt As New DataTable
        Dim KeyField, ProductCatalogID As String
        Dim AddColName, AddColValue, TableName As String

        Try
            If ProductID > 0 Then
                If (db.CheckAuthories("ProductMaster.aspx", GBLUserID, GBLCompanyID, "CanEdit", ObjMain(0)("ProductName")) = False) Then Return "You are not authorized to edit..!, Can't Edit"

                AddColName = "ModifiedDate=Getdate(),ModifiedBy=" & GBLUserID
                AddColValue = "ProductCatalogID = " & ProductID & " And CompanyID = " & GBLCompanyID
                KeyField = db.UpdateDatatableToDatabase(ObjMain, "ProductCatalogMaster", AddColName, 1, AddColValue)
                If KeyField <> "Success" Then
                    Return "Error while updating in master " & KeyField
                End If
                KeyField = db.UpdateDatatableToDatabase(ObjProductConfig, "ProductConfigurationMaster", AddColName, 2, AddColValue)
                If KeyField <> "Success" Then
                    Return "Error while updating in config " & KeyField
                End If
                KeyField = db.UpdateDatatableToDatabase(ObjVendorRate, "ProductVendorWiseRateSetting", AddColName, 2, AddColValue)
                If KeyField <> "Success" Then
                    Return "Error while updating in vendor rate " & KeyField
                End If

                TableName = "ProductConfigurationMaster"
                AddColName = "CreatedDate,CompanyID,CreatedBy"
                AddColValue = "Getdate()," & GBLCompanyID & "," & GBLUserID
                KeyField = db.InsertDatatableToDatabase(objProductConfigNew, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    Return "Error in product config :- " & KeyField
                End If

                TableName = "ProductVendorWiseRateSetting"
                KeyField = db.InsertDatatableToDatabase(ObjVendorRateNew, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    Return "Error in vendor rates :- " & KeyField
                End If

            Else
                If (db.CheckAuthories("ProductMaster.aspx", GBLUserID, GBLCompanyID, "CanSave", ObjMain(0)("ProductName")) = False) Then Return "You are not authorized to save..!, Can't Save"

                Dim dtExist As New DataTable
                db.FillDataTable(dtExist, "Select Distinct ProductName From ProductCatalogMaster Where CompanyID=" & GBLCompanyID & " And ProductName= '" & ObjMain(0)("ProductName") & "' And IsDeletedTransaction=0")
                If dtExist.Rows.Count > 0 Then
                    Return "Product name already exist, please check the product first.."
                End If
                Dim prefix = "PCM"
                Dim MaxVoucherNo As Long
                Dim ProductCatalogCode = db.GeneratePrefixedNo("ProductCatalogMaster", prefix, "MaxProductCode", MaxVoucherNo, "", " Where IsDeletedTransaction=0 And Prefix='" & prefix & "' And  CompanyID=" & GBLCompanyID)

                TableName = "ProductCatalogMaster"
                AddColName = "CreatedDate,CompanyID,CreatedBy,ProductCatalogCode,Prefix,MaxProductCode"
                AddColValue = "Getdate()," & GBLCompanyID & "," & GBLUserID & ",'" & ProductCatalogCode & "','" & prefix & "'," & MaxVoucherNo
                ProductCatalogID = db.InsertDatatableToDatabase(ObjMain, TableName, AddColName, AddColValue)

                If IsNumeric(ProductCatalogID) = False Then
                    Return "Error in main :- " & ProductCatalogID
                End If
                TableName = "ProductConfigurationMaster"
                AddColName = "CreatedDate,CompanyID,CreatedBy,ProductCatalogID"
                AddColValue = "Getdate()," & GBLCompanyID & ",'" & GBLUserID & "'," & ProductCatalogID
                KeyField = db.InsertDatatableToDatabase(ObjProductConfig, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    db.ExecuteNonSQLQuery("Delete from ProductCatalogMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                    db.ExecuteNonSQLQuery("Delete from ProductConfigurationMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                    Return "Error in product config :- " & KeyField
                End If

                TableName = "ProductVendorWiseRateSetting"
                KeyField = db.InsertDatatableToDatabase(ObjVendorRate, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    db.ExecuteNonSQLQuery("Delete from ProductCatalogMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                    db.ExecuteNonSQLQuery("Delete from ProductConfigurationMaster WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                    db.ExecuteNonSQLQuery("Delete from ProductVendorWiseRateSetting WHERE CompanyID=" & GBLCompanyID & " and ProductCatalogID=" & ProductCatalogID)
                    Return "Error in vendor rates :- " & KeyField
                End If
            End If

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    Public Function UploadProductImageFile() As String
        Dim httpPostedFile = HttpContext.Current.Request.Files("UserAttchedFiles")
        Try

            If httpPostedFile IsNot Nothing Then
                ' Get the complete file path
                Dim fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("/Files/ProductFiles/"), httpPostedFile.FileName)

                Dim fi As New FileInfo(fileSavePath)
                If (fi.Exists) Then    'if file exists, delete it
                    fi.Delete()
                End If
                ' Save the uploaded file to "ProductFiles" folder
                httpPostedFile.SaveAs(fileSavePath)
            End If
            Return "Success"

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetVendorRateSetting(ByVal productId As Integer) As String
        Try

            str = "Select RateSettingID,ProductCatalogID,SequenceNo,VendorID,VendorRate From ProductVendorWiseRateSetting Where IsDeletedTransaction=0 And ProductCatalogID=" & productId & " And CompanyID = " & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductConfigData(ByVal productId As Integer) As String
        Try

            str = "SELECT ProductConfigID, ProductCatalogID, SequenceNo, ParameterName, ParameterDisplayName, ParameterDefaultValue, ProductFormula,null ParameterValue,Isnull(IsDisplayParameter,0) AS IsDisplayParameter FROM ProductConfigurationMaster Where IsDeletedTransaction=0 And ProductCatalogID=" & productId & " And CompanyID = " & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProductMasterList() As String
        Try

            str = "SELECT PCM.ProductCatalogID,'Files/ProductFiles/'+PCM.ProductImagePath ProductImagePath, PCM.ProductCatalogCode,PCM.ProcessIDStr,PCM.DefaultProcessStr,PCM.DisplayProcessStr, PCM.ProductName,PCM.ProductHSNID,Isnull(PCM.Remark,'') Remark, PCM.ProductDescription, PCM.ReferenceProductCode,PCM.CategoryID, CM.CategoryName, PHM.ProductHSNName " &
                    " From ProductCatalogMaster As PCM INNER Join ProductHSNMaster As PHM On PHM.ProductHSNID = PCM.ProductHSNID And PCM.CompanyID = PHM.CompanyID" &
                    " INNER JOIN CategoryMaster AS CM ON CM.CategoryID = PCM.CategoryID And PCM.CompanyID =CM.CompanyID" &
                    " Where PCM.IsDeletedTransaction=0 And PCM.CompanyID = " & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetInputParameterData() As String
        Try

            str = "Select Distinct FieldName ParameterName,FieldDisplayName From ItemGroupFieldMaster Where IsDeletedTransaction=0 And FieldFormula <>'' And ItemGroupID IN (Select ItemGroupID From ItemGroupMaster Where IsDeletedTransaction=0 And ItemGroupNameID =-1 And CompanyID = " & GBLCompanyID & ") And CompanyID = " & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetQuotationNo() As String
        Try
            Dim prefix = "Q"
            Dim MaxVoucherNo As Long
            Return db.GeneratePrefixedNo("ProductQuotation", prefix, "MaxEstimateNo", MaxVoucherNo, "", " Where IsDeletedTransaction=0 And Prefix='" & prefix & "' And  CompanyID=" & GBLCompanyID)
        Catch ex As Exception
            Return "fail"
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProductPlanning(ByVal ObjJSJson As Object, ByVal GblOperId As String, ByVal LedgerID As Integer) As String
        Try
            ', ByVal OprFactors As Object
            Dim dt As New DataTable
            db.ConvertObjectToDatatable(ObjJSJson, dt)
            'Dim Gbl_Job_H = Val(dt.Rows(0)(0))
            'Dim Gbl_Job_L = Val(dt.Rows(0)(1))
            Dim PlanContQty = Val(dt.Rows(0)("PlanContQty"))
            Dim ProductCatalogID = Val(dt.Rows(0)("ProductCatalogID"))
            Dim CalculationValue = Val(dt.Rows(0)("CalculationValue"))
            Dim Gbl_DT_Operation, GblDTPlan As New DataTable
            Dim Op_Amt As Double = 0
            Dim GblVendorID As Integer
            Dim GblVendorName, City As String
            Dim FinalAmount, PlanAmt, VendorRate As Long

            InitDataTable(GblDTPlan)
            str = "SELECT DISTINCT PM.TypeofCharges,Case When ISNULL(VWPR.Rate, 0)=0 Then PM.Rate Else ISNULL(VWPR.Rate, 0) End AS Rate,Case When Isnull(VWPR.MinimumCharges,0)=0 Then PM.MinimumCharges Else Isnull(VWPR.MinimumCharges,0) End As MinimumCharges, PM.SetupCharges, PM.SizeToBeConsidered, PM.ChargeApplyOnSheets, PM.PrePress, PM.MinimumL AS SizeL, PM.MinimumW AS SizeW, PM.MaximumL, PM.MaximumW, 0 AS Amount, 0 AS PlanID, PM.ProcessID, PM.ProcessName, " & PlanContQty & " AS Quantity,IsNull(VWPR.LedgerID,0) VendorID FROM ProcessMaster AS PM LEFT OUTER JOIN VendorWiseProcessRates AS VWPR ON VWPR.ProcessID = PM.ProcessID AND VWPR.CompanyID = PM.CompanyID AND PM.IsDeletedTransaction = VWPR.IsDeletedTransaction Where PM.ProcessId In (" & GblOperId & ") And PM.CompanyId = " & GBLCompanyID & " And (PM.IsDeletedTransaction=0) "
            db.FillDataTable(Gbl_DT_Operation, str)

            Dim FinalDtOpr As New DataTable
            FinalDtOpr = Gbl_DT_Operation.Copy()
            FinalDtOpr.Clear()

            Dim TempVendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
            TempVendorID = IIf(TempVendorID = 0 Or TempVendorID = "", "", " And LedgerID=" & TempVendorID)
            Dim DTVendorList As New DataTable
            str = "Select Distinct LedgerID AS VendorID,LedgerName As VendorName,City, Isnull((Select Distinct VendorRate From ProductVendorWiseRateSetting AS PVR Where (PVR.IsDeletedTransaction = 0) AND PVR.VendorID = VM.LedgerID AND PVR.CompanyID = VM.CompanyID  And PVR.ProductCatalogID =" & ProductCatalogID & "),0) VendorRate From LedgerMaster As VM Where LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And   LedgerGroupNameID IN(25)) AND IsDeletedTransaction=0 AND CompanyID=" & GBLCompanyID & " " & IIf(LedgerID = 0, " OR ", " AND ") & "  City In(Select City From LedgerMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And LedgerID=" & LedgerID & ") " & TempVendorID & " Order By VendorName"
            db.FillDataTable(DTVendorList, str)
            If DTVendorList.Rows.Count = 0 Then
                str = "Select Distinct LedgerID AS VendorID,LedgerName As VendorName,City, Isnull((Select Distinct VendorRate From ProductVendorWiseRateSetting AS PVR Where (PVR.IsDeletedTransaction = 0) AND PVR.VendorID = VM.LedgerID AND PVR.CompanyID = VM.CompanyID  And PVR.ProductCatalogID =" & ProductCatalogID & "),0) VendorRate From LedgerMaster As VM Where LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where IsDeletedTransaction=0 And CompanyID=" & GBLCompanyID & " And   LedgerGroupNameID IN(25)) AND IsDeletedTransaction=0 AND CompanyID=" & GBLCompanyID & TempVendorID & " Order By VendorName"
                db.FillDataTable(DTVendorList, str)
            End If
            Dim GblDTOprSlabs, GblDTOprFactors As New DataTable()
            'db.ConvertObjectToDatatable(OprFactors, GblDTOprFactors, "")

            str = "SELECT DISTINCT PM.TypeofCharges, Case When ISNULL(PMS.Rate, 0)=0 Then Round(ISNULL(PM.Rate, 0),4) Else Round(ISNULL(PMS.Rate, 0),4) End AS Rate, Case When PMS.MinimumCharges=0 Then PM.MinimumCharges Else PMS.MinimumCharges End As MinimumCharges, PM.SetupCharges, PM.SizeToBeConsidered, PM.ChargeApplyOnSheets, PM.PrePress, PM.ProcessID, PM.ProcessName,Isnull(PMS.FromQty,0) AS FromQty,IsNull(PMS.ToQty,0) As ToQty,Isnull(PMS.RateFactor,'') As RateFactor FROM ProcessMaster AS PM Left JOIN ProcessMasterSlabs AS PMS ON PMS.ProcessID = PM.ProcessID And PMS.IsLocked=0 And PM.CompanyID=PMS.CompanyID Where PM.ProcessId In (" & GblOperId & ") And PM.CompanyId = " & GBLCompanyID & " And Isnull(PM.IsDeletedTransaction,0)<>1 " & TempVendorID
            db.FillDataTable(GblDTOprSlabs, str)

            For j = 0 To DTVendorList.Rows.Count - 1
                GblVendorID = DTVendorList.Rows(j)("VendorID")
                GblVendorName = DTVendorList.Rows(j)("VendorName")
                VendorRate = DTVendorList.Rows(j)("VendorRate")
                City = DTVendorList.Rows(j)("City")
                PlanAmt = (CalculationValue * VendorRate * PlanContQty)

                Op_Amt = 0
                For i = 0 To Gbl_DT_Operation.Rows.Count - 1
                    If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("VendorID")), 0, Gbl_DT_Operation.Rows(i)("VendorID")) = GblVendorID Then

                        For k = 0 To GblDTOprSlabs.Rows.Count - 1
                            'If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("ProcessID")), 0, Gbl_DT_Operation.Rows(i)("ProcessID")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ProcessID")), 0, GblDTOprSlabs.Rows(k)("ProcessID")) Then
                            If IIf(IsDBNull(GblDTOprSlabs.Rows(k)("FromQty")), 0, GblDTOprSlabs.Rows(k)("FromQty")) >= 1 And GblDTOprFactors.Rows(j)("ProcessID") = GblDTOprSlabs.Rows(k)("ProcessID") And IIf(IsDBNull(GblDTOprFactors.Rows(j)("RateFactor")), "", GblDTOprFactors.Rows(j)("RateFactor")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("RateFactor")), "", GblDTOprSlabs.Rows(k)("RateFactor")) Then
                                'If (QTY >= IIf(IsDBNull(GblDTOprSlabs.Rows(k)("FromQty")), 0, GblDTOprSlabs.Rows(k)("FromQty")) And QTY <= IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ToQty")), 0, GblDTOprSlabs.Rows(k)("ToQty")) And IIf(IsDBNull(GblDTOprFactors.Rows(j)("RateFactor")), "", GblDTOprFactors.Rows(j)("RateFactor")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("RateFactor")), "", GblDTOprSlabs.Rows(k)("RateFactor"))) Then
                                Gbl_DT_Operation.Rows(i)("Rate") = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("Rate")), 0, GblDTOprSlabs.Rows(k)("Rate"))
                                Gbl_DT_Operation.Rows(i)("MinimumCharges") = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("MinimumCharges")), 0, GblDTOprSlabs.Rows(k)("MinimumCharges"))
                                Exit For
                                'End If
                                'End If
                            End If
                        Next

                        Dim Amt = (CalculationValue * IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("Rate")), 0, Gbl_DT_Operation.Rows(i)("Rate")) * PlanContQty)
                        Dim MinimumCharges = IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("MinimumCharges")), 0, Gbl_DT_Operation.Rows(i)("MinimumCharges"))
                        If MinimumCharges > Amt Then
                            Amt = MinimumCharges
                        End If
                        Gbl_DT_Operation.Rows(i)("Amount") = Amt
                        Op_Amt += Amt

                        FinalDtOpr.ImportRow(Gbl_DT_Operation.Rows(i))

                    End If
                Next

                FinalAmount = Op_Amt + PlanAmt
                If PlanAmt > 0 Then
                    GblDTPlan.NewRow()
                    GblDTPlan.Rows.Add(GblVendorID, GblVendorName, City, ProductCatalogID, PlanContQty, VendorRate, VendorRate, Op_Amt, FinalAmount, RoundUp(FinalAmount / PlanContQty, 2))
                End If
            Next

            GblDTPlan.TableName = "TblPlanning"
            Gbl_DT_Operation.TableName = "TblOperations"
            Dim DataSet = New DataSet()
            DataSet.Merge(GblDTPlan)
            DataSet.Merge(FinalDtOpr)

            data.Message = db.ConvertDataSetsTojSonString(DataSet)

            Return js.Serialize(data.Message)

        Catch ex As Exception
            Return "error: " & ex.Message
        End Try
    End Function
    Private Sub InitDataTable(ByRef GblDTPlan As DataTable)

        With GblDTPlan

            .Columns.Add("VendorID", GetType(Double))
            .Columns.Add("VendorName", GetType(String))
            .Columns.Add("City", GetType(String))
            .Columns.Add("ParameterID", GetType(Double))
            .Columns.Add("RequiredQuantity", GetType(Double))
            .Columns.Add("VendorRate", GetType(Long))
            .Columns.Add("EstimationRate", GetType(Long))
            .Columns.Add("ProcessCost", GetType(Long))
            .Columns.Add("FinalAmount", GetType(Long))
            .Columns.Add("UnitCost", GetType(Long))

        End With

    End Sub
    Private Function RoundUp(value As Double, decimals As Integer) As Double
        Return Math.Ceiling(value * (10 ^ decimals)) / (10 ^ decimals)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveProjectQuotation(ByVal ObjMain As Object, ByVal ObjProductConfig As Object) As String
        ', ByVal ObjProductConfigNew As Object,
        Dim ProjectID As String = 0
        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, AddColValue, TableName As String

        Try
            If ProjectID > 0 Then
                If (db.CheckAuthories("ProjectQuotation.aspx", GBLUserID, GBLCompanyID, "CanEdit", ObjMain(0)("ProjectName")) = False) Then Return "You are not authorized to edit..!, Can't Edit"

                AddColName = "ModifiedDate=Getdate(),ModifiedBy=" & GBLUserID
                AddColValue = "ProductEstimateID = " & ProjectID & " And CompanyID = " & GBLCompanyID
                KeyField = db.UpdateDatatableToDatabase(ObjMain, "ProductQuotation", AddColName, 1, AddColValue)
                If KeyField <> "Success" Then
                    Return "Error while updating in master " & KeyField
                End If

                KeyField = db.UpdateDatatableToDatabase(ObjProductConfig, "ProductQuotationContents", AddColName, 2, AddColValue)
                If KeyField <> "Success" Then
                    Return "Error while updating in contents " & KeyField
                End If

                'TableName = "ProductQuotationContents"
                'AddColName = "CreatedDate,CompanyID,CreatedBy"
                'AddColValue = "Getdate()," & GBLCompanyID & "," & GBLUserID
                'KeyField = db.InsertDatatableToDatabase(ObjProductConfigNew, TableName, AddColName, AddColValue)
                'If IsNumeric(KeyField) = False Then
                '    Return "Error in product config :- " & KeyField
                'End If

            Else
                If (db.CheckAuthories("ProjectQuotation.aspx", GBLUserID, GBLCompanyID, "CanSave", ObjMain(0)("ProjectName")) = False) Then Return "You are not authorized to save..!, Can't Save"

                Dim prefix = "Q"
                Dim MaxVoucherNo As Long
                Dim EstimateNo = db.GeneratePrefixedNo("ProductQuotation", prefix, "MaxEstimateNo", MaxVoucherNo, "", " Where IsDeletedTransaction=0 And Prefix='" & prefix & "' And  CompanyID=" & GBLCompanyID)

                TableName = "ProductQuotation"
                AddColName = "CreatedDate,CompanyID,CreatedBy,EstimateNo,Prefix,MaxEstimateNo"
                AddColValue = "Getdate()," & GBLCompanyID & "," & GBLUserID & ",'" & EstimateNo & "','" & prefix & "'," & MaxVoucherNo
                ProjectID = db.InsertDatatableToDatabase(ObjMain, TableName, AddColName, AddColValue)

                If IsNumeric(ProjectID) = False Then
                    Return "Error in main :- " & ProjectID
                End If
                TableName = "ProductQuotationContents"
                AddColName = "CreatedDate,CompanyID,CreatedBy,ProductEstimateID"
                AddColValue = "Getdate()," & GBLCompanyID & ",'" & GBLUserID & "'," & ProjectID
                KeyField = db.InsertDatatableToDatabase(ObjProductConfig, TableName, AddColName, AddColValue)
                If IsNumeric(KeyField) = False Then
                    db.ExecuteNonSQLQuery("Delete from ProductQuotation WHERE CompanyID=" & GBLCompanyID & " and ProductEstimateID=" & ProjectID)
                    db.ExecuteNonSQLQuery("Delete from ProductQuotationContents WHERE CompanyID=" & GBLCompanyID & " and ProductEstimateID=" & ProjectID)
                    Return "Error in product config :- " & KeyField
                End If
            End If

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField

    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetProjectQuotationList() As String
        Try

            str = "SELECT PQ.ProductEstimateID, PQC.ProductEstimationContentID, PQ.LedgerID, LM.LedgerName,SLM.LedgerName AS SalesLedgerName ,PQ.SalesPersonID, PQ.Narration, PQ.EstimateNo, PQ.ProjectName, PQ.CreatedDate, PQ.IsApproved, PQ.ApprovedBy, PQC.Quantity, PQC.ProductCatalogID, PCM.ProductName,PQC.VendorID,VLM.LedgerName AS VednorName, PQC.Rate, PQC.Amount, PQC.ProcessCost, PQC.FinalAmount, PQC.UnitCost, PQC.RateType, PQC.ProcessIDStr,PQC.DefaultProcessStr,PQ.FreightAmount/*, PQC.ProductInputSizes*/ " &
                    "FROM  dbo.ProductQuotation AS PQ " &
                    "INNER JOIN dbo.ProductQuotationContents AS PQC ON PQ.ProductEstimateID = PQC.ProductEstimateID AND PQ.CompanyID = PQC.CompanyID " &
                    "INNER JOIN dbo.ProductCatalogMaster AS PCM ON PCM.ProductCatalogID = PQC.ProductCatalogID AND PQ.CompanyID = PQC.CompanyID " &
                    "INNER JOIN LedgerMaster As LM On LM.LedgerID=PQ.LedgerID And LM.CompanyID = PQ.CompanyID " &
                    "INNER JOIN LedgerMaster As SLM On SLM.LedgerID=PQ.SalesPersonID And SLM.CompanyID = PQ.CompanyID " &
                    "INNER JOIN LedgerMaster As VLM On VLM.LedgerID=PQC.VendorID And VLM.CompanyID = PQC.CompanyID Where PQ.IsDeletedTransaction=0 And PQ.CompanyID= " & GBLCompanyID
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteProjectQuotation(ByVal TxtPOID As Integer) As String

        Dim KeyField As String
        Dim dtExist As New DataTable

        If db.CheckAuthories("ProjectQuotation.aspx", GBLUserID, GBLCompanyID, "CanDelete", TxtPOID) = False Then Return "You are Not authorized To delete..!"

        str = "Select ProductEstimateID From ProductQuotation Where IsApproved=1 And CompanyID=" & GBLCompanyID & " And ProductEstimateID=" & TxtPOID & " And IsDeletedTransaction = 0"
        db.FillDataTable(dtExist, str)
        If dtExist.Rows.Count > 0 Then
            Return "This product Is further processed..! Record can't be delete..."
        End If

        Try

            str = "Update ProductQuotation Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " And ProductEstimateID=" & TxtPOID
            str += ";Update ProductQuotationContents Set DeletedBy='" & GBLUserID & "',DeletedDate=Getdate(),IsDeletedTransaction=1 WHERE CompanyID=" & GBLCompanyID & " and ProductEstimateID=" & TxtPOID
            KeyField = db.ExecuteNonSQLQuery(str)

        Catch ex As Exception
            KeyField = "fail " & ex.Message
        End Try
        Return KeyField
    End Function
End Class