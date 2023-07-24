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
Public Class WebServiceDashboard
    Inherits System.Web.Services.WebService


    Dim db As New DBConnection
    Dim FYear As String
    Dim CompanyId As Integer
    Dim js As New JavaScriptSerializer()
    Dim data As New HelloWorldData()
    Dim dataTable As New DataTable()
    Dim str, UserId As String

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SalesManager(ByVal LedgerGroupID As Integer) As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "select DISTINCT LedgerName,LedgerID,LedgerGroupID from LedgerMaster  where IsdeletedTransaction = 0 and LedgerGroupID = " & LedgerGroupID
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SalesByManager(ByVal LedgerGroupID As Integer) As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DISTINCT LM.LedgerName, Round(Sum(PQC.FinalAMount),2) TotalSales	 FROM LedgerMaster AS LM INNER JOIN ProductQuotation AS PQ ON PQ.SalesManagerId = LM.LedgerID INNER JOIN ProductQuotationContents AS pqc ON pqc.productEstimateID = PQ.productEstimateID  WHERE Isnull(LM.IsdeletedTransaction, 0) = 0 AND Isnull(LedgerGroupID, 0) = 3 and Isnull(PQ.Isapproved, 0) <> 1 GROUP BY LM.LedgerName, LM.LedgerID, LM.LedgerGroupID "
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function piechart(ByVal CategoryID As Int16) As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim query As String = ""


            If CategoryID > 0 Then
                query = "SELECT DISTINCT PCM.ProductName, CM.CategoryID, ROUND(SUM(PQC.FinalAmount), 2) AS TotalSales " &
                    "FROM ProductCatalogMaster AS PCM " &
                    "INNER JOIN ProductQuotationContents AS PQC ON PQC.ProductCatalogID = PCM.ProductCatalogID " &
                    "INNER JOIN CategoryMaster AS CM ON CM.CategoryID = PCM.CategoryID " &
                    "WHERE ISNULL(PCM.IsdeletedTransaction, 0) = 0 AND PCM.CategoryID = " & CategoryID & " " &
                    "GROUP BY PCM.ProductName, CM.CategoryID"
            Else
                query = "SELECT PCM.ProductName, ROUND(SUM(PQC.FinalAmount), 2) AS TotalSales " &
                "FROM ProductCatalogMaster AS PCM " &
                "INNER JOIN ProductQuotationContents AS PQC ON PQC.ProductCatalogID = PCM.ProductCatalogID " &
                "WHERE ISNULL(PCM.IsdeletedTransaction, 0) = 0 " &
                "GROUP BY PCM.ProductName"
            End If

            If query <> "" Then
                db.FillDataTable(Dt, query)
                data.Message = db.ConvertDataTableTojSonString(Dt)
                Return js.Serialize(data.Message)
            End If
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function barchart() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DISTINCT CM.CategoryID, CM.CategoryName, ROUND(SUM(PQC.FinalAmount), 2) AS TotalSale FROM CategoryMaster AS CM INNER JOIN ProductQuotationContents AS PQC ON PQC.CategoryID = CM.CategoryID WHERE ISNULL(CM.IsdeletedTransaction, 0) = 0 GROUP BY CM.CategoryName,CM.CategoryID "
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Lastchart(ByVal CategoryID As Int16) As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim query As String = ""

            If CategoryID > 0 Then
                query = "SELECT  DISTINCT LM.State, ROUND(SUM(PQC.FinalAmount), 2) AS TotalSales FROM LedgerMaster AS LM INNER JOIN ProductQuotation AS PQ ON PQ.LedgerID = LM.LedgerID INNER JOIN ProductQuotationContents AS PQC ON PQC.productEstimateID = PQ.productEstimateID WHERE ISNULL(LM.IsdeletedTransaction, 0) = 0 AND PQC.CategoryID = " & CategoryID & " AND ISNULL(PQ.Isapproved, 0) = 1 GROUP BY LM.State"
            Else
                query = "SELECT DISTINCT LM.State, ROUND(SUM(PQC.FinalAmount), 2) AS TotalSales FROM LedgerMaster AS LM INNER JOIN ProductQuotation AS PQ ON PQ.LedgerID = LM.LedgerID INNER JOIN ProductQuotationContents AS PQC ON PQC.productEstimateID = PQ.productEstimateID WHERE ISNULL(LM.IsdeletedTransaction, 0) = 0 AND ISNULL(PQ.Isapproved, 0) = 1 GROUP BY LM.State"
            End If

            If query <> "" Then
                db.FillDataTable(Dt, query)
                data.Message = db.ConvertDataTableTojSonString(Dt)
                Return js.Serialize(data.Message)
            End If

        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    '//////////////////////////////////////////////////////////////////////salesDashboard//////////////////////////////////////////////////////////////////////////////////////////////////////////

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function dxchart() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT  LM.State, ML.LedgerName AS SM, Round(SUM(PQC.FinalAmount),2) AS TotalAmount FROM ProductQuotation AS PQ inner JOIN  LedgerMaster AS LM ON PQ.LedgerID = LM.LedgerID LEFT JOIN LedgerMaster AS ML ON ML.LedgerID = PQ.SalesManagerId INNER JOIN ProductQuotationContents AS PQC ON PQC.productEstimateID = PQ.productEstimateID GROUP BY  LM.State,  ML.LedgerName  order by State asc"
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function categoryPieChart() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DISTINCT CM.CategoryID, CM.CategoryName, ROUND(SUM(PQC.FinalAmount), 2) AS TotalSale FROM CategoryMaster AS CM INNER JOIN ProductQuotationContents AS PQC ON PQC.CategoryID = CM.CategoryID WHERE ISNULL(CM.IsdeletedTransaction, 0) = 0 GROUP BY CM.CategoryName,CM.CategoryID "
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MonthDATA() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DATENAME(Month, PQ.CreatedDate) AS Month, YEAR(PQ.CreatedDate) AS Year, Round(SUM(PQC.FinalAmount),2) AS TotalSales FROM ProductQuotation AS PQ INNER JOIN ProductQuotationContents AS PQC ON PQC.productEstimateID = PQ.productEstimateID GROUP BY   DateName(Month, PQ.CreatedDate), YEAR(PQ.CreatedDate) ,MONTH(PQ.CreatedDate) ORDER BY YEAR(PQ.CreatedDate),MONTH(PQ.CreatedDate)"
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function Revenue() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DATENAME(Month, PQ.CreatedDate) AS Month, YEAR(pq.CreatedDate) AS Year, round(SUM(PQC.FinalAmount),2) AS MonthlyRevenue FROM ProductQuotation AS PQ INNER JOIN ProductQuotationContents AS PQC ON PQC.ProductEstimateID = PQ.ProductEstimateID GROUP BY   DateName(Month, PQ.CreatedDate), YEAR(PQ.CreatedDate) ,MONTH(PQ.CreatedDate) ORDER BY YEAR(PQ.CreatedDate),MONTH(PQ.CreatedDate)"
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function NewCustomer() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DateName(Month, PQ.CreatedDate) AS Month,COUNT(DISTINCT LM.LedgerGroupID) AS NewCustomers FROM  ProductQuotation AS PQ INNER JOIN LedgerMaster AS LM ON PQ.LedgerID = LM.LedgerID INNER JOIN ProductQuotationContents AS PQC ON PQC.productEstimateID = PQ.productEstimateID INNER JOIN ( SELECT LedgerID, MIN(CreatedDate) AS FirstCreatedDate FROM ProductQuotation  GROUP BY LedgerID) AS Q ON PQ.LedgerID = Q.LedgerID AND PQ.CreatedDate = Q.FirstCreatedDate WHERE LM.LedgerGroupID = 1 GROUP BY DateName(Month, PQ.CreatedDate), YEAR(PQ.CreatedDate) ,MONTH(PQ.CreatedDate)  ORDER BY YEAR(PQ.CreatedDate),MONTH(PQ.CreatedDate)"
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function

    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GrossProfit() As String
        Try
            Dim CompanyID As String = Convert.ToString(Session("CompanyID"))
            Dim Dt As New DataTable
            Dim STR = "SELECT DATENAME(Month, PQ.CreatedDate) AS Month, YEAR(PQ.CreatedDate) AS Year,  SUM(PQC.ProfitCost) AS GrossProfit , ROUND(SUM(PQC.FinalAmount), 2) as FinalAmount  FROM ProductQuotation AS PQ INNER JOIN ProductQuotationContents AS PQC ON PQC.productEstimateID = PQ.productEstimateID GROUP BY   DateName(Month, PQ.CreatedDate), YEAR(PQ.CreatedDate) ,MONTH(PQ.CreatedDate) ORDER BY YEAR(PQ.CreatedDate),MONTH(PQ.CreatedDate)"
            db.FillDataTable(Dt, STR)
            data.Message = db.ConvertDataTableTojSonString(Dt)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function MachineData(ByVal LedgerID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "Select ISNULL(MM.MachineID,0)id, MM.MachineName text, MM.DepartmentID ,DM.DepartmentName From MachineMaster As MM Inner Join DepartmentMaster as DM on MM.DepartmentID=DM.DepartmentID And MM.CompanyID=DM.CompanyID Where MM.CompanyID= " & CompanyId & " And ISNULL(MM.IsDeletedTransaction, 0) <> 1    Order By MM.MachineName"
            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function VendorMachineGrid(ByVal MachineID As String, ByVal VendorID As String) As String
        Try
            CompanyId = Convert.ToString(HttpContext.Current.Session("CompanyID"))
            str = "SELECT DISTINCT PKSlabID, MachineID,LedgerID,  SheetRangeFrom, SheetRangeTo, Rate, PlateCharges, PSPlateCharges, CTCPPlateCharges, Wastage, SpecialColorFrontCharges, SpecialColorBackCharges, NULLIF (PaperGroup, '') AS PaperGroup, MaxPlanW AS SizeW, MaxPlanL AS SizeL, MinCharges FROM VendorWiseMachineSlabMaster " &
                " WHERE (CompanyID = " & CompanyId & ") AND (MachineID = " & MachineID & ") AND (LedgerID = " & VendorID & ") AND (ISNULL(IsDeletedTransaction, 0) <> 1) " &
                " Order By PaperGroup,SheetRangeFrom ,SheetRangeTo "

            db.FillDataTable(dataTable, str)
            data.Message = db.ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    Public Class HelloWorldData
        Public Message As [String]
    End Class
End Class