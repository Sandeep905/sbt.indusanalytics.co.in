Imports System.Data
Imports System.Data.SqlClient
Imports System.Web.Script.Serialization
Imports System.Web.Script.Services
Imports System.Web.Services
Imports Connection

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class Api_shiring_service
    Inherits System.Web.Services.WebService

    Dim str As String = ""
    Dim planErrors As String = ""
    Dim Gbl_Job_Overlap_Flap, Gbl_Job_Open_Flap As Double
    Dim Gbl_Die_Size_L, Gbl_Die_Size_H As Double
    Dim Gbl_Job_Tongue_Height, Gbl_Job_Bottom_Flap As Double

    Dim db As New DBConnection
    Private ReadOnly DA As SqlDataAdapter
    Dim Gbl_Half_Ups_Logic, Check_Plan_In_Special_Size, Check_Plan_In_Standard_Size, CheckPaperByClient, ChkPlanInAvailableStock As Boolean
    Dim k, Gbl_Machine_Name As String
    Dim Gbl_lower_Width, Gbl_upper_Width As Double
    Dim CompanyID, GblVendorID As Long, Gbl_Job_Leaves, Gbl_Job_Flap_Width As Long
    Dim Gbl_Machine_Gripper, Gbl_Gripper As Double
    Dim Gbl_Printing_Style, Gbl_Flat_Wastage_Type, Gbl_Plate_Type, Gbl_Grain_Direction, Gbl_Plan_Grain_Direction As String
    Dim Gbl_UPS_L, Gbl_UPS_H, Gbl_Job_Pages, Gbl_Job_Ups As Long
    Dim Gbl_Flat_Wastage_Value, Gbl_Job_Trimming_TB, Gbl_Job_Trimming_LR As Double
    Dim Gbl_Striping_LR, Gbl_Striping_TB, Gbl_ColorStrip As Double
    Dim Gbl_DT_plan, DT_Printing_Slabs, DT_Client_Printing_Slabs, Gbl_DT_Search_In_Machine, DT_Vendor_Printing_Slabs As New DataTable
    Dim Gbl_DT_Paper, Gbl_DT_Machine, Gbl_DT_Operation As New DataTable
    Dim Gbl_Paper_Rate, Gbl_Paper_H, Gbl_Paper_L, Gbl_Paper_TrimmingLR, Gbl_Paper_TrimmingTB As Double
    Dim Gbl_Paper_GSM As Integer
    Dim Gbl_Front_Color As Byte, Gbl_Back_Color As Byte
    Dim Gbl_Sheet_L As Double, Gbl_Sheet_W As Double
    Dim Gbl_Order_Quantity As Single
    '    Dim Gbl_Is_Balance_Piece, Gbl_Is_Standard_Paper As Byte
    Dim Gbl_GripperSide, Gbl_Orientation As String
    Dim Gbl_Paper_ID, Gbl_Machine_ID, Gbl_Ledger_ID As Integer
    Dim Gbl_Job_H, Gbl_Job_L, Gbl_Job_W As Double
    Dim Gbl_Paper_Detail As String
    Dim Gbl_Bal_Side, Bal_Piece As String
    Dim Gbl_Paper_Rate_Type As String = ""
    Dim Gbl_Paper_Quality, Gbl_Paper_Mill, Gbl_Paper_Finish As String

    Dim Gbl_Machine_Type, Gbl_Plan_Type As String
    Dim Gbl_InterLock_Style As Integer
    Dim Gbl_Unit_Per_Packing, Gbl_Packing As String
    Dim Coating_Charges As Double = 0
    Dim Special_Color_Back_Charges As Double = 0
    Dim Special_Color_Front_Charges As Double = 0
    Dim Gbl_Special_Front_Color, Gbl_Special_Back_Color As Integer
    Dim Special_Color_Front_Amount, Special_Color_Back_Amount As Double
    Dim Rf_Dt_Opr As New DataTable

    Dim GblDTReel As New DataTable
    Dim Gbl_M_Min_H, GblMachineMaxW As Double
    Dim GblDTSlittingMachine As New DataTable
    Dim GblDTMachineCoatingRates As New DataTable
    'Dim GblDTVendorProcessRates As New DataTable

    Dim GblDTBook, GblDTOprFactors, GblDTOprSlabs As New DataTable
    Dim MachineIDFilter As String = ""
    Dim GblMainPaperGroup As String = ""
    Dim GblOperId As String = ""
    Dim GblOnlineCoating As String = ""
    Dim SlabPrintingChargeN As Double = 0
    Dim GblPaperPurchaseRateType, GblVendorName As String

    <System.Web.Services.WebMethod()>
    <ScriptMethod(UseHttpGet:=True, ResponseFormat:=ResponseFormat.Json)>
    Public Sub HelloWorld()
        k = Convert.ToString(HttpContext.Current.Request.QueryString("name"))
        CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim js As New JavaScriptSerializer()
        Context.Response.Clear()
        Context.Response.ContentType = "application/json"
        Dim data As New HelloWorldData()
        data.Message = ConvertDataTableTojSonString(GetDataTable)
        Context.Response.Write(js.Serialize(data.Message))
    End Sub

    Public Function GetDataTable() As DataTable
        Dim dataTable As New DataTable()
        Dim str As String
        Try

            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = Convert.ToString(HttpContext.Current.Session("Version"))
            Dim TempVendorID = GblVendorID.ToString()
            TempVendorID = IIf(TempVendorID = 0 Or TempVendorID = "", "", " And VendorID=" & TempVendorID)

            If k = "Paper_Planning" Then
                str = "SELECT DISTINCT IM.ItemID AS PaperID, IM.Quality, IM.GSM, IM.Manufecturer, IM.PackingType, IM.UnitPerPacking, IM.WtPerPacking, IM.EstimationRate, IM.Finish, 0 AS PaperTrimming,Round(IM.SizeW,2) As SizeW, Round(IM.SizeL,2) As SizeL, IM.Caliper, ISNULL(IM.IsStandardItem, 0) AS IsStandardItem, IM.ItemCode AS PaperCode, 0 AS IsBalancePiece, ISNULL(IM.EstimationUnit, '') AS EstimationUnit, IM.ItemName AS PaperName, IM.PaperGroup, IG.ItemGroupName, IM.PurchaseUnit " &
                        "FROM ItemMaster AS IM INNER JOIN ItemGroupMaster AS IG ON IG.ItemGroupID = IM.ItemGroupID AND IM.CompanyID = IG.CompanyID " & IIf(Gbl_Paper_Mill = "", "", "And IM.Manufecturer='" & Gbl_Paper_Mill & "'") & IIf(Gbl_Paper_Finish = "", " ", " And IM.Finish ='" & Gbl_Paper_Finish & "'") &
                        "Where IM.Quality='" & Gbl_Paper_Quality & "' And IM.GSM=" & Gbl_Paper_GSM & " And IM.CompanyID=" & CompanyID & TempVendorID & " " & IIf(ChkPlanInAvailableStock = True, " And Isnull(IM.PhysicalStock,0)>0 ", " ") & " And IG.IsDeletedTransaction=0 And IM.IsDeletedTransaction = 0 " & IIf(Check_Plan_In_Standard_Size = True, "  And IM.IsStandardItem=1 ", " ")
            ElseIf k = "Search_In_Machine_Selection" Then
                ' str = "SELECT MachineId, MachineName, MinimumSheet, Colors, MakeReadyCharges, MakeReadyWastageSheet, MachineType, MakeReadyTime, ElectricConsumption, PrintingMargin, MachineSpeed, LabourCharges, ChargesType, RoundofImpressionsWith, IsPerfectaMachine, BasicPrintingCharges , JobChangeOverTime, OtherCharges, WastageType, WastageCalculationOn,IsSpecialMachine From MachineMaster  Where CompanyId = " & CompanyID & " " & IIf(MachineIDFilter = "", "", MachineIDFilter) & TempVendorID & " Order By MachineID"
                str = "SELECT MM.MachineId, MM.MachineName, MM.MinimumSheet, MM.Colors, MM.MakeReadyCharges, MM.MakeReadyWastageSheet, MM.MachineType, MM.MakeReadyTime, ElectricConsumption, PrintingMargin, MachineSpeed, LabourCharges, ChargesType, RoundofImpressionsWith, IsPerfectaMachine, VMS.Rate as BasicPrintingCharges , JobChangeOverTime, OtherCharges, WastageType, WastageCalculationOn,IsSpecialMachine From MachineMaster as MM inner join VendorWiseMachineSlabMaster as VMS on MM.MachineId = VMS.MachineID and MM.CompanyID = VMS.CompanyID  Where MM.CompanyId = " & CompanyID & "   Order By MM.MachineID"
            ElseIf k = "Online_Coated_Rates" Then
                str = "SELECT MachineID, SheetRangeFrom, SheetRangeTo, CoatingName, Rate From MachineOnlineCoatingRates Where CompanyId = " & CompanyID & TempVendorID & "  Order By MachineID, SheetRangeFrom, SheetRangeTo"
            ElseIf k = "Client_Printing_Slabs" Then
                str = "SELECT MachineID, SheetRangeFrom, SheetRangeTo, Wastage, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges, FlatRate, FlatWastageSheets, ApplyAsFixedCharge, MinimumSheet, ChargesType, RoundofImpressionsWith, BasicPrintingCharges From ClientMachineCostSettings Where LedgerID = " & Gbl_Ledger_ID & "  And CompanyId = " & CompanyID & " " & IIf(MachineIDFilter = "", "", MachineIDFilter) & " Order By MachineID, SheetRangeFrom, SheetRangeTo "   '' Order By Machine_ID, SheetRangeFrom, SheetRangeTo"           
            ElseIf k = "Printing_Slabs" Then
                str = "Select MachineID, SheetRangeFrom, SheetRangeTo, Wastage, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges,CoatingCharges, SpecialColorFrontCharges, SpecialColorBackCharges, FlatRate, FlatWastageSheets, ApplyAsFixedCharge,PaperGroup,MaxPlanL,MaxPlanW,MinCharges From MachineSlabMaster  Where CompanyId = " & CompanyID & "  " & IIf(MachineIDFilter = "", "", MachineIDFilter) & "  Order By (MaxPlanL * MaxPlanW) ASC "
            ElseIf k = "Vendor_Printing_Slabs" Then
                str = "Select MachineID, SheetRangeFrom, SheetRangeTo, Wastage, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges,CoatingCharges, SpecialColorFrontCharges, SpecialColorBackCharges, FlatRate, FlatWastageSheets, ApplyAsFixedCharge,PaperGroup,MaxPlanL,MaxPlanW,MinCharges,LedgerID From VendorWiseMachineSlabMaster Where CompanyId = " & CompanyID & "  " & IIf(MachineIDFilter = "", "", MachineIDFilter) & TempVendorID.Replace("VendorID", "LedgerID") & " Order By (MaxPlanL * MaxPlanW) ASC "
            ElseIf k = "Planning_Machines" Then
                'str = "SELECT MachineId, MachineName, Isnull(MaxLength,0) as MaxLength, Isnull(MaxWidth,0) as MaxWidth, Isnull(MinLength,0) As MinLength, Isnull(MinWidth,0) As MinWidth, Isnull(MaxPrintL,0) As MaxPrintL, Isnull(MaxPrintW,0) As MaxPrintW, Isnull(MinPrintL,0) As MinPrintL, Isnull(MinPrintW,0) As MinPrintW,  Isnull(Colors,0) As Colors,Isnull(MachineType,'') As MachineType,Isnull(ChargesType,'') As ChargesType, Isnull(Gripper,0) As Gripper, Isnull(IsPerfectaMachine,0) AS IsPerfectaMachine, Isnull(RoundofImpressionsWith,0) As RoundofImpressionsWith, MachineType, Isnull(BasicPrintingCharges,0) As BasicPrintingCharges, Isnull(MachineSpeed,0) As MachineSpeed, Isnull(MakeReadyTime,0) As MakeReadyTime, JobChangeOverTime, WastageType, WastageCalculationOn,Isnull(IsSpecialMachine ,0) As IsSpecialMachine FROM MachineMaster Where /*DepartmentID=0 AND*/ Isnull(IsDeletedTransaction,0)=0 And (MachineType In ('Sheetfed Offset', 'Digital') Or Isnull(IsPlanningMachine,0)=1 ) /*AND (Isnull(Colors,0) >= " & Gbl_Front_Color & ")*/ And CompanyId = " & CompanyID & " " & MachineIDFilter & TempVendorID & " Union SELECT MachineId, MachineName, Isnull(MaxLength,0) as MaxLength, Isnull(MaxWidth,0) as MaxWidth, Isnull(MinLength,0) As MinLength, Isnull(MinWidth,0) As MinWidth, Isnull(MaxPrintL,0) As MaxPrintL, Isnull(MaxPrintW,0) As MaxPrintW, Isnull(MinPrintL,0) As MinPrintL, Isnull(MinPrintW,0) As MinPrintW, Isnull(Colors,0) As Colors,Isnull(MachineType,'') As MachineType,Isnull(ChargesType,'') As ChargesType, Isnull(Gripper,0) As Gripper, Isnull(IsPerfectaMachine,0) As IsPerfectaMachine, Isnull(RoundofImpressionsWith,0) As RoundofImpressionsWith, MachineType, Isnull(BasicPrintingCharges,0) As BasicPrintingCharges, Isnull(MachineSpeed,0) As MachineSpeed, Isnull(MakeReadyTime,0) As MakeReadyTime , JobChangeOverTime, WastageType, WastageCalculationOn,Isnull(IsSpecialMachine,0) As IsSpecialMachine FROM MachineMaster Where Isnull(IsDeletedTransaction,0)=0 And DepartmentID=100 AND (MachineType ='Web Offset') /*AND (Isnull(Colors,0) >= " & Gbl_Front_Color & ")*/ And CompanyId = " & CompanyID & "  " & MachineIDFilter & TempVendorID
                str = "SELECT MachineId, MachineName, Isnull(MaxLength,0) as MaxLength, Isnull(MaxWidth,0) as MaxWidth, Isnull(MinLength,0) As MinLength, Isnull(MinWidth,0) As MinWidth, Isnull(MaxPrintL,0) As MaxPrintL, Isnull(MaxPrintW,0) As MaxPrintW, Isnull(MinPrintL,0) As MinPrintL, Isnull(MinPrintW,0) As MinPrintW,  Isnull(Colors,0) As Colors,Isnull(MachineType,'') As MachineType,Isnull(ChargesType,'') As ChargesType, Isnull(Gripper,0) As Gripper, Isnull(IsPerfectaMachine,0) AS IsPerfectaMachine, Isnull(RoundofImpressionsWith,0) As RoundofImpressionsWith, MachineType, Isnull(BasicPrintingCharges,0) As BasicPrintingCharges, Isnull(MachineSpeed,0) As MachineSpeed, Isnull(MakeReadyTime,0) As MakeReadyTime, JobChangeOverTime, WastageType, WastageCalculationOn,Isnull(IsSpecialMachine ,0) As IsSpecialMachine FROM MachineMaster Where /*DepartmentID=0 AND*/ Isnull(IsDeletedTransaction,0)=0 And (MachineType In ('Sheetfed Offset', 'Digital') Or Isnull(IsPlanningMachine,0)=1 ) /*AND (Isnull(Colors,0) >= " & Gbl_Front_Color & ")*/ And CompanyId = " & CompanyID & " " & MachineIDFilter & " Union SELECT MachineId, MachineName, Isnull(MaxLength,0) as MaxLength, Isnull(MaxWidth,0) as MaxWidth, Isnull(MinLength,0) As MinLength, Isnull(MinWidth,0) As MinWidth, Isnull(MaxPrintL,0) As MaxPrintL, Isnull(MaxPrintW,0) As MaxPrintW, Isnull(MinPrintL,0) As MinPrintL, Isnull(MinPrintW,0) As MinPrintW, Isnull(Colors,0) As Colors,Isnull(MachineType,'') As MachineType,Isnull(ChargesType,'') As ChargesType, Isnull(Gripper,0) As Gripper, Isnull(IsPerfectaMachine,0) As IsPerfectaMachine, Isnull(RoundofImpressionsWith,0) As RoundofImpressionsWith, MachineType, Isnull(BasicPrintingCharges,0) As BasicPrintingCharges, Isnull(MachineSpeed,0) As MachineSpeed, Isnull(MakeReadyTime,0) As MakeReadyTime , JobChangeOverTime, WastageType, WastageCalculationOn,Isnull(IsSpecialMachine,0) As IsSpecialMachine FROM MachineMaster Where Isnull(IsDeletedTransaction,0)=0 And DepartmentID=100 AND (MachineType ='Web Offset') /*AND (Isnull(Colors,0) >= " & Gbl_Front_Color & ")*/ And CompanyId = " & CompanyID & "  " & MachineIDFilter
            ElseIf k = "Slitting_Machine" Then
                str = "Select MachineID, MachineName, Gripper, MaxReelSize, WebCutOffSize, MinReelSize, WebCutOffSizeMin, MachineType From MachineMaster Where CompanyId = " & CompanyID & " /*" & IIf(MachineIDFilter = "", "", MachineIDFilter) & TempVendorID & "  And DepartmentID = 0*/ AND (MachineType In ('Reel to Sheet Cutting'))  "
            ElseIf k = "Machine_Online_Coating_Rates" Then
                str = "SELECT MachineID, SheetRangeFrom, SheetRangeTo, CoatingName, Rate,RateType,BasicCoatingCharges From MachineOnlineCoatingRates Where CompanyId = " & CompanyID & " And CoatingName='" & GblOnlineCoating & "' " & IIf(MachineIDFilter = "", "", MachineIDFilter) & TempVendorID & "  Order By MachineID, SheetRangeFrom, SheetRangeTo"
            ElseIf k = "Operation_Slabs" Then
                str = "SELECT DISTINCT PM.TypeofCharges, Case When ISNULL(PMS.Rate, 0)=0 Then Round(ISNULL(PM.Rate, 0),4) Else Round(ISNULL(PMS.Rate, 0),4) End AS Rate, Case When PMS.MinimumCharges=0 Then PM.MinimumCharges Else PMS.MinimumCharges End As MinimumCharges, PM.SetupCharges, PM.SizeToBeConsidered, PM.ChargeApplyOnSheets, PM.PrePress, PM.ProcessID, PM.ProcessName,Isnull(PMS.FromQty,0) AS FromQty,IsNull(PMS.ToQty,0) As ToQty,Isnull(PMS.RateFactor,'') As RateFactor FROM ProcessMaster AS PM Left JOIN ProcessMasterSlabs AS PMS ON PMS.ProcessID = PM.ProcessID And PMS.IsLocked=0 And PM.CompanyID=PMS.CompanyID Where PM.ProcessId In (" & GblOperId & ") And PM.CompanyId = " & CompanyID & " And Isnull(PM.IsDeletedTransaction,0)<>1 " & TempVendorID
            ElseIf k = "Vendor_Process_Rate_Setting" Then

                str = "Select PM.ProcessID,PM.ProcessName,VWPR.RateFactor,VWPR.Rate,VWPR.RateType,VWPR.MinimumCharges" &
                      " From VendorWiseProcessRates VWPR Inner Join ProcessMaster PM on VWPR.ProcessID=PM.ProcessID And VWPR.CompanyID=PM.CompanyID  " &
                      " Where VWPR.ProcessId In (" & GblOperId & ") And PM.CompanyID=" & CompanyID & " And (VWPR.IsDeletedTransaction=0) And (PM.IsDeletedTransaction=0)" & TempVendorID.Replace("VendorID", "VWPR.VendorID")

            End If

            db.FillDataTable(dataTable, str)
            Return dataTable

        Catch ex As Exception
            planErrors = ex.Message
            Return dataTable
        End Try
    End Function

    '    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ConvertDataTableTojSonString(ByVal dataTable As DataTable) As String
        Dim serializer As New System.Web.Script.Serialization.JavaScriptSerializer()
        Dim tableRows As New List(Of Dictionary(Of [String], [Object]))()
        serializer.MaxJsonLength = 2147483647
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

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Function Shirin_Job(ObjJSJson As Object, ByVal ObjOprJson As Object, ByVal LedgerID As Integer) As String
        Dim js As New JavaScriptSerializer()
        js.MaxJsonLength = 2147483647
        Dim Dataset As New DataSet

        Try

            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Dim dt As New DataTable
            Dim Job_Pasting_Flap As Double
            Dim PlanContName As String

            db.ConvertObjectToDatatable(ObjOprJson, GblDTOprFactors)
            db.ConvertObjectToDatatable(ObjJSJson, dt)
            Gbl_Job_H = Val(dt.Rows(0)(0))
            Gbl_Job_L = Val(dt.Rows(0)(1))
            Gbl_Job_W = Val(dt.Rows(0)(2))
            Gbl_Job_Open_Flap = Val(dt.Rows(0)(3))
            Job_Pasting_Flap = Val(dt.Rows(0)(4))
            Gbl_Job_Bottom_Flap = Val(dt.Rows(0)(5))
            Gbl_Job_Pages = Val(dt.Rows(0)(6))
            Gbl_Job_Ups = Val(dt.Rows(0)(7))
            Gbl_Job_Flap_Width = Val(dt.Rows(0)(8))
            Gbl_Job_Tongue_Height = Val(dt.Rows(0)(9))
            Gbl_Job_Overlap_Flap = Val(dt.Rows(0)(4))
            Gbl_upper_Width = Val(dt.Rows(0)(10))
            Gbl_lower_Width = Val(dt.Rows(0)(11))

            Gbl_Orientation = Trim(dt.Rows(0)(12))
            Gbl_Front_Color = Val(dt.Rows(0)(13))
            Gbl_Back_Color = Val(dt.Rows(0)(14))
            Gbl_ColorStrip = Val(dt.Rows(0)(15))
            Gbl_Gripper = Val(dt.Rows(0)(16))
            Gbl_Printing_Style = Trim(dt.Rows(0)(17))
            Gbl_Flat_Wastage_Value = Val(dt.Rows(0)(18))
            'Job_Trimming_L = Val(dt.Rows(0)(19))
            Gbl_Job_Trimming_LR = Val(dt.Rows(0)(19)) + Val(dt.Rows(0)(20))
            Gbl_Job_Trimming_TB = Val(dt.Rows(0)(21)) + Val(dt.Rows(0)(22))
            'Job_Trimming_B = Val(dt.Rows(0)(22))
            Gbl_Striping_LR = Val(dt.Rows(0)(23)) + Val(dt.Rows(0)(24))
            ' Stripping_Margin_R = Val(dt.Rows(0)(24))
            Gbl_Striping_TB = Val(dt.Rows(0)(25)) + Val(dt.Rows(0)(26))
            ' Stripping_Margin_B = Val(dt.Rows(0)(26))
            Gbl_Plan_Grain_Direction = Trim(dt.Rows(0)(27))

            Gbl_Paper_Quality = IIf(IsDBNull(dt.Rows(0)(28)), "", dt.Rows(0)(28))
            Gbl_Paper_GSM = IIf(IsDBNull(dt.Rows(0)(29)), 0, dt.Rows(0)(29))
            Gbl_Paper_Mill = IIf(IsDBNull(dt.Rows(0)(30)), "", dt.Rows(0)(30))
            Gbl_Paper_Finish = IIf(IsDBNull(dt.Rows(0)(37)), "", dt.Rows(0)(37))

            Gbl_Plate_Type = Trim(dt.Rows(0)(31))
            Gbl_Flat_Wastage_Type = Trim(dt.Rows(0)(32))
            Gbl_Order_Quantity = Val(dt.Rows(0)(33))
            Gbl_Special_Front_Color = Val(dt.Rows(0)(34))
            Gbl_Special_Back_Color = Val(dt.Rows(0)(35))
            PlanContName = Trim(dt.Rows(0)(36))
            GblOperId = Trim(dt.Rows(0)(38))

            Gbl_Paper_Detail = " Quality='" & Trim(Gbl_Paper_Quality) & "' and GSM=" & Trim(Gbl_Paper_GSM) & " and (Manufecturer='" & Trim(Gbl_Paper_Mill) & "' Or  Finish='" & Trim(Gbl_Paper_Finish) & "')"
            Check_Plan_In_Special_Size = IIf(IsDBNull(dt.Rows(0)(41)), "False", dt.Rows(0)(41))
            Check_Plan_In_Standard_Size = IIf(IsDBNull(dt.Rows(0)(42)), "False", dt.Rows(0)(42))
            If IIf(IsDBNull(dt.Rows(0)(43)), "", dt.Rows(0)(43)) <> "" Then
                MachineIDFilter = " And MachineID In (" & IIf(IsDBNull(dt.Rows(0)(43)), "", dt.Rows(0)(43)) & ")"
            End If
            GblOnlineCoating = IIf(IsDBNull(dt.Rows(0)(44)), "None", dt.Rows(0)(44))

            Gbl_Paper_TrimmingLR = IIf(IsDBNull(dt.Rows(0)(45)), 0, dt.Rows(0)(45)) + IIf(IsDBNull(dt.Rows(0)(46)), 0, dt.Rows(0)(46))
            Gbl_Paper_TrimmingTB = IIf(IsDBNull(dt.Rows(0)(47)), 0, dt.Rows(0)(47)) + IIf(IsDBNull(dt.Rows(0)(48)), 0, dt.Rows(0)(48))
            CheckPaperByClient = IIf(IsDBNull(dt.Rows(0)(49)), "False", dt.Rows(0)(49))
            ChkPlanInAvailableStock = IIf(IsDBNull(dt.Rows(0)("ChkPlanInAvailableStock")), "False", dt.Rows(0)("ChkPlanInAvailableStock"))
            Gbl_Ledger_ID = LedgerID

            dt = Nothing

            If Gbl_Job_W = 0 Then
                Gbl_Job_W = Gbl_Job_H
            ElseIf Gbl_Job_H = 0 Then
                Gbl_Job_H = Gbl_Job_W
            End If
            If Gbl_Job_Leaves = 0 Then
                Gbl_Job_Leaves = Gbl_Job_Pages
            End If
            If Gbl_Job_Overlap_Flap = 0 Then
                Gbl_Job_Overlap_Flap = Job_Pasting_Flap
            End If
            Context.Response.ContentType = "application/json"
            Dim data As New HelloWorldData()

            k = "Paper_Planning"
            Gbl_DT_Paper = GetDataTable()
            Dim dataViewItems As DataView = Gbl_DT_Paper.DefaultView
            dataViewItems.RowFilter = "ItemGroupName = 'Reel'"

            GblDTReel = Gbl_DT_Paper.Copy()
            GblDTReel.Clear()

            For I = 0 To dataViewItems.Count - 1
                GblDTReel.ImportRow(dataViewItems.Item(I).Row)
            Next I

            'For Each MydataRow In Gbl_DT_Paper.Select("ItemGroupName = 'Reel'")
            '    GblDTReel.ImportRow(MydataRow)
            'Next MydataRow

            If Gbl_DT_Paper.Rows.Count > 0 Then
                If Check_Plan_In_Special_Size = True Then
                    Gbl_DT_Paper.NewRow()
                    Dim R As DataRow = Gbl_DT_Paper.NewRow
                    For Each column In Gbl_DT_Paper.Columns
                        If column.ColumnName = "SizeW" Or column.ColumnName = "SizeL" Or column.ColumnName = "PaperID" Or column.ColumnName = "WtPerPacking" Or column.ColumnName = "PaperTrimming" Then
                            R(column.ColumnName) = 0
                            'ElseIf column.ColumnName = "PaperGroup" Then
                            '    R(column.ColumnName) = ""
                        Else
                            R(column.ColumnName) = Gbl_DT_Paper.Rows(0)(column.ColumnName)
                        End If
                    Next
                    Gbl_DT_Paper.Rows.Add(R)
                End If
                Gbl_Packing = IIf(IsDBNull(Gbl_DT_Paper.Rows(0)(4)), "", Gbl_DT_Paper.Rows(0)(4))
                Gbl_Unit_Per_Packing = IIf(IsDBNull(Gbl_DT_Paper.Rows(0)(5)), 0, Gbl_DT_Paper.Rows(0)(5))
                GblMainPaperGroup = IIf(IsDBNull(Gbl_DT_Paper.Rows(0)("PaperGroup")), "", Gbl_DT_Paper.Rows(0)("PaperGroup"))
            Else
                'If Check_Plan_In_Special_Size = True Then
                '    Gbl_DT_Paper.NewRow()
                '    Dim R As DataRow = Gbl_DT_Paper.NewRow
                '    For Each column In Gbl_DT_Paper.Columns
                '        If column.ColumnName = "SizeW" Or column.ColumnName = "SizeL" Or column.ColumnName = "PaperID" Or column.ColumnName = "WtPerPacking" Or column.ColumnName = "PaperTrimming" Then
                '            R(column.ColumnName) = 0
                '        ElseIf column.ColumnName = "PaperGroup" Then
                '            R(column.ColumnName) = ""
                '        ElseIf column.ColumnName = "Quality" Then
                '            R(column.ColumnName) = Gbl_Paper_Quality
                '        ElseIf column.ColumnName = "GSM" Then
                '            R(column.ColumnName) = Gbl_Paper_GSM
                '        ElseIf column.ColumnName = "Manufecturer" Then
                '            R(column.ColumnName) = Gbl_Paper_Mill
                '        Else
                '            R(column.ColumnName) = ""
                '        End If
                '    Next
                '    Gbl_DT_Paper.Rows.Add(R)
                '    Gbl_Packing = IIf(IsDBNull(Gbl_DT_Paper.Rows(0)(4)), "", Gbl_DT_Paper.Rows(0)(4))
                '    Gbl_Unit_Per_Packing = IIf(IsDBNull(Gbl_DT_Paper.Rows(0)(5)), 0, Gbl_DT_Paper.Rows(0)(5))
                '    GblMainPaperGroup = IIf(IsDBNull(Gbl_DT_Paper.Rows(0)("PaperGroup")), "", Gbl_DT_Paper.Rows(0)("PaperGroup"))
                'End If
                'If Gbl_DT_Paper.Rows.Count <= 0 Then
                planErrors = "Selected paper detail not found in the database, Plan In Standard Size is " & Check_Plan_In_Standard_Size & "..! Please select another paper size or deselect standard size check box"
                Return planErrors
                'End If
            End If

            InitPlanningMachines()
            Dim TempVendorID = Convert.ToString(HttpContext.Current.Session("VendorID"))
            TempVendorID = IIf(TempVendorID = 0 Or TempVendorID = "", "", " And LedgerID=" & TempVendorID)
            Dim DTVendorList As New DataTable
            'str = "Select Distinct LedgerID AS VendorID,LedgerName As VendorName From LedgerMaster Where LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where IsDeletedTransaction=0 And CompanyID=" & CompanyID & " And   LedgerGroupNameID IN(25)) AND IsDeletedTransaction=0 AND CompanyID=" & CompanyID & " And City In(Select City From LedgerMaster Where IsDeletedTransaction=0 And CompanyID=" & CompanyID & " And LedgerID=" & LedgerID & ") " & TempVendorID & " Order By VendorName"
            str = "Select Distinct LM.LedgerID AS VendorID,LedgerName As VendorName From LedgerMaster as LM inner join VendorWiseMachineSlabMaster as VWS on VWS.LedgerID = LM.LedgerID and VWS.CompanyID = LM.CompanyID Where LedgerGroupID IN(Select LedgerGroupID From LedgerGroupMaster Where IsDeletedTransaction=0 And CompanyID=" & CompanyID & " And   LedgerGroupNameID IN(25)) AND LM.IsDeletedTransaction=0 AND LM.CompanyID=" & CompanyID & " And City In(Select City From LedgerMaster Where IsDeletedTransaction=0 And CompanyID=" & CompanyID & ")  Order By VendorName"
            db.FillDataTable(DTVendorList, str)
            For i = 0 To DTVendorList.Rows.Count - 1
                GblVendorID = DTVendorList.Rows(i)("VendorID")
                GblVendorName = DTVendorList.Rows(i)("VendorName")
                LoadAllGrids()
                'If Gbl_DT_Machine.Rows.Count <= 0 Then
                '    planErrors = "Machine not found in the database, Plan in total colors is " & Gbl_Front_Color + Gbl_Back_Color & "..! Please check total colors of machine"
                '    Return planErrors
                'End If
                If Gbl_Printing_Style = "Choose Best" Then
                    Gbl_Printing_Style = "Work & Turn"
                    Plan_Job_Pre()
                    Gbl_Printing_Style = "Work & Tumble"
                    Plan_Job_Pre()
                    Gbl_Printing_Style = "Front & Back"
                    Plan_Job_Pre()
                    Gbl_Printing_Style = "FB-Perfection"
                    Plan_Job_Pre()
                Else
                    Plan_Job_Pre()
                End If
            Next

            If DTVendorList.Rows.Count = 0 Then
                LoadAllGrids()
                If Gbl_DT_Machine.Rows.Count <= 0 Then
                    planErrors = "Machine not found in the database, Plan in total colors is " & Gbl_Front_Color + Gbl_Back_Color & "..! Please check total colors of machine"
                    Return planErrors
                End If
                If Gbl_Printing_Style = "Choose Best" Then
                    Gbl_Printing_Style = "Work & Turn"
                    Plan_Job_Pre()
                    Gbl_Printing_Style = "Work & Tumble"
                    Plan_Job_Pre()
                    Gbl_Printing_Style = "Front & Back"
                    Plan_Job_Pre()
                    Gbl_Printing_Style = "FB-Perfection"
                    Plan_Job_Pre()
                Else
                    Plan_Job_Pre()
                End If
            End If

            ''Dim Local_Job_L As Integer, Local_Job_W As Integer
            ''If Gbl_DT_plan.Rows.Count <= 1 Then
            ''    Local_Job_L = Gbl_Job_L
            ''    Local_Job_W = Gbl_Job_W
            ''    Gbl_Job_L = Gbl_Job_L / 2
            ''    Gbl_Job_W = Gbl_Job_W / 2

            ''    Gbl_Half_Ups_Logic = True
            ''    Plan_Job_Pre()
            ''    Gbl_Half_Ups_Logic = False
            ''    Gbl_Job_L = Local_Job_L
            ''    Gbl_Job_W = Local_Job_W
            ''End If

            If Gbl_DT_plan.Rows.Count < 1 Then
                If planErrors = "" Then
                    planErrors = "Check Job Size: Job size may be larger than available Paper size or Machine Size. " +
                    " Check Paper Size: Suitable paper size may not be available in selected Paper Group.  " +
                    " Check Grain Direction: Grain Direction may not be correct. " +
                    " Check Printing Style: Printing Style may not be correct. " +
                    " Check Color Strip, Gripper,  Plate Type, Job Trimming, Stripping Margin, Printing Margin"
                End If
                Return planErrors
            End If

            Gbl_DT_plan.TableName = "TblPlanning"
            Rf_Dt_Opr.TableName = "TblOperations"
            GblDTBook.TableName = "TblBookForms"

            Gbl_DT_plan.DefaultView.Sort = "WastageKg ASC,TotalAmount ASC"
            Gbl_DT_plan = Gbl_DT_plan.DefaultView.ToTable

            Dataset.Merge(Gbl_DT_plan)
            Dataset.Merge(Rf_Dt_Opr)
            Dataset.Merge(GblDTBook)

            '            data.Message = ConvertDataTableTojSonString(Gbl_DT_plan)
            data.Message = db.ConvertDataSetsTojSonString(Dataset)

            Return js.Serialize(data.Message)

        Catch ex As Exception
            planErrors += ex.Message
            Return planErrors
        End Try
        ' Return JsonConvert.SerializeObject(data.Message)
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Function ShirinJobMaster(ObjJobSize As Object, ByVal ObjOpr As Object, ByVal PlateRate As Double, ByVal PaperRate As Double) As String
        Dim js As New JavaScriptSerializer()
        js.MaxJsonLength = 2147483647
        Dim Dataset As New DataSet

        Try

            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Dim dt As New DataTable

            db.ConvertObjectToDatatable(ObjOpr, GblDTOprFactors)
            db.ConvertObjectToDatatable(ObjJobSize, dt)
            ' Gbl_Sheet_W = Val(dt.Rows(0)(0))
            'Gbl_Sheet_L = Val(dt.Rows(0)(1))
            Seperate_Paper_Size(dt.Rows(0)(0), Gbl_Sheet_L, Gbl_Sheet_W)
            Gbl_Orientation = Trim(dt.Rows(0)(1))
            Gbl_UPS_H = Val(dt.Rows(0)(2))
            Gbl_UPS_L = Val(dt.Rows(0)(3))
            Gbl_Machine_ID = Val(dt.Rows(0)(4))
            Gbl_Order_Quantity = Val(dt.Rows(0)(5))
            Gbl_Job_Pages = IIf(IsDBNull(dt.Rows(0)(6)), 0, dt.Rows(0)(6))
            Gbl_Printing_Style = Trim(dt.Rows(0)(7))
            Gbl_Front_Color = IIf(IsDBNull(dt.Rows(0)(8)), 0, dt.Rows(0)(8))
            Gbl_Back_Color = IIf(IsDBNull(dt.Rows(0)(9)), 0, dt.Rows(0)(9))
            Gbl_Special_Front_Color = IIf(IsDBNull(dt.Rows(0)(10)), 0, dt.Rows(0)(10))
            Gbl_Special_Back_Color = IIf(IsDBNull(dt.Rows(0)(11)), 0, dt.Rows(0)(11))
            Gbl_Flat_Wastage_Type = IIf(IsDBNull(dt.Rows(0)(12)), "Machine Default", dt.Rows(0)(12))
            Gbl_Flat_Wastage_Value = IIf(IsDBNull(dt.Rows(0)(13)), 0, dt.Rows(0)(13))
            Gbl_Grain_Direction = IIf(IsDBNull(dt.Rows(0)(14)), "With Grain", dt.Rows(0)(14))

            Gbl_Paper_Quality = IIf(IsDBNull(dt.Rows(0)(15)), "", dt.Rows(0)(15))
            Gbl_Paper_GSM = IIf(IsDBNull(dt.Rows(0)(16)), 0, dt.Rows(0)(16))
            Gbl_Paper_Mill = IIf(IsDBNull(dt.Rows(0)(17)), "", dt.Rows(0)(17))
            Gbl_Paper_Finish = IIf(IsDBNull(dt.Rows(0)(18)), "", dt.Rows(0)(18))

            Gbl_Plate_Type = Trim(dt.Rows(0)(19))
            Gbl_Plan_Type = Trim(dt.Rows(0)(20))
            Gbl_Paper_ID = IIf(IsDBNull(dt.Rows(0)(21)), 0, dt.Rows(0)(21))
            GblOnlineCoating = IIf(IsDBNull(dt.Rows(0)(22)), "None", dt.Rows(0)(22))
            GblMainPaperGroup = IIf(IsDBNull(dt.Rows(0)(23)), "", dt.Rows(0)(23))
            Gbl_GripperSide = IIf(IsDBNull(dt.Rows(0)(24)), "L", dt.Rows(0)(24))
            Gbl_Machine_Gripper = IIf(IsDBNull(dt.Rows(0)(25)), 0, dt.Rows(0)(25))
            GblOperId = IIf(IsDBNull(dt.Rows(0)(26)), "", dt.Rows(0)(26))
            Gbl_InterLock_Style = IIf(IsDBNull(dt.Rows(0)(27)), "", dt.Rows(0)(27))

            GblVendorID = IIf(IsDBNull(dt.Rows(0)(28)), 0, dt.Rows(0)(28))
            GblVendorName = IIf(IsDBNull(dt.Rows(0)(29)), "", dt.Rows(0)(29))
            'Gbl_Paper_Detail = " Quality='" & Trim(Gbl_Paper_Quality) & "' and GSM=" & Trim(Gbl_Paper_GSM) & " and (Manufecturer='" & Trim(Gbl_Paper_Mill) & "' Or  Finish='" & Trim(Gbl_Paper_Finish) & "')"

            If IIf(IsDBNull(Gbl_Machine_ID), 0, Gbl_Machine_ID) <> 0 Then
                MachineIDFilter = " And MachineID In (" & Gbl_Machine_ID & ")"
            End If
            Gbl_Job_Ups = Gbl_UPS_L * Gbl_UPS_H
            dt = Nothing

            If Gbl_Job_Leaves = 0 Then
                Gbl_Job_Leaves = Gbl_Job_Pages
            End If

            LoadPaperGrid()

            If Gbl_DT_Paper.Rows.Count = 0 Then
                planErrors = "Selected Paper detail not found in the database, Plan In Standard Size is " & Check_Plan_In_Standard_Size & "..! Please select another Paper size or deselect Standard size check"
                Return planErrors
            End If
            Gbl_DT_Paper.Rows(0)("EstimationRate") = PaperRate

            InitPlanningMachines()
            LoadAllGrids()
            For i = 0 To DT_Printing_Slabs.Rows.Count - 1
                DT_Printing_Slabs.Rows(i)(5) = PlateRate
                DT_Printing_Slabs.Rows(i)(6) = PlateRate
                DT_Printing_Slabs.Rows(i)(7) = PlateRate
            Next

            Gbl_Machine_Name = Gbl_DT_Machine.Rows(0)(1)
            GblMachineMaxW = Gbl_DT_Machine.Rows(0)(3)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(0)(5)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(0)(11)

            Paper_Planning()

            If Gbl_DT_plan.Rows.Count < 1 Then
                If planErrors = "" Then
                    planErrors = "Check Job Size: Job size may be larger than available Paper size or Machine Size. " +
                    " Check Paper Size: Suitable paper size may not be available in selected Paper Group.  " +
                    " Check Grain Direction: Grain Direction may not be correct. " +
                    " Check Printing Style: Printing Style may not be correct. " +
                    " Check Color Strip, Gripper,  Plate Type, Job Trimming, Stripping Margin, Printing Margin"
                End If
                Return planErrors
            End If

            Gbl_DT_plan.TableName = "TblPlanning"
            Rf_Dt_Opr.TableName = "TblOperations"
            GblDTBook.TableName = "TblBookForms"

            Gbl_DT_plan.DefaultView.Sort = "WastageKg ASC,TotalAmount ASC"
            Gbl_DT_plan = Gbl_DT_plan.DefaultView.ToTable

            Dataset.Merge(Gbl_DT_plan)
            Dataset.Merge(Rf_Dt_Opr)
            Dataset.Merge(GblDTBook)

            Dim data As New HelloWorldData()
            data.Message = db.ConvertDataSetsTojSonString(Dataset)

            Return js.Serialize(data.Message)
        Catch ex As Exception
            planErrors = ex.Message
            Return planErrors
        End Try
    End Function

    Private Sub LoadPaperGrid()
        Try
            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            'str = "SELECT Distinct PaperID, Quality, GSM, Manufecturer, PackingType, UnitPerPacking, WtPerPacking,EstimationRate,Finish, PaperTrimming, SizeW, SizeL, Caliper, IsStandardItem, PaperCode, IsBalancePiece, EstimationUnit,PaperName,PaperGroup From (Select Distinct [ItemID] As PaperID,[ItemGroupID],[CompanyID],[UserID] AS [UserID],convert(CHAR(30),[ModifiedDate], 106) AS [ModifiedDate],[FYear],[FieldName],[FieldValue] From ItemMasterDetails " &
            '                 " Where ItemID =" & Gbl_Paper_ID & " And CompanyID=" & CompanyID & " And Isnull(IsDeletedTransaction,0)<>1 )x unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([Quality], [GSM], [Manufecturer], [PackingType], [UnitPerPacking], [WtPerPacking], [EstimationRate], [Finish], [PaperTrimming],[SizeW], [SizeL], [Caliper], [IsStandardItem], [PaperCode], [IsBalancePiece], [EstimationUnit],[PaperName],[PaperGroup])) P "

            str = "SELECT Distinct ItemID PaperID, Quality, GSM, Manufecturer, PackingType, UnitPerPacking, WtPerPacking,EstimationRate,Finish, 0 PaperTrimming, SizeW, SizeL, Caliper, Isnull(IsStandardItem,0) As IsStandardItem,ItemCode PaperCode,0 As IsBalancePiece, IsNull(EstimationUnit,'') As EstimationUnit,ItemName PaperName,PaperGroup,'' ItemGroupName,PurchaseUnit From ItemMaster " &
                         " Where ItemID =" & Gbl_Paper_ID & " And CompanyID=" & CompanyID & " And (IsDeletedTransaction=0)"

            db.FillDataTable(Gbl_DT_Paper, str)

        Catch ex As Exception

        End Try
    End Sub

    Private Sub LoadAllGrids()
        Gbl_DT_Machine = New DataTable()
        DT_Client_Printing_Slabs = New DataTable()
        DT_Printing_Slabs = New DataTable()
        Gbl_DT_Search_In_Machine = New DataTable()
        GblDTSlittingMachine = New DataTable()
        GblDTMachineCoatingRates = New DataTable()

        k = "Planning_Machines"
        Gbl_DT_Machine = GetDataTable()

        k = "Client_Printing_Slabs"
        DT_Client_Printing_Slabs = GetDataTable()

        k = "Printing_Slabs"
        DT_Printing_Slabs = GetDataTable()

        k = "Vendor_Printing_Slabs"
        DT_Vendor_Printing_Slabs = GetDataTable()

        k = "Search_In_Machine_Selection"
        Gbl_DT_Search_In_Machine = GetDataTable()

        k = "Slitting_Machine"
        GblDTSlittingMachine = GetDataTable()

        k = "Machine_Online_Coating_Rates"
        GblDTMachineCoatingRates = GetDataTable()

        LoadOperations()

    End Sub

    Protected Sub InitPlanningMachines()

        With Gbl_DT_plan

            .Columns.Add("MachineID", GetType(Long))
            .Columns.Add("MachineName", GetType(String))
            .Columns.Add("Gripper", GetType(Long))
            .Columns.Add("GripperSide", GetType(String))
            .Columns.Add("MachineColors", GetType(Long))
            .Columns.Add("PaperID", GetType(Long))
            .Columns.Add("PaperSize", GetType(String))
            .Columns.Add("CutSize", GetType(String))
            .Columns.Add("CutL", GetType(Long))
            .Columns.Add("CutW", GetType(Long))
            .Columns.Add("UpsL", GetType(Long))
            .Columns.Add("UpsW", GetType(Long))
            .Columns.Add("TotalUps", GetType(Long))
            .Columns.Add("BalPiece", GetType(String))
            .Columns.Add("BalSide", GetType(String))
            .Columns.Add("WasteArea", GetType(Long))
            .Columns.Add("WastePerc", GetType(Double))
            .Columns.Add("WastageKg", GetType(Double))
            .Columns.Add("GrainDirection", GetType(String))
            .Columns.Add("PlateQty", GetType(Integer))
            .Columns.Add("PlateRate", GetType(Double))
            .Columns.Add("PlateAmount", GetType(Double))
            .Columns.Add("MakeReadyWastageSheet", GetType(Long))
            .Columns.Add("ActualSheets", GetType(Long))
            .Columns.Add("WastageSheets", GetType(Integer))
            .Columns.Add("TotalPaperWeightInKg", GetType(Double))
            .Columns.Add("FullSheets", GetType(Long))
            .Columns.Add("PaperRate", GetType(Double))
            .Columns.Add("PaperAmount", GetType(Double))
            .Columns.Add("PrintingImpressions", GetType(Long))
            .Columns.Add("ImpressionsToBeCharged", GetType(Long))
            .Columns.Add("PrintingRate", GetType(Double))
            .Columns.Add("PrintingAmount", GetType(Double))
            .Columns.Add("TotalMakeReadies", GetType(Long))
            .Columns.Add("MakeReadyRate", GetType(Double))
            .Columns.Add("MakeReadyAmount", GetType(Double))
            .Columns.Add("FinalQuantity", GetType(Long))
            .Columns.Add("TotalColors", GetType(Long))
            .Columns.Add("TotalAmount", GetType(Double))
            .Columns.Add("CutLH", GetType(Long))
            .Columns.Add("CutHL", GetType(Long))
            .Columns.Add("PrintingStyle", GetType(String))
            .Columns.Add("PrintingChargesType", GetType(String))
            .Columns.Add("ExpectedExecutionTime", GetType(Double))
            .Columns.Add("TotalExecutionTime", GetType(Double))
            .Columns.Add("MainPaperName", GetType(String))
            .Columns.Add("PlanType", GetType(String))
            .Columns.Add("PaperRateType", GetType(String))
            .Columns.Add("DieCutSize", GetType(String))
            .Columns.Add("InterlockStyle", GetType(Integer))
            .Columns.Add("NoOfSets", GetType(Integer))
            .Columns.Add("GrantAmount", GetType(Double))
            .Columns.Add("Packing", GetType(String))
            .Columns.Add("UnitPerPacking", GetType(Double))
            .Columns.Add("RoundofImpressionsWith", GetType(Double))
            .Columns.Add("SpeColorFCharges", GetType(Double))
            .Columns.Add("SpeColorBCharges", GetType(Double))
            .Columns.Add("SpeColorFAmt", GetType(Double))
            .Columns.Add("SpeColorBAmt", GetType(Double))
            .Columns.Add("OpAmt", GetType(Double))
            .Columns.Add("PlanID", GetType(Integer))
            .Columns.Add("CoatingCharges", GetType(Double))
            .Columns.Add("CoatingAmount", GetType(Double))
            .Columns.Add("PaperGroup", GetType(String))
            .Columns.Add("VendorID", GetType(Long))
            .Columns.Add("VendorName", GetType(String))

        End With

        With GblDTBook

            .Columns.Add("Forms", GetType(Double))
            .Columns.Add("Sets", GetType(Double))
            .Columns.Add("Pages", GetType(Double))
            .Columns.Add("Sheets", GetType(Double))
            .Columns.Add("ImpressionsPerSet", GetType(Double))
            .Columns.Add("FormsInPoint", GetType(Double))
            .Columns.Add("ImprsToChargedPerSet", GetType(Double))
            .Columns.Add("BasicRate", GetType(Double))
            .Columns.Add("SlabRate", GetType(Double))
            .Columns.Add("RateType", GetType(String))
            .Columns.Add("Amount", GetType(Long))
            .Columns.Add("WastagePercentSheet", GetType(Double))
            .Columns.Add("PlateRate", GetType(Double))
            .Columns.Add("PlanID", GetType(Long))

        End With

    End Sub

    Private Sub LoadOperations()
        CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        If GblOperId <> "" Then
            'str = Convert.ToString(HttpContext.Current.Session("Version"))
            'If str = "New" Then
            'GblDTVendorProcessRates = New DataTable()
            Gbl_DT_Operation = New DataTable()

            'k = "Operation_Slabs"
            'GblDTOprSlabs = GetDataTable()
            'k = "Vendor_Process_Rate_Setting"
            'GblDTVendorProcessRates = GetDataTable()

            str = "SELECT DISTINCT PM.TypeofCharges,Case When ISNULL(VWPR.Rate, 0)=0 Then PM.Rate Else ISNULL(VWPR.Rate, 0) End AS Rate,Case When Isnull(VWPR.MinimumCharges,0)=0 Then PM.MinimumCharges Else Isnull(VWPR.MinimumCharges,0) End As MinimumCharges, PM.SetupCharges, PM.SizeToBeConsidered, PM.ChargeApplyOnSheets, PM.PrePress, PM.MinimumL AS SizeL, PM.MinimumW AS SizeW, PM.MaximumL, PM.MaximumW, 0 AS Amount, 0 AS PlanID, PM.ProcessID, PM.ProcessName, 0 AS Quantity, 0 AS Ups, 1 AS NoOfPass, '' AS Remarks, '' AS RateFactor, 1 AS Pieces, 1 AS NoOfStitch, 1 AS NoOfLoops, 1 AS NoOfColors, ISNULL(PM.IsDisplay, 0) AS IsDisplay FROM ProcessMaster AS PM LEFT OUTER JOIN VendorWiseProcessRates AS VWPR ON VWPR.ProcessID = PM.ProcessID AND VWPR.CompanyID = PM.CompanyID AND PM.IsDeletedTransaction = VWPR.IsDeletedTransaction Where PM.ProcessId In (" & GblOperId & ") And PM.CompanyId = " & CompanyID & " And (PM.IsDeletedTransaction=0) "
            'Else
            '    str = "SELECT Distinct Type_of_Charges As TypeofCharges, Rate, Minimum_Charges As MinimumCharges, Setup_Charges As SetupCharges, Size_To_Be_Considered As SizeToBeConsidered, Charge_Apply_On_Sheets As ChargeApplyOnSheets,Pre_Press As PrePress, Minimum_L, Minimum_W, Maximum_L, Maximum_W,0 As Amt,0 As PlanID,Operation_Id,Operation_Name, 0 AS Quantity, 0 AS Ups, 1 AS NoOfPass, '' AS Remarks,'' As RateFactor,1 As Pieces ,1 As NoOfStitch,1 As NoOfLoops,1 As NoOfColors  FROM Operation_Master Where Operation_id In (" & GblOperId & ") And CompanyID = " & CompanyID & " "
            'End If

            db.FillDataTable(Gbl_DT_Operation, str)
        End If

    End Sub

    Private Sub Plan_Job_Pre()
        Try
            Select Case Gbl_Orientation
                Case "Rectangular", "BookCover", "MultipleLeaves", "WrintingPad", "Brochure" ', "AccordionFold", "DoubleGateFold", "DoubleParallelFold", "GateFold", "FrenchFold", "HalfFold", "HalfThenTriFold", "RollFold", "TriFold", "ZFold", "RightAngleFirstFoldShort"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Rectangular_Planning("With Grain")
                        Call Rectangular_Planning("Across Grain")
                    Else
                        Call Rectangular_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "BookPages"

                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Book_Pages_Planning("With Grain")
                        Call Book_Pages_Planning("Across Grain")
                    Else
                        Call Book_Pages_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "WiroBookPages", "WiroLeaves"

                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Wiro_Book_Pages_Planning("With Grain")
                        Call Wiro_Book_Pages_Planning("Across Grain")
                    Else
                        Call Wiro_Book_Pages_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "Calendar"

                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Calendar_Planning("With Grain")
                        Call Calendar_Planning("Across Grain")
                    Else
                        Call Calendar_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "FourCornerBox"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Four_Corner_Box_Planning("With Grain")
                        Call Four_Corner_Box_Planning("Across Grain")
                    Else
                        Call Four_Corner_Box_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "ReverseTuckIn"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Reverse_Tuck_In_Planning("With Grain")
                        Call Reverse_Tuck_In_Planning("Across Grain")
                    Else
                        Call Reverse_Tuck_In_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "ReverseTuckAndTongue"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Reverse_Tuck_And_Tongue_Planning("With Grain")
                        Call Reverse_Tuck_And_Tongue_Planning("Across Grain")
                    Else
                        Call Reverse_Tuck_And_Tongue_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "UniversalCarton"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Universal_Planning("With Grain")
                        Call Universal_Planning("Across Grain")
                    Else
                        Call Universal_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "StandardStraightTuckIn"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Standard_Straight_Tuck_In_Planning("With Grain")
                        Call Standard_Straight_Tuck_In_Planning("Across Grain")
                    Else
                        Call Standard_Straight_Tuck_In_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "StandardStraightTuckInNested"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Reverse_Tuck_In_Planning("With Grain")
                        Call Reverse_Tuck_In_Planning("Across Grain")
                    Else
                        Call Reverse_Tuck_In_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "CrashLockWithPasting"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Crash_Lock_With_Pasting_Planning("With Grain")
                        Call Crash_Lock_With_Pasting_Planning("Across Grain")
                    Else
                        Call Crash_Lock_With_Pasting_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "CrashLockWithoutPasting"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Crash_Lock_Without_Pasting_Planning("With Grain")
                        Call Crash_Lock_Without_Pasting_Planning("Across Grain")
                    Else
                        Call Crash_Lock_Without_Pasting_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "PrePlannedSheet"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Preplanned_Sheet_Planning("With Grain")
                        Call Preplanned_Sheet_Planning("Across Grain")
                    Else
                        Call Preplanned_Sheet_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "CarryBag"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Carry_Bag_Planning("With Grain")
                        Call Carry_Bag_Planning("Across Grain")
                    Else
                        Call Carry_Bag_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "EnvCenterPasting"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Env_Center_Pasting("With Grain")
                        Call Env_Center_Pasting("Across Grain")
                    Else
                        Call Env_Center_Pasting(Gbl_Plan_Grain_Direction)
                    End If
                Case "EnvLPasting"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Env_L_Pasting("With Grain")
                        Call Env_L_Pasting("Across Grain")
                    Else
                        Call Env_L_Pasting(Gbl_Plan_Grain_Direction)
                    End If
                Case "EnvSidePasting"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Env_Side_Pasting("With Grain")
                        Call Env_Side_Pasting("Across Grain")
                    Else
                        Call Env_Side_Pasting(Gbl_Plan_Grain_Direction)
                    End If

                Case "CatchCover"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Catch_Cover_Planning("With Grain")
                        Call Catch_Cover_Planning("Across Grain")
                    Else
                        Call Catch_Cover_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "TuckToFrontOpenTop"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Sleev_Box_Planning("With Grain")
                        Call Sleev_Box_Planning("Across Grain")
                    Else
                        Call Sleev_Box_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "FourCornerHingedLid"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Four_Corner_Hinged_Lid_Planning("With Grain")
                        Call Four_Corner_Hinged_Lid_Planning("Across Grain")
                    Else
                        Call Four_Corner_Hinged_Lid_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "TurnOverEndTray"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Turn_Over_End_Tray_Planning("With Grain")
                        Call Turn_Over_End_Tray_Planning("Across Grain")
                    Else
                        Call Turn_Over_End_Tray_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "WebbedSelfLockingTray"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Webbed_Self_locking_Tray_Planning("With Grain")
                        Call Webbed_Self_locking_Tray_Planning("Across Grain")
                    Else
                        Call Webbed_Self_locking_Tray_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "RingFlap"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Ring_Flap_Planning("With Grain")
                        Call Ring_Flap_Planning("Across Grain")
                    Else
                        Call Ring_Flap_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "UniversalOpenCrashLockWithPasting"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Universal_Crash_Lock_With_Pasting_Planning("With Grain")
                        Call Universal_Crash_Lock_With_Pasting_Planning("Across Grain")
                    Else
                        Call Universal_Crash_Lock_With_Pasting_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "6CornerBox", "SixCornerBox"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call B_6_Corner_Box_Planning("With Grain")
                        Call B_6_Corner_Box_Planning("Across Grain")
                    Else
                        Call B_6_Corner_Box_Planning(Gbl_Plan_Grain_Direction)
                    End If

                Case "OvelShape"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Ovel_Shape_Planning("With Grain")
                        Call Ovel_Shape_Planning("Across Grain")
                    Else
                        Call Ovel_Shape_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "PolygonShape"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Polygon_Shape_Planning("With Grain")
                        Call Polygon_Shape_Planning("Across Grain")
                    Else
                        Call Polygon_Shape_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "StandardStraightTuckInHang"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Standard_Straight_Tuck_In_Hang("With Grain")
                        Call Standard_Straight_Tuck_In_Hang("Across Grain")
                    Else
                        Call Standard_Straight_Tuck_In_Hang(Gbl_Grain_Direction)
                    End If
                Case "WiroPrePlannedSheet"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Preplanned_Wiro_Sheet_Planning("With Grain")
                        Call Preplanned_Wiro_Sheet_Planning("Across Grain")
                    Else
                        Call Preplanned_Wiro_Sheet_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "WeddingCardSets"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Wedding_Card_Sets_Planning("With Grain")
                        Call Wedding_Card_Sets_Planning("Across Grain")
                    Else
                        Call Wedding_Card_Sets_Planning(Gbl_Plan_Grain_Direction)
                    End If
                Case "PastryTypeBox"
                    If Gbl_Plan_Grain_Direction = "Both" Then
                        Call Pastry_Type_Box_Planning("With Grain")
                        Call Pastry_Type_Box_Planning("Across Grain")
                    Else
                        Call Pastry_Type_Box_Planning(Gbl_Plan_Grain_Direction)
                    End If
            End Select
        Catch ex As Exception
            planErrors = ex.Message
        End Try
    End Sub

    Private Sub Paper_Planning()
        Try
            ' CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If Gbl_Machine_Type = "Sheetfed Offset" Or Gbl_Machine_Type = "Digital" Then
                Gbl_Plan_Type = "Sheet Planning"
                Plan_On_Sheet()
                If Pass_in_Slitting_Machine() = True Then
                    Gbl_Plan_Type = "Reel to Sheet Planning"
                    Plan_On_Reel_Slitting()
                End If

            ElseIf Gbl_Machine_Type = "Web Offset" Then
                Gbl_Plan_Type = "Reel Planning"
                Plan_On_Reel()
            End If

        Catch ex As Exception
            planErrors = ex.Message
        End Try
    End Sub

    Function Pass_in_Slitting_Machine() As Boolean
        Dim mi As Long
        Try

            Dim Min_Reel_Size As Double
            Dim Max_Reel_Size As Double
            Dim Web_CutOff_Size As Double
            Dim Web_CutOff_Size_Min As Double
            Dim Machine_Gripper As Double

            Pass_in_Slitting_Machine = False

            For mi = 0 To GblDTSlittingMachine.Rows.Count - 1
                Machine_Gripper = Val(GblDTSlittingMachine.Rows(mi)(2))
                Max_Reel_Size = Val(GblDTSlittingMachine.Rows(mi)(3))
                Web_CutOff_Size = Val(GblDTSlittingMachine.Rows(mi)(4))
                Min_Reel_Size = Val(GblDTSlittingMachine.Rows(mi)(5))
                Web_CutOff_Size_Min = Val(GblDTSlittingMachine.Rows(mi)(6))
                If (Gbl_Sheet_W <= Max_Reel_Size And Gbl_Sheet_L <= Web_CutOff_Size) Or (Gbl_Sheet_L <= Max_Reel_Size And Gbl_Sheet_W <= Web_CutOff_Size) Then   'For Machine maximum paper size
                    If (Gbl_Sheet_W >= Min_Reel_Size And Gbl_Sheet_L >= Web_CutOff_Size_Min) Or (Gbl_Sheet_L >= Min_Reel_Size And Gbl_Sheet_W >= Web_CutOff_Size_Min) Then  'For Machine Minimum paper size
                        Pass_in_Slitting_Machine = True
                        Exit Function
                    End If
                End If
            Next
        Catch ex As Exception
            planErrors = ex.Message
            Pass_in_Slitting_Machine = False
        End Try
    End Function

    Private Function Wedding_Card_Sets_Planning(ByVal Grain_Direction As String) As String
        Dim Size_W, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_LR)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1
            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            Size_L = Gbl_Rect_L
            Gbl_UPS_L = Gbl_Job_Ups
            Gbl_UPS_H = 1
            Size_W = Gbl_Rect_H

            If Size_W >= Size_L Then
                Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                Gbl_Sheet_W = Size_W + Gbl_Striping_LR

                If Gbl_Machine_Type = "Web Offset" Then
                    Gbl_M_Min_H = Gbl_Sheet_W
                    Max_Print_H = Gbl_Sheet_W
                End If
                Gbl_GripperSide = "L"
                ''*****Check size in Machine Min and Max******''
                If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                    If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                        If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                            Call Paper_Planning()
                        End If
                    End If
                End If
            Else
                Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                Gbl_GripperSide = "H"

                If Gbl_Machine_Type = "Web Offset" Then
                    Gbl_M_Min_H = Gbl_Sheet_W
                End If

                ''*****Check size in Machine Min and Max******''
                If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                    If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                        If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                            Call Paper_Planning()
                        End If
                    End If
                End If
            End If

NextMachine:
        Next
        Return True
    End Function

    Private Function Preplanned_Wiro_Sheet_Planning(ByVal Grain_Direction As String) As String
        Dim Size_W, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_LR)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1
            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            Size_L = Gbl_Rect_L
            Size_W = Gbl_Rect_H
            Gbl_UPS_H = 1
            Gbl_UPS_L = Gbl_Job_Ups
            If Size_W >= Size_L Then
                Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                Gbl_Sheet_W = Size_W + Gbl_Striping_LR

                Gbl_GripperSide = "L"
                ''*****Check size in Machine Min and Max******''
                If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                    If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                        If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                            Call Paper_Planning()
                        End If
                    End If
                End If
            Else
                Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                Gbl_GripperSide = "H"

                If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                    If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                        If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                            Call Paper_Planning()
                        End If
                    End If
                End If
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Rectangular_Planning(ByVal Grain_Direction As String) As String
        Dim Size_W, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_LR)
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_TB)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1
            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            Size_L = Gbl_Rect_L
            Gbl_UPS_L = 1
            While Size_L <= M_Max_L
                Gbl_UPS_H = 1
                Size_W = Gbl_Rect_H
                While Size_W <= GblMachineMaxW Or Size_W <= M_Max_L
                    If Size_W >= Size_L Then
                        Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_Sheet_W = Size_W + Gbl_Striping_LR

                        'If Gbl_Machine_Type = "Web Offset" Then
                        '    Gbl_M_Min_H = Gbl_Sheet_W
                        '    Max_Print_H = Gbl_Sheet_W
                        'End If
                        Gbl_GripperSide = "L"
                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                                    If Gbl_Printing_Style = "Work & Tumble" Then
                                        If Gbl_UPS_L Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                        If Gbl_UPS_H Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    Else
                                        Call Paper_Planning()
                                    End If
                                End If
                            End If
                        End If
                    Else
                        Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                        Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_GripperSide = "H"

                        'If Gbl_Machine_Type = "Web Offset" Then
                        '    Gbl_M_Min_H = Gbl_Sheet_W
                        'End If

                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                                    If Gbl_Printing_Style = "Work & Tumble" Then
                                        If Gbl_UPS_H Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                        If Gbl_UPS_L Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    Else
                                        Call Paper_Planning()
                                    End If
                                End If
                            End If
                        End If
                    End If
                    Size_W = Val(Size_W) + Val(Gbl_Rect_H)
                    Gbl_UPS_H = Gbl_UPS_H + 1
                End While
                Size_L = Size_L + Gbl_Rect_L
                Gbl_UPS_L = Gbl_UPS_L + 1

            End While
NextMachine:
        Next
        Return True
    End Function

    Private Function Preplanned_Sheet_Planning(ByVal Grain_Direction As String) As String
        '     CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim Size_W, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_LR)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1
            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            Size_L = Gbl_Rect_L
            Size_W = Gbl_Rect_H
            Gbl_UPS_H = 1
            Gbl_UPS_L = Gbl_Job_Ups
            If Size_W >= Size_L Then
                Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                Gbl_Sheet_W = Size_W + Gbl_Striping_LR

                Gbl_GripperSide = "L"
                ''*****Check size in Machine Min and Max******''
                If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                    If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                        If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then

                            Call Paper_Planning()

                        End If
                    End If
                End If
            Else
                Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                Gbl_GripperSide = "H"

                If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                    If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                        If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then

                            Call Paper_Planning()

                        End If
                    End If
                End If
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Four_Corner_Box_Planning(ByVal Grain_Direction As String) As String
        '     CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_W + (Gbl_Job_H * 2)
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_H * 2)

                Gbl_Die_Size_L = Gbl_Job_W + (Gbl_Job_H * 2) '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + (Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_TB)
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_TB)
                    End While
                    Size_L = Size_L + Gbl_Job_W + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_W + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_Rect_H = Gbl_Job_W + (Gbl_Job_H * 2)
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_Die_Size_H = Gbl_Job_W + (Gbl_Job_H * 2)
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + (Gbl_Job_W + (Gbl_Job_H * 2) + Gbl_Job_Trimming_TB)
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_W + (Gbl_Job_H * 2) + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + (Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR)
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function A4_Corner_Tray_Planning(ByVal Grain_Direction As String) As String
        'CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_W + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_TB
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                Size_H = Gbl_Rect_H

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H)

                    End While
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                Gbl_Rect_H = Gbl_Job_W + (Gbl_Job_H * 2) + Gbl_Job_Trimming_TB
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H)

                    End While
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function B_6_Corner_Box_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_Rect_H = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)

                Gbl_Die_Size_L = Gbl_Job_L + (Gbl_Job_H * 2) '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_TB
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)
                Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_H * 2)
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L

                        If Size_H >= Size_L Then
                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + (Gbl_Rect_H + Gbl_Job_Trimming_LR)
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + (Gbl_Rect_L + Gbl_Job_Trimming_TB)
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Ovel_Shape_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_L + Gbl_Job_Trimming_LR
                Gbl_Rect_H = Gbl_Job_W + Gbl_Job_Trimming_TB

                Gbl_Die_Size_L = Gbl_Job_L + Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_W + Gbl_Job_Trimming_TB
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + (Gbl_Job_L / 2) + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + (Gbl_Job_L / 2) + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H - (Gbl_Job_H * (13.5 / 100))
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H - (Gbl_Job_H * (13.5 / 100))
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Job_L + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_W + Gbl_Job_Trimming_TB
                Gbl_Rect_H = Gbl_Job_L + Gbl_Job_Trimming_LR
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_W + Gbl_Job_Trimming_TB
                Gbl_Die_Size_H = Gbl_Job_L + Gbl_Job_Trimming_LR
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L

                        If Size_H >= Size_L Then
                            Gbl_Sheet_L = Size_L + (Gbl_Job_H / 2) + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + (Gbl_Job_H / 2) + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + (Gbl_Job_L + Gbl_Job_Trimming_LR) - (Gbl_Job_L * (13.5 / 100))
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_L + Gbl_Job_Trimming_LR - (Gbl_Job_L * (13.5 / 100))

                    End While

                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + (Gbl_Job_H + Gbl_Job_Trimming_TB)
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Trimming_TB
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Polygon_Shape_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_lower_Width + Gbl_Job_Trimming_LR
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Trimming_TB

                Gbl_Die_Size_L = Gbl_lower_Width + Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Trimming_TB
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L - ((Gbl_lower_Width - Gbl_upper_Width) / 2) + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L
                End While

            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Trimming_TB
                Gbl_Rect_H = Gbl_lower_Width + Gbl_Job_Trimming_LR
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Trimming_TB
                Gbl_Die_Size_H = Gbl_lower_Width + Gbl_Job_Trimming_LR
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    If Gbl_upper_Width < Gbl_lower_Width Then
                        Size_H = Gbl_lower_Width + Gbl_Job_Trimming_LR
                    Else
                        Size_H = Gbl_upper_Width + Gbl_Job_Trimming_LR
                    End If

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L

                        If Size_H >= Size_L Then
                            Gbl_Sheet_L = Size_L - ((Gbl_lower_Width - Gbl_upper_Width) / 2) + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L - ((Gbl_lower_Width - Gbl_upper_Width) / 2) + Gbl_Striping_LR + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H

                    End While

                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Wiro_Book_Pages_Planning(ByVal Grain_Direction As String) As String

        Dim Size_W, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            Size_L = Gbl_Rect_L
            Gbl_UPS_L = 1
            While Size_L <= M_Max_L
                Gbl_UPS_H = 1
                Size_W = Gbl_Rect_H
                While Size_W <= GblMachineMaxW Or Size_W <= M_Max_L
                    If Size_W >= Size_L Then
                        Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_Sheet_W = Size_W + Gbl_Striping_LR

                        If Gbl_Machine_Type = "Web Offset" Then
                            M_Min_L = Gbl_Sheet_W
                        End If
                        Gbl_GripperSide = "L"
                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                                    If Gbl_Printing_Style = "Work & Tumble" Then
                                        If Gbl_UPS_L Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                        If Gbl_UPS_H Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    Else
                                        Call Paper_Planning()
                                    End If
                                End If
                            End If
                        End If
                    Else
                        Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                        Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_GripperSide = "H"

                        If Gbl_Machine_Type = "Web Offset" Then
                            Gbl_M_Min_H = Gbl_Sheet_W
                        End If

                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_W <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_W <= Max_Print_H) Then
                                    If Gbl_Printing_Style = "Work & Tumble" Then
                                        If Gbl_UPS_H Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                        If Gbl_UPS_L Mod 2 = 0 Then
                                            Call Paper_Planning()
                                        End If
                                    Else
                                        Call Paper_Planning()
                                    End If
                                End If
                            End If
                        End If
                    End If

                    Gbl_UPS_H = Gbl_UPS_H + 1
                    Size_W = Val(Size_W) + Val(Gbl_Rect_H)
                End While

                Gbl_UPS_L = Gbl_UPS_L + 1
                Size_L = Size_L + Gbl_Rect_L
            End While
            'Ups = Gbl_UPS_H * Gbl_UPS_L
        Next
        Return True
    End Function

    Private Function Webbed_Self_locking_Tray_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then

                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2)
                Gbl_Rect_H = (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2)

                Gbl_Die_Size_L = (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_L + Gbl_Job_Trimming_R
                Gbl_Die_Size_H = (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_TB
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2)
                Gbl_Rect_H = (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2)
                Gbl_UPS_L = 1
                Gbl_Die_Size_L = (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B
                Gbl_Die_Size_H = (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_L + Gbl_Job_Trimming_R
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2)
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_LR
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_TB
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Ring_Flap_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then

                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_W + Gbl_Job_H + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_H * 2) + (Gbl_Job_Overlap_Flap) + Gbl_Job_Open_Flap

                Gbl_Die_Size_L = Gbl_Job_W + Gbl_Job_H + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_H * 2) + (Gbl_Job_Overlap_Flap) + Gbl_Job_Open_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_H * 4) + Gbl_Job_W + (Gbl_Job_Open_Flap * 2) + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_TB
                    End While
                    Size_L = Size_L + Gbl_Job_W + Gbl_Job_H + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_W + Gbl_Job_H + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = (Gbl_Job_H * 2) + (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Open_Flap
                Gbl_Rect_H = Gbl_Job_W + Gbl_Job_H + (Gbl_Job_Overlap_Flap * 2)

                Gbl_Die_Size_L = (Gbl_Job_H * 2) + (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Open_Flap
                Gbl_Die_Size_H = Gbl_Job_W + Gbl_Job_H + (Gbl_Job_Overlap_Flap * 2)

                Gbl_UPS_L = 1
                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_H * 4) + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + (Gbl_Job_Tongue_Height * 2)
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Reverse_Tuck_In_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_Rect_H = (Gbl_Job_W * 2) + (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Reverse_Tuck_And_Tongue_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB + Gbl_Job_Tongue_Height
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Tongue_Height + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                End While
            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Tongue_Height + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB + Gbl_Job_Tongue_Height

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Env_Center_Pasting(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                End While

                '''''''interlock style = 7
                Gbl_InterLock_Style = 7
                Gbl_Rect_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1

                        If Gbl_UPS_H Mod 2 = 0 Then
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Open_Flap '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B
                        Else
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Open_Flap '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B                            
                        End If

                        If Gbl_UPS_H = 2 Then
                            Size_L = Size_L + Gbl_Job_L
                            Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B                            
                        End If

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Job_L + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then   ''/////// InterLock_Style 5

                Gbl_InterLock_Style = 5
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                End While

                '''''''interlock style = 9
                Gbl_InterLock_Style = 9
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L

                    If Gbl_UPS_L >= 2 Then
                        Size_H = (Gbl_Job_L * 3) + Gbl_Job_Overlap_Flap
                        Gbl_Die_Size_H = (Gbl_Job_L * 3) + Gbl_Job_Overlap_Flap
                    Else
                        Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                        Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                    End If
                    Gbl_UPS_H = 1

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While

                    Gbl_UPS_L = Gbl_UPS_L + 1
                    If Gbl_UPS_L Mod 2 = 0 Then
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                    Else
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                    End If
                End While

            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Env_L_Pasting(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                End While

                '''''''interlock style = 7
                Gbl_InterLock_Style = 7
                Gbl_Rect_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1

                        If Gbl_UPS_H Mod 2 = 0 Then
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Open_Flap
                        Else
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Open_Flap
                        End If

                        If Gbl_UPS_H = 2 Then
                            Size_L = Size_L + Gbl_Job_Overlap_Flap
                            Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B                            
                        End If

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + (Gbl_Job_L * 2) + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_L * 2) + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then   ''/////// InterLock_Style 5

                Gbl_InterLock_Style = 5
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                End While

                '''''''interlock style = 9
                Gbl_InterLock_Style = 9
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L

                    If Gbl_UPS_L >= 2 Then
                        Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Overlap_Flap
                        Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Overlap_Flap
                    Else
                        Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                        Gbl_Die_Size_H = (Gbl_Job_L * 2) + Gbl_Job_Overlap_Flap
                    End If
                    Gbl_UPS_H = 1

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While

                    Gbl_UPS_L = Gbl_UPS_L + 1
                    If Gbl_UPS_L Mod 2 = 0 Then
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                    Else
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                    End If
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Sleev_Box_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_W

                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_W
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        If Gbl_UPS_H Mod 2 = 0 Then
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Trimming_TB
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Trimming_TB
                        Else
                            Size_H = Size_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_H + Gbl_Job_Trimming_TB
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_H + Gbl_Job_Trimming_TB
                        End If

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_W
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_W
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    If Gbl_UPS_L Mod 2 = 0 Then
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Trimming_TB
                    Else
                        Size_L = Size_L + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_H + Gbl_Job_Trimming_TB
                    End If

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Four_Corner_Hinged_Lid_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)
                Gbl_Rect_H = (Gbl_Job_H * 2) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_L

                Gbl_Die_Size_L = (Gbl_Job_W * 2) + (Gbl_Job_H * 3)
                Gbl_Die_Size_H = (Gbl_Job_H * 2) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_L
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            If Gbl_UPS_H = 1 Then
                                Gbl_Sheet_L = Size_L - Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Machine_Gripper + Gbl_ColorStrip + Gbl_Striping_TB
                            Else
                                Gbl_Sheet_L = Size_L + Gbl_Machine_Gripper + Gbl_ColorStrip + Gbl_Striping_TB
                            End If

                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            If Gbl_UPS_H = 1 Then
                                If Gbl_UPS_H Mod 2 = 0 Then
                                    Gbl_Sheet_L = Size_L - Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Striping_TB
                                Else
                                    Gbl_Sheet_L = Size_L - Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Striping_TB
                                End If
                            Else
                                Gbl_Sheet_L = Size_L + Gbl_Striping_TB
                            End If

                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1

                        If Gbl_UPS_H Mod 2 = 0 Then
                            If Gbl_Job_Flap_Width > ((Gbl_Job_H + Gbl_Job_Overlap_Flap) / 2) Then
                                Size_H = Size_H - Gbl_Job_H - Gbl_Job_Overlap_Flap + Gbl_Job_Flap_Width + Gbl_Job_L + Gbl_Job_Trimming_TB
                                Gbl_Die_Size_H = Gbl_Die_Size_H - Gbl_Job_H - Gbl_Job_Overlap_Flap + Gbl_Job_Flap_Width + Gbl_Job_L + Gbl_Job_Trimming_TB
                            Else
                                Size_H = Size_H + Gbl_Job_L + Gbl_Job_Overlap_Flap + Gbl_Job_H + Gbl_Job_Trimming_TB
                                Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_L + Gbl_Job_Overlap_Flap + Gbl_Job_H + Gbl_Job_Trimming_TB
                            End If
                        Else
                            If Gbl_Job_Flap_Width > ((Gbl_Job_H + Gbl_Job_Overlap_Flap) / 2) Then
                                Size_H = Size_H + Gbl_Job_L + (Gbl_Job_Flap_Width * 2) + Gbl_Job_L + Gbl_Job_Trimming_TB
                                Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_L + (Gbl_Job_Flap_Width * 2) + Gbl_Job_L + Gbl_Job_Trimming_TB
                            Else
                                Size_H = Size_H + (Gbl_Job_L) + (Gbl_Job_H) + (Gbl_Job_Overlap_Flap * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B
                                Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L) + (Gbl_Job_H) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_TB
                            End If
                        End If

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + (Gbl_Job_W * 2) + (Gbl_Job_H * 2) + Gbl_Job_Open_Flap + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_W * 2) + (Gbl_Job_H * 2) + Gbl_Job_Open_Flap + Gbl_Job_Trimming_LR

                End While
            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = (Gbl_Job_H * 2) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_L
                Gbl_Rect_H = (Gbl_Job_W * 2) + (Gbl_Job_H * 2) + Gbl_Job_Open_Flap
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = (Gbl_Job_H * 2) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_L
                Gbl_Die_Size_H = (Gbl_Job_W * 2) + (Gbl_Job_H * 2) + Gbl_Job_Open_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            If Gbl_UPS_L = 1 Then
                                Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Else
                                Gbl_Sheet_W = Size_H + Gbl_Job_H + Gbl_Striping_LR
                            End If
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else

                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            If Gbl_UPS_L = 1 Then
                                Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Else
                                Gbl_Sheet_W = Size_H + Gbl_Job_H + Gbl_Striping_LR
                            End If
                            Gbl_GripperSide = "H"
                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Open_Flap + Gbl_Job_Trimming_LR

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1

                    If Gbl_UPS_L Mod 2 = 0 Then
                        Size_L = Size_L + Gbl_Job_L + Gbl_Job_H + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L + Gbl_Job_H + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_TB
                    Else
                        Size_L = Size_L + (Gbl_Job_H) + (Gbl_Job_Overlap_Flap) + Gbl_Job_L + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_H) + (Gbl_Job_Overlap_Flap) + Gbl_Job_L + Gbl_Job_Trimming_TB
                    End If

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Env_Side_Pasting(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then

                ''/////// InterLock_Style 1
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_Die_Size_L = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_TB

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                End While

                '''''''interlock style = 2
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_Die_Size_L = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1

                        Size_H = Size_H + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then

                ''/////// InterLock_Style 3
                Gbl_InterLock_Style = 3
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                End While

                '''''''interlock style = 4
                Gbl_InterLock_Style = 4
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)

                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L

                    Size_H = Gbl_Rect_H + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_H = Gbl_Rect_H
                    Gbl_UPS_H = 1

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While

                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Calendar_Planning(ByVal Grain_Direction As String) As String

        Dim Size_W, Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_LR)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            Size_L = Gbl_Rect_L
            Gbl_UPS_L = 1

            While Size_L <= M_Max_L
                Gbl_UPS_H = 1
                Size_W = Gbl_Rect_H
                While Size_W <= GblMachineMaxW Or Size_W <= M_Max_L
                    If Size_W >= Size_L Then
                        Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_Sheet_W = Size_W + Gbl_Striping_LR

                        If Gbl_Machine_Type = "Web Offset" Then
                            Gbl_M_Min_H = Gbl_Sheet_W
                            Max_Print_H = Gbl_Sheet_W
                        End If
                        Gbl_GripperSide = "L"
                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then

                                    Call Paper_Planning()

                                End If
                            End If
                        End If

                    Else
                        Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                        Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_GripperSide = "H"

                        If Gbl_Machine_Type = "Web Offset" Then
                            Gbl_M_Min_H = Gbl_Sheet_W
                        End If

                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then

                                    Call Paper_Planning()

                                End If
                            End If
                        End If
                    End If

                    Size_W = Val(Size_W) + Val(Gbl_Rect_H)
                    Gbl_UPS_H = Gbl_UPS_H + 1
                End While
                Size_L = Size_L + Gbl_Rect_L
                Gbl_UPS_L = Gbl_UPS_L + 1

            End While
NextMachine:
        Next
        Return True
    End Function

    Private Function Carry_Bag_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer
        Dim UpsL, UpsH As Single

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)
            UpsL = 1
            UpsH = 1

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB

                Gbl_UPS_L = UpsL

                Size_L = Gbl_Rect_L

                If M_Max_L < Gbl_Rect_L Then
                    Gbl_Rect_L = Gbl_Job_L + Gbl_Job_W + Gbl_Job_Overlap_Flap
                    UpsL = 0.5
                    Gbl_UPS_L = UpsL
                End If

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H

                    End While
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = UpsH
                    Size_H = Gbl_Rect_H

                    If M_Max_L < Gbl_Rect_H Then
                        Gbl_Rect_H = Gbl_Job_L + Gbl_Job_W + Gbl_Job_Overlap_Flap
                        UpsH = 0.5
                        Gbl_UPS_H = UpsH
                    End If

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H)

                    End While
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Catch_Cover_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then

                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_H + Gbl_Job_Bottom_Flap

                Gbl_UPS_L = 1
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While

                '////////////////////////////////////////////////// InterLock_Style = 2
                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_H + Gbl_Job_Bottom_Flap

                Gbl_UPS_L = 1
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + Gbl_Job_L + (Gbl_Job_Overlap_Flap) + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While

            ElseIf Grain_Direction = "Across Grain" Then

                '//////////////////////////////////////////////////////InterLock_Style = 3
                Gbl_InterLock_Style = 3
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_H + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)

                Gbl_UPS_L = 1
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While

                '//////////////////////////////////InterLock_Style = 4
                Gbl_InterLock_Style = 4
                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_H + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Overlap_Flap * 2)

                Gbl_UPS_L = 1
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Job_L + (Gbl_Job_Overlap_Flap) + Gbl_Job_Trimming_LR

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While

            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Universal_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer
        Dim UpsL, UpsH As Single

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)
            UpsL = 1
            UpsH = 1

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Open_Flap * 2)

                Gbl_UPS_L = UpsL
                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap '+ Gbl_Job_Trimming_L + Gbl_Job_Trimming_R
                Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_Open_Flap * 2)
                Size_L = Gbl_Rect_L

                If M_Max_L < Gbl_Rect_L Then
                    Gbl_Rect_L = Gbl_Job_L + Gbl_Job_W + Gbl_Job_Overlap_Flap
                    UpsL = 0.5
                    Gbl_UPS_L = UpsL
                End If

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB

                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1

                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Open_Flap * 2)
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = UpsL
                Gbl_Die_Size_L = Gbl_Job_H + (Gbl_Job_Open_Flap * 2) '+ Gbl_Job_Trimming_T + Gbl_Job_Trimming_B
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = UpsH
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap

                    If M_Max_L < Gbl_Rect_H Then
                        Gbl_Rect_H = Gbl_Job_L + Gbl_Job_W + Gbl_Job_Overlap_Flap
                        UpsH = 0.5
                        Gbl_UPS_H = UpsH
                    End If

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + (Gbl_Job_Open_Flap * 2) + Gbl_Job_Trimming_TB
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Universal_Crash_Lock_With_Pasting_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB

                Gbl_UPS_L = 1
                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                    End While
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                Gbl_UPS_L = 1
                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_LR
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H)
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Standard_Straight_Tuck_In_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)

                Gbl_UPS_L = 1
                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2) + Gbl_Job_Trimming_TB
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR

                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1
                Gbl_Die_Size_L = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_TB
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + (Gbl_Job_Open_Flap * 2) + Gbl_Job_Trimming_TB
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Crash_Lock_With_Pasting_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_UPS_L = 1
                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        If Gbl_UPS_H Mod 2 = 0 Then
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            '''''''' Die Cut Size H
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            ''''''''
                        Else
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            '''''''' Die Cut Size H
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB

                        End If
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR

                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1
                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1

                    If Gbl_UPS_L Mod 2 = 0 Then
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        '''''''' Die Cut Size L
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        ''''''''
                    Else
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        '''''''' Die Cut Size L
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        ''''''''
                    End If
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Crash_Lock_Without_Pasting_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Rect_H = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap

                Gbl_UPS_L = 1
                Gbl_Die_Size_L = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        If Gbl_UPS_H Mod 2 = 0 Then
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            '''''''' Die Cut Size H
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            ''''''''
                        Else
                            Size_H = Size_H + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                            '''''''' Die Cut Size H
                            Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB

                        End If
                    End While
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR

                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Rect_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Gbl_UPS_L = 1
                Gbl_Die_Size_L = Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap
                Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = (Gbl_Job_L * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Val(Gbl_Rect_H) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_LR
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1

                    If Gbl_UPS_L Mod 2 = 0 Then
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        '''''''' Die Cut Size L
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        ''''''''
                    Else
                        Size_L = Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        '''''''' Die Cut Size L
                        Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_H + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Bottom_Flap + Gbl_Job_Trimming_TB
                        ''''''''
                    End If
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Turn_Over_End_Tray_Planning(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_Rect_H = Gbl_Job_W + (((Gbl_Job_L) * 70 / 100) * 2) + (Gbl_Job_Overlap_Flap * 2)

                Gbl_Die_Size_L = Gbl_Job_L + (Gbl_Job_H * 2) '+ Gbl_Job_Trimming_LR
                Gbl_Die_Size_H = Gbl_Job_W + (((Gbl_Job_L) * 70 / 100) * 2) + (Gbl_Job_Overlap_Flap * 2)
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2)
                    Gbl_Die_Size_H = Gbl_Job_W + (((Gbl_Job_L) * 70 / 100) * 2) + (Gbl_Job_Overlap_Flap * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_TB
                    End While
                    Size_L = Size_L + Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                End While

            ElseIf Grain_Direction = "Across Grain" Then

                Gbl_InterLock_Style = 2
                Gbl_Rect_L = Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_H * 2)
                Gbl_UPS_L = 1

                Gbl_Die_Size_L = Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2)
                Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_H * 2)
                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Job_L + (Gbl_Job_H * 2)
                    Gbl_Die_Size_H = Gbl_Job_L + (Gbl_Job_H * 2)

                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Size_H + Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_L + (Gbl_Job_H * 2) + Gbl_Job_Trimming_LR

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_TB
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Job_W + (Gbl_Job_H * 4) + (Gbl_Job_Overlap_Flap * 2) + Gbl_Job_Trimming_TB

                End While
            End If

NextMachine:
        Next
        Return True
    End Function

    Private Function Standard_Straight_Tuck_In_Hang(ByVal Grain_Direction As String) As String

        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                Gbl_InterLock_Style = 1
                Gbl_Rect_H = (Gbl_Job_H * 2) + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_LR
                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_TB

                Gbl_UPS_L = 1
                Gbl_Die_Size_H = (Gbl_Job_H * 2) + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_LR
                Gbl_Die_Size_L = Gbl_Job_L + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + Gbl_Job_Trimming_TB

                Size_L = Gbl_Rect_L
                While Size_L <= M_Max_L
                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip '+ Gbl_Printing_Margin_TB
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Rect_H + Gbl_Job_Trimming_TB
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H + Gbl_Job_Trimming_TB
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L + Gbl_Job_Trimming_LR

                End While
            ElseIf Grain_Direction = "Across Grain" Then
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = (Gbl_Job_H * 2) + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap) + (Gbl_Job_Tongue_Height * 2) + Gbl_Job_Trimming_TB
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2) + Gbl_Job_Trimming_LR

                Gbl_UPS_L = 1
                Gbl_Die_Size_L = Gbl_Rect_L
                Gbl_Die_Size_H = Gbl_Rect_H

                Size_L = Gbl_Rect_L

                While Size_L <= M_Max_L

                    Gbl_UPS_H = 1
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Gbl_Rect_H
                    While Size_H <= GblMachineMaxW Or Size_H <= M_Max_L
                        If Size_H >= Size_L Then

                            Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR
                            Gbl_GripperSide = "L"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                            Gbl_GripperSide = "H"

                            ''*****Check size in Machine Min and Max******''
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Val(Size_H) + Gbl_Job_L + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_LR
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Job_L + Gbl_Job_W + Gbl_Job_Open_Flap + Gbl_Job_Trimming_LR
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Size_L + Gbl_Rect_L '+ Gbl_Job_Trimming_TB
                    Gbl_Die_Size_L = Gbl_Die_Size_L + (Gbl_Job_H * 2) + (Gbl_Job_W * 2) + Gbl_Job_Overlap_Flap + (Gbl_Job_Tongue_Height * 2) '+ Gbl_Job_Trimming_TB
                End While
            End If
NextMachine:
        Next
        Return True
    End Function

    Private Function Book_Pages_Planning(ByVal Grain_Direction As String) As String
        'CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim Size_W, Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Grain_Direction = Grain_Direction
        If Grain_Direction = "With Grain" Then
            Gbl_Rect_H = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        Else
            Gbl_Rect_L = Gbl_Job_H + (Gbl_Job_Trimming_TB)
            Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Trimming_LR)
        End If

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            Size_L = Gbl_Rect_L
            Size_W = Gbl_Rect_H
            If Grain_Direction = "Across Grain" Then
                Size_L = Gbl_Rect_L
                Gbl_UPS_L = 1
            Else
                Size_L = Gbl_Rect_L * 2
                Gbl_UPS_L = 2
            End If

            While Size_L <= M_Max_L
                If Grain_Direction = "Across Grain" Then
                    Size_W = Gbl_Rect_H * 2
                    Gbl_UPS_H = 2
                Else
                    Size_W = Gbl_Rect_H
                    Gbl_UPS_H = 1
                End If

                While Size_W <= GblMachineMaxW Or Size_W <= M_Max_L
                    If Size_W >= Size_L Then
                        Gbl_Sheet_L = Size_L + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip
                        Gbl_Sheet_W = Size_W + Gbl_Striping_LR
                        Gbl_GripperSide = "L"

                        'If Gbl_Machine_Type = "Web Offset" Then
                        '    Gbl_M_Min_H = Gbl_Sheet_W
                        '    Max_Print_H = Gbl_Sheet_W
                        'End If

                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then

                                    Call Paper_Planning()

                                End If
                            End If
                        End If

                    Else
                        Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                        Gbl_Sheet_W = Size_W + Gbl_Striping_TB + Gbl_Machine_Gripper + Gbl_ColorStrip

                        'If Gbl_Machine_Type = "Web Offset" Then
                        '    Gbl_M_Min_H = Gbl_Sheet_W
                        'End If

                        ''*****Check size in Machine Min and Max******''
                        If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then
                            If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then
                                If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then

                                    Call Paper_Planning()

                                End If
                            End If
                        End If
                    End If
                    If Grain_Direction = "Across Grain" Then
                        Gbl_UPS_H = Gbl_UPS_H + 2
                        Size_W = Val(Size_W) + Val(Gbl_Rect_H) + Gbl_Rect_H
                    Else
                        Size_W = Val(Size_W) + Val(Gbl_Rect_H)
                        Gbl_UPS_H = Gbl_UPS_H + 1
                    End If

                End While

                If Grain_Direction = "Across Grain" Then
                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_UPS_L = Gbl_UPS_L + 1
                Else
                    Gbl_UPS_L = Gbl_UPS_L + 2
                    Size_L = Size_L + Gbl_Rect_L + Gbl_Rect_L
                End If

            End While
NextMachine:
        Next
        Return True
    End Function

    Private Function Pastry_Type_Box_Planning(Grain_Direction As String) As String
        Dim Size_H, Size_L, Gbl_Rect_H, Gbl_Rect_L As Double
        Dim M_Max_L As Double
        Dim M_Min_L, Max_Print_L, Max_Print_H As Double
        Dim i As Integer

        Gbl_Plan_Grain_Direction = Grain_Direction

        For i = 0 To Gbl_DT_Machine.Rows.Count - 1

            If Gbl_Printing_Style = "FB-Perfection" Then
                If IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(14)), False, Gbl_DT_Machine.Rows(i)(14)) <> True Or (Val(Gbl_DT_Machine.Rows(i)(10)) < (Gbl_Front_Color + Gbl_Back_Color)) Or (Gbl_Front_Color <> Gbl_Back_Color) Then
                    GoTo NextMachine
                End If
            End If

            Gbl_Machine_Gripper = Gbl_Gripper
            Gbl_Machine_ID = Gbl_DT_Machine.Rows(i)(0)
            Gbl_Machine_Name = Gbl_DT_Machine.Rows(i)(1)
            M_Max_L = Gbl_DT_Machine.Rows(i)(2)
            GblMachineMaxW = Gbl_DT_Machine.Rows(i)(3)
            M_Min_L = Gbl_DT_Machine.Rows(i)(4)
            Gbl_M_Min_H = Gbl_DT_Machine.Rows(i)(5)
            Max_Print_L = Gbl_DT_Machine.Rows(i)(6)
            Max_Print_H = Gbl_DT_Machine.Rows(i)(7)
            Gbl_Machine_Type = Gbl_DT_Machine.Rows(i)(11)

            If Gbl_Machine_Gripper = 0 Then ' pick gripper from machine if not set it manually means it should be 0 or blank
                Gbl_Machine_Gripper = IIf(IsDBNull(Gbl_DT_Machine.Rows(i)(13)), 0, Gbl_DT_Machine.Rows(i)(13))
            End If

            If Gbl_Printing_Style = "Work & Tumble" Or Gbl_Printing_Style = "FB-Perfection" Then
                Gbl_Machine_Gripper = Gbl_Machine_Gripper * 2
            End If

            Gbl_Machine_Gripper = Math.Round(Gbl_Machine_Gripper, 3)

            If Grain_Direction = "With Grain" Then
                ''/////// InterLock Style 1
                Gbl_InterLock_Style = 1

                Gbl_Rect_L = (Gbl_Job_W * 2) + (Gbl_Job_H * 2) + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB
                Gbl_Rect_H = Gbl_Job_L + (Gbl_Job_Flap_Width * 2) + Gbl_Job_Trimming_LR

                Gbl_Die_Size_L = Gbl_Rect_L
                Gbl_Die_Size_H = Gbl_Rect_H
                Gbl_UPS_L = 1

                Size_L = Gbl_Rect_L
                While M_Max_L >= Size_L
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Size_H
                    Gbl_UPS_H = 1

                    While GblMachineMaxW >= Size_H Or M_Max_L >= Size_H

                        If Size_H >= Size_L Then
                            Gbl_Sheet_L = Size_L + Gbl_Machine_Gripper + Gbl_ColorStrip + Gbl_Striping_TB
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR

                            Gbl_GripperSide = "L"
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then  'For Machine Minimum paper size
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then  'For Machine Minimum paper size
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then  'For Machine Minimum Printing size
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Machine_Gripper + Gbl_ColorStrip + Gbl_Striping_TB

                            Gbl_GripperSide = "H"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then  'For Machine Minimum paper size
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then  'For Machine Minimum paper size
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then  'For Machine Minimum Printing size
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        End If
                        Gbl_UPS_H = Gbl_UPS_H + 1
                        Size_H = Gbl_Rect_H + Size_H
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H
                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1
                    Size_L = Gbl_Rect_L + Size_L
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Size_L
                End While

            ElseIf Grain_Direction = "Across Grain" Then
                ''/////// InterLock_Style 2
                Gbl_InterLock_Style = 2

                Gbl_Rect_L = Gbl_Job_L + (Gbl_Job_Flap_Width * 2) + Gbl_Job_Trimming_LR
                Gbl_Rect_H = (Gbl_Job_W * 2) + (Gbl_Job_H * 2) + Gbl_Job_Open_Flap + Gbl_Job_Trimming_TB

                Gbl_Die_Size_L = Gbl_Rect_L
                Gbl_Die_Size_H = Gbl_Rect_H

                Gbl_UPS_L = 1
                Size_L = Gbl_Rect_L

                While M_Max_L >= Size_L
                    Size_H = Gbl_Rect_H
                    Gbl_Die_Size_H = Size_H
                    Gbl_UPS_H = 1

                    While GblMachineMaxW >= Size_H Or M_Max_L >= Size_H

                        If Size_H >= Size_L Then
                            Gbl_Sheet_L = Size_L + Gbl_Machine_Gripper + Gbl_ColorStrip + Gbl_Striping_TB
                            Gbl_Sheet_W = Size_H + Gbl_Striping_LR

                            Gbl_GripperSide = "L"
                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then  'For Machine Minimum paper size
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then  'For Machine Minimum paper size
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then  'For Machine Minimum Printing size
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If
                        Else
                            Gbl_Sheet_L = Size_L + Gbl_Striping_LR
                            Gbl_Sheet_W = Size_H + Gbl_Machine_Gripper + Gbl_ColorStrip + Gbl_Striping_TB

                            Gbl_GripperSide = "H"

                            If (Gbl_Sheet_W <= M_Max_L And Gbl_Sheet_L <= GblMachineMaxW) Or (Gbl_Sheet_L <= M_Max_L And Gbl_Sheet_W <= GblMachineMaxW) Then  'For Machine Minimum paper size
                                If (Gbl_Sheet_W >= M_Min_L And Gbl_Sheet_L >= Gbl_M_Min_H) Or (Gbl_Sheet_L >= M_Min_L And Gbl_Sheet_W >= Gbl_M_Min_H) Then  'For Machine Minimum paper size
                                    If (Size_H <= Max_Print_L And Size_L <= Max_Print_H) Or (Size_L <= Max_Print_L And Size_H <= Max_Print_H) Then  'For Machine Minimum Printing size
                                        If Gbl_Printing_Style = "Work & Tumble" Then
                                            If Gbl_UPS_H Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        ElseIf Gbl_Printing_Style = "Work & Turn" Then
                                            If Gbl_UPS_L Mod 2 = 0 Then
                                                Call Paper_Planning()
                                            End If
                                        Else
                                            Call Paper_Planning()
                                        End If
                                    End If
                                End If
                            End If

                        End If
                        Gbl_UPS_H += 1
                        Size_H = Size_H + Gbl_Rect_H
                        Gbl_Die_Size_H = Gbl_Die_Size_H + Gbl_Rect_H

                    End While
                    Gbl_UPS_L = Gbl_UPS_L + 1

                    Size_L = Size_L + Gbl_Rect_L
                    Gbl_Die_Size_L = Gbl_Die_Size_L + Gbl_Rect_L
                End While
            End If

NextMachine:
        Next
        Return True
    End Function

    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Private Sub Plan_On_Sheet()
        Try
            Dim Cut_L, Cut_H, Cut_H_L, Cut_L_H As Long
            Dim Bal_L, Bal_H, Final_Bal_L, Final_Bal_H, Waste_In_Percent, Waste As Double

            For i = 0 To Gbl_DT_Paper.Rows.Count - 1
                Gbl_Paper_ID = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(0)), 0, Gbl_DT_Paper.Rows(i)(0))
                If Gbl_Paper_ID = 0 Then ''Special size case paper id is zero
                    Gbl_DT_Paper.Rows(i)(10) = Gbl_Sheet_W
                    Gbl_DT_Paper.Rows(i)(11) = Gbl_Sheet_L
                End If
                Gbl_Paper_GSM = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(2)), 0, Gbl_DT_Paper.Rows(i)(2))
                Gbl_Packing = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(4)), "", Gbl_DT_Paper.Rows(i)(4))
                Gbl_Unit_Per_Packing = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(5)), 0, Gbl_DT_Paper.Rows(i)(5))

                Gbl_Paper_Rate = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(7)), 0, Gbl_DT_Paper.Rows(i)(7))

                If Gbl_Paper_TrimmingLR = 0 And Gbl_Paper_TrimmingTB = 0 Then
                    Gbl_Paper_TrimmingLR = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(9)), 0, Gbl_DT_Paper.Rows(i)(9))
                    Gbl_Paper_TrimmingTB = Gbl_Paper_TrimmingLR
                End If

                Gbl_Paper_H = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(10)), 0, Gbl_DT_Paper.Rows(i)(10))
                Gbl_Paper_L = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(11)), 0, Gbl_DT_Paper.Rows(i)(11))
                'Gbl_Is_Standard_Paper = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(13)), False, Gbl_DT_Paper.Rows(i)(13))
                'Gbl_Is_Balance_Piece = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(15)), False, Gbl_DT_Paper.Rows(i)(15))
                Gbl_Paper_Rate_Type = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(16)), "", Gbl_DT_Paper.Rows(i)(16))  'Estimation Unit
                GblPaperPurchaseRateType = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(20)), "", Gbl_DT_Paper.Rows(i)(20))  'Purchase Unit
                Gbl_Paper_Quality = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(1)), "", Gbl_DT_Paper.Rows(i)(1)) 'IIf(Gbl_Paper_Quality = "", "", Gbl_Paper_Quality)
                GblMainPaperGroup = IIf(IsDBNull(Gbl_DT_Paper.Rows(i)(18)), "", Gbl_DT_Paper.Rows(i)(18))

                Gbl_Paper_Detail = "Quality=" & Trim(Gbl_Paper_Quality) & " and GSM=" & Trim(Gbl_Paper_GSM) & " and SizeW=" & Trim(Gbl_Paper_H) & " And  SizeL=" & Trim(Gbl_Paper_L) & ""

                If Gbl_Paper_ID = 0 Then
                    Gbl_Paper_L = Math.Round(Gbl_Paper_L + ((Gbl_Paper_TrimmingLR)), 2)
                    Gbl_Paper_H = Math.Round(Gbl_Paper_H + ((Gbl_Paper_TrimmingTB)), 2)
                Else
                    Gbl_Paper_L = Math.Round(Gbl_Paper_L - ((Gbl_Paper_TrimmingLR)), 2)
                    Gbl_Paper_H = Math.Round(Gbl_Paper_H - ((Gbl_Paper_TrimmingTB)), 2)
                End If

                Gbl_Sheet_W = Math.Round(Gbl_Sheet_W, 2)
                Gbl_Sheet_L = Math.Round(Gbl_Sheet_L, 2)

                If (Gbl_Sheet_L <= Gbl_Paper_L And Gbl_Sheet_W <= Gbl_Paper_H) Then   'For Paper Size
                    Cut_L = RoundDown(Gbl_Paper_L / Gbl_Sheet_L)
                    Cut_H = RoundDown(Gbl_Paper_H / Gbl_Sheet_W)

                    'Calculating Balance Piece size
                    Bal_L = Gbl_Paper_L - (Gbl_Sheet_L * Cut_L)
                    Bal_H = Gbl_Paper_H - (Gbl_Sheet_W * Cut_H)

                    Cut_H_L = 0
                    Cut_L_H = 0
                    If Gbl_Grain_Direction = "Both" Then

                        If Bal_L > Gbl_Sheet_W Then
                            Cut_L_H = RoundDown(Bal_L / Gbl_Sheet_W)
                            Cut_H_L = RoundDown(Gbl_Paper_H / Gbl_Sheet_L)
                        End If

                        If Bal_H > Gbl_Sheet_L Then
                            Cut_H_L = RoundDown(Bal_H / Gbl_Sheet_L)
                            Cut_L_H = RoundDown(Gbl_Paper_L / Gbl_Sheet_W)
                        End If

                        Final_Bal_L = Bal_L - (Cut_L_H * Gbl_Sheet_W)
                        Final_Bal_H = Bal_H - (Cut_H_L * Gbl_Sheet_L)

                        If (Final_Bal_L * Gbl_Paper_H) > (Final_Bal_H * Gbl_Paper_L) Then
                            Bal_Piece = Gbl_Paper_H & "x" & Math.Round(Final_Bal_L, 2)
                            Gbl_Bal_Side = "L"
                        Else
                            Bal_Piece = Math.Round(Final_Bal_H, 2) & "x" & Gbl_Paper_L
                            Gbl_Bal_Side = "W"
                        End If

                        Waste = Math.Round((Gbl_Paper_L * Gbl_Paper_H) - ((Gbl_Sheet_L * Gbl_Sheet_W) * ((Cut_L * Cut_H) + (Cut_L_H * Cut_H_L))), 2)
                        Waste_In_Percent = Math.Round(Waste * 100 / (Gbl_Paper_L * Gbl_Paper_H), 2)
                    Else

                        If (Bal_L * Gbl_Paper_H) > (Bal_H * Gbl_Paper_L) Then
                            Bal_Piece = Gbl_Paper_H & "x" & Math.Round(Bal_L, 2)
                            Gbl_Bal_Side = "L"
                        Else
                            Bal_Piece = Math.Round(Bal_H, 2) & "x" & Gbl_Paper_L
                            Gbl_Bal_Side = "W"
                        End If
                        Waste = Math.Round((Gbl_Paper_L * Gbl_Paper_H) - ((Gbl_Sheet_L * Gbl_Sheet_W) * (Cut_L * Cut_H)), 2)
                        Waste_In_Percent = Math.Round(Waste * 100 / (Gbl_Paper_L * Gbl_Paper_H), 2)

                    End If
                    If Gbl_Orientation = "BookPages" Or Gbl_Orientation = "WiroBookPages" Or Gbl_Orientation = "Calendar" Or Gbl_Orientation = "WiroLeaves" Then
                        Call Add_Shirin_Book(Cut_L, Cut_H, Cut_H_L, Cut_L_H, Bal_Piece, Gbl_Bal_Side, Waste, Waste_In_Percent)
                    Else
                        Call Add_Shirin(Cut_L, Cut_H, Cut_H_L, Cut_L_H, Bal_Piece, Gbl_Bal_Side, Waste, Waste_In_Percent)
                    End If

                End If
            Next

        Catch ex As Exception
            planErrors = ex.Message
        End Try
    End Sub

    Private Sub Plan_On_Reel()
        Try

            Dim pi As Long
            Dim Reel_Width As Double
            Dim Cut_L, Cut_H, Cut_H_L, Cut_L_H As Long
            Dim Bal_L, Bal_H, Waste_In_Percent, Waste As Double

            For pi = 0 To GblDTReel.Rows.Count - 1

                Gbl_Paper_ID = IIf(IsDBNull(GblDTReel.Rows(pi)(0)), 0, GblDTReel.Rows(pi)(0))
                If Gbl_Paper_ID = 0 Then
                    GblDTReel.Rows(pi)(10) = Gbl_Sheet_W
                    GblDTReel.Rows(pi)(11) = Gbl_Sheet_L
                End If

                Gbl_Paper_GSM = IIf(IsDBNull(GblDTReel.Rows(pi)(2)), 0, GblDTReel.Rows(pi)(2))
                Gbl_Paper_Rate = IIf(IsDBNull(GblDTReel.Rows(pi)(7)), 0, GblDTReel.Rows(pi)(7))
                Reel_Width = IIf(IsDBNull(GblDTReel.Rows(pi)(10)), 0, GblDTReel.Rows(pi)(10))

                ' Gbl_Main_Paper_Group = GblDTReel.TextMatrix(pi, 18)

                If Reel_Width < Gbl_Sheet_W Then
                    GoTo NextReel
                End If
                If GblMachineMaxW < Gbl_Sheet_L Then
                    GoTo NextReel
                End If
                '            If Gbl_Machine_Max_Paper_H > Gbl_Sheet_H Then
                '               GoTo NextReel
                '            End If
                Cut_H = RoundDown(Reel_Width / Gbl_Sheet_W)
                Cut_L = 1
                Gbl_Paper_H = Reel_Width

                If Gbl_M_Min_H <> 0 Then
                    Gbl_Paper_L = Math.Round(Gbl_Sheet_L, 2) 'Gbl_M_Min_H  Variable cutoff setting in line o matic machine
                Else
                    Gbl_Paper_L = GblMachineMaxW 'Gbl_Sheet_L fix web cut off
                End If

                Bal_H = Gbl_Paper_H - (Gbl_Sheet_W * Cut_H)
                Bal_L = Gbl_Paper_L - (Gbl_Sheet_L * Cut_L)

                If (Bal_L * Gbl_Paper_H) > (Bal_H * Gbl_Paper_L) Then
                    Bal_Piece = Gbl_Paper_H & "x" & Math.Round(Bal_L, 2)
                    Gbl_Bal_Side = "L"
                Else
                    Bal_Piece = Math.Round(Bal_H, 2) & "x" & Gbl_Paper_L
                    Gbl_Bal_Side = "W"
                End If

                Gbl_Paper_Detail = "Quality=" & Trim(Gbl_Paper_Quality) & " and GSM=" & Trim(Gbl_Paper_GSM) & " and SizeW=" & Trim(Reel_Width) & ""

                Waste = Math.Round((Gbl_Paper_L * Gbl_Paper_H) - ((Gbl_Sheet_L * Gbl_Sheet_W) * (Cut_L * Cut_H)), 2)
                Waste_In_Percent = Math.Round(Waste * 100 / (Gbl_Paper_L * Gbl_Paper_H), 2)

                If Gbl_Orientation = "BookPages" Or Gbl_Orientation = "WiroBookPages" Or Gbl_Orientation = "Calendar" Or Gbl_Orientation = "WiroLeaves" Then
                    If Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Or Gbl_Printing_Style = "Single Side" Then
                        Add_Shirin_Book(Cut_L, Cut_H, Cut_H_L, Cut_L_H, Bal_Piece, Gbl_Bal_Side, Waste, Waste_In_Percent)
                    End If
                Else
                    If Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Or Gbl_Printing_Style = "Single Side" Then
                        Call Add_Shirin(Cut_L, Cut_H, Cut_H_L, Cut_L_H, Bal_Piece, Gbl_Bal_Side, Waste, Waste_In_Percent)
                    End If
                End If

NextReel:
            Next
        Catch ex As Exception
            planErrors = ex.Message
        End Try
    End Sub

    Private Sub Plan_On_Reel_Slitting()
        Try

            Dim pi As Long
            Dim Reel_Width As Double
            Dim Cut_L, Cut_H, Cut_H_L, Cut_L_H As Long
            Dim Bal_L, Bal_H, Waste_In_Percent, Waste As Double

            For pi = 0 To GblDTReel.Rows.Count - 1

                Gbl_Paper_ID = Val(GblDTReel.Rows(pi)(2))
                If Gbl_Paper_ID = 0 Then
                    GblDTReel.Rows(pi)(10) = Gbl_Sheet_W
                    GblDTReel.Rows(pi)(11) = Gbl_Sheet_L
                End If

                Gbl_Paper_GSM = Val(GblDTReel.Rows(pi)(2))
                Gbl_Paper_Rate = GblDTReel.Rows(pi)(7)
                Reel_Width = GblDTReel.Rows(pi)(10)

                'Gbl_Main_Paper_Name = GblDTReel.TextMatrix(pi, 1) & ", " & GblDTReel.TextMatrix(pi, 2) & " GSM, " & GblDTReel.TextMatrix(pi, 3)
                'Gbl_Main_Paper_Group = GblDTReel.TextMatrix(pi, 18)

                If Reel_Width < Gbl_Sheet_W Then
                    GoTo NextReel
                End If
                If GblMachineMaxW < Gbl_Sheet_L Then
                    GoTo NextReel
                End If
                If GblMachineMaxW < Gbl_Sheet_W Then
                    GoTo NextReel
                End If

                Cut_H = RoundDown(Reel_Width / Gbl_Sheet_W)
                Cut_L = 1
                Gbl_Paper_H = Reel_Width
                'Gbl_Paper_L = Gbl_Sheet_L

                If Gbl_M_Min_H <> 0 Then
                    Gbl_Paper_L = Math.Round(Gbl_Sheet_L, 2)  'Gbl_M_Min_H  Variable cutoff setting in line o matic machine
                Else
                    Gbl_Paper_L = GblMachineMaxW 'Gbl_Sheet_L fix web cut off
                End If

                Bal_H = Gbl_Paper_H - (Gbl_Sheet_W * Cut_H)
                Bal_L = Gbl_Paper_L - (Gbl_Sheet_L * Cut_L)

                If (Bal_L * Gbl_Paper_H) > (Bal_H * Gbl_Paper_L) Then
                    Bal_Piece = Gbl_Paper_H & "x" & Math.Round(Bal_L, 2)
                    Gbl_Bal_Side = "L"
                Else
                    Bal_Piece = Math.Round(Bal_H, 2) & "x" & Gbl_Paper_L
                    Gbl_Bal_Side = "W"
                End If
                Waste = Math.Round((Gbl_Paper_L * Gbl_Paper_H) - ((Gbl_Sheet_L * Gbl_Sheet_W) * (Cut_L * Cut_H)), 2)
                Waste_In_Percent = Math.Round(Waste * 100 / (Gbl_Paper_L * Gbl_Paper_H), 2)

                If Gbl_Orientation = "BookPages" Or Gbl_Orientation = "WiroBookPages" Or Gbl_Orientation = "Calendar" Or Gbl_Orientation = "WiroLeaves" Then
                    If Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Or Gbl_Printing_Style = "Single Side" Or Gbl_Printing_Style = "No Printing" Then
                        Add_Shirin_Book(Cut_L, Cut_H, Cut_H_L, Cut_L_H, Bal_Piece, Gbl_Bal_Side, Waste, Waste_In_Percent)
                    End If
                Else
                    If Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Or Gbl_Printing_Style = "Single Side" Or Gbl_Printing_Style = "No Printing" Then
                        Call Add_Shirin(Cut_L, Cut_H, Cut_H_L, Cut_L_H, Bal_Piece, Gbl_Bal_Side, Waste, Waste_In_Percent)
                    End If
                End If

NextReel:
            Next
        Catch ex As Exception
            planErrors = ex.Message
        End Try
    End Sub


    ''' <summary>
    ''' Add Book planning in datatable
    ''' </summary>
    ''' <param name="Cut_L"></param>
    ''' <param name="Cut_H"></param>
    ''' <param name="Cut_H_L"></param>
    ''' <param name="Cut_L_H"></param>
    ''' <param name="Bal_Piece"></param>
    ''' <param name="Bal_Side"></param>
    ''' <param name="Waste"></param>
    ''' <param name="Waste_In_Percent"></param>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Private Sub Add_Shirin_Book(ByVal Cut_L As Long, ByVal Cut_H As Long, ByVal Cut_H_L As Long, ByVal Cut_L_H As Long, ByVal Bal_Piece As String, ByVal Bal_Side As String, ByVal Waste As Double, ByVal Waste_In_Percent As Double)

        Dim Make_Ready_Sheet, Make_Ready_Sheets_Total As Long, Plate_Qty As Long
        Dim Make_Readies, Make_Ready_Amount As Double
        Dim Plate_Rate, Plate_Amount As Double
        Dim Full_Sheets, Actual_Sheets, Wastage_Sheets, Flat_Wastage_Sheets, Wastage_Percent_Sheets As Double
        Dim Final_Quantity, Printing_Impressions, Impression_To_Be_Charged, Printing_Charges As Double
        Dim Total_Colors As Long, Total_Colors_Main As Long
        Dim Paper_Amount, Printing_Amount As Double, Total_Cut_Sheets, Total_Ups As Double
        Dim Actual_Plus_MakeReady_Sheets As Long
        Dim Minimum_Sheets As Long, Roundof_Impressions_With As Long, Machine_Colors As Long
        Dim Make_Ready_Rate As Double
        Dim Printing_Charges_Type As String = ""
        Dim Coating_Charges_Type As String = ""
        Dim Basic_Printing_Charges As Double
        Dim BasicCoatingCharges As Double
        Dim Machine_Speed As Long, Make_Ready_Time As Long, Job_Change_Over_Time As Long
        Dim No_Of_Sets As Integer
        Dim Wastage_Type As String = "", Wastage_Calculation_On As String = ""
        Dim No_Of_Forms As Long
        Dim Is_Perfecta_Machine As Boolean = False
        Dim DT_Book As New DataTable
        Dim IsSpecialMachine As Boolean = False

        Try
            'CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If Gbl_Orientation = "PrePlannedSheet" Then
                Total_Ups = Gbl_Job_Ups
            Else
                Total_Ups = Gbl_UPS_L * Gbl_UPS_H
            End If

            'If Gbl_Half_Ups_Logic = True Then
            '    Total_Ups = Total_Ups / 2
            'End If

            If Gbl_Orientation = "WiroLeaves" Then
                Gbl_Job_Pages = Gbl_Job_Leaves * 2
            End If

            '''''Check Machine availability or fill respective values of machine 
            Call Search_In_Machine(Gbl_Machine_ID, Minimum_Sheets, Make_Ready_Sheet, Make_Ready_Rate, Machine_Colors, Printing_Charges_Type, Roundof_Impressions_With, Basic_Printing_Charges, Machine_Speed, Make_Ready_Time, Job_Change_Over_Time, Wastage_Type, Wastage_Calculation_On, Gbl_DT_Search_In_Machine, Is_Perfecta_Machine, IsSpecialMachine)

            'Special type of machine Mitsubishi Daiya print only F&B ,IsSpecialMachine case is added for this by VB & pKp at Lovely on 15-03-20
            If IsSpecialMachine = True And (Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble") Then Gbl_Printing_Style = "Front & Back"

            Call Calculate_Book_Forms(DT_Book, Total_Ups, Gbl_Order_Quantity, Gbl_Job_Pages, No_Of_Sets, No_Of_Forms, Actual_Sheets)

            If Gbl_Printing_Style = "Single Side" Or Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble" Then
                If Gbl_Front_Color >= Gbl_Back_Color Then
                    Total_Colors_Main = Gbl_Front_Color
                    Plate_Qty = Gbl_Front_Color * No_Of_Sets
                Else
                    Total_Colors_Main = Gbl_Back_Color
                    Plate_Qty = Gbl_Back_Color * No_Of_Sets
                End If
            ElseIf Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Then
                Total_Colors_Main = Gbl_Front_Color + Gbl_Back_Color
                Plate_Qty = (Gbl_Front_Color * No_Of_Forms) + (Gbl_Back_Color * No_Of_Forms)
            End If

            Total_Colors = Total_Colors_Main + Gbl_Special_Front_Color + Gbl_Special_Back_Color

            If Gbl_Printing_Style = "Single Side" Then
                Make_Readies = RoundUp(Total_Colors / Machine_Colors, 0) * No_Of_Sets
            ElseIf Gbl_Front_Color >= Gbl_Back_Color Then
                Make_Readies = (RoundUp(Gbl_Front_Color / Machine_Colors, 0)) * No_Of_Sets
            End If

            Make_Ready_Sheets_Total = RoundUp(Make_Readies * Make_Ready_Sheet, 0)
            Actual_Plus_MakeReady_Sheets = Actual_Sheets + Make_Ready_Sheets_Total

            Plate_Qty = 0
            Dim T_Impressions As Decimal
            For i = 0 To DT_Book.Rows.Count - 1

                If IsSpecialMachine = True And Gbl_Printing_Style = "Front & Back" Then
                    If (Val(DT_Book.Rows(i)(2)) / (Total_Ups * 2)) < 1 Then
                        DT_Book.Rows(i)(4) = DT_Book.Rows(i)(4) / 2
                    End If
                End If

                Printing_Impressions = Val(DT_Book.Rows(i)(4))

                If Roundof_Impressions_With = 0 Then
                    Impression_To_Be_Charged = Printing_Impressions
                Else
                    Impression_To_Be_Charged = RoundUP_25(Printing_Impressions / Roundof_Impressions_With) * Roundof_Impressions_With
                End If

                If Minimum_Sheets > Impression_To_Be_Charged Then
                    Impression_To_Be_Charged = Minimum_Sheets
                End If
                DT_Book.Rows(i)(6) = Impression_To_Be_Charged

                '''''''For Both Machine Slabs
                If Search_In_Machine_Slabs(Gbl_Machine_ID, Impression_To_Be_Charged, Wastage_Percent_Sheets, Printing_Charges, Plate_Rate, Coating_Charges, Special_Color_Front_Charges, Special_Color_Back_Charges, Printing_Charges_Type, Roundof_Impressions_With, Basic_Printing_Charges) = False Then
                    If planErrors.Contains("Check Printing slabs in:") Then
                        If planErrors.Contains(Gbl_Machine_Name) = False Then
                            planErrors = planErrors.Replace("Check Printing slabs in:", "Check Printing slabs in:(" & Gbl_Machine_Name & ",")
                        End If
                    Else
                        planErrors = planErrors & " Check Printing slabs in: " & Gbl_Machine_Name & ")"
                    End If
                    Exit Sub
                End If

                Coating_Charges = 0
                If GblOnlineCoating = "None" Or GblOnlineCoating = "No" Or GblOnlineCoating = "null" Then
                Else
                    If Search_In_Machine_Online_Coating(Gbl_Machine_ID, GblDTMachineCoatingRates, Coating_Charges, Coating_Charges_Type, Actual_Sheets, BasicCoatingCharges) = False Then
                        If planErrors.Contains("Check Coating slabs in:") Then
                            If planErrors.Contains(Gbl_Machine_Name) = False Then
                                planErrors = planErrors.Replace("Check Coating slabs in:", "Check Coating slabs in:(" & Gbl_Machine_Name & ",")
                            End If
                        Else
                            planErrors = planErrors & " Check Coating slabs in: " & Gbl_Machine_Name & ")"
                        End If
                        Exit Sub
                    End If
                End If

                If IsSpecialMachine = True Then 'And i > 0 And DT_Book.Rows(i)(1) = 1
                    DT_Book.Rows(i)(1) = Val(DT_Book.Rows(i)(0)) * 2
                    Printing_Amount = Calculate_Book_Printing_Charges(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, Val(DT_Book.Rows(i)(1)), Gbl_Front_Color, Gbl_Back_Color, "Front & Back", Is_Perfecta_Machine, Gbl_Machine_ID)
                    Plate_Qty = Plate_Qty + (Val(DT_Book.Rows(i)(0)) * (Gbl_Front_Color + Gbl_Back_Color + Gbl_Special_Front_Color + Gbl_Special_Back_Color))

                Else
                    If i = 0 And Val(DT_Book.Rows(i)(1)) > 1 Then
                        Printing_Amount = Calculate_Book_Printing_Charges(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, Val(DT_Book.Rows(i)(1)), Gbl_Front_Color, Gbl_Back_Color, "Front & Back", Is_Perfecta_Machine, Gbl_Machine_ID)
                        Plate_Qty = Val(DT_Book.Rows(i)(0)) * (Gbl_Front_Color + Gbl_Back_Color + Gbl_Special_Front_Color + Gbl_Special_Back_Color)
                    Else
                        If Gbl_Front_Color >= Gbl_Back_Color Then
                            Printing_Amount = Calculate_Book_Printing_Charges(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, Val(DT_Book.Rows(i)(1)), Gbl_Front_Color, 0, Gbl_Printing_Style, Is_Perfecta_Machine, Gbl_Machine_ID)
                            Plate_Qty = Plate_Qty + Gbl_Front_Color
                        Else
                            Printing_Amount = Calculate_Book_Printing_Charges(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, Val(DT_Book.Rows(i)(1)), 0, Gbl_Back_Color, Gbl_Printing_Style, Is_Perfecta_Machine, Gbl_Machine_ID)
                            Plate_Qty = Plate_Qty + Gbl_Back_Color
                        End If
                    End If
                End If


                'If IsSpecialMachine = True And Gbl_Printing_Style = "Front & Back" Then
                '    Printing_Impressions = Printing_Impressions / 2
                'End If


                If Gbl_Special_Front_Color > Gbl_Special_Back_Color Then
                    Plate_Qty = Plate_Qty + Gbl_Special_Front_Color
                Else
                    Plate_Qty = Plate_Qty + Gbl_Special_Back_Color
                End If

                DT_Book.Rows(i)(7) = Basic_Printing_Charges
                DT_Book.Rows(i)(8) = Printing_Charges
                DT_Book.Rows(i)(9) = Printing_Charges_Type
                DT_Book.Rows(i)(10) = Printing_Amount
                T_Impressions = T_Impressions + (Impression_To_Be_Charged * Val(DT_Book.Rows(i)(1)))   'No of Sets
            Next

            Impression_To_Be_Charged = T_Impressions

            Printing_Amount = IIf(IsDBNull(DT_Book.Compute("SUM(Amount)", "")), "0", DT_Book.Compute("SUM(Amount)", ""))

            '''''''Calculate Wastage 
            If Gbl_Flat_Wastage_Type = "Machine Default" Or Gbl_Flat_Wastage_Type.Contains("Default") Then
                If Wastage_Type.Contains("Sheet") Then
                    If Wastage_Calculation_On = "Flat" Then
                        Wastage_Sheets = Wastage_Percent_Sheets
                        Wastage_Sheets = RoundUp(Wastage_Sheets * No_Of_Forms, 0)
                    Else
                        If Gbl_Front_Color >= Gbl_Back_Color Then
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Front_Color)
                        Else
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Back_Color)   'Total_Color
                        End If
                        Wastage_Sheets = RoundUp(Wastage_Percent_Sheets * No_Of_Forms, 0)
                    End If
                Else
                    If Wastage_Calculation_On = "Flat" Then
                        Wastage_Sheets = RoundUp(Actual_Plus_MakeReady_Sheets * Wastage_Percent_Sheets / 100, 0)
                    Else
                        If Gbl_Front_Color >= Gbl_Back_Color Then
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Front_Color)
                        Else
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Back_Color)   'Total_Color
                        End If
                        Wastage_Sheets = RoundUp(Actual_Plus_MakeReady_Sheets * Wastage_Percent_Sheets / 100, 0)
                    End If

                End If
            ElseIf Gbl_Flat_Wastage_Type = "Sheets" Then
                Flat_Wastage_Sheets = Gbl_Flat_Wastage_Value
                Wastage_Sheets = Gbl_Flat_Wastage_Value
                Wastage_Sheets = RoundUp(Wastage_Sheets * No_Of_Forms, 0)
            ElseIf Gbl_Flat_Wastage_Type = "Percentage" Then
                Wastage_Percent_Sheets = Gbl_Flat_Wastage_Value
                Wastage_Sheets = RoundUp(Actual_Sheets * Gbl_Flat_Wastage_Value / 100, 0)
            End If
            Wastage_Sheets = RoundUp(Wastage_Sheets, 0)

            Dim Total_Paper_In_KG As Double
            Dim Used_Paper_In_KG As Double
            Dim Wastage_Paper_In_KG As Double
            Dim wt_Cut_Sheets As Double
            Dim wt_Full_Sheets As Double

            Total_Cut_Sheets = RoundUp((Actual_Sheets), 0) + RoundUp((Make_Ready_Sheets_Total), 0) + RoundUp((Wastage_Sheets), 0)

            If (Cut_H_L * Cut_L_H) > 0 Then
                Full_Sheets = RoundUp(Total_Cut_Sheets / ((Cut_L * Cut_H) + (Cut_H_L * Cut_L_H)), 0)
            Else
                Full_Sheets = RoundUp(Total_Cut_Sheets / (Cut_L * Cut_H), 0)
            End If

            wt_Cut_Sheets = ((Gbl_Paper_GSM * Gbl_Sheet_L * Gbl_Sheet_W) / 1000000) / 1000  ' wt of Double sheet in kg
            If Gbl_Paper_ID > 0 Then
                wt_Full_Sheets = ((Gbl_Paper_GSM * (Gbl_Paper_L + (Gbl_Paper_TrimmingLR)) * (Gbl_Paper_H + (Gbl_Paper_TrimmingTB))) / 1000000000) ' wt of Double sheet in kg
            Else
                wt_Full_Sheets = ((Gbl_Paper_GSM * Gbl_Paper_L * Gbl_Paper_H) / 1000000000)  ' wt of Double sheet in kg
            End If

            Total_Paper_In_KG = Math.Round(Full_Sheets * wt_Full_Sheets, 3)
            Used_Paper_In_KG = Math.Round(Total_Cut_Sheets * wt_Cut_Sheets, 3)
            Wastage_Paper_In_KG = Math.Round(Total_Paper_In_KG - Used_Paper_In_KG, 3)

            If CheckPaperByClient = "True" Or CheckPaperByClient = True Then
                Gbl_Paper_Rate = 0
            End If

            If Gbl_Paper_Rate_Type.ToUpper.Contains("SHEET") Then
                Paper_Amount = Math.Round(Gbl_Paper_Rate * Full_Sheets, 2)
            Else
                Gbl_Paper_Rate_Type = "Kg"
                Paper_Amount = Math.Round(Gbl_Paper_Rate * Total_Paper_In_KG, 2)
            End If

            Make_Ready_Amount = Math.Round(Make_Readies * Make_Ready_Rate, 2)

            If Gbl_Machine_Type = "Digital" Then
                Plate_Qty = 0
            End If
            Plate_Amount = Math.Round(Plate_Rate * Plate_Qty, 2)
            Final_Quantity = RoundUp((Total_Cut_Sheets * Total_Ups) / (Gbl_Job_Pages / 2), 0)

            Dim Expected_Execution_Time As Long, Total_Completion_Time As Long
            'Time in Minutes                            'Make_Ready_Time
            If Machine_Speed <> 0 Then
                Expected_Execution_Time = (Make_Ready_Time * Make_Readies) + (Printing_Impressions / Machine_Speed) + Job_Change_Over_Time
                Total_Completion_Time = Expected_Execution_Time
            End If

            '///////////////////////
            ''Dim ST_Op_Amt As String = ""
            Dim Op_Amt As Double = 0
            Dim Pub_Sheets As Double

            Dim DTOPR As New DataTable
            DTOPR = Gbl_DT_Operation.Copy()
            DTOPR.Clear()

            For j = 0 To GblDTOprFactors.Rows.Count - 1

                For i = 0 To Gbl_DT_Operation.Rows.Count - 1
                    If Gbl_DT_Operation.Rows(i)(6) = "Pre" Then
                        Pub_Sheets = Full_Sheets
                    Else
                        If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "Actual Sheets", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets" Then
                            Pub_Sheets = ((Actual_Sheets))
                        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Make Ready Sheets" Then
                            Pub_Sheets = Actual_Sheets + Make_Readies
                        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Wastage Sheets" Then
                            Pub_Sheets = Actual_Sheets + Wastage_Sheets
                        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Make Ready Sheets + Wastage Sheets" Then
                            Pub_Sheets = (Full_Sheets * ((Cut_L) * (Cut_L)))
                        End If
                    End If

                    If UCase(Gbl_DT_Operation.Rows(i)(4)) = "PROCESS" Then
                        Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Sheet_L / 25.4, 2)
                        Gbl_DT_Operation.Rows(i)(8) = RoundUp(Gbl_Sheet_W / 25.4, 2)
                    Else
                        Gbl_DT_Operation.Rows(i)(7) = 0
                        Gbl_DT_Operation.Rows(i)(8) = 0
                    End If

                    Dim QTY As Double = 0
                    Dim typeofcharge As String = ""
                    typeofcharge = IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(0)), "", Gbl_DT_Operation.Rows(i)(0))
                    If typeofcharge.Contains("Order Quantity") Or typeofcharge.Contains("OrderQuantity") Then
                        QTY = Gbl_Order_Quantity
                    ElseIf typeofcharge.Contains("Unit") Then
                        QTY = Final_Quantity
                    ElseIf typeofcharge.Contains("Sheet") Then
                        QTY = Pub_Sheets
                    End If

                    If typeofcharge.Contains("Calendar-Inch") Then
                        Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Job_L / 25.4, 2)
                    End If

                    If typeofcharge.Contains("Job-Inch") Then
                        Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Job_L / 25.4, 2)
                        Gbl_DT_Operation.Rows(i)(8) = RoundUp(Gbl_Job_W / 25.4, 2)
                    End If

                    'Dim k As Integer = 0
                    'For k = 0 To GblDTOprSlabs.Rows.Count - 1
                    '    If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("ProcessID")), 0, Gbl_DT_Operation.Rows(i)("ProcessID")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ProcessID")), 0, GblDTOprSlabs.Rows(k)("ProcessID")) Then
                    '        If IIf(IsDBNull(GblDTOprSlabs.Rows(k)("FromQty")), 0, GblDTOprSlabs.Rows(k)("FromQty")) >= 1 And IIf(IsDBNull(GblDTOprFactors.Rows(j)("ProcessID")), 0, GblDTOprFactors.Rows(j)("ProcessID")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ProcessID")), 0, GblDTOprSlabs.Rows(k)("ProcessID")) Then
                    '            If (QTY >= IIf(IsDBNull(GblDTOprSlabs.Rows(k)("FromQty")), 0, GblDTOprSlabs.Rows(k)("FromQty")) And QTY <= IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ToQty")), 0, GblDTOprSlabs.Rows(k)("ToQty")) And IIf(IsDBNull(GblDTOprFactors.Rows(j)("RateFactor")), "", GblDTOprFactors.Rows(j)("RateFactor")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("RateFactor")), "", GblDTOprSlabs.Rows(k)("RateFactor"))) Then
                    '                Gbl_DT_Operation.Rows(i)(1) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("Rate")), 0, GblDTOprSlabs.Rows(k)("Rate"))
                    '                Gbl_DT_Operation.Rows(i)(2) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("MinimumCharges")), 0, GblDTOprSlabs.Rows(k)("MinimumCharges"))
                    '                Exit For
                    '            End If
                    '        End If
                    '    End If
                    'Next

                    Dim Amt = Calculate_Operations(IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(0)), "", Gbl_DT_Operation.Rows(i)(0)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(1)), 0, Gbl_DT_Operation.Rows(i)(1)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(2)), 0, Gbl_DT_Operation.Rows(i)(2)), Final_Quantity, IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(3)), 0, Gbl_DT_Operation.Rows(i)(3)), Total_Paper_In_KG, Total_Ups, No_Of_Sets, IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(7)), 0, Gbl_DT_Operation.Rows(i)(7)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(8)), 0, Gbl_DT_Operation.Rows(i)(8)), Total_Colors, Pub_Sheets, Gbl_Job_L, Gbl_Job_H, Gbl_Job_W, Plate_Qty, Gbl_Order_Quantity)
                    Gbl_DT_Operation.Rows(i)(11) = Amt
                    Gbl_DT_Operation.Rows(i)(12) = Gbl_DT_plan.Rows.Count + 1
                    Gbl_DT_Operation.Rows(i)(15) = QTY
                    Gbl_DT_Operation.Rows(i)(16) = Total_Ups
                    Gbl_DT_Operation.Rows(i)(17) = 1
                    Gbl_DT_Operation.Rows(i)(19) = IIf(IsDBNull(GblDTOprFactors.Rows(j)("RateFactor")), "", GblDTOprFactors.Rows(j)("RateFactor"))
                    Gbl_DT_Operation.Rows(i)("NoOfColors") = Total_Colors

                    If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("ProcessID")), 0, Gbl_DT_Operation.Rows(i)("ProcessID")) = IIf(IsDBNull(GblDTOprFactors.Rows(j)("ProcessID")), 0, GblDTOprFactors.Rows(j)("ProcessID")) Then
                        DTOPR.ImportRow(Gbl_DT_Operation.Rows(i))
                        Op_Amt = Op_Amt + Amt
                    End If
                Next
            Next

            Dim Coating_Amount As Double = 0
            Coating_Amount = Calculate_Coating_Charges(Actual_Sheets, Coating_Charges, Coating_Charges_Type, RoundUp(Gbl_Sheet_L / 25.4, 2), RoundUp(Gbl_Sheet_W / 25.4, 2), BasicCoatingCharges, Impression_To_Be_Charged)

            Special_Color_Front_Amount = Calculate_Special_Color_Charges(Gbl_Special_Front_Color, Special_Color_Front_Charges, Impression_To_Be_Charged, Printing_Charges_Type, Roundof_Impressions_With, No_Of_Sets)
            Special_Color_Back_Amount = Calculate_Special_Color_Charges(Gbl_Special_Back_Color, Special_Color_Back_Charges, Impression_To_Be_Charged, Printing_Charges_Type, Roundof_Impressions_With, No_Of_Sets)

            Rf_Dt_Opr.Merge(DTOPR) 'Gbl_DT_Operation
            GblDTBook.Merge(DT_Book)

            '/////////////
            With Gbl_DT_plan

                Dim Paper_Size, Cut_size, Die_Cut_size As String
                Dim Total_Amount, F_Total_Amount As Double
                Paper_Size = Gbl_Paper_H & "x" & Gbl_Paper_L
                Cut_size = Math.Round(Gbl_Sheet_W, 2) & "x" & Math.Round(Gbl_Sheet_L, 2)
                Total_Amount = Math.Round(Plate_Amount + Paper_Amount + Printing_Amount + Make_Ready_Amount + Coating_Amount, 2)
                F_Total_Amount = Op_Amt + Total_Amount
                Die_Cut_size = Gbl_Die_Size_H & "x" & Gbl_Die_Size_L

                .NewRow()
                .Rows.Add(Gbl_Machine_ID, Gbl_Machine_Name, Gbl_Machine_Gripper, Gbl_GripperSide, Machine_Colors, Gbl_Paper_ID, Paper_Size, Cut_size, Cut_L, Cut_H, Gbl_UPS_L, Gbl_UPS_H, Total_Ups, Bal_Piece, Bal_Side, Waste, Waste_In_Percent, Wastage_Paper_In_KG, Gbl_Grain_Direction, Plate_Qty, Plate_Rate, Plate_Amount, Make_Ready_Sheets_Total, Actual_Sheets, Wastage_Sheets, Total_Paper_In_KG, Full_Sheets, Gbl_Paper_Rate, Paper_Amount, (Printing_Impressions * Make_Readies), Impression_To_Be_Charged, Printing_Charges, Printing_Amount, Make_Readies, Make_Ready_Rate, Make_Ready_Amount, Final_Quantity, Total_Colors, Total_Amount, Cut_L_H, Cut_H_L, Gbl_Printing_Style, Printing_Charges_Type, Expected_Execution_Time, Total_Completion_Time, Gbl_Paper_Detail, Gbl_Plan_Type, Gbl_Paper_Rate_Type, Die_Cut_size, Gbl_InterLock_Style, No_Of_Sets, Math.Round(F_Total_Amount, 3), Gbl_Packing, Gbl_Unit_Per_Packing, Roundof_Impressions_With, Special_Color_Front_Charges, Special_Color_Back_Charges, Special_Color_Front_Amount, Special_Color_Back_Amount, Op_Amt, .Rows.Count + 1, Coating_Charges, Coating_Amount, GblMainPaperGroup, GblVendorID, GblVendorName)

            End With

        Catch ex As Exception
            planErrors = ex.Message
        End Try
    End Sub

    ''' <summary>
    ''' Add Plan in datatable
    ''' </summary>
    ''' <param name="Cut_L"></param>
    ''' <param name="Cut_H"></param>
    ''' <param name="Cut_H_L"></param>
    ''' <param name="Cut_L_H"></param>
    ''' <param name="Bal_Piece"></param>
    ''' <param name="Bal_Side"></param>
    ''' <param name="Waste"></param>
    ''' <param name="Waste_In_Percent"></param>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Private Sub Add_Shirin(ByVal Cut_L As Long, ByVal Cut_H As Long, ByVal Cut_H_L As Long, ByVal Cut_L_H As Long, ByVal Bal_Piece As String, ByVal Bal_Side As String, ByVal Waste As Double, ByVal Waste_In_Percent As Double)
        Try
            'Dim DT_Plate As New DataTable
            Dim Make_Ready_Sheet, Make_Ready_Sheets_Total As Long, Plate_Qty As Long
            Dim Make_Readies, Make_Ready_Amount As Double
            Dim Plate_Rate, Plate_Amount As Double
            Dim Full_Sheets, Actual_Sheets, Wastage_Sheets, Flat_Wastage_Sheets, Wastage_Percent_Sheets As Double
            Dim Final_Quantity, Printing_Impressions, Impression_To_Be_Charged, Printing_Charges As Double
            Dim Total_Colors As Long, Total_Colors_Main As Long
            Dim Paper_Amount, Printing_Amount As Double, Total_Cut_Sheets, Total_Ups As Double
            Dim Actual_Plus_MakeReady_Sheets As Long
            Dim Minimum_Sheets As Long, Roundof_Impressions_With As Long, Machine_Colors As Long
            Dim Make_Ready_Rate As Double
            Dim Printing_Charges_Type As String = ""
            Dim Coating_Charges_Type As String = ""
            Dim Basic_Printing_Charges As Double
            Dim BasicCoatingCharges As Double
            Dim Machine_Speed, Make_Ready_Time As Long, Job_Change_Over_Time As Long
            Dim No_Of_Sets As Integer
            Dim Wastage_Type As String = "", Wastage_Calculation_On As String = ""
            Dim Is_Perfecta_Machine As Boolean = False
            Dim IsSpecialMachine As Boolean = False

            If Gbl_Orientation = "PrePlannedSheet" Then
                Total_Ups = Gbl_Job_Ups
            Else
                Total_Ups = Gbl_UPS_L * Gbl_UPS_H
            End If

            If Gbl_Orientation = "WeddingCardSets" Then ''For lovely cards
                Total_Ups = Gbl_Job_Leaves
            End If

            ''If Gbl_Half_Ups_Logic = True Then
            ''    Total_Ups = Total_Ups / 2
            ''End If

            If Gbl_Job_Leaves = 0 Or Gbl_Orientation = "WeddingCardSets" Then
                Actual_Sheets = RoundUp(Val(Gbl_Order_Quantity) / (Total_Ups), 0)
            Else
                Actual_Sheets = RoundUp((Val(Gbl_Order_Quantity) / (Total_Ups)) * Gbl_Job_Leaves, 0)
            End If

            '''''Check Machine availability or fill respective values of machine 
            Call Search_In_Machine(Gbl_Machine_ID, Minimum_Sheets, Make_Ready_Sheet, Make_Ready_Rate, Machine_Colors, Printing_Charges_Type, Roundof_Impressions_With, Basic_Printing_Charges, Machine_Speed, Make_Ready_Time, Job_Change_Over_Time, Wastage_Type, Wastage_Calculation_On, Gbl_DT_Search_In_Machine, Is_Perfecta_Machine, IsSpecialMachine)

            'If Machine_Colors = 0 Then
            '    Return
            'End If
            'Special type of machine Mitsubishi Daiya print only F&B ,IsSpecialMachine case is added for this by VB & pKp at Lovely on 15-03-20
            If IsSpecialMachine = True And (Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble") Then Gbl_Printing_Style = "Front & Back"

            If Gbl_Printing_Style = "Single Side" Or Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble" Then
                If Gbl_Front_Color >= Gbl_Back_Color Then
                    Total_Colors_Main = Gbl_Front_Color
                Else
                    Total_Colors_Main = Gbl_Back_Color
                End If
            ElseIf Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Then
                Total_Colors_Main = Gbl_Front_Color + Gbl_Back_Color
            Else
                Total_Colors_Main = 0
            End If

            Total_Colors = Total_Colors_Main + Gbl_Special_Front_Color + Gbl_Special_Back_Color


            If Gbl_Printing_Style = "Single Side" Then
                Make_Readies = RoundUp(Total_Colors / Machine_Colors, 0)
            ElseIf Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble" Then
                Make_Readies = RoundUp(Total_Colors / Machine_Colors, 0)
            ElseIf Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Then
                Make_Readies = RoundUp(Gbl_Front_Color / Machine_Colors, 0) + RoundUp(Gbl_Back_Color / Machine_Colors, 0)
            End If

            Make_Ready_Sheets_Total = RoundUp(Make_Readies * Make_Ready_Sheet, 0)
            Actual_Plus_MakeReady_Sheets = Actual_Sheets + Make_Ready_Sheets_Total

            No_Of_Sets = 1
            If Gbl_Printing_Style = "Single Side" Then
                Printing_Impressions = Actual_Plus_MakeReady_Sheets
            ElseIf Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble" Then
                Printing_Impressions = Actual_Plus_MakeReady_Sheets * 2
            ElseIf Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Then
                No_Of_Sets = 2
                Printing_Impressions = Actual_Plus_MakeReady_Sheets
            End If

            'If Machine_Colors < Total_Colors_Main Then
            '    Printing_Impressions = Printing_Impressions * RoundUp(Total_Colors_Main / Machine_Colors, 0)
            'End If
            If Roundof_Impressions_With = 0 Then
                Impression_To_Be_Charged = Printing_Impressions
            Else
                If Minimum_Sheets >= Printing_Impressions Then
                    Impression_To_Be_Charged = Minimum_Sheets
                Else
                    Impression_To_Be_Charged = RoundUP_25(Printing_Impressions / Roundof_Impressions_With) * Roundof_Impressions_With   'Rounding sheets like 240 to 1000 sheets
                End If
            End If
            If Minimum_Sheets > Impression_To_Be_Charged Then
                Impression_To_Be_Charged = Minimum_Sheets
            End If

            '/////Calculating Wastage
            If Gbl_Printing_Style <> "No Printing" Then
                '''''''For Both Machine Slabs clients and self
                If Search_In_Machine_Slabs(Gbl_Machine_ID, Impression_To_Be_Charged, Wastage_Percent_Sheets, Printing_Charges, Plate_Rate, Coating_Charges, Special_Color_Front_Charges, Special_Color_Back_Charges, Printing_Charges_Type, Roundof_Impressions_With, Basic_Printing_Charges) = False Then
                    If planErrors.Contains("Check Printing slabs in:") Then
                        If planErrors.Contains(Gbl_Machine_Name) = False Then
                            planErrors = planErrors.Replace("Check Printing slabs in:", "Check Printing slabs in:(" & Gbl_Machine_Name & ",")
                        End If
                    Else
                        planErrors = planErrors & " Check Printing slabs in: " & Gbl_Machine_Name & ")"
                    End If
                    Exit Sub
                End If
            End If

            Coating_Charges = 0
            If GblOnlineCoating = "None" Or GblOnlineCoating = "No" Or GblOnlineCoating = "null" Then
            Else
                If Search_In_Machine_Online_Coating(Gbl_Machine_ID, GblDTMachineCoatingRates, Coating_Charges, Coating_Charges_Type, Actual_Sheets, BasicCoatingCharges) = False Then
                    If planErrors.Contains("Check Coating slabs in:") Then
                        If planErrors.Contains(Gbl_Machine_Name) = False Then
                            planErrors = planErrors.Replace("Check Coating slabs in:", "Check Coating slabs in:(" & Gbl_Machine_Name & ",")
                        End If
                    Else
                        planErrors = planErrors & " Check Coating slabs in: " & Gbl_Machine_Name & ")"
                    End If
                    Exit Sub
                End If
            End If

            'DT_Plate.Columns.Add("Form_No", GetType(Integer))
            'DT_Plate.Columns.Add("No_of_Plate", GetType(Long))
            'DT_Plate.Columns.Add("Rate", GetType(Single))
            'DT_Plate.Columns.Add("Amount", GetType(Long))
            'DT_Plate.Columns.Add("Printing_Style", GetType(String))
            'DT_Plate.Columns.Add("Total_Color", GetType(Long))

            'DT_Plate.NewRow()
            'DT_Plate.Rows.Add(1, Plate_Qty, Plate_Rate, Plate_Amount, Gbl_Printing_Style, Total_Colors)
            'Plate_Calculation(DT_Plate)
            If Gbl_Machine_Type = "Digital" Then
                Plate_Qty = 0
            Else
                Plate_Qty = Total_Colors
            End If

            Plate_Amount = Math.Round(Val(Plate_Rate) * Val(Plate_Qty), 2)

            '''''''Calculate Wastage 
            If Gbl_Flat_Wastage_Type = "Machine Default" Or Gbl_Flat_Wastage_Type.Contains("Default") Then
                If Wastage_Type = "Sheets" Then
                    If Wastage_Calculation_On = "Flat" Then
                        Wastage_Sheets = Wastage_Percent_Sheets
                    Else
                        If Gbl_Front_Color >= Gbl_Back_Color Then
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Front_Color + Gbl_Special_Front_Color + Gbl_Special_Back_Color)
                        Else
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Back_Color + Gbl_Special_Front_Color + Gbl_Special_Back_Color)   'Total_Color
                        End If
                        Wastage_Sheets = Wastage_Percent_Sheets
                    End If
                Else
                    If Wastage_Calculation_On = "Flat" Then
                        Wastage_Sheets = RoundUp(Actual_Plus_MakeReady_Sheets * Wastage_Percent_Sheets / 100, 0)
                    Else
                        If Gbl_Front_Color >= Gbl_Back_Color Then
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Front_Color + Gbl_Special_Front_Color + Gbl_Special_Back_Color)
                        Else
                            Wastage_Percent_Sheets = Wastage_Percent_Sheets * (Gbl_Back_Color + Gbl_Special_Front_Color + Gbl_Special_Back_Color)   'Total_Color
                        End If
                        Wastage_Sheets = RoundUp(Actual_Plus_MakeReady_Sheets * Wastage_Percent_Sheets / 100, 0)
                    End If
                End If
            ElseIf Gbl_Flat_Wastage_Type = "Sheets" Then
                Flat_Wastage_Sheets = Gbl_Flat_Wastage_Value
                Wastage_Sheets = Gbl_Flat_Wastage_Value
            ElseIf Gbl_Flat_Wastage_Type = "Percentage" Then
                Wastage_Percent_Sheets = Gbl_Flat_Wastage_Value
                Wastage_Sheets = RoundUp(Actual_Plus_MakeReady_Sheets * Wastage_Percent_Sheets / 100, 0)
            End If
            Wastage_Sheets = RoundUp(Wastage_Sheets, 0)


            '/////////Calculating Paper Qty///////////
            Dim Total_Paper_In_KG As Double
            Dim Used_Paper_In_KG As Double
            Dim Wastage_Paper_In_KG As Double
            Dim wt_Cut_Sheets As Double
            Dim wt_Full_Sheets As Double

            Total_Cut_Sheets = RoundUp((Actual_Sheets), 0) + RoundUp((Make_Ready_Sheets_Total), 0) + RoundUp((Wastage_Sheets), 0)

            If (Cut_H_L * Cut_L_H) > 0 Then
                Full_Sheets = RoundUp(Total_Cut_Sheets / ((Cut_L * Cut_H) + (Cut_H_L * Cut_L_H)), 0)
            Else
                Full_Sheets = RoundUp(Total_Cut_Sheets / (Cut_L * Cut_H), 0)
            End If

            wt_Cut_Sheets = ((Gbl_Paper_GSM * Gbl_Sheet_L * Gbl_Sheet_W) / 1000000) / 1000  ' wt of Double sheet in kg
            If Gbl_Paper_ID > 0 Then ''Special size case paper Trimming LR already added at planning
                wt_Full_Sheets = ((Gbl_Paper_GSM * (Gbl_Paper_L + (Gbl_Paper_TrimmingLR)) * (Gbl_Paper_H + (Gbl_Paper_TrimmingTB))) / 1000000000) ' wt of Double sheet in kg
            Else
                wt_Full_Sheets = ((Gbl_Paper_GSM * Gbl_Paper_L * Gbl_Paper_H) / 1000000000) ' wt of Double sheet in kg
            End If

            If UCase(Gbl_Plan_Type) = UCase("Reel To Sheet Planning") Then
                If UCase(GblPaperPurchaseRateType) = UCase("Meter") Or UCase(GblPaperPurchaseRateType) = UCase("Square Meter") Then
                    wt_Cut_Sheets = (Gbl_Sheet_L / 1000)
                    wt_Full_Sheets = (Gbl_Paper_L / 1000)
                End If

                Total_Paper_In_KG = Math.Round(Full_Sheets * wt_Full_Sheets, 3)
                Used_Paper_In_KG = Math.Round(Total_Cut_Sheets * wt_Cut_Sheets, 3)
                Wastage_Paper_In_KG = Math.Round(Total_Paper_In_KG - Used_Paper_In_KG, 3)
                Wastage_Paper_In_KG = Math.Round(Math.Round(Full_Sheets * (Gbl_Paper_H / 1000), 3) - Math.Round(Total_Cut_Sheets * (Gbl_Sheet_W / 1000), 3), 3)
            Else
                Total_Paper_In_KG = Math.Round(Full_Sheets * wt_Full_Sheets, 3)
                Used_Paper_In_KG = Math.Round(Total_Cut_Sheets * wt_Cut_Sheets, 3)
                Wastage_Paper_In_KG = Math.Round(Total_Paper_In_KG - Used_Paper_In_KG, 3)
            End If

            If CheckPaperByClient = "True" Or CheckPaperByClient = True Then
                Gbl_Paper_Rate = 0
            End If

            If Gbl_Paper_Rate_Type.ToUpper.Contains("SHEET") Then
                Paper_Amount = Math.Round(Gbl_Paper_Rate * Full_Sheets, 2)
            Else
                Gbl_Paper_Rate_Type = "Kg"
                Paper_Amount = Math.Round(Gbl_Paper_Rate * Total_Paper_In_KG, 2)
            End If

            If UCase(Gbl_Plan_Type) = UCase("Reel To Sheet Planning") Then
                Dim row As DataRow = GblDTReel.Select("PaperID = " & Gbl_Paper_ID & "").FirstOrDefault()
                If Not row Is Nothing Then
                    Dim POUnit = IIf(IsDBNull(row.Item("PurchaseUnit")), "KG", row.Item("PurchaseUnit"))
                    If POUnit.ToUpper.Contains("METER") Then
                        wt_Cut_Sheets = (Gbl_Sheet_L / 1000)
                        wt_Full_Sheets = (Gbl_Paper_L / 1000)
                    End If

                    Total_Paper_In_KG = Math.Round(Full_Sheets * wt_Full_Sheets, 3)
                    Used_Paper_In_KG = Math.Round(Total_Cut_Sheets * wt_Cut_Sheets, 3)
                    Wastage_Paper_In_KG = Math.Round(Math.Round(Full_Sheets * (Gbl_Paper_H / 1000), 3) - Math.Round(Total_Cut_Sheets * (Gbl_Sheet_W / 1000), 3), 3)

                    Paper_Amount = Math.Round(Gbl_Paper_Rate * Total_Paper_In_KG, 2)

                End If
            End If

            'As Discussed with vivek sir on 25-04-2019 for cost getting double due to Ttl imprn of F&B
            Dim tmpImpression_To_Be_Charged As Double = Impression_To_Be_Charged
            'If Machine_Colors < Total_Colors_Main Then
            ''Printing_Impressions = Printing_Impressions * RoundUp(Total_Colors / Machine_Colors, 0)
            'tmpImpression_To_Be_Charged = Impression_To_Be_Charged / RoundUp(Total_Colors_Main / Machine_Colors, 0)
            'End If

            Printing_Amount = Calculate_Printing_Charges(tmpImpression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, No_Of_Sets, Gbl_Front_Color, Gbl_Back_Color, Gbl_Printing_Style, Is_Perfecta_Machine, Gbl_Machine_ID)
            Make_Ready_Amount = Math.Round(Make_Readies * Make_Ready_Rate, 2)
            If Gbl_Job_Leaves = 0 Then
                Final_Quantity = RoundUp(Total_Cut_Sheets * Total_Ups, 0)
            Else
                Final_Quantity = RoundUp((Total_Cut_Sheets * Total_Ups) / Gbl_Job_Leaves, 0)
            End If

            Dim Expected_Execution_Time As Long, Total_Completion_Time As Long
            'Time in Minutes                            'Make_Ready_Time
            If Machine_Speed <> 0 Then
                Expected_Execution_Time = (Make_Ready_Time * Make_Readies) + (Printing_Impressions / Machine_Speed) + Job_Change_Over_Time
                Total_Completion_Time = Expected_Execution_Time
            End If

            Dim Op_Amt As Double = 0
            ''Dim ST_Op_Amt As String = ""
            Dim Pub_Sheets As Double
            ''For i = 0 To Gbl_DT_Operation.Rows.Count - 1
            ''    If Gbl_DT_Operation.Rows(i)(6) = "Pre" Then
            ''        Pub_Sheets = Full_Sheets
            ''    Else
            ''        If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "Actual Sheets", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets" Then
            ''            Pub_Sheets = ((Actual_Sheets))
            ''        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Make Ready Sheets" Then
            ''            Pub_Sheets = Actual_Sheets + Make_Readies
            ''        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Wastage Sheets" Then
            ''            Pub_Sheets = Actual_Sheets + Wastage_Sheets
            ''        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Make Ready Sheets + Wastage Sheets" Then
            ''            Pub_Sheets = (Full_Sheets * ((Cut_L) * (Cut_L)))
            ''        End If
            ''    End If
            ''    Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Sheet_L / 25.4, 2)
            ''    Gbl_DT_Operation.Rows(i)(8) = RoundUp(Gbl_Sheet_W / 25.4, 2)

            ''    Dim Amt = Calculate_Operations(IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(0)), "", Gbl_DT_Operation.Rows(i)(0)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(1)), 0, Gbl_DT_Operation.Rows(i)(1)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(2)), 0, Gbl_DT_Operation.Rows(i)(2)),
            ''                                   Final_Quantity, IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(3)), 0, Gbl_DT_Operation.Rows(i)(3)), Total_Paper_In_KG, Total_Ups,
            ''                                   No_Of_Sets, IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(7)), 0, Gbl_DT_Operation.Rows(i)(7)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(8)), 0, Gbl_DT_Operation.Rows(i)(8)), Total_Colors, Pub_Sheets,
            ''                                   Gbl_Job_L, Gbl_Job_H, Gbl_Job_W, Plate_Qty, Gbl_Order_Quantity)

            ''    Gbl_DT_Operation.Rows(i)(11) = Amt
            ''    Gbl_DT_Operation.Rows(i)(12) = Gbl_DT_plan.Rows.Count + 1
            ''    Gbl_DT_Operation.Rows(i)(15) = Final_Quantity
            ''    Gbl_DT_Operation.Rows(i)(16) = Total_Ups
            ''    Gbl_DT_Operation.Rows(i)(17) = 1

            ''    ''If ST_Op_Amt = "" Then
            ''    ''    ST_Op_Amt = Amt
            ''    ''Else
            ''    ''    ST_Op_Amt = ST_Op_Amt & "," & Amt
            ''    ''End If
            ''    Op_Amt = Op_Amt + Amt
            ''Next

            'Future use
            'Dim slbrate As Double = GblDTOprSlabs.Compute("IsNull(Sum(Rate),0)", "ProcessID =" & Gbl_DT_Operation.Rows(i)("ProcessID") & " And ProcessID =" & GblDTOprFactors.Rows(j)("ProcessID") & " And FromQty >" & QTY & " And ToQty <= " & QTY & " And RateFactor='" & GblDTOprFactors.Rows(j)("RateFactor") & "'")
            'If slbrate <= 0 Or Nothing Then
            'Else
            '    Gbl_DT_Operation.Rows(i)(1) = slbrate
            'End If

            Dim DTOPR As New DataTable
            DTOPR = Gbl_DT_Operation.Copy()
            DTOPR.Clear()

            For j = 0 To GblDTOprFactors.Rows.Count - 1

                For i = 0 To Gbl_DT_Operation.Rows.Count - 1
                    If Gbl_DT_Operation.Rows(i)(6) = "Pre" Then
                        Pub_Sheets = Full_Sheets
                    Else
                        If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "Actual Sheets", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets" Then
                            Pub_Sheets = ((Actual_Sheets))
                        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Make Ready Sheets" Then
                            Pub_Sheets = Actual_Sheets + Make_Readies
                        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Wastage Sheets" Then
                            Pub_Sheets = Actual_Sheets + Wastage_Sheets
                        ElseIf IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(5)), "", Gbl_DT_Operation.Rows(i)(5)) = "Actual Sheets + Make Ready Sheets + Wastage Sheets" Then
                            Pub_Sheets = (Full_Sheets * ((Cut_L) * (Cut_L)))
                        End If
                    End If

                    If UCase(Gbl_DT_Operation.Rows(i)(4)) = "PROCESS" Then
                        Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Sheet_L / 25.4, 2)
                        Gbl_DT_Operation.Rows(i)(8) = RoundUp(Gbl_Sheet_W / 25.4, 2)
                    Else
                        Gbl_DT_Operation.Rows(i)(7) = 0
                        Gbl_DT_Operation.Rows(i)(8) = 0
                    End If
                    Dim QTY As Double = 0
                    Dim typeofcharge As String = ""
                    typeofcharge = IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(0)), "", Gbl_DT_Operation.Rows(i)(0))
                    If typeofcharge.Contains("Order Quantity") Or typeofcharge.Contains("OrderQuantity") Then
                        QTY = Gbl_Order_Quantity
                    ElseIf typeofcharge.Contains("Unit") Then
                        QTY = Final_Quantity
                    ElseIf typeofcharge.Contains("Sheet") Then
                        QTY = Pub_Sheets
                    End If

                    If typeofcharge.Contains("Calendar-Inch") Then
                        Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Job_L / 25.4, 2)
                    End If

                    If typeofcharge.Contains("Job-Inch") Then
                        Gbl_DT_Operation.Rows(i)(7) = RoundUp(Gbl_Job_L / 25.4, 2)
                        Gbl_DT_Operation.Rows(i)(8) = RoundUp(Gbl_Job_W / 25.4, 2)
                    End If

                    'Dim k As Integer = 0
                    'For k = 0 To GblDTVendorProcessRates.Rows.Count - 1
                    '    If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("ProcessID")), 0, Gbl_DT_Operation.Rows(i)("ProcessID")) = IIf(IsDBNull(GblDTVendorProcessRates.Rows(k)("ProcessID")), 0, GblDTVendorProcessRates.Rows(k)("ProcessID")) Then
                    '        'If IIf(IsDBNull(GblDTVendorProcessRates.Rows(k)("LedgerID")), 0, GblDTVendorProcessRates.Rows(k)("LedgerID")) = Gbl_Ledger_ID And IIf(IsDBNull(GblDTOprFactors.Rows(j)("ProcessID")), 0, GblDTOprFactors.Rows(j)("ProcessID")) = IIf(IsDBNull(GblDTVendorProcessRates.Rows(k)("ProcessID")), 0, GblDTVendorProcessRates.Rows(k)("ProcessID")) Then
                    '        Gbl_DT_Operation.Rows(i)(1) = IIf(IsDBNull(GblDTVendorProcessRates.Rows(k)("Rate")), 0, GblDTVendorProcessRates.Rows(k)("Rate"))
                    '        Gbl_DT_Operation.Rows(i)(2) = IIf(IsDBNull(GblDTVendorProcessRates.Rows(k)("MinimumCharges")), 0, GblDTVendorProcessRates.Rows(k)("MinimumCharges"))
                    '        Exit For
                    '        'End If
                    '    End If
                    'Next
                    'For k = 0 To GblDTOprSlabs.Rows.Count - 1
                    '    If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("ProcessID")), 0, Gbl_DT_Operation.Rows(i)("ProcessID")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ProcessID")), 0, GblDTOprSlabs.Rows(k)("ProcessID")) Then
                    '        If IIf(IsDBNull(GblDTOprSlabs.Rows(k)("FromQty")), 0, GblDTOprSlabs.Rows(k)("FromQty")) >= 1 And IIf(IsDBNull(GblDTOprFactors.Rows(j)("ProcessID")), 0, GblDTOprFactors.Rows(j)("ProcessID")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ProcessID")), 0, GblDTOprSlabs.Rows(k)("ProcessID")) Then
                    '            If (QTY >= IIf(IsDBNull(GblDTOprSlabs.Rows(k)("FromQty")), 0, GblDTOprSlabs.Rows(k)("FromQty")) And QTY <= IIf(IsDBNull(GblDTOprSlabs.Rows(k)("ToQty")), 0, GblDTOprSlabs.Rows(k)("ToQty")) And IIf(IsDBNull(GblDTOprFactors.Rows(j)("RateFactor")), "", GblDTOprFactors.Rows(j)("RateFactor")) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("RateFactor")), "", GblDTOprSlabs.Rows(k)("RateFactor"))) Then
                    '                Gbl_DT_Operation.Rows(i)(1) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("Rate")), 0, GblDTOprSlabs.Rows(k)("Rate"))
                    '                Gbl_DT_Operation.Rows(i)(2) = IIf(IsDBNull(GblDTOprSlabs.Rows(k)("MinimumCharges")), 0, GblDTOprSlabs.Rows(k)("MinimumCharges"))
                    '                Exit For
                    '            End If
                    '        End If
                    '    End If
                    'Next
                    'If ST_Op_Amt = "" Then
                    '    ST_Op_Amt = Amt
                    'Else
                    '    ST_Op_Amt = ST_Op_Amt & "," & Amt
                    'End If
                    Dim Amt = Calculate_Operations(IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(0)), "", Gbl_DT_Operation.Rows(i)(0)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(1)), 0, Gbl_DT_Operation.Rows(i)(1)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(2)), 0, Gbl_DT_Operation.Rows(i)(2)), Final_Quantity, IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(3)), 0, Gbl_DT_Operation.Rows(i)(3)), Total_Paper_In_KG, Total_Ups, No_Of_Sets, IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(7)), 0, Gbl_DT_Operation.Rows(i)(7)), IIf(IsDBNull(Gbl_DT_Operation.Rows(i)(8)), 0, Gbl_DT_Operation.Rows(i)(8)), Total_Colors, Pub_Sheets, Gbl_Job_L, Gbl_Job_H, Gbl_Job_W, Plate_Qty, Gbl_Order_Quantity)
                    Gbl_DT_Operation.Rows(i)(11) = Amt
                    Gbl_DT_Operation.Rows(i)(12) = Gbl_DT_plan.Rows.Count + 1
                    Gbl_DT_Operation.Rows(i)(15) = QTY
                    Gbl_DT_Operation.Rows(i)(16) = Total_Ups
                    Gbl_DT_Operation.Rows(i)(17) = 1
                    Gbl_DT_Operation.Rows(i)(19) = IIf(IsDBNull(GblDTOprFactors.Rows(j)("RateFactor")), "", GblDTOprFactors.Rows(j)("RateFactor"))
                    Gbl_DT_Operation.Rows(i)("NoOfColors") = Total_Colors

                    If IIf(IsDBNull(Gbl_DT_Operation.Rows(i)("ProcessID")), 0, Gbl_DT_Operation.Rows(i)("ProcessID")) = IIf(IsDBNull(GblDTOprFactors.Rows(j)("ProcessID")), 0, GblDTOprFactors.Rows(j)("ProcessID")) Then
                        DTOPR.ImportRow(Gbl_DT_Operation.Rows(i))
                        Op_Amt = Op_Amt + Amt
                    End If
                Next
            Next

            Dim Coating_Amount As Double = 0
            Coating_Amount = Calculate_Coating_Charges(Actual_Sheets, Coating_Charges, Coating_Charges_Type, RoundUp(Gbl_Sheet_L / 25.4, 2), RoundUp(Gbl_Sheet_W / 25.4, 2), BasicCoatingCharges, Impression_To_Be_Charged)

            ''''/// for Special Front and back color
            Special_Color_Front_Amount = Calculate_Special_Color_Charges(Gbl_Special_Front_Color, Special_Color_Front_Charges, Impression_To_Be_Charged, Printing_Charges_Type, Roundof_Impressions_With, No_Of_Sets)
            Special_Color_Back_Amount = Calculate_Special_Color_Charges(Gbl_Special_Back_Color, Special_Color_Back_Charges, Impression_To_Be_Charged, Printing_Charges_Type, Roundof_Impressions_With, No_Of_Sets)

            '            Rf_Dt_Opr.Merge(Gbl_DT_Operation)
            Rf_Dt_Opr.Merge(DTOPR)

            With Gbl_DT_plan

                Dim Paper_Size, Cut_size, Die_Cut_size As String
                Dim Total_Amount, F_Total_Amount As Double
                Paper_Size = Gbl_Paper_H & "x" & Gbl_Paper_L
                Cut_size = Math.Round(Gbl_Sheet_W, 2) & "x" & Math.Round(Gbl_Sheet_L, 2)
                Die_Cut_size = Gbl_Die_Size_H & "x" & Gbl_Die_Size_L
                Total_Amount = Math.Round(Plate_Amount + Paper_Amount + Printing_Amount + Make_Ready_Amount + Coating_Amount, 2)
                If Gbl_Half_Ups_Logic = True Then
                    Gbl_UPS_L = Gbl_UPS_L / 2
                End If
                F_Total_Amount = Total_Amount + Op_Amt

                If Gbl_Printing_Style = "Front & Back" Or Gbl_Printing_Style = "FB-Perfection" Then
                    Printing_Impressions *= 2
                    Impression_To_Be_Charged *= 2
                End If

                If Machine_Colors < Gbl_Front_Color Then
                    Printing_Impressions = Printing_Impressions * RoundUp(Gbl_Front_Color / Machine_Colors, 0)
                    Impression_To_Be_Charged = Impression_To_Be_Charged * RoundUp(Gbl_Front_Color / Machine_Colors, 0)
                    'tmpImpression_To_Be_Charged = Impression_To_Be_Charged / RoundUp(Total_Colors_Main / Machine_Colors, 0)
                End If

                .NewRow()
                .Rows.Add(Gbl_Machine_ID, Gbl_Machine_Name, Gbl_Machine_Gripper, Gbl_GripperSide, Machine_Colors, Gbl_Paper_ID, Paper_Size, Cut_size, Cut_L, Cut_H, Gbl_UPS_L, Gbl_UPS_H, Total_Ups, Bal_Piece, Bal_Side, Waste, Waste_In_Percent, Wastage_Paper_In_KG, Gbl_Grain_Direction, Plate_Qty, Plate_Rate, Plate_Amount, Make_Ready_Sheets_Total, Actual_Sheets, Wastage_Sheets, Total_Paper_In_KG, Full_Sheets, Gbl_Paper_Rate, Paper_Amount, (Printing_Impressions * Make_Readies), Impression_To_Be_Charged, Printing_Charges, Printing_Amount, Make_Readies, Make_Ready_Rate, Make_Ready_Amount, Final_Quantity, Total_Colors, Total_Amount, Cut_L_H, Cut_H_L, Gbl_Printing_Style, Printing_Charges_Type, Expected_Execution_Time, Total_Completion_Time, Gbl_Paper_Detail, Gbl_Plan_Type, Gbl_Paper_Rate_Type, Die_Cut_size, Gbl_InterLock_Style, No_Of_Sets, Math.Round(F_Total_Amount, 3), Gbl_Packing, Gbl_Unit_Per_Packing, Roundof_Impressions_With, Special_Color_Front_Charges, Special_Color_Back_Charges, Special_Color_Front_Amount, Special_Color_Back_Amount, Op_Amt, .Rows.Count + 1, Coating_Charges, Coating_Amount, GblMainPaperGroup, GblVendorID, GblVendorName)

            End With

        Catch ex As Exception
            planErrors = planErrors & ex.Message
        End Try
    End Sub

    Public Function Calculate_Special_Color_Charges(ByVal Special_Colors As Integer, ByVal Special_Color_Charges As Double, ByVal Impression_To_Be_Charged As String, ByVal Printing_Charges_Type As String, ByVal Roundof_Impressions_With As Long, ByVal No_Of_Sets As Long) As Double
        Dim Amount As Double
        If Printing_Charges_Type = "Impressions" Then
            Amount = Math.Round((Impression_To_Be_Charged * Special_Color_Charges), 2) * No_Of_Sets
            'Amount = Math.Round((Impression_To_Be_Charged * Special_Color_Charges * Special_Colors), 2) '* No_Of_Sets
        ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With Then
            Amount = Math.Round((Impression_To_Be_Charged * (Special_Color_Charges / Roundof_Impressions_With) * Special_Colors), 2) '* No_Of_Sets
        ElseIf Printing_Charges_Type = "Impressions/Color" Then
            Amount = Math.Round((Impression_To_Be_Charged * Special_Color_Charges * Special_Colors), 2) '* No_Of_Sets
        ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With & "/Color" Then
            Amount = Math.Round((Impression_To_Be_Charged * (Special_Color_Charges / Roundof_Impressions_With) * Special_Colors), 2) '* No_Of_Sets
        End If
        Calculate_Special_Color_Charges = Amount
    End Function

    <WebMethod(EnableSession:=True)>
    Private Function Search_In_Machine_Slabs(ByVal Machine_ID As Long, ByVal Printing_Impressions As Long, ByRef Wastage_Percent_Sheets As Double, ByRef Printing_Charges As Double, ByRef Plate_Rate As Double, ByRef Coating_Charges As Double, ByRef Special_Color_Front_Charges As Double, ByRef Special_Color_Back_Charges As Double, ByRef Printing_Charges_Type As String, ByRef Roundof_Impressions_With As Long, ByRef Basic_Printing_Charges As Double) As Boolean
        Dim i As Long
        Try

            'Dim dataViewSlabs As DataView = DT_Printing_Slabs.DefaultView
            'dataViewSlabs.RowFilter = "MachineID = " & Machine_ID & ""
            'Dim slabTable As New DataTable= DT_Printing_Slabs.Copy()
            'slabTable.Clear()
            'For i = 0 To dataViewSlabs.Count - 1
            '    slabTable.ImportRow(dataViewSlabs.Item(i).Row)
            'Next i

            With DT_Client_Printing_Slabs
                Dim row As DataRow = DT_Client_Printing_Slabs.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
                If Not row Is Nothing Then
                    For i = 0 To .Rows.Count - 1
                        If Machine_ID = Val(.Rows(i)(0)) And (Printing_Impressions >= Val(.Rows(i)(1)) And Printing_Impressions <= Val(.Rows(i)(2))) Then
                            Wastage_Percent_Sheets = Val(.Rows(i)(3))
                            Printing_Charges = Val(.Rows(i)(4))

                            If Gbl_Plate_Type = "CTP Plate" Then
                                Plate_Rate = Val(.Rows(i)(5))
                            ElseIf Gbl_Plate_Type = "PS Plate" Or Gbl_Plate_Type = "PS Plate+Film" Then
                                Plate_Rate = Val(.Rows(i)(6))
                            ElseIf Gbl_Plate_Type = "CTCP Plate" Or Gbl_Plate_Type = "CTcP Plate" Then
                                Plate_Rate = Val(.Rows(i)(7))
                            Else
                                Plate_Rate = 0
                            End If

                            Printing_Charges_Type = IIf(IsDBNull(row.Item(12)), 0, row.Item(12))
                            Roundof_Impressions_With = IIf(IsDBNull(row.Item(13)), 0, row.Item(13))
                            Basic_Printing_Charges = IIf(IsDBNull(row.Item(14)), 0, row.Item(14))
                            Search_In_Machine_Slabs = True
                            Exit Function
                        End If
                    Next
                End If
            End With

            With DT_Printing_Slabs
                Dim row1 As DataRow = DT_Printing_Slabs.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
                If Not row1 Is Nothing Then
                    For i = 0 To .Rows.Count - 1
                        If (UCase(Trim(GblMainPaperGroup)) = UCase(Trim(.Rows(i)(14))) Or "-" = Trim(.Rows(i)(14))) And Machine_ID = Val(.Rows(i)(0)) And (Printing_Impressions >= Val(.Rows(i)(1)) And Printing_Impressions <= Val(.Rows(i)(2))) Then
                            Wastage_Percent_Sheets = Val(.Rows(i)(3))
                            Printing_Charges = Val(.Rows(i)(4))

                            If Gbl_Plate_Type = "CTP Plate" Then
                                Plate_Rate = Val(.Rows(i)(5))
                            ElseIf Gbl_Plate_Type = "PS Plate" Or Gbl_Plate_Type = "PS Plate+Film" Then
                                Plate_Rate = Val(.Rows(i)(6))
                            ElseIf Gbl_Plate_Type = "CTCP Plate" Or Gbl_Plate_Type = "CTcP Plate" Then
                                Plate_Rate = Val(.Rows(i)(7))
                            Else
                                Plate_Rate = 0
                            End If
                            Coating_Charges = IIf(IsDBNull(.Rows(i)(8)), 0, .Rows(i)(8))
                            Special_Color_Front_Charges = IIf(IsDBNull(.Rows(i)(9)), 0, .Rows(i)(9))
                            Special_Color_Back_Charges = IIf(IsDBNull(.Rows(i)(10)), 0, .Rows(i)(10))
                            Basic_Printing_Charges = IIf(IsDBNull(.Rows(i)("MinCharges")), 0, .Rows(i)("MinCharges"))
                            Search_In_Machine_Slabs = True
                            Exit Function
                        End If
                    Next
                End If
                If .Rows.Count > 0 Then
                    Wastage_Percent_Sheets = Val(.Rows(.Rows.Count - 1)(3))
                    Printing_Charges = Val(.Rows(.Rows.Count - 1)(4))

                    If Gbl_Plate_Type = "CTP Plate" Then
                        Plate_Rate = Val(.Rows(.Rows.Count - 1)(5))
                    ElseIf Gbl_Plate_Type = "PS Plate" Or Gbl_Plate_Type = "PS Plate+Film" Then
                        Plate_Rate = Val(.Rows(.Rows.Count - 1)(6))
                    ElseIf Gbl_Plate_Type = "CTCP Plate" Or Gbl_Plate_Type = "CTcP Plate" Then
                        Plate_Rate = Val(.Rows(.Rows.Count - 1)(7))
                    Else
                        Plate_Rate = 0
                    End If
                Else
                    Wastage_Percent_Sheets = 0
                    Printing_Charges = 0
                    Plate_Rate = 0
                End If

            End With
            Search_In_Machine_Slabs = False

        Catch ex As Exception
            planErrors = ex.Message
            Search_In_Machine_Slabs = False
        End Try
    End Function

    Public Function RoundUP_25(Num As Double) As Double    'Round off number to Upper or lower side forcely '
        'any nimber .25 or more is considered 1, like num = 6.24 then 6.0 or num 6.25 then num = 7
        On Error Resume Next
        If InStr(Num, ".") <> 0 Then
            If Mid(Num, InStr(Num, "."), Len(Num)) >= 0.25 Then
                RoundUP_25 = Mid(Num, 1, InStr(Num, ".")) + 1
            Else
                RoundUP_25 = Mid(Num, 1, InStr(Num, "."))
            End If
        Else
            RoundUP_25 = Num
        End If
    End Function

    Public Function RoundDown(Num As Double) As Double    'Round off number to Lower side forcely '
        'like num = 6.7 or num 6.3 then num = 6
        On Error Resume Next
        Num = Math.Round(Num, 5) 'Param 28-Apr-2014
        If InStr(Num, ".") <> 0 Then
            RoundDown = Mid(Num, 1, InStr(Num, "."))
        Else
            RoundDown = Num
        End If
    End Function

    Private Function RoundUp(value As Double, decimals As Integer) As Double
        Return Math.Ceiling(value * (10 ^ decimals)) / (10 ^ decimals)
    End Function

    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Private Function Search_In_Machine(ByVal Machine_ID As Long, ByRef Minimum_Sheets As Long, ByRef Make_Ready_Sheet As Long, ByRef Make_Ready_Rate As Double, ByRef Machine_Colors As Long, ByRef Printing_Charges_Type As String, ByRef Roundof_Impressions_With As Long, ByRef Basic_Printing_Charges As Double, ByRef Machine_Speed As Long, ByRef Make_Ready_Time As Long, ByRef Job_Change_Over_Time As Long, ByRef Wastage_Type As String, ByRef Wastage_Calculation_On As String, ByVal DT_Machine As DataTable, ByRef Is_Perfecta_Machine As Boolean, ByRef IsSpecialMachine As Boolean) As Boolean

        Dim row As DataRow = DT_Machine.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
        If Not row Is Nothing Then
            Minimum_Sheets = IIf(IsDBNull(row.Item(2)), 0, row.Item(2))
            Machine_Colors = IIf(IsDBNull(row.Item(3)), 0, row.Item(3))
            Make_Ready_Rate = IIf(IsDBNull(row.Item(4)), 0, Val(row.Item(4)))
            Make_Ready_Sheet = IIf(IsDBNull(row.Item(5)), 0, Val(row.Item(5)))
            Make_Ready_Time = IIf(IsDBNull(row.Item(7)), 0, Val(row.Item(7)))
            Machine_Speed = IIf(IsDBNull(row.Item(10)), 0, Val(row.Item(10)))
            Printing_Charges_Type = IIf(IsDBNull(row.Item(12)), "", row.Item(12))
            Roundof_Impressions_With = IIf(IsDBNull(row.Item(13)), 0, row.Item(13))
            Is_Perfecta_Machine = IIf(IsDBNull(row.Item(14)), False, row.Item(14))
            Basic_Printing_Charges = IIf(IsDBNull(row.Item(15)), 0, row.Item(15))
            Job_Change_Over_Time = IIf(IsDBNull(row.Item(16)), 0, row.Item(16))
            Wastage_Type = IIf(IsDBNull(row.Item(18)), 0, row.Item(18))
            Wastage_Calculation_On = IIf(IsDBNull(row.Item(19)), 0, row.Item(19))
            IsSpecialMachine = IIf(IsDBNull(row.Item("IsSpecialMachine")), False, row.Item("IsSpecialMachine"))
            Search_In_Machine = True
            Exit Function
        End If
        Search_In_Machine = False

    End Function

    Public Function Search_In_Machine_Online_Coating(ByVal Machine_ID As Long, ByVal DTCoatingMachine As DataTable, ByRef Coating_Rate As Double, ByRef Coating_Charges_Type As String, ByVal Actual_Sheets As Double, ByRef BasicCoatingCharges As Double) As Boolean
        Try
            Dim row As DataRow = DTCoatingMachine.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
            If Not row Is Nothing Then
                For i = 0 To DTCoatingMachine.Rows.Count - 1
                    If IIf(IsDBNull(DTCoatingMachine.Rows(i)(0)), 0, DTCoatingMachine.Rows(i)(0)) = Machine_ID Then
                        If GblOnlineCoating = IIf(IsDBNull(DTCoatingMachine.Rows(i)(3)), 0, DTCoatingMachine.Rows(i)(3)) And IIf(IsDBNull(DTCoatingMachine.Rows(i)(1)), 0, DTCoatingMachine.Rows(i)(1)) <= Actual_Sheets And IIf(IsDBNull(DTCoatingMachine.Rows(i)(2)), 0, DTCoatingMachine.Rows(i)(2)) >= Actual_Sheets Then
                            Coating_Rate = IIf(IsDBNull(DTCoatingMachine.Rows(i)(4)), 0, DTCoatingMachine.Rows(i)(4))
                            Coating_Charges_Type = IIf(IsDBNull(DTCoatingMachine.Rows(i)(5)), "Rate/100 Sq.Inch/Sheet", DTCoatingMachine.Rows(i)(5))
                            BasicCoatingCharges = IIf(IsDBNull(DTCoatingMachine.Rows(i)(6)), 0, DTCoatingMachine.Rows(i)(6))

                            Search_In_Machine_Online_Coating = True
                            Exit Function
                        End If
                    End If
                Next
            End If
            Search_In_Machine_Online_Coating = False
        Catch ex As Exception
            Search_In_Machine_Online_Coating = False
        End Try
    End Function

    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Sub Seperate_Paper_Size(ByVal Paper_Size As String, ByRef Paper_L As Double, ByRef Paper_H As Double)
        On Error Resume Next
        Dim x_Position As Long
        x_Position = InStr(1, Paper_Size, "x", vbTextCompare)
        Paper_H = Val(Mid(Paper_Size, 1, x_Position - 1))
        Paper_L = Val(Mid(Paper_Size, x_Position + 1, Len(Paper_Size)))
    End Sub

    ''''''Calculate Printng Amount
    '<WebMethod>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Calculate_Printing_Charges(ByVal Impression_To_Be_Charged As Long, ByVal Minimum_Sheets As Long, ByRef Printing_Charges As Double, ByVal Printing_Charges_Type As String, ByVal Basic_Printing_Charges As Double, ByVal Roundof_Impressions_With As Long, ByVal No_Of_sets As Long, ByVal Front_Color As Long, ByVal Back_Color As Long, ByVal Printing_Style As String, ByVal Is_Perfecta_Machine As Boolean, ByVal Machine_ID As Integer) As Double
        Dim Printing_Amount As Double = 0
        Dim Total_Colors_Main As Long = 0
        Try

            If Printing_Style = "Single Side" Or Printing_Style = "Work & Turn" Or Printing_Style = "Work & Tumble" Then
                If Front_Color >= Back_Color Then
                    Total_Colors_Main = Front_Color
                Else
                    Total_Colors_Main = Back_Color
                End If
            ElseIf Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                Total_Colors_Main = Front_Color + Back_Color
                If Is_Perfecta_Machine = False Then
                    'Impression_To_Be_Charged = Impression_To_Be_Charged / 2
                    'planErrors = planErrors & "Impression to be charged is half in case of machine is not perfecta"
                End If
            End If

            If Printing_Charges_Type = "Impressions" Then
                If Basic_Printing_Charges <> 0 Then
                    Printing_Amount = Math.Round(((Impression_To_Be_Charged - Minimum_Sheets) * Printing_Charges) + Basic_Printing_Charges, 2) * No_Of_sets
                Else
                    Printing_Amount = Math.Round((Impression_To_Be_Charged * Printing_Charges) + Basic_Printing_Charges, 2) * No_Of_sets
                End If
            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With Then
                If Basic_Printing_Charges <> 0 Then
                    Printing_Amount = Math.Round(((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With)) + Basic_Printing_Charges, 2) * No_Of_sets
                Else
                    Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With)) + Basic_Printing_Charges, 2) * No_Of_sets
                End If
            ElseIf Printing_Charges_Type = "Impressions/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round(((Printing_Charges * Front_Color) + Basic_Printing_Charges), 2) + Math.Round(((Printing_Charges * Back_Color) + Basic_Printing_Charges), 2)
                    Else
                        Printing_Amount = Math.Round(Printing_Charges * Front_Color, 2) + Math.Round(Printing_Charges * Back_Color, 2)
                    End If
                Else
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round(((Printing_Charges * Total_Colors_Main) + Basic_Printing_Charges), 2) * No_Of_sets
                    Else
                        Printing_Amount = Math.Round(Printing_Charges * Total_Colors_Main, 2) * No_Of_sets
                    End If
                End If
            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With & "/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Front_Color) + Basic_Printing_Charges), 2) + Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Back_Color) + Basic_Printing_Charges), 2)
                    Else
                        Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Front_Color), 2) + Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Back_Color), 2)
                    End If
                Else
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Total_Colors_Main) + Basic_Printing_Charges), 2) * No_Of_sets
                    Else
                        Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Total_Colors_Main), 2) * No_Of_sets
                    End If
                End If
            End If
            Calculate_Printing_Charges = Printing_Amount

            If DT_Printing_Slabs.Rows.Count > 0 Then
                Dim row1 As DataRow = DT_Printing_Slabs.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
                Dim row2 As DataRow = DT_Printing_Slabs.Select("PaperGroup = '" & GblMainPaperGroup & "' Or PaperGroup = '-' ").FirstOrDefault()
                If Not row1 Is Nothing And Not row2 Is Nothing Then
                    If IIf(IsDBNull(row1("SheetRangeTo")), 0, row1("SheetRangeTo")) > 0 Then
                        Printing_Amount = FnCalGroupWiseRates_(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, No_Of_sets, Front_Color, Back_Color, Printing_Style, Machine_ID)
                        If Printing_Amount > 0 Then
                            Calculate_Printing_Charges = Printing_Amount
                            Printing_Charges = SlabPrintingChargeN
                        End If
                    End If
                End If
            End If

            If DT_Vendor_Printing_Slabs.Rows.Count > 0 Then
                Dim row1 As DataRow = DT_Vendor_Printing_Slabs.Select("LedgerID = " & GblVendorID & "").FirstOrDefault()
                If Not row1 Is Nothing Then
                    If IIf(IsDBNull(row1("SheetRangeTo")), 0, row1("SheetRangeTo")) > 0 Then
                        Printing_Amount = FnCalVendorWiseRates_(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, No_Of_sets, Front_Color, Back_Color, Printing_Style, Machine_ID)
                        If Printing_Amount > 0 Then
                            Calculate_Printing_Charges = Printing_Amount
                            Printing_Charges = SlabPrintingChargeN
                        End If
                    End If
                End If
            End If

        Catch ex As Exception
            Calculate_Printing_Charges = Printing_Amount
        End Try
    End Function

    Public Function Calculate_Book_Printing_Charges(ByVal Impression_To_Be_Charged As Long, ByVal Minimum_Sheets As Long, ByRef Printing_Charges As Double, ByVal Printing_Charges_Type As String, ByVal Basic_Printing_Charges As Double, ByVal Roundof_Impressions_With As Long, ByVal No_Of_sets As Long, ByVal Front_Color As Long, ByVal Back_Color As Long, ByVal Printing_Style As String, ByVal Is_Perfecta_Machine As Boolean, ByVal Machine_ID As Integer) As Double
        Dim Printing_Amount As Double = 0
        Dim Total_Colors_Main As Long = 0
        Try

            If Printing_Style = "Single Side" Or Printing_Style = "Work & Turn" Or Printing_Style = "Work & Tumble" Then
                If Front_Color >= Back_Color Then
                    Total_Colors_Main = Front_Color
                Else
                    Total_Colors_Main = Back_Color
                End If
            ElseIf Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                Total_Colors_Main = Front_Color + Back_Color
                If Is_Perfecta_Machine = False Then
                    ' Impression_To_Be_Charged = Impression_To_Be_Charged / 2
                    'planErrors = planErrors & "Impression to be charged is half in case of machine is not perfecta"
                End If
            End If

            If Printing_Charges_Type = "Impressions" Then
                If Basic_Printing_Charges <> 0 Then
                    Printing_Amount = Math.Round(((Impression_To_Be_Charged - Minimum_Sheets) * Printing_Charges) + Basic_Printing_Charges, 2) * No_Of_sets
                Else
                    Printing_Amount = Math.Round((Impression_To_Be_Charged * Printing_Charges) + Basic_Printing_Charges, 2) * No_Of_sets
                End If
            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With Then
                If Basic_Printing_Charges <> 0 Then
                    Printing_Amount = Math.Round(((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With)) + Basic_Printing_Charges, 2) * No_Of_sets
                Else
                    Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With)) + Basic_Printing_Charges, 2) * No_Of_sets
                End If
            ElseIf Printing_Charges_Type = "Impressions/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round(((Printing_Charges * Front_Color) + Basic_Printing_Charges), 2) + Math.Round(((Printing_Charges * Back_Color) + Basic_Printing_Charges), 2)
                    Else
                        Printing_Amount = Math.Round(Printing_Charges * Front_Color, 2) + Math.Round(Printing_Charges * Back_Color, 2)
                    End If
                Else
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round(((Printing_Charges * Total_Colors_Main) + Basic_Printing_Charges), 2) * No_Of_sets
                    Else
                        Printing_Amount = Math.Round(Printing_Charges * Total_Colors_Main, 2) * No_Of_sets
                    End If
                End If
            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With & "/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Back_Color = 0 Then
                        If Basic_Printing_Charges <> 0 Then
                            Printing_Amount = Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Front_Color) + Basic_Printing_Charges) * (No_Of_sets), 2) + Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Back_Color) + Basic_Printing_Charges) * (No_Of_sets), 2)
                        Else
                            Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Front_Color) * (No_Of_sets), 2) + Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Back_Color) * (No_Of_sets), 2)
                        End If
                    Else
                        If Basic_Printing_Charges <> 0 Then
                            Printing_Amount = Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Front_Color) + Basic_Printing_Charges) * (No_Of_sets / 2), 2) + Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Back_Color) + Basic_Printing_Charges) * (No_Of_sets / 2), 2)
                        Else
                            Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Front_Color) * (No_Of_sets / 2), 2) + Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Back_Color) * (No_Of_sets / 2), 2)
                        End If
                    End If
                Else
                    If Basic_Printing_Charges <> 0 Then
                        Printing_Amount = Math.Round((((Impression_To_Be_Charged - Minimum_Sheets) * (Printing_Charges / Roundof_Impressions_With) * Total_Colors_Main) + Basic_Printing_Charges), 2) * No_Of_sets
                    Else
                        Printing_Amount = Math.Round((Impression_To_Be_Charged * (Printing_Charges / Roundof_Impressions_With) * Total_Colors_Main), 2) * No_Of_sets
                    End If
                End If
            End If
            Calculate_Book_Printing_Charges = Printing_Amount

            If DT_Printing_Slabs.Rows.Count > 0 Then
                Dim row1 As DataRow = DT_Printing_Slabs.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
                Dim row2 As DataRow = DT_Printing_Slabs.Select("PaperGroup = '" & GblMainPaperGroup & "' Or PaperGroup = '-' ").FirstOrDefault()
                If Not row1 Is Nothing And Not row2 Is Nothing Then
                    If IIf(IsDBNull(row1("SheetRangeTo")), 0, row1("SheetRangeTo")) > 0 Then
                        Printing_Amount = FnCalGroupWiseRates_(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, No_Of_sets, Front_Color, Back_Color, Printing_Style, Machine_ID)
                        If Printing_Amount > 0 Then
                            Calculate_Book_Printing_Charges = Printing_Amount
                            Printing_Charges = SlabPrintingChargeN
                        End If
                    End If
                End If
            End If

            If DT_Vendor_Printing_Slabs.Rows.Count > 0 Then
                Dim row1 As DataRow = DT_Vendor_Printing_Slabs.Select("LedgerID = " & GblVendorID & "").FirstOrDefault()
                If row1 IsNot Nothing Then
                    If IIf(IsDBNull(row1("SheetRangeTo")), 0, row1("SheetRangeTo")) > 0 Then
                        Printing_Amount = FnCalVendorWiseRates_(Impression_To_Be_Charged, Minimum_Sheets, Printing_Charges, Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, No_Of_sets, Front_Color, Back_Color, Printing_Style, Machine_ID)
                        If Printing_Amount > 0 Then
                            Calculate_Book_Printing_Charges = Printing_Amount
                            Printing_Charges = SlabPrintingChargeN
                        End If
                    End If
                End If
            End If

        Catch ex As Exception
            Calculate_Book_Printing_Charges = Printing_Amount
        End Try
    End Function

    Private Function FnCalGroupWiseRates_(ByVal Impression_To_Be_Charged As Long, ByVal Minimum_Sheets As Long, ByVal Printing_Charges As Double, ByVal Printing_Charges_Type As String, ByVal Basic_Printing_Charges As Double, ByVal Roundof_Impressions_With As Long, ByVal No_Of_Sets As Long, ByVal Front_Color As Long, ByVal Back_Color As Long, ByVal Printing_Style As String, ByVal Machine_ID As Integer) As Double
        Try

            Dim Min_Charges As Long = 0
            Dim Printing_Amount_N As Long = 0
            SlabPrintingChargeN = 0
            Dim Slab_Max_N As Long = 0
            'Dim Act_Imp_To_Charge_N As Long

            Dim Total_Colors_Main As Long = 0
            If Printing_Style = "Single Side" Or Printing_Style = "Work & Turn" Or Printing_Style = "Work & Tumble" Then
                If Front_Color >= Back_Color Then
                    Total_Colors_Main = Front_Color
                Else
                    Total_Colors_Main = Back_Color
                End If
            ElseIf Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                Total_Colors_Main = Front_Color + Back_Color
            End If

            Dim dataViewItems As DataView = DT_Printing_Slabs.DefaultView
            Dim DTSlabs As New DataTable
            dataViewItems.RowFilter = "MachineID = " & Machine_ID & ""
            dataViewItems.RowFilter = "PaperGroup = '" & GblMainPaperGroup & "' Or PaperGroup = '-' "

            DTSlabs = DT_Printing_Slabs.Copy()
            DTSlabs.Clear()

            For I = 0 To dataViewItems.Count - 1
                DTSlabs.ImportRow(dataViewItems.Item(I).Row)
            Next I

            With DTSlabs
                Dim row1 As DataRow = DTSlabs.Select("MachineID = " & Machine_ID & "").FirstOrDefault()
                If Not row1 Is Nothing Then
                    For i = 0 To .Rows.Count - 1
                        If Machine_ID = Val(.Rows(i)(0)) Then
                            If IIf(IsDBNull(.Rows(i)("SheetRangeFrom")), 0, .Rows(i)("SheetRangeFrom")) = 1 And (IIf(IsDBNull(.Rows(i)("PaperGroup")), "", .Rows(i)("PaperGroup")) = GblMainPaperGroup Or IIf(IsDBNull(.Rows(i)("PaperGroup")), "", .Rows(i)("PaperGroup")) = "-") And GblMainPaperGroup <> "" Then
                                If (Gbl_Sheet_L <= IIf(IsDBNull(.Rows(i)("MaxPlanL")), 0, .Rows(i)("MaxPlanL")) And Gbl_Sheet_W <= IIf(IsDBNull(.Rows(i)("MaxPlanW")), 0, .Rows(i)("MaxPlanW"))) Or (Gbl_Sheet_L <= IIf(IsDBNull(.Rows(i)("MaxPlanW")), 0, .Rows(i)("MaxPlanW")) And Gbl_Sheet_W <= IIf(IsDBNull(.Rows(i)("MaxPlanL")), 0, .Rows(i)("MaxPlanL"))) Then
                                    Min_Charges = IIf(IsDBNull(.Rows(i)("MinCharges")), 0, .Rows(i)("MinCharges"))
                                    Slab_Max_N = IIf(IsDBNull(.Rows(i)("SheetRangeTo")), 0, .Rows(i)("SheetRangeTo"))
                                    Exit For
                                End If
                            End If
                        End If
                    Next

                    For i = 0 To .Rows.Count - 1
                        If Machine_ID = Val(.Rows(i)(0)) Then
                            If IIf(IsDBNull(.Rows(i)("SheetRangeFrom")), 0, .Rows(i)("SheetRangeFrom")) <= Impression_To_Be_Charged And IIf(IsDBNull(.Rows(i)("SheetRangeTo")), 0, .Rows(i)("SheetRangeTo")) >= Impression_To_Be_Charged And (IIf(IsDBNull(.Rows(i)("PaperGroup")), "", .Rows(i)("PaperGroup")) = GblMainPaperGroup Or IIf(IsDBNull(.Rows(i)("PaperGroup")), "", .Rows(i)("PaperGroup")) = "-") And GblMainPaperGroup <> "" Then
                                If (Gbl_Sheet_L <= IIf(IsDBNull(.Rows(i)("MaxPlanL")), 0, .Rows(i)("MaxPlanL")) And Gbl_Sheet_W <= IIf(IsDBNull(.Rows(i)("MaxPlanW")), 0, .Rows(i)("MaxPlanW"))) Or (Gbl_Sheet_L <= IIf(IsDBNull(.Rows(i)("MaxPlanW")), 0, .Rows(i)("MaxPlanW")) And Gbl_Sheet_W <= IIf(IsDBNull(.Rows(i)("MaxPlanL")), 0, .Rows(i)("MaxPlanL"))) Then
                                    SlabPrintingChargeN = IIf(IsDBNull(.Rows(i)("Rate")), 0, .Rows(i)("Rate"))
                                    If IIf(IsDBNull(.Rows(i)("MinCharges")), 0, .Rows(i)("MinCharges")) > 0 Then
                                        Min_Charges = IIf(IsDBNull(.Rows(i)("MinCharges")), 0, .Rows(i)("MinCharges"))
                                        Slab_Max_N = IIf(IsDBNull(.Rows(i)("SheetRangeTo")), 0, .Rows(i)("SheetRangeTo"))
                                    End If
                                    Exit For
                                End If
                            End If
                        End If
                    Next
                Else
                    Min_Charges = 0
                End If
            End With

            If Printing_Charges_Type = "Impressions" Then
                If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round((Impression_To_Be_Charged * SlabPrintingChargeN), 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Math.Round((Slab_Max_N * SlabPrintingChargeN), 2) * No_Of_Sets
                    End If
                Else
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round(((Impression_To_Be_Charged - Slab_Max_N) * SlabPrintingChargeN) + Min_Charges, 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Min_Charges
                    End If
                End If
            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With Then
                If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With)), 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Math.Round((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With)), 2) * No_Of_Sets
                    End If
                Else
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round(((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With)) + Min_Charges, 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Min_Charges
                    End If
                End If
            ElseIf Printing_Charges_Type = "Impressions/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Front_Color)), 2) + Math.Round(((SlabPrintingChargeN * Back_Color)), 2)
                        Else
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Front_Color)), 2) + Math.Round(((SlabPrintingChargeN * Back_Color)), 2)
                        End If
                    Else
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Front_Color)) + Min_Charges, 2) + Math.Round(((SlabPrintingChargeN * Back_Color)) + Min_Charges, 2)
                        Else
                            Printing_Amount_N = Min_Charges
                        End If
                    End If
                Else
                    If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Total_Colors_Main)), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Math.Round(((Slab_Max_N * Total_Colors_Main)), 2) * No_Of_Sets
                        End If
                    Else
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Total_Colors_Main) + Min_Charges), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Min_Charges
                        End If
                    End If
                End If

            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With & "/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Back_Color = 0 Then
                        If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets), 2) + Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets), 2)
                            Else
                                Printing_Amount_N = Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets), 2) + Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets), 2)
                            End If
                        Else
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color) + Min_Charges) * (No_Of_Sets), 2) + Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color) + Min_Charges) * (No_Of_Sets), 2)
                            Else
                                Printing_Amount_N = Min_Charges * No_Of_Sets
                            End If
                        End If
                    Else
                        If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets / 2), 2) + Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets / 2), 2)
                            Else
                                Printing_Amount_N = Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets / 2), 2) + Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets / 2), 2)
                            End If
                        Else
                            'If Gbl_UPS_L * Gbl_UPS_H = 4 Then
                            '    Gbl_UPS_L = Gbl_UPS_L '''''only for debug cases
                            'End If
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color) + Min_Charges) * (No_Of_Sets / 2), 2) + Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color) + Min_Charges) * (No_Of_Sets / 2), 2)
                            Else
                                Printing_Amount_N = Min_Charges * No_Of_Sets
                            End If
                        End If
                    End If
                Else
                    If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Total_Colors_Main)), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Total_Colors_Main)), 2) * No_Of_Sets
                        End If
                    Else
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Total_Colors_Main) + Min_Charges), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Min_Charges
                        End If
                    End If
                End If

            End If

            FnCalGroupWiseRates_ = Printing_Amount_N

        Catch ex As Exception
            planErrors = ex.Message
            FnCalGroupWiseRates_ = 0
        End Try
    End Function

    Private Function FnCalVendorWiseRates_(ByVal Impression_To_Be_Charged As Long, ByVal Minimum_Sheets As Long, ByVal Printing_Charges As Double, ByVal Printing_Charges_Type As String, ByVal Basic_Printing_Charges As Double, ByVal Roundof_Impressions_With As Long, ByVal No_Of_Sets As Long, ByVal Front_Color As Long, ByVal Back_Color As Long, ByVal Printing_Style As String, ByVal Machine_ID As Integer) As Double
        Try

            Dim Min_Charges As Long = 0
            Dim Printing_Amount_N As Long = 0
            SlabPrintingChargeN = 0
            Dim Slab_Max_N As Long = 0
            'Dim Act_Imp_To_Charge_N As Long

            Dim Total_Colors_Main As Long = 0
            If Printing_Style = "Single Side" Or Printing_Style = "Work & Turn" Or Printing_Style = "Work & Tumble" Then
                If Front_Color >= Back_Color Then
                    Total_Colors_Main = Front_Color
                Else
                    Total_Colors_Main = Back_Color
                End If
            ElseIf Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                Total_Colors_Main = Front_Color + Back_Color
            End If

            Dim dataViewItems As DataView = DT_Vendor_Printing_Slabs.DefaultView
            Dim DTSlabs As New DataTable
            dataViewItems.RowFilter = "MachineID = " & Machine_ID
            dataViewItems.RowFilter = "LedgerID = " & GblVendorID

            DTSlabs = DT_Vendor_Printing_Slabs.Copy()
            DTSlabs.Clear()

            For I = 0 To dataViewItems.Count - 1
                DTSlabs.ImportRow(dataViewItems.Item(I).Row)
            Next I

            With DTSlabs
                Dim row1 As DataRow = DTSlabs.Select("MachineID = " & Machine_ID & " And LedgerID = " & GblVendorID).FirstOrDefault()
                If row1 IsNot Nothing Then
                    For i = 0 To .Rows.Count - 1
                        If Machine_ID = Val(.Rows(i)(0)) Then
                            If IIf(IsDBNull(.Rows(i)("SheetRangeFrom")), 0, .Rows(i)("SheetRangeFrom")) <= Impression_To_Be_Charged And IIf(IsDBNull(.Rows(i)("SheetRangeTo")), 0, .Rows(i)("SheetRangeTo")) >= Impression_To_Be_Charged And (IIf(IsDBNull(.Rows(i)("LedgerID")), 0, .Rows(i)("LedgerID")) = GblVendorID) Then
                                'If (Gbl_Sheet_L <= IIf(IsDBNull(.Rows(i)("MaxPlanL")), 0, .Rows(i)("MaxPlanL")) And Gbl_Sheet_W <= IIf(IsDBNull(.Rows(i)("MaxPlanW")), 0, .Rows(i)("MaxPlanW"))) Or (Gbl_Sheet_L <= IIf(IsDBNull(.Rows(i)("MaxPlanW")), 0, .Rows(i)("MaxPlanW")) And Gbl_Sheet_W <= IIf(IsDBNull(.Rows(i)("MaxPlanL")), 0, .Rows(i)("MaxPlanL"))) Then
                                SlabPrintingChargeN = IIf(IsDBNull(.Rows(i)("Rate")), 0, .Rows(i)("Rate"))
                                If IIf(IsDBNull(.Rows(i)("MinCharges")), 0, .Rows(i)("MinCharges")) > 0 Then
                                    Min_Charges = IIf(IsDBNull(.Rows(i)("MinCharges")), 0, .Rows(i)("MinCharges"))
                                    Slab_Max_N = IIf(IsDBNull(.Rows(i)("SheetRangeTo")), 0, .Rows(i)("SheetRangeTo"))
                                End If
                                Exit For
                                'End If
                            End If
                        End If
                    Next
                Else
                    Min_Charges = 0
                End If
            End With

            If Printing_Charges_Type = "Impressions" Then
                If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round((Impression_To_Be_Charged * SlabPrintingChargeN), 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Math.Round((Slab_Max_N * SlabPrintingChargeN), 2) * No_Of_Sets
                    End If
                Else
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round(((Impression_To_Be_Charged - Slab_Max_N) * SlabPrintingChargeN) + Min_Charges, 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Min_Charges
                    End If
                End If
            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With Then
                If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With)), 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Math.Round((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With)), 2) * No_Of_Sets
                    End If
                Else
                    If Impression_To_Be_Charged > Slab_Max_N Then
                        Printing_Amount_N = Math.Round(((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With)) + Min_Charges, 2) * No_Of_Sets
                    Else
                        Printing_Amount_N = Min_Charges
                    End If
                End If
            ElseIf Printing_Charges_Type = "Impressions/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Front_Color)), 2) + Math.Round(((SlabPrintingChargeN * Back_Color)), 2)
                        Else
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Front_Color)), 2) + Math.Round(((SlabPrintingChargeN * Back_Color)), 2)
                        End If
                    Else
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Front_Color)) + Min_Charges, 2) + Math.Round(((SlabPrintingChargeN * Back_Color)) + Min_Charges, 2)
                        Else
                            Printing_Amount_N = Min_Charges
                        End If
                    End If
                Else
                    If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Total_Colors_Main)), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Math.Round(((Slab_Max_N * Total_Colors_Main)), 2) * No_Of_Sets
                        End If
                    Else
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((SlabPrintingChargeN * Total_Colors_Main) + Min_Charges), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Min_Charges
                        End If
                    End If
                End If

            ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With & "/Color" Then
                If Printing_Style = "Front & Back" Or Printing_Style = "FB-Perfection" Then
                    If Back_Color = 0 Then
                        If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets), 2) + Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets), 2)
                            Else
                                Printing_Amount_N = Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets), 2) + Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets), 2)
                            End If
                        Else
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color) + Min_Charges) * (No_Of_Sets), 2) + Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color) + Min_Charges) * (No_Of_Sets), 2)
                            Else
                                Printing_Amount_N = Min_Charges * No_Of_Sets
                            End If
                        End If
                    Else
                        If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets / 2), 2) + Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets / 2), 2)
                            Else
                                Printing_Amount_N = Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color)) * (No_Of_Sets / 2), 2) + Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color)) * (No_Of_Sets / 2), 2)
                            End If
                        Else
                            'If Gbl_UPS_L * Gbl_UPS_H = 4 Then
                            '    Gbl_UPS_L = Gbl_UPS_L '''''only for debug cases
                            'End If
                            If Impression_To_Be_Charged > Slab_Max_N Then
                                Printing_Amount_N = Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Front_Color) + Min_Charges) * (No_Of_Sets / 2), 2) + Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Back_Color) + Min_Charges) * (No_Of_Sets / 2), 2)
                            Else
                                Printing_Amount_N = Min_Charges * No_Of_Sets
                            End If
                        End If
                    End If
                Else
                    If Min_Charges = 0 And SlabPrintingChargeN > 0 Then
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round(((Impression_To_Be_Charged * (SlabPrintingChargeN / Roundof_Impressions_With) * Total_Colors_Main)), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Math.Round(((Slab_Max_N * (SlabPrintingChargeN / Roundof_Impressions_With) * Total_Colors_Main)), 2) * No_Of_Sets
                        End If
                    Else
                        If Impression_To_Be_Charged > Slab_Max_N Then
                            Printing_Amount_N = Math.Round((((Impression_To_Be_Charged - Slab_Max_N) * (SlabPrintingChargeN / Roundof_Impressions_With) * Total_Colors_Main) + Min_Charges), 2) * No_Of_Sets
                        Else
                            Printing_Amount_N = Min_Charges
                        End If
                    End If
                End If

            End If

            FnCalVendorWiseRates_ = Printing_Amount_N

        Catch ex As Exception
            planErrors = ex.Message
            FnCalVendorWiseRates_ = 0
        End Try
    End Function

    '''''Plate Calculation
    <WebMethod(EnableSession:=True)>
    Function Plate_Calculation(ByRef DT As DataTable) As DataTable
        Dim i As Integer
        If DT.Rows.Count >= 1 Then
            For i = 0 To DT.Rows.Count - 1
                DT.Rows(i)(1) = Val(DT.Rows(i)(5)) 'Plate Qty
                DT.Rows(i)(3) = Math.Round(Val(DT.Rows(i)(2)) * Val(DT.Rows(i)(5)), 2) ''Plate Amount
            Next
        End If
        Return DT
    End Function

    ''''''Calculate Operation
    Function Calculate_Operations(TypeOfCharges As String, Rate As Double, Minimum_Charges As Double, Final_Quantity As Long, Setup_Charges As Double, ByVal Total_Paper_KG As Long, ByVal Total_Ups As Long, ByVal Sets As Long, ByVal Size_L As Double, ByVal Size_W As Double, ByVal Total_Colors As Long, ByVal Pub_Sheets As Double, Job_L As Double, Job_H As Double, Job_W As Double, Total_Plates As Long, Order_Quantity As Long) As Double
        'TypeOfCharges As String, Rate As Double, Minimum_Charges As Double, Final_Quantity As Long, Setup_Charges As Double, ByVal Total_Paper_KG As Long, ByVal Total_Ups As Long, ByVal Sets As Long, ByVal Size_L As Double, ByVal Size_W As Double, ByVal Total_Colors As Long, ByVal Pub_Sheets As Double, Job_L As Double, Job_H As Double, Job_W As Double, Total_Plates As Long
        '        CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        Dim Amount As Double
        Dim Pages As Long
        Dim Stitch As Integer
        Dim folds As Integer

        Stitch = 1
        If Gbl_Job_Leaves = 0 Then
            If Gbl_Job_Pages = 0 Then
                Pages = 1
            Else
                Pages = Gbl_Job_Pages
            End If
        Else
            Pages = Val(Gbl_Job_Leaves) * 2
        End If

        'Dim spine As Single
        'spine = Val(Paper_Caliper) * (Pages / 2)
        If Gbl_Order_Quantity = 0 Then
            Gbl_Order_Quantity = Order_Quantity
        End If
        If Total_Ups = 4 Then
            folds = 2
        ElseIf Total_Ups = 8 Then
            folds = 3
        ElseIf Total_Ups = 16 Then
            folds = 4
        ElseIf Total_Ups = 32 Then
            folds = 5
        End If

        Select Case TypeOfCharges
            Case "Rate/Kg"
                Amount = (Total_Paper_KG * Rate) + Setup_Charges
            Case "Rate/Color"
                Amount = (Total_Colors * Rate) + Setup_Charges
            Case "Rate/Sq.Inch/Color"
                Amount = (Total_Colors * Size_L * Size_W * Rate) + Setup_Charges
            Case "Rate/Sq.Inch/Unit"
                Amount = (Size_L * Size_W * Rate * Final_Quantity) + Setup_Charges
            Case "Rate/Sq.Inch/Sheet"
                Amount = (Size_L * Size_W * Rate * Pub_Sheets) + Setup_Charges
            Case "Rate/Sq.Inch"
                Amount = (Size_L * Size_W * Rate) + Setup_Charges
            Case "Rate/Sq.Cm"
                Amount = (Size_L * Size_W * Rate) + Setup_Charges
            Case "Rate/Sq.Cm/Unit"
                Amount = (Size_L * Size_W * Rate * Final_Quantity) + Setup_Charges
            Case "Rate/100 Sq.Cm/Sheet"
                Amount = ((Size_L * Size_W) * Pub_Sheets * (Rate / 100)) + Setup_Charges
            Case "Rate/100 Sq.Cm/Sheet Both Side"
                Amount = ((Size_L * Size_W) * Pub_Sheets * (Rate / 100) * 2) + Setup_Charges
            Case "Rate/Sq.Cm/Sheet"
                Amount = (Size_L * Size_W * Rate * Pub_Sheets) + Setup_Charges
            Case "Rate/100 Sq.Inch/Sheet"
                Amount = (((Size_L * Size_W) * Pub_Sheets * (Rate / 100))) + Setup_Charges
            Case "Rate/100 Sq.Inch/Sheet Both Side"
                Amount = (((Size_L * Size_W) * Pub_Sheets * (Rate / 100)) * 2) + Setup_Charges
            Case "Rate/Sq.Inch/Sheet Both Side"
                Amount = ((Size_L * Size_W) * 2 * Rate * Pub_Sheets) + Setup_Charges
            Case "Rate/Unit"
                Amount = (Final_Quantity * Rate) + Setup_Charges
            Case "Rate/1000 Units"
                Amount = (RoundUp(Final_Quantity / 1000, 0) * 1000) * (Rate / 1000) + Setup_Charges
            Case "Rate/Sheet"
                Amount = (Pub_Sheets * Rate) + Setup_Charges
            Case "Rate/1000 Sheets"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = (Pub_Sheets * (Rate / 1000)) + Setup_Charges
            Case "Rate/1000 Sheets Both Side"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = ((Pub_Sheets * (Rate / 1000)) * 2) + Setup_Charges
            Case "Rate/Ups"
                Amount = (Total_Ups * Rate) + Setup_Charges
            Case "Rate/Ups/Sheet"
                Amount = (Total_Ups * Pub_Sheets * Rate) + Setup_Charges
            Case "Rate/Page"
                Amount = (Pages * Rate) + Setup_Charges 'Amount = Pages * Rate
            Case "Rate/Job"
                Amount = (1 * Rate) + Setup_Charges
            Case "Rate/Set"
                Amount = (Sets * Rate) + Setup_Charges
            Case "Rate/Plate"
                Amount = (Total_Plates * Rate) + Setup_Charges
            Case "Rate/Sq.Inch/Unit"
                Amount = (Size_L * Size_W * Rate * Final_Quantity) + Setup_Charges
            Case "Rate/Total Cuts/1000 Sheets"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = ((Val(Gbl_UPS_L) + Val(Gbl_UPS_H)) * (Rate / 1000) * Pub_Sheets) + Setup_Charges
            Case "Rate/Set/1000 Sheets"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = (Sets * (Rate / 1000) * Pub_Sheets) + Setup_Charges
            Case "Rate/Page/Unit"
                Amount = (Pages * Final_Quantity * Rate) + Setup_Charges 'Amount = Pages * Rate
            Case "Rate/Set/Unit"
                Amount = (Sets * Final_Quantity * Rate) + Setup_Charges
            Case "Rate/Total Cuts/Sheet"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = ((Val(Gbl_UPS_L) + Val(Gbl_UPS_H)) * (Rate) * Pub_Sheets) + Setup_Charges
            Case "Rate/Order Quantity"
                Amount = (Gbl_Order_Quantity * Rate) + Setup_Charges 'Amount = Pages * Rate
            Case "Rate/1000 Order Quantity"
                Amount = (Gbl_Order_Quantity * (Rate / 1000)) + Setup_Charges 'Amount = Pages * Rate
            Case "Rate/Page/Order Quantity"
                Amount = (Pages * Gbl_Order_Quantity * Rate) + Setup_Charges 'Amount = Pages * Rate
            Case "Rate/Set/Order Quantity"
                Amount = (Sets * Gbl_Order_Quantity * Rate) + Setup_Charges 'Amount = Pages * Rate
            Case "Rate/Inch/Unit"
                Amount = ((Job_L / 25.4) * Rate * Final_Quantity) + Setup_Charges
            Case "Rate/Inch/Order Quantity"
                Amount = ((Job_L / 25.4) * Rate * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Loop/Unit"
                Amount = (Stitch * Rate * Final_Quantity) + Setup_Charges
            Case "Rate/Loop/Order Quantity"
                Amount = (Stitch * Rate * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Color/1000 Sheets"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = (Total_Colors * (Rate / 1000) * Pub_Sheets) + Setup_Charges
            Case "Rate/Color/1000 Sheets Both Side"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = ((Total_Colors * (Rate / 1000) * Pub_Sheets) * 2) + Setup_Charges
            Case "Rate/Ups/1000 Sheets"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = (Total_Ups * Pub_Sheets * (Rate / 1000)) + Setup_Charges
            Case "Rate/Set/1000 Sheets"
                Pub_Sheets = RoundUp(Pub_Sheets / 1000, 0) * 1000
                Amount = (Total_Ups * Sets * Pub_Sheets * (Rate / 1000)) + Setup_Charges
            Case "Rate/Sq.Inch/Set"
                Amount = ((Size_L * Size_W) * Rate * Sets) + Setup_Charges
            Case "Rate/Sq.Inch/Order Quantity"
                Amount = (Size_L * Size_W * Rate * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Color/Order Quantity"
                Amount = (Total_Colors * Rate * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Color/1000 Order Quantity"
                Amount = (Total_Colors * (Rate / 1000) * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Stitch/Unit"
                Amount = (Stitch * Rate * Final_Quantity) + Setup_Charges
            Case "Rate/Stitch/Order Quantity"
                Amount = (Stitch * Rate * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Sq.Inch/Color/Set"
                Amount = (Rate * (Size_L * Size_W) * Gbl_Front_Color * Sets) + Setup_Charges
            Case "Rate/Sq.Inch/Color/Set/Order Quantity"
                Amount = (Rate * (Size_L * Size_W) * Gbl_Front_Color * Sets * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Sq.Inch/Color/Set/Unit"
                Amount = (Rate * (Size_L * Size_W) * Gbl_Front_Color * Sets * Final_Quantity) + Setup_Charges
            Case "Rate/Sq.Mtr/Sheet"
                Amount = (Rate * (Size_L * Size_W) * Pub_Sheets) + Setup_Charges
            Case "Rate/Sq.Mtr/Unit"
                Amount = (Rate * (Size_L * Size_W) * Final_Quantity) + Setup_Charges
            Case "Rate/Sq.Mtr/Order Quantity"
                Amount = (Rate * (Size_L * Size_W) * Gbl_Order_Quantity) + Setup_Charges
            Case "Rate/Fold/Form/Unit"
                If folds > 0 Then
                    Amount = (Rate * (folds * RoundUp(Sets / 2, 0)) * Final_Quantity) + Setup_Charges
                Else
                    Amount = (Rate * (Math.Round((Total_Ups / 2)) * RoundUp(Sets / 2, 0)) * Final_Quantity) + Setup_Charges
                End If
            Case "Rate/Fold/Form/Order Quantity"
                If folds > 0 Then
                    Amount = (Rate * (folds * RoundUp(Sets / 2, 0)) * Gbl_Order_Quantity) + Setup_Charges
                Else
                    Amount = (Rate * (Math.Round((Total_Ups / 2)) * RoundUp(Sets / 2, 0)) * Gbl_Order_Quantity) + Setup_Charges
                End If
            Case "Rate/Fold/Unit"
                If folds > 0 Then
                    Amount = (Rate * folds * Final_Quantity) + Setup_Charges
                Else
                    Amount = (Rate * Math.Round((Total_Ups / 2)) * Final_Quantity) + Setup_Charges
                End If
            Case "Rate/Fold/Order Quantity"
                If folds > 0 Then
                    Amount = (Rate * folds * Gbl_Order_Quantity) + Setup_Charges
                Else
                    Amount = (Rate * Math.Round((Total_Ups / 2)) * Gbl_Order_Quantity) + Setup_Charges
                End If
                'Case "Rate/SqureCM(Height*Spine)/Order Quantity"
                '    Amount = (Rate * ((Job_H / 10) * (spine / 10)) * Gbl_Order_Quantity) + Setup_Charges

                'Case "Rate/SqureCM(Height*Spine)/Unit"
                '    Amount = (Rate * ((Job_H / 10) * (spine / 10)) * Final_Quantity) + Setup_Charges
        End Select

        'Check Minimum charges & returing values
        If Amount < Minimum_Charges Then
            Calculate_Operations = Math.Round(Minimum_Charges, 2)
        Else
            Calculate_Operations = Math.Round(Amount, 2)
        End If
    End Function

    ''Grid_Costing on edit amount calculation
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Function Amount_Calculation(ByVal Cal_Amt_Oper As Object) As Double
        'ByVal Row As Integer, ByVal Col As Integer, ByVal Quantity As Long, ByVal Rate As Double, ByVal Paper_Rate_Type As String, ByVal Total_Paper_In_KG As Double,
        ' ByVal Full_Sheet As Double, ByVal Machine_ID As Integer, ByVal No_Of_Sets As Integer, ByVal F_Color As Integer, ByVal B_Color As Integer, 
        'ByVal Printing_Style As String, ByVal Impression_To_Be_Charged As Long

        Dim dt As New DataTable
        Dim dT_Search_In_Machine As New DataTable
        db.ConvertObjectToDatatable(Cal_Amt_Oper, dt)
        Dim Is_Perfecta_Machine As Boolean = False
        Dim Amount As Double = 0
        Dim Minimum_Sheets, Roundof_Impressions_With As Long
        Dim Printing_Charges_Type As String = ""
        Dim Basic_Printing_Charges As Double
        Dim IsSpecialMachine As Boolean = False
        Try

            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            If IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) = 0 Then ' Plate Rate
                Amount = Val(dt.Rows(0)(1)) * Val(dt.Rows(0)(2))
            ElseIf IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) = 1 Then ' Paper Rate
                If IIf(IsDBNull(dt.Rows(0)(1)), "Sheet", dt.Rows(0)(1)) = "Sheet" Then
                    Amount = Math.Round(Val(dt.Rows(0)(2)) * Val(dt.Rows(0)(3)), 2)
                Else
                    Amount = Math.Round(Val(dt.Rows(0)(4)) * Val(dt.Rows(0)(3)), 2)
                End If
            ElseIf IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) = 2 Then 'Printing Amount
                Gbl_Orientation = IIf(IsDBNull(dt.Rows(0)(8)), "", dt.Rows(0)(8))

                Gbl_Machine_ID = IIf(IsDBNull(dt.Rows(0)(1)), 0, dt.Rows(0)(1))
                If IIf(IsDBNull(Gbl_Machine_ID), 0, Gbl_Machine_ID) <> 0 Then
                    MachineIDFilter = " And MachineID In (" & Gbl_Machine_ID & ")"
                End If

                k = "Search_In_Machine_Selection"
                dT_Search_In_Machine = GetDataTable()

                GblMainPaperGroup = IIf(IsDBNull(dt.Rows(0)(9)), "", dt.Rows(0)(9))

                If Search_In_Machine(Gbl_Machine_ID, Minimum_Sheets, 0, 0, 0, Printing_Charges_Type, Roundof_Impressions_With, Basic_Printing_Charges, 0, 0, 0, 0, 0, dT_Search_In_Machine, Is_Perfecta_Machine, IsSpecialMachine) = True Then
                    k = "Printing_Slabs"
                    DT_Printing_Slabs = GetDataTable()
                    For i = 0 To DT_Printing_Slabs.Rows.Count - 1
                        DT_Printing_Slabs.Rows(i)("Rate") = dt.Rows(0)(3)
                    Next
                    If (Gbl_Orientation = "Books" Or Gbl_Orientation = "BookPages" Or Gbl_Orientation = "WiroLeaves" Or Gbl_Orientation = "WiroBookPages" Or Gbl_Orientation = "Calendar") Then
                        Amount = Calculate_Book_Printing_Charges(dt.Rows(0)(2), Minimum_Sheets, dt.Rows(0)(3), Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, dt.Rows(0)(4), dt.Rows(0)(5), dt.Rows(0)(6), dt.Rows(0)(7), Is_Perfecta_Machine, Gbl_Machine_ID)
                    Else
                        Amount = Calculate_Printing_Charges(dt.Rows(0)(2), Minimum_Sheets, dt.Rows(0)(3), Printing_Charges_Type, Basic_Printing_Charges, Roundof_Impressions_With, dt.Rows(0)(4), dt.Rows(0)(5), dt.Rows(0)(6), dt.Rows(0)(7), Is_Perfecta_Machine, Gbl_Machine_ID)
                    End If
                Else
                    Amount = 0
                End If
            ElseIf IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) = 3 Then 'calculate special colors
                Gbl_Machine_ID = IIf(IsDBNull(dt.Rows(0)(5)), 0, dt.Rows(0)(5))
                If IIf(IsDBNull(Gbl_Machine_ID), 0, Gbl_Machine_ID) <> 0 Then
                    MachineIDFilter = " And MachineID In (" & Gbl_Machine_ID & ")"
                End If
                k = "Search_In_Machine_Selection"
                dT_Search_In_Machine = GetDataTable()
                If Search_In_Machine(Gbl_Machine_ID, Minimum_Sheets, 0, 0, 0, Printing_Charges_Type, Roundof_Impressions_With, Basic_Printing_Charges, 0, 0, 0, 0, 0, dT_Search_In_Machine, Is_Perfecta_Machine, IsSpecialMachine) = True Then
                    Amount = Calculate_Special_Color_Charges(Val(dt.Rows(0)(1)), Val(dt.Rows(0)(2)), dt.Rows(0)(3), Printing_Charges_Type, Roundof_Impressions_With, dt.Rows(0)(4))
                End If
            ElseIf IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) = 4 Then 'Operation calculations
                Amount = Calculate_Operations(dt.Rows(0)(1), IIf(IsDBNull(dt.Rows(0)(2)), 0, dt.Rows(0)(2)), IIf(IsDBNull(dt.Rows(0)(3)), 0, dt.Rows(0)(3)), IIf(IsDBNull(dt.Rows(0)(4)), 0, dt.Rows(0)(4)), IIf(IsDBNull(dt.Rows(0)(5)), 0, dt.Rows(0)(5)), IIf(IsDBNull(dt.Rows(0)(6)), 0, dt.Rows(0)(6)), IIf(IsDBNull(dt.Rows(0)(7)), 0, dt.Rows(0)(7)), IIf(IsDBNull(dt.Rows(0)(8)), 0, dt.Rows(0)(8)), IIf(IsDBNull(dt.Rows(0)(9)), 0, dt.Rows(0)(9)), IIf(IsDBNull(dt.Rows(0)(10)), 0, dt.Rows(0)(10)), IIf(IsDBNull(dt.Rows(0)(11)), 0, dt.Rows(0)(11)), IIf(IsDBNull(dt.Rows(0)(12)), 0, dt.Rows(0)(12)), IIf(IsDBNull(dt.Rows(0)(13)), 0, dt.Rows(0)(13)), IIf(IsDBNull(dt.Rows(0)(14)), 0, dt.Rows(0)(14)), IIf(IsDBNull(dt.Rows(0)(15)), 0, dt.Rows(0)(15)), IIf(IsDBNull(dt.Rows(0)(16)), 0, dt.Rows(0)(16)), IIf(IsDBNull(dt.Rows(0)(17)), 0, dt.Rows(0)(17)))
            ElseIf IIf(IsDBNull(dt.Rows(0)(0)), 0, dt.Rows(0)(0)) = 5 Then 'Coating
                Gbl_Machine_ID = IIf(IsDBNull(dt.Rows(0)(1)), 0, dt.Rows(0)(1))
                If IIf(IsDBNull(Gbl_Machine_ID), 0, Gbl_Machine_ID) <> 0 Then
                    MachineIDFilter = " And MachineID In (" & Gbl_Machine_ID & ")"
                End If

                GblOnlineCoating = IIf(IsDBNull(dt.Rows(0)(6)), 0, dt.Rows(0)(6))
                k = "Machine_Online_Coating_Rates"
                GblDTMachineCoatingRates = GetDataTable()
                Coating_Charges = IIf(IsDBNull(dt.Rows(0)(3)), 0, dt.Rows(0)(3))
                If GblOnlineCoating = "None" Or GblOnlineCoating = "No" Or GblOnlineCoating = "null" Then
                Else
                    If Search_In_Machine_Online_Coating(Gbl_Machine_ID, GblDTMachineCoatingRates, Coating_Charges, Printing_Charges_Type, IIf(IsDBNull(dt.Rows(0)(2)), 0, dt.Rows(0)(2)), Basic_Printing_Charges) = False Then
                        Amount_Calculation = 0
                    Else
                        Amount = Calculate_Coating_Charges(IIf(IsDBNull(dt.Rows(0)(2)), 0, dt.Rows(0)(2)), IIf(IsDBNull(dt.Rows(0)(3)), 0, dt.Rows(0)(3)), Printing_Charges_Type, IIf(IsDBNull(dt.Rows(0)(4)), 0, dt.Rows(0)(4)), IIf(IsDBNull(dt.Rows(0)(5)), 0, dt.Rows(0)(5)), Basic_Printing_Charges, dt.Rows(0)(2))
                    End If
                End If
            End If
            Amount_Calculation = Amount

        Catch ex As Exception
            'str = ex.Message
            Amount_Calculation = Amount
        End Try
        Return Amount_Calculation
    End Function

    Public Function Calculate_Coating_Charges(ByVal Pub_Sheets As Long, ByVal Coating_Charges As Double, ByVal Coating_Charges_Type As String, ByVal Size_L As Double, ByVal Size_W As Double, ByVal BasicCoatingCharges As Double, ByVal Impression_To_Be_Charged As Double) As Double
        Dim Amount As Double
        'If Printing_Charges_Type = "Impressions" Then
        '    Amount = Math.Round((Impression_To_Be_Charged * Coating_Charges), 2) * No_Of_Sets
        'ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With Then
        '    Amount = Math.Round((Impression_To_Be_Charged * (Coating_Charges / Roundof_Impressions_With)), 2) * No_Of_Sets
        'ElseIf Printing_Charges_Type = "Impressions/Color" Then
        '    Amount = Math.Round((Coating_Charges), 2) * No_Of_Sets
        'ElseIf Printing_Charges_Type = "Impressions/" & Roundof_Impressions_With & "/Color" Then
        '    Amount = Math.Round((Impression_To_Be_Charged * (Coating_Charges / Roundof_Impressions_With)), 2) '* No_Of_Sets
        'End If ByVal Size_L As Double, ByVal Size_W As Double, ByVal Total_Colors As Long, ByVal Pub_Sheets As Double

        If Coating_Charges_Type = "Rate/Sq.Inch/Sheet" Then
            Amount = Math.Round((Size_L * Size_W * Coating_Charges * Pub_Sheets), 2)
        ElseIf Coating_Charges_Type = "Rate/Sq.Inch/Sheet Both Side" Then
            Amount = Math.Round((Size_L * Size_W * Coating_Charges * Pub_Sheets), 2) * 2
        ElseIf Coating_Charges_Type = "Rate/100 Sq.Inch/Sheet" Then
            Amount = Math.Round(Size_L * Size_W * Pub_Sheets * (Coating_Charges / 100), 2)
        ElseIf Coating_Charges_Type = "Rate/100 Sq.Inch/Sheet Both Side" Then
            Amount = Math.Round(Size_L * Size_W * Pub_Sheets * (Coating_Charges / 100), 2) * 2
        ElseIf Coating_Charges_Type = "Impressions/1000" Then ''Coating type Impressions newly added as per pople sir on 07062021
            Amount = Math.Round((Impression_To_Be_Charged * (Coating_Charges / 1000)), 2)
        ElseIf Coating_Charges_Type = "Impressions" Then
            Amount = Math.Round((Impression_To_Be_Charged * (Coating_Charges)), 2)
        ElseIf Coating_Charges_Type = "Impressions/1000 Both Side" Then
            Amount = Math.Round((Impression_To_Be_Charged * (Coating_Charges / 1000)), 2) * 2
        End If
        If BasicCoatingCharges > Amount Then
            Amount = BasicCoatingCharges
        End If
        Calculate_Coating_Charges = Amount
    End Function

    Private Function Calculate_Book_Forms(ByRef DT_Book As DataTable, ByVal Ups As Long, ByVal Quantity As Long, ByVal Pages As Long, ByRef No_Of_Set As Long, ByRef No_Of_Forms As Long, ByRef Actual_Sheets As Long) As Object

        Dim Pages_Per_Form As Long = 0
        Dim Sets As Double = 0
        Dim Forms As Double = 0
        Dim Remaining_Pages As Long
        Dim F_B_Forms As Double = 0
        Dim F_B_Sets As Double = 0
        Dim F_B_Pages As Double = 0
        Dim F_B_Sheets As Double = 0
        Dim F_B_Impressions As Double = 0
        Dim W_TM_Sets As Double = 0

        Try
            With DT_Book

                .Columns.Add("Forms", GetType(Double))
                .Columns.Add("Sets", GetType(Double))
                .Columns.Add("Pages", GetType(Double))
                .Columns.Add("Sheets", GetType(Double))
                .Columns.Add("ImpressionsPerSet", GetType(Double))
                .Columns.Add("FormsInPoint", GetType(Double))
                .Columns.Add("ImprsToChargedPerSet", GetType(Double))
                .Columns.Add("BasicRate", GetType(Double))
                .Columns.Add("SlabRate", GetType(Double))
                .Columns.Add("RateType", GetType(String))
                .Columns.Add("Amount", GetType(Long))
                .Columns.Add("WastagePercentSheet", GetType(Double))
                .Columns.Add("PlateRate", GetType(Double))
                .Columns.Add("PlanID", GetType(Long))

                Pages_Per_Form = Ups * 2
                Sets = Pages / Ups
                Forms = Pages / Pages_Per_Form
                Dim mode As MidpointRounding
                If Gbl_Printing_Style = "Single Side" Then
                    F_B_Forms = RoundDown(Sets / 2)
                    F_B_Sets = F_B_Forms
                    F_B_Pages = Math.Round(Pages_Per_Form * F_B_Forms, mode)
                    F_B_Sheets = Quantity * F_B_Forms
                    F_B_Impressions = F_B_Sheets
                Else
                    F_B_Forms = RoundDown(Sets / 2)
                    F_B_Sets = F_B_Forms * 2
                    F_B_Pages = Math.Round(Pages_Per_Form * F_B_Forms, mode)
                    F_B_Sheets = Quantity * F_B_Forms
                    F_B_Impressions = F_B_Sheets * 2
                End If
                Dim IMPS = F_B_Impressions / F_B_Sets
                If F_B_Sets = 0 Then
                    IMPS = 0
                End If

                If F_B_Forms > 0 Then
                    .NewRow()
                    .Rows.Add(F_B_Forms, F_B_Sets, F_B_Pages, F_B_Sheets, IMPS, F_B_Forms)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1
                End If

                Dim fact As Double
                Dim flag4 As Boolean
                If (Ups = 4) Or (Ups = 8) Or (Ups = 16) Or (Ups = 32) Or (Ups = 64) Or (Ups = 128) Or (Ups = 256) And Gbl_Orientation = "BookPages" Then
                    flag4 = True
                End If

                Remaining_Pages = Pages - F_B_Pages
                W_TM_Sets = Remaining_Pages / Ups

                If Gbl_Printing_Style = "Work & Turn" Or Gbl_Printing_Style = "Work & Tumble" Then
                    fact = RoundDown(Remaining_Pages / Ups)
                Else
                    fact = 1
                End If
                Dim Impperset As Integer
                If W_TM_Sets >= fact And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If

                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    Remaining_Pages = RoundUp(Remaining_Pages - (fact * Ups), 0)
                End If

                If flag4 = True Then
                    fact = 0.5
                Else
                    fact = Remaining_Pages / Ups
                End If
                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If

                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    Remaining_Pages = Remaining_Pages - (fact * Ups)

                End If

                'Fact = 0.25
                If flag4 = True Then
                    fact = 0.25
                Else
                    fact = Remaining_Pages / Ups
                End If

                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If
                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    Remaining_Pages = Remaining_Pages - (fact * Ups)
                End If

                'Fact = 0.125
                If flag4 = True Then
                    fact = 0.125
                Else
                    fact = Remaining_Pages / Ups
                End If
                'Fact = Remaining_Pages / Ups
                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If
                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    Remaining_Pages = RoundUp(Remaining_Pages - (fact * Ups), 0)
                End If

                'Fact = 0.0625
                If flag4 = True Then
                    fact = 0.0625
                Else
                    fact = Remaining_Pages / Ups
                End If
                'Fact = Remaining_Pages / Ups
                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If
                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    fact = RoundUp(Remaining_Pages / Ups, 0)
                End If

                'Fact = 0.03125
                If flag4 = True Then
                    fact = 0.03125
                Else
                    fact = Remaining_Pages / Ups
                End If
                'Fact = Remaining_Pages / Ups
                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If
                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    fact = RoundUp(Remaining_Pages / Ups, 0)
                End If

                'Fact = 0.015625
                If flag4 = True Then
                    fact = 0.015625
                Else
                    fact = Remaining_Pages / Ups
                End If

                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If
                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    fact = RoundUp(Remaining_Pages / Ups, 0)
                End If

                If flag4 = True Then
                    fact = 0.0078125
                Else
                    fact = RoundUp(Remaining_Pages / Ups, 0)
                End If
                If Math.Round(W_TM_Sets, 5) >= Math.Round(fact, 5) And fact <> 0 Then
                    W_TM_Sets = W_TM_Sets - fact

                    If Gbl_Printing_Style = "Single Side" Then
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0))
                    Else
                        Impperset = Val(RoundUp((Quantity * fact) / 2, 0)) * 2
                    End If
                    .NewRow()
                    .Rows.Add(RoundUp(fact, 0), RoundUp(fact, 0), Math.Round((fact * Ups)), RoundUp((Quantity * fact) / 2, 0), Impperset, fact)
                    .Rows(.Rows.Count - 1).Item("PlanID") = Gbl_DT_plan.Rows.Count + 1

                    fact = RoundUp(Remaining_Pages / Ups, 0)
                End If

                Dim rw As Integer
                For rw = 2 To .Rows.Count - 1
                    If Gbl_Machine_Type = "Web Offset" Then
                        .Rows(rw)(1) = Val(.Rows(rw)(1) * 2)
                        .Rows(rw)(4) = Val(.Rows(rw)(4) / 2)
                    End If
                Next

                'No_Of_Forms = IIf(IsDBNull(.Rows(.Rows.Count - 1)(0)), 0, .Rows(.Rows.Count - 1)(0))
                'No_Of_Set = IIf(IsDBNull(.Rows(.Rows.Count - 1)(1)), 0, .Rows(.Rows.Count - 1)(1))
                'Actual_Sheets = IIf(IsDBNull(.Rows(.Rows.Count - 1)(3)), 0, .Rows(.Rows.Count - 1)(3))
                No_Of_Forms = IIf(IsDBNull(DT_Book.Compute("SUM(Forms)", "")), "0", DT_Book.Compute("SUM(Forms)", ""))  'Val(.Rows(.Rows.Count - 1)(0))
                No_Of_Set = IIf(IsDBNull(DT_Book.Compute("SUM(Sets)", "")), "0", DT_Book.Compute("SUM(Sets)", "")) ' 'Val(.Rows(.Rows.Count - 1)(1))
                Actual_Sheets = IIf(IsDBNull(DT_Book.Compute("SUM(Sheets)", "")), "0", DT_Book.Compute("SUM(Sheets)", ""))  ' Val(.Rows(.Rows.Count - 1)(3))
                .Rows(.Rows.Count - 1)(8) = 785657567

            End With
        Catch ex As Exception
            planErrors = ex.Message
            Return planErrors
        End Try
        Return True
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ShipperPlanning(ObjJSJson As Object) As String
        Dim js As New JavaScriptSerializer()
        js.MaxJsonLength = 2147483647
        Dim TblSPlan As New DataTable

        Try

            With TblSPlan
                .Columns.Add("ShipperID", GetType(Double))
                .Columns.Add("ShipperName", GetType(String))
                .Columns.Add("SizeL", GetType(Double))
                .Columns.Add("SizeW", GetType(Double))
                .Columns.Add("SizeH", GetType(Double))
                .Columns.Add("EmptyCartonWt", GetType(Double))
                .Columns.Add("Capacity", GetType(Double))
                .Columns.Add("QtyPerShipper", GetType(Double))
                .Columns.Add("TotalShipperQtyReq", GetType(Double))
                .Columns.Add("TotalWtOfAllShippers", GetType(Double))
                .Columns.Add("PackX", GetType(Double))
                .Columns.Add("PackY", GetType(Double))
                .Columns.Add("PackZ", GetType(Double))
                .Columns.Add("ShippingRate", GetType(Double))
                .Columns.Add("ShippingCost", GetType(Double))
                .Columns.Add("CBM", GetType(Double))
                .Columns.Add("CBF", GetType(Double))
                .Columns.Add("ShipperWeightPerPack", GetType(Double))
                .Columns.Add("ItemGroupName", GetType(String))
                .Columns.Add("ItemGroupID", GetType(Integer))
                .Columns.Add("ShipperRate", GetType(Double))
                .Columns.Add("ShipperCost", GetType(Double))
            End With

            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            Dim DT, DTShippers As New DataTable
            Dim ShipperPlanType As String = ""
            Dim MinJobL, MinJobW, MinJobH, MaxJobL, MaxJobW, MaxJobH As Double ', MaxWtInBox, Tollerance, Sheet_Thichness, MinWtInBox
            Dim Job_Pack_H, Job_Pack_W, Job_Pack_L, Per_Unit_Wt As Double
            Dim Paper_KG As Double
            Dim Expected_Qty_In_Box, Qty_In_A_Bundle, Total_Quantity As Double
            Dim ShipperID As Long, ShipperName As String, Shipperlength As Single, ShipperWidth As Single,
                ShipperHeight As Single, ShipperRate As Single, ShipperWeight As Single, ShipperCapacityWeight As Single

            db.ConvertObjectToDatatable(ObjJSJson, DT)
            Gbl_Job_H = Val(DT.Rows(0)(0))
            Gbl_Job_L = Val(DT.Rows(0)(1))
            Gbl_Job_W = Val(DT.Rows(0)(2))
            Gbl_Job_Open_Flap = Val(DT.Rows(0)(3))
            Gbl_Job_Bottom_Flap = Val(DT.Rows(0)(4))
            Gbl_Job_Pages = Val(DT.Rows(0)(5))
            Gbl_Job_Tongue_Height = Val(DT.Rows(0)(6))
            Gbl_Job_Overlap_Flap = Val(DT.Rows(0)(7))
            Gbl_Paper_GSM = IIf(IsDBNull(DT.Rows(0)(8)), 0, DT.Rows(0)(8))
            Gbl_Order_Quantity = Val(DT.Rows(0)(9))
            Gbl_Orientation = Trim(DT.Rows(0)(10))
            Paper_KG = Val(DT.Rows(0)(11))
            Qty_In_A_Bundle = Val(DT.Rows(0)(12))
            Expected_Qty_In_Box = Val(DT.Rows(0)(13))
            'Tollerance = Val(DT.Rows(0)(14))
            Total_Quantity = Val(DT.Rows(0)(15))

            'MaxJobL = Val(DT.Rows(0)(16))
            'MaxJobW = Val(DT.Rows(0)(17))
            'MaxJobH = Val(DT.Rows(0)(18))
            'MinWtInBox = Val(DT.Rows(0)(19))
            'MaxWtInBox = Val(DT.Rows(0)(20))
            ShipperPlanType = Trim(DT.Rows(0)(21))

            'MinJobL = Val(DT.Rows(0)(22))
            'MinJobW = Val(DT.Rows(0)(23))
            'MinJobH = Val(DT.Rows(0)(24))

            Job_Pack_L = IIf(IsDBNull(DT.Rows(0)(25)), 0, DT.Rows(0)(25))
            Job_Pack_W = IIf(IsDBNull(DT.Rows(0)(26)), 0, DT.Rows(0)(26))
            Job_Pack_H = IIf(IsDBNull(DT.Rows(0)(27)), 0, DT.Rows(0)(27))
            Per_Unit_Wt = IIf(IsDBNull(DT.Rows(0)(28)), 0, DT.Rows(0)(28))


            'Sheet_Thichness = Val(DT.Rows(0)(25)) ' Math.Round((Gbl_Paper_GSM * 0.000631312), 3)

            'Select Case Gbl_Orientation
            '    Case "Rectangular", "BookCover", "AccordionFold", "DoubleGateFold", "DoubleParallelFold", "GateFold", "FrenchFold", "HalfFold", "HalfThenTriFold", "RollFold", "TriFold", "ZFold"
            '        Job_Pack_L = Gbl_Job_L
            '        Job_Pack_W = Gbl_Job_H
            '        Job_Pack_H = Sheet_Thichness
            '        Per_Unit_Wt = Math.Round((Paper_KG * 1000) / Gbl_Order_Quantity, 3)
            '    Case "BookPages", "WiroBookPages", "Calendar", "MultipleLeaves", "WiroLeaves", "WrintingPad", "PrePlannedSheet", "FourCornerBox", "RingFlap", "FourCornerHingedLid", "WebbedSelfLockingTray", "TurnOverEndTray", "BodyBeltOuter", "6CornerBox"
            '        Job_Pack_L = Gbl_Job_L
            '        Job_Pack_W = Gbl_Job_H
            '        Job_Pack_H = Sheet_Thichness * Gbl_Job_Pages
            '        Per_Unit_Wt = Math.Round((Paper_KG * 1000) / Gbl_Order_Quantity, 3)
            '    Case "EnvCenterPasting", "EnvLPasting", "EnvSidePasting", "CatchCover", "ReverseTuckIn", "ReverseTuckAndTongue", "StandardStraightTuckIn", "UniversalCarton", "StandardStraightTuckInNested", "TuckToFrontOpenTop"
            '        Job_Pack_L = Sheet_Thichness * 3
            '        Job_Pack_W = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
            '        Job_Pack_H = Gbl_Job_L + Gbl_Job_W
            '        Per_Unit_Wt = Math.Round((Paper_KG * 1000) / Gbl_Order_Quantity, 3)
            '    Case "CrashLockWithPasting", "CrashLockWithoutPasting", "UniversalOpenCrashLockWithPasting"
            '        Job_Pack_L = Sheet_Thichness * 6
            '        Job_Pack_W = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
            '        Job_Pack_H = Gbl_Job_L + Gbl_Job_W
            '        Per_Unit_Wt = Math.Round((Paper_KG * 1000) / Gbl_Order_Quantity, 3)
            '    Case "CarryBag"
            '        Job_Pack_L = Sheet_Thichness * 5
            '        Job_Pack_W = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
            '        Job_Pack_H = Gbl_Job_L + Gbl_Job_W
            '        Per_Unit_Wt = Math.Round((Paper_KG * 1000) / Gbl_Order_Quantity, 3)
            '    Case "OvelShape", "PolygonShape"
            '        Job_Pack_L = Sheet_Thichness
            '        Job_Pack_W = Gbl_Job_H + (Gbl_Job_W * 2) + (Gbl_Job_Open_Flap * 2)
            '        Job_Pack_H = Gbl_Job_L + Gbl_Job_W
            '        Per_Unit_Wt = Math.Round((Paper_KG * 1000) / Gbl_Order_Quantity, 3) 'In gm
            'End Select

            If Per_Unit_Wt <= 0 Then
                Return "This will not work with this orientation"
            End If

            If MinJobL < Job_Pack_L Then MinJobL = Job_Pack_L
            If MinJobW < Job_Pack_W Then MinJobW = Job_Pack_W
            If MinJobH < Job_Pack_H Then MinJobH = Job_Pack_H

            If ShipperPlanType.ToUpper() = "OLD" Then
                Job_Pack_H = Job_Pack_H + 5 ' 5 MM Extra the partition thickness
                Job_Pack_W = Job_Pack_W + 5 ' 5 MM Extra the partition thickness
                str = "SELECT Distinct ShipperID,ItemName As ShipperName,Isnull(SizeL,0) As ShipperLength, Isnull(SizeW,0) As ShipperWidth,Isnull(SizeH,0) As ShipperHeight,EstimationRate As ShipperRate, Isnull(EmptyCartonWt,0) As ShipperWeight,Isnull(CapacityWeight,0) As CapacityWeight, ItemGroupName,ItemGroupID,Isnull(CBM,0) As CBM,Isnull(CBF,0) As CBF From (Select Distinct [IMD].[ItemID] As ShipperID,ItemName,IMD.ItemGroupID,[IG].[ItemGroupName],IMD.CompanyID,IMD.UserID AS [UserID],Convert(CHAR(30),IMD.ModifiedDate, 106) AS [ModifiedDate],IMD.FYear,[FieldName],[FieldValue] From ItemMasterDetails As IMD Inner Join ItemMaster As IM On IM.ItemID=IMD.ItemID Inner Join ItemGroupMaster AS IG On IG.ItemGroupID=IMD.ItemGroupID And IMD.CompanyID=IG.CompanyID And IMD.ItemGroupID=7 And IMD.CompanyID=" & CompanyID & " And Isnull(IG.IsDeletedTransaction,0)<>1 And Isnull(IMD.IsDeletedTransaction,0)<>1 )x Unpivot (value for name in ([FieldValue])) up pivot (max(value) for FieldName In ([SizeH], [EmptyCartonWt], [CapacityWeight], [WtPerPacking], [EstimationRate],[SizeW], [SizeL], [CBF], [EstimationUnit],[CBM])) P "
            Else
                str = "SELECT 0 As ShipperID,'X' As ShipperName," & MaxJobL & " As ShipperLength, " & MaxJobW & " As ShipperWidth," & MaxJobH & " As ShipperHeight,10 As ShipperRate, 1 As ShipperWeight,20 As CapacityWeight,'SHIPPER CARTON' As ItemGroupName,7 As ItemGroupID"
            End If

            db.FillDataTable(DTShippers, str)

            With DTShippers

                If .Rows.Count > 0 Then
                    Dim rw As Integer
                    For rw = 0 To .Rows.Count - 1
                        ShipperID = Val(.Rows(rw)("ShipperID"))
                        ShipperName = Trim(.Rows(rw)("ShipperName"))
                        Shipperlength = Val(.Rows(rw)("ShipperLength"))
                        ShipperWidth = Val(.Rows(rw)("ShipperWidth"))
                        ShipperHeight = Val(.Rows(rw)("ShipperHeight"))
                        ShipperRate = Val(.Rows(rw)("ShipperRate"))
                        ShipperWeight = Val(.Rows(rw)("ShipperWeight"))
                        ShipperCapacityWeight = Val(.Rows(rw)("CapacityWeight"))

                        Dim Wi As Double, He As Double, Le As Double
                        Dim X As Long, Y As Long, Z As Long, X_Inc As Long

                        X_Inc = Val(Qty_In_A_Bundle) * Job_Pack_L
                        He = Job_Pack_H
                        Z = 1
                        For H = Job_Pack_H To 1000 Step Job_Pack_H
                            Wi = Job_Pack_W
                            Y = 1
                            For W = Job_Pack_W To 1000 Step Job_Pack_W
                                Le = X_Inc
                                X = Val(Qty_In_A_Bundle)

                                For L = X_Inc To 1000 Step X_Inc
                                    'Calculate wt and check wt in criteria
                                    Dim WT As Double
                                    WT = (X * Per_Unit_Wt) * Y * Z 'in gm

                                    Dim flagplan As Boolean = False
                                    If ShipperPlanType.ToUpper() = "OLD" Then
                                        If WT <= ShipperCapacityWeight Then
                                            flagplan = True
                                        End If
                                    Else
                                        'If WT <= (Val(MaxWtInBox) * 1000) And WT >= (Val(MinWtInBox) * 1000) And L >= MinJobL And H >= MinJobH And W >= MinJobW And L <= MaxJobL And H <= MaxJobH And W <= MaxJobW Then
                                        Shipperlength = Math.Round(Val(L), 0) + 10
                                        ShipperWidth = Math.Round(Val(W), 0) + 10
                                        ShipperHeight = Math.Round(Val(H), 0) + 10
                                        ShipperName = Shipperlength & "x" & ShipperWidth & "x" & ShipperHeight
                                        ShipperRate = 1
                                        flagplan = True
                                        'End If
                                    End If

                                    If flagplan = True Then

                                        Dim Qty_In_Shipper As Long, Total_Shipper_Qty_Req As Long
                                        Dim Filled_Shipper_Wt As Double, Total_Wt_of_All_Shippers As Double

                                        Qty_In_Shipper = (X * Y * Z)

                                        Filled_Shipper_Wt = (ShipperWeight + Math.Round(WT / 1000, 2)) 'In KG
                                        Total_Shipper_Qty_Req = RoundUp(Val(Total_Quantity) / Qty_In_Shipper, 0)
                                        Total_Wt_of_All_Shippers = Filled_Shipper_Wt * Total_Shipper_Qty_Req 'In KG

                                        If Qty_In_Shipper = Expected_Qty_In_Box Then
                                            TblSPlan.NewRow()
                                            TblSPlan.Rows.Add(ShipperID, ShipperName, Math.Round(Shipperlength, 0), Math.Round(ShipperWidth, 0), Math.Round(ShipperHeight, 0), ShipperWeight, Math.Round(Filled_Shipper_Wt, 3), Qty_In_Shipper, Total_Shipper_Qty_Req, Math.Round(Total_Wt_of_All_Shippers, 3), X, Y, Z, ShipperRate, ShipperRate * Total_Shipper_Qty_Req, Math.Round(((Shipperlength / 10) * (ShipperWidth / 10) * (ShipperHeight / 10)) / 1000000, 4), Math.Round(((Shipperlength / 25.4) * (ShipperWidth / 25.4) * (ShipperHeight / 25.4)) / 1728, 4), Math.Round(Per_Unit_Wt, 2), Trim(.Rows(rw)(8)), Val(.Rows(rw)(9)), ShipperRate, ShipperRate * Total_Shipper_Qty_Req)
                                            If TblSPlan.Rows.Count > 15 Then
                                                ' GoTo x
                                            End If
                                        End If
                                    End If
                                    'increment in loop
                                    X = X + Val(Qty_In_A_Bundle)
                                    Le = Le + L  ' Multiple of Job L
                                Next

                                Y = Y + 1
                                Wi = Wi + W  ' Multiple of Job W
                            Next
                            He = He + H  ' Multiple of Job H
                            Z = Z + 1
                        Next
                    Next
                End If

            End With
x:
            Dim data As New HelloWorldData()
            data.Message = db.ConvertDataTableTojSonString(TblSPlan)

            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ContainerPlanning(ObjJSJson As Object) As String
        Dim js As New JavaScriptSerializer With {
            .MaxJsonLength = 2147483647
        }
        Dim TblSPlan, DTContainers, DTShpr As New DataTable

        Try
            CompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))

            With TblSPlan
                .Columns.Add("ContainerID", GetType(Double))
                .Columns.Add("ContainerName", GetType(String))
                .Columns.Add("LengthMM", GetType(Double))
                .Columns.Add("WidthMM", GetType(Double))
                .Columns.Add("HeightMM", GetType(Double))
                .Columns.Add("LengthFT", GetType(Double))
                .Columns.Add("WidthFT", GetType(Double))
                .Columns.Add("HeightFT", GetType(Double))
                .Columns.Add("CountL", GetType(Double))
                .Columns.Add("CountW", GetType(Double))
                .Columns.Add("CountH", GetType(Double))
                .Columns.Add("TotalCarton", GetType(Double))
                .Columns.Add("Direction", GetType(String))
                .Columns.Add("TotalWt", GetType(Double))
                .Columns.Add("MaxWeight", GetType(Double))
                .Columns.Add("TotalContainers", GetType(Double))
                .Columns.Add("CBM", GetType(Double))
                .Columns.Add("CBF", GetType(Double))
            End With

            db.ConvertObjectToDatatable(ObjJSJson, DTShpr)
            str = "Select ContainerID,ContainerName, LengthMM, WidthMM, HeightMM, LengthFT, WidthFT, HeightFT,LengthCM, WidthCM, HeightCM, MaxWeight From ContainerMaster Where CompanyID=" & CompanyID
            db.FillDataTable(DTContainers, str)
            Dim ContL, ContW, ContH As Integer
            Dim totalWt, TtlContainers, TtlCarton As Double
            Dim Directions As String
            For i = 0 To DTContainers.Rows.Count - 1
                ContH = Math.Floor(DTContainers.Rows(i)(4) / DTShpr.Rows(0)(0))
                Directions = "Cont.L-Box L"
                ContL = Math.Floor(DTContainers.Rows(i)(2) / DTShpr.Rows(0)(1))
                ContW = Math.Floor(DTContainers.Rows(i)(3) / DTShpr.Rows(0)(2))

                totalWt = DTShpr.Rows(0)(3) ' Math.Round(DTShpr.Rows(0)(3) * ContL * ContH * ContW, 2)
                If totalWt <= DTContainers.Rows(i)(11) Then
                    TtlCarton = ContL * ContW * ContH
                    TtlContainers = RoundUp(DTShpr.Rows(0)(4) / TtlCarton, 0)
                    TblSPlan.Rows.Add(DTContainers.Rows(i)(0), DTContainers.Rows(i)(1), DTContainers.Rows(i)(2), DTContainers.Rows(i)(3), DTContainers.Rows(i)(4), DTContainers.Rows(i)(5), DTContainers.Rows(i)(6), DTContainers.Rows(i)(7), ContL, ContW, ContH, TtlCarton, Directions, totalWt, DTContainers.Rows(i)(11), TtlContainers, Math.Round(DTShpr.Rows(0)(5) * DTShpr.Rows(0)(4), 2), Math.Round(DTShpr.Rows(0)(6) * DTShpr.Rows(0)(4), 2))
                End If

                Directions = "Cont.L-Box W"
                ContL = Math.Floor(DTContainers.Rows(i)(3) / DTShpr.Rows(0)(1))
                ContW = Math.Floor(DTContainers.Rows(i)(2) / DTShpr.Rows(0)(2))

                totalWt = DTShpr.Rows(0)(3) ' Math.Round(DTShpr.Rows(0)(3) * ContL * ContH * ContW, 2)
                If totalWt <= DTContainers.Rows(i)(11) Then
                    TtlCarton = ContL * ContW * ContH
                    TtlContainers = RoundUp(DTShpr.Rows(0)(4) / TtlCarton, 0)
                    TblSPlan.Rows.Add(DTContainers.Rows(i)(0), DTContainers.Rows(i)(1), DTContainers.Rows(i)(2), DTContainers.Rows(i)(3), DTContainers.Rows(i)(4), DTContainers.Rows(i)(5), DTContainers.Rows(i)(6), DTContainers.Rows(i)(7), ContL, ContW, ContH, TtlCarton, Directions, totalWt, DTContainers.Rows(i)(11), TtlContainers, Math.Round(DTShpr.Rows(0)(5) * DTShpr.Rows(0)(4), 2), Math.Round(DTShpr.Rows(0)(6) * DTShpr.Rows(0)(4), 2))
                End If
            Next

            Dim data As New HelloWorldData()
            data.Message = db.ConvertDataTableTojSonString(TblSPlan)

            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

End Class

Public Class HelloWorldData
    Public Message As [String]
End Class
