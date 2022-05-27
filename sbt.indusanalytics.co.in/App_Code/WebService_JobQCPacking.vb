Imports System.Web
Imports System.Web.Services
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
Public Class WebService_JobQCPacking
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

    '---------------------------------  Pending List for QC Packing---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function PendingQCPacking() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select ISNULL(SPM.SemiPackingMainID, 0) AS SemiPackingMainID, ISNULL(SPM.MaxSemiPackingNo, 0) AS MaxSemiPackingNo, NULLIF (SPM.SemiPackingNo, '') AS SemiPackingNo,Replace(Convert(nvarchar(30),SPM.SemiPackingDate,106),'','-') as SemiPackingDate, ISNULL(JBJ.JobBookingID, 0) AS JobBookingID, ISNULL(SPD.JobBookingJobCardContentsID, 0) AS JobBookingJobCardContentsID, ISNULL(JBJ.ProductMasterID, 0) AS ProductMasterID, ISNULL(JBJ.BookingID, 0) AS BookingID, ISNULL(SPD.OrderBookingID, 0) AS OrderBookingID, ISNULL(JBD.OrderBookingDetailsID, 0) AS OrderBookingDetailsID, NULLIF (JBJ.JobBookingNo, '') AS JobBookingNo, Replace(Convert(nvarchar(30),JBJ.JobBookingDate,106),'','-') as JobBookingDate, NULLIF (PM.ProductMasterCode, '') AS ProductMasterCode, NULLIF (JOB.SalesOrderNo, '') AS SalesOrderNo, Replace(Convert(nvarchar(30),JBD.OrderBookingDate,106),'','-') as OrderBookingDate, NULLIF (JBJ.JobName, '') AS JobName, Replace(Convert(nvarchar(30),JBD.ExpectedDeliveryDate,106),'','-') as ExpectedDeliveryDate, SUM(ISNULL(SPD.PackedQuantity, 0)) AS SemiPackedQuantity,JBJ.LedgerID," &
              " (SELECT Isnull(SUM(ISNULL(B.ReceiptQuantity, 0)),0) AS Expr1 FROM FinishGoodsTransactionMain AS A INNER JOIN FinishGoodsTransactionDetail AS B ON A.FGTransactionID = B.FGTransactionID AND A.CompanyID = B.CompanyID AND A.VoucherID = - 50 AND ISNULL(A.IsDeletedTransaction, 0) = 0 WHERE (B.SemiPackingMainID = SPD.SemiPackingMainID) AND (B.JobBookingID = SPD.JobBookingID) AND (B.ProductMasterID = SPD.ProductMasterID) AND (B.CompanyID = SPD.CompanyID) AND  (ISNULL(B.IsDeletedTransaction, 0) = 0)) AS QCApprovedQuantity,JBJ.OrderQuantity As JobCardQuantity, JBD.ProductCode,JBD.OrderQuantity " &
              " From JobSemiPackingMain AS SPM INNER JOIN JobSemiPackingDetail AS SPD ON SPM.SemiPackingMainID=SPD.SemiPackingMainID AND SPM.CompanyID=SPD.CompanyID AND Isnull(SPM.IsDeletedTransaction,0)=0 INNER JOIN JobBookingJobCard AS JBJ ON JBJ.JobBookingID=SPD.JobBookingID AND JBJ.CompanyID=SPM.CompanyID INNER JOIN JobOrderBooking AS JOB ON JOB.OrderBookingID=SPD.OrderBookingID AND JOB.CompanyID=SPD.CompanyID INNER JOIN JobOrderBookingDetails AS JBD ON JOB.OrderBookingID=JBD.OrderBookingID AND JBJ.BookingID=JBD.BookingID AND JOB.CompanyID=JBD.CompanyID INNER JOIN JobBookingJobCardContents AS JBJC ON JBJ.JobBookingID=JBJC.JobBookingID AND SPD.JobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID AND JBJ.CompanyID=JBJC.CompanyID LEFT JOIN ProductMaster AS PM ON SPD.ProductMasterID=PM.ProductMasterID AND SPD.CompanyID=PM.CompanyID " &
              " Where SPM.CompanyID='" & GBLCompanyID & "' AND Isnull(SPM.IsDeletedTransaction,0)=0 " &
              " GROUP BY ISNULL(SPM.SemiPackingMainID, 0), ISNULL(SPM.MaxSemiPackingNo, 0), NULLIF (SPM.SemiPackingNo, ''), SPM.SemiPackingDate, ISNULL(JBJ.JobBookingID, 0), ISNULL(SPD.JobBookingJobCardContentsID, 0), ISNULL(JBJ.ProductMasterID, 0), ISNULL(JBJ.BookingID, 0), ISNULL(SPD.OrderBookingID, 0), ISNULL(JBD.OrderBookingDetailsID, 0), NULLIF (JBJ.JobBookingNo, ''), JBJ.JobBookingDate, NULLIF (PM.ProductMasterCode, ''), NULLIF (JOB.SalesOrderNo, ''), JBD.OrderBookingDate, NULLIF (JBJ.JobName, ''), JBD.ExpectedDeliveryDate, SPD.JobBookingID, SPD.SemiPackingMainID, SPD.ProductMasterID, SPD.CompanyID,JBJ.OrderQuantity, JBD.ProductCode,JBJ.LedgerID,JBD.OrderQuantity " &
              " HAVING (Sum(Isnull(SPD.OuterCarton,0))-Isnull((Select Sum(Isnull(B.OuterCarton,0)) From FinishGoodsTransactionMain AS A INNER JOIN FinishGoodsTransactionDetail AS B ON A.FGTransactionID=B.FGTransactionID AND A.CompanyID=B.CompanyID AND A.VoucherID=-50 AND Isnull(A.IsDeletedTransaction,0)=0 Where A.SemiPackingMainID=SPD.SemiPackingMainID AND A.JobBookingID=SPD.JobBookingID AND A.ProductMasterID=SPD.ProductMasterID AND A.CompanyID=SPD.CompanyID AND Isnull(A.IsDeletedTransaction,0)=0),0))>0"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------------------------  Processed List for QC Packing---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function ProcessedQCPacking() As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select DISTINCT FM.FGTransactionID,JBJ.JobBookingNo,JBJ.JobName,Isnull(FM.JobBookingID,0) AS JobBookingID,Isnull(FM.JobBookingJobCardContentsID,0) AS JobBookingJobCardContentsID,Isnull(FM.OrderBookingID,0) AS OrderBookingID,Isnull(FM.OrderBookingDetailsID,0) AS OrderBookingDetailsID,JBJ.LedgerID,  " &
              "  Isnull(FM.ProductMasterID,0) As ProductMasterID,Isnull(FM.MaxVoucherNo,0) As MaxVoucherNo,Nullif(FM.VoucherNo,'') as VoucherNo,Replace(Convert(Varchar(13),FM.VoucherDate,106),' ','-') AS VoucherDate,Isnull(FM.TotalOuterCarton,0) as TotalOuterCarton,Isnull(FM.TotalInnerCarton,0) as TotalInnerCarton,Isnull(FM.TotalQuantity,0) as TotalQuantity,Nullif(FM.FYear,'') as FYear  " &
              "  From FinishGoodsTransactionMain AS FM " &
              "  INNER JOIN JobBookingJobCard AS JBJ ON FM.JobBookingID=JBJ.JobBookingID And FM.CompanyID=JBJ.CompanyID And isnull(JBJ.IsDeletedTransaction,0)<>1  " &
              "  LEFT JOIN JobBookingJobCardContents AS JBJC ON FM.JobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID AND FM.CompanyID=JBJC.CompanyID  " &
              "  LEFT JOIN ProductMaster AS PM ON FM.ProductMasterID=PM.ProductMasterID And FM.CompanyID=PM.CompanyID  " &
              "  Where FM.VoucherID=-50 AND FM.CompanyID='" & GBLCompanyID & "' And isnull(FM.IsDeletedTransaction,0)<>1 Order By FYear,MaxVoucherNo Desc"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------------------------  Load Pending Semi Packing Details---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function LoadSemiPackingDetails(ByVal semiPackingID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select JSM.SemiPackingMainID,JSD.SemiPackingDetailID, JSD.JobBookingID,JSD.JobBookingJobCardContentsID,JSD.OrderBookingID,JSD.OrderBookingDetailsID,JSM.SemiPackingNo,JSM.SemiPackingDate,JOB.SalesOrderNo,JOB.OrderBookingDate,JBJ.JobBookingNo,JBJ.JobBookingDate,PM.ProductMasterCode,JBJ.JobName,JBJ.ProductCode,  " &
               "(JSD.OuterCarton-Isnull((Select Sum(Isnull(B.OuterCarton,0)) From FinishGoodsTransactionMain As A INNER JOIN FinishGoodsTransactionDetail As B On A.FGTransactionID=B.FGTransactionID And A.CompanyID=B.CompanyID Where A.VoucherID=-50  And A.CompanyID='" & GBLCompanyID & "' AND Isnull(B.IsDeletedTransaction,0)=0 AND B.SemiPackingDetailID=JSD.SemiPackingDetailID " &
               " AND B.JobBookingID=JSD.JobBookingID AND B.CompanyID=JSD.CompanyID),0)) AS OuterCarton,JSD.InnerCarton,JSD.QuantityPerPack,JSD.QuantityPerOuter,((JSD.OuterCarton-Isnull((Select Sum(Isnull(B.OuterCarton,0)) From FinishGoodsTransactionMain AS A INNER JOIN FinishGoodsTransactionDetail AS B ON A.FGTransactionID=B.FGTransactionID AND A.CompanyID=B.CompanyID Where A.VoucherID=-50  AND A.CompanyID='" & GBLCompanyID & "' AND Isnull(B.IsDeletedTransaction,0)=0 AND B.SemiPackingDetailID=JSD.SemiPackingDetailID " &
               " And B.JobBookingID=JSD.JobBookingID And B.CompanyID=JSD.CompanyID),0))*Isnull(JSD.InnerCarton,0)*Isnull(JSD.QuantityPerPack,0)) AS PackedQuantity,JSD.PackingDescription,JSD.PackingNarration " &
               " From JobSemiPackingMain AS JSM " &
               " INNER JOIN JobSemiPackingDetail AS JSD ON JSM.SemiPackingMainID=JSD.SemiPackingMainID And JSM.CompanyID=JSD.CompanyID " &
               " INNER JOIN JobBookingJobCard AS JBJ ON JBJ.JobBookingID=JSD.JobBookingID AND JBJ.CompanyID=JSD.CompanyID " &
               " INNER JOIN JobOrderBooking AS JOB ON JSD.OrderBookingID=JOB.OrderBookingID And JSD.CompanyID=JOB.CompanyID " &
               " LEFT JOIN ProductMaster AS PM ON JSD.ProductMasterID=PM.ProductMasterID AND JSD.CompanyID=PM.CompanyID " &
               " LEFT JOIN JobBookingJobCardContents AS JBJC ON JBJ.JobBookingID=JBJC.JobBookingID And JSD.JobBookingJobCardContentsID=JBJC.JobBookingJobCardContentsID And JBJ.CompanyID=JBJC.CompanyID " &
               " Where JSM.CompanyID='" & GBLCompanyID & "' AND (JSD.OuterCarton-Isnull((Select Sum(Isnull(B.OuterCarton,0)) From FinishGoodsTransactionMain AS A INNER JOIN FinishGoodsTransactionDetail AS B ON A.FGTransactionID=B.FGTransactionID AND A.CompanyID=B.CompanyID  " &
               " Where A.VoucherID=-50 And A.CompanyID='" & GBLCompanyID & "' AND Isnull(B.IsDeletedTransaction,0)=0 AND B.SemiPackingDetailID=JSD.SemiPackingDetailID " &
               " AND B.JobBookingID=JSD.JobBookingID AND B.CompanyID=JSD.CompanyID),0))>0 And JSM.SemiPackingMainID='" & semiPackingID & "' AND Isnull(JSD.IsDeletedTransaction,0)=0"

        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function

    '---------------------------------  Pending Retrive QC Packing---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function RetriveData(ByVal FGTransactionID As String) As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))

        str = "Select FGM.VoucherNo,replace(convert(nvarchar(30),FGM.VoucherDate,106),'','-') as VoucherDate,FGM.FGTransactionID,FGD.TransID,FGD.SemiPackingMainID,FGD.SemiPackingDetailID,FGD.JobBookingID,FGD.JobBookingJobCardContentsID,JBJ.ProductMasterID,JBJ.BookingID,FGD.OrderBookingID,FGD.OrderBookingDetailsID,FGD.WarehouseID,JBJ.JobBookingNo,Replace(Convert(Varchar(13),JBJ.JobBookingDate,106),' ','-') AS BookingDate,   Nullif(PM.ProductMasterCode,'') AS ProductMasterCode,Nullif(JBJ.ProductCode,'') AS ProductCode,Nullif(JBJ.JobName,'') AS JobName,Isnull(JBD.OrderQuantity,0 ) AS OrderQuantity,Isnull(JBJ.OrderQuantity,0 ) AS JobQuantity,Isnull(JBJ.OrderQuantity,0 ) AS JobQuantity,FGD.OuterCarton,FGD.InnerCarton,FGD.QuantityPerPack,FGD.ReceiptQuantity as PackedQuantity,Nullif(FGD.PackingDescription,'') As PackingDescription,Isnull(FGD.WeightPerOuterCarton,0) AS WeightPerOuter,(Isnull(FGD.QuantityPerPack,0)*Isnull(FGD.InnerCarton,0)) AS QuantityPerOuter,Isnull(FGD.TotalWeight,0) AS TotalWeight,Nullif(WHM.WarehouseName,'') AS WarehouseName,   Nullif(WHM.BinName,'') AS BinName,Nullif(FGM.Narration,'') AS Narration, Nullif(FGD.ShipperLengthCM,0) AS  CFCLength ,Nullif(FGD.ShipperWidthCM,0) AS   CFCWidth ,Nullif(FGD.ShipperHeightCM,0) AS   CFCHeight ,Nullif(FGD.CBCM ,0) AS  CBCM ,Nullif(FGD.CFT ,0) AS  CFT ,Nullif(FGD.TotalCFT ,0) AS  TotalCFT  ,(Select Sum(Isnull(PackedQuantity,0)) From JobSemiPackingDetail Where SemiPackingMainID=FGD.SemiPackingMainID AND CompanyID=FGD.CompanyID) AS SemiPackedQuantity,JBJ.LedgerID  " &
               " From FinishGoodsTransactionMain As FGM " &
               " INNER Join FinishGoodsTransactionDetail AS FGD ON FGD.FGTransactionID=FGM.FGTransactionID And FGM.CompanyID=FGD.CompanyID   " &
               " INNER Join JobBookingJobCard AS JBJ ON JBJ.JobBookingID=FGD.JobBookingID And JBJ.CompanyID=FGD.CompanyID     " &
               " INNER Join WarehouseMaster AS WHM ON WHM.WarehouseID=FGD.WarehouseID And WHM.CompanyID=FGD.CompanyID         " &
               " INNER Join JobOrderBookingDetails AS JBD ON JBD.OrderBookingID=JBJ.OrderBookingID And JBD.CompanyID=JBJ.CompanyID     " &
               " Left Join ProductMaster As PM On PM.ProductMasterID=JBJ.ProductMasterID And PM.CompanyID=FGD.CompanyID  " &
               " Where Isnull(FGM.FGTransactionID, 0)='" & FGTransactionID & "' and Isnull(FGM.IsDeletedTransaction,0)<>1 And FGM.CompanyID='" & GBLCompanyID & "'"
        db.FillDataTable(dataTable, str)
        data.Message = ConvertDataTableTojSonString(dataTable)
        js.MaxJsonLength = 2147483647
        Return js.Serialize(data.Message)
    End Function


    '---------------------------------  Generate Packing No---------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GeneratePackingVoucherNo() As String

        Dim MaxVoucherNo As Long
        Dim KeyField As String
        Dim Prefix As String = "FG"

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try
            KeyField = db.GeneratePrefixedNo("FinishGoodsTransactionMain", Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherPrefix='" & Prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND VoucherID = -50 AND Isnull(IsDeletedTransaction,0)=0")
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
            str = "Select DISTINCT Nullif(WarehouseName,'') AS Warehouse From WarehouseMaster Where WarehouseName <> '' AND WarehouseName IS NOT NULL  AND CompanyID=" & GBLCompanyID & "  Order By Nullif(WarehouseName,'')"
            db.FillDataTable(dataTable, str)
            data.Message = ConvertDataTableTojSonString(dataTable)
            Return js.Serialize(data.Message)
        Catch ex As Exception
            Return ex.Message
        End Try

    End Function

    ''----------------------------Open JobQCPacking  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function SaveJobQCPacking(ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim QCPackingNo As String
        Dim MaxVoucherNo As Long
        Dim KeyField, FGTransactionID As String
        Dim AddColName, AddColValue, TableName As String
        Dim Prefix As String = "FG"

        AddColName = ""
        AddColValue = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        If db.CheckAuthories("JobQcPacking.aspx", GBLUserID, GBLCompanyID, "CanSave") = False Then
            Return "You are not authorized to save"
        End If

        Try

            QCPackingNo = db.GeneratePrefixedNo("FinishGoodsTransactionMain", Prefix, "MaxVoucherNo", MaxVoucherNo, GBLFYear, " Where VoucherID = -50 And VoucherPrefix='" & Prefix & "' And  CompanyID=" & GBLCompanyID & " And FYear='" & GBLFYear & "' AND Isnull(IsDeletedTransaction,0)=0 ")

            Using UpdtTrans As New Transactions.TransactionScope
                TableName = "FinishGoodsTransactionMain"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,VoucherID,VoucherPrefix,MaxVoucherNo,VoucherNo"
                AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "',-50,'" & Prefix & "','" & MaxVoucherNo & "','" & QCPackingNo & "'"
                FGTransactionID = db.InsertDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, AddColValue)
                If IsNumeric(FGTransactionID) = False Then
                    UpdtTrans.Dispose()
                    Return "Error: " & FGTransactionID
                End If

                TableName = "FinishGoodsTransactionDetail"
                AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,FGTransactionID,ParentFGTransactionID"
                AddColValue = "'" & DateTime.Now & "',Getdate(),'" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & FGTransactionID & "','" & FGTransactionID & "'"
                str = db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)
                If IsNumeric(str) = False Then
                    UpdtTrans.Dispose()
                    Return "Error: " & str
                End If
                db.ExecuteNonSQLQuery("Update FinishGoodsTransactionDetail Set ParentFGTransactionDetailID=FGTransactionDetailID Where CompanyID=" & GBLCompanyID & " And FGTransactionID=" & FGTransactionID)

                UpdtTrans.Complete()
                KeyField = "Success"
            End Using

        Catch ex As Exception
            KeyField = "Error: " & ex.Message
        End Try
        Return KeyField

    End Function

    ''----------------------------Open JobQCPacking  Update Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function UpdateQCPacking(ByVal FGTransactionID As String, ByVal jsonObjectsRecordMain As Object, ByVal jsonObjectsRecordDetail As Object) As String

        Dim dt As New DataTable
        Dim KeyField As String
        Dim AddColName, wherecndtn, TableName, AddColValue As String
        AddColName = ""

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLUserName = Convert.ToString(HttpContext.Current.Session("UserName"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))
        GBLBranchID = Convert.ToString(HttpContext.Current.Session("BranchId"))

        If db.CheckAuthories("QcAndPacking.aspx", GBLUserID, GBLCompanyID, "CanEdit") = False Then
            Return "You are not authorized to update"
        End If

        Try
            Dim dtExist As New DataTable

            TableName = "FinishGoodsTransactionMain"
            AddColName = "ModifiedDate='" & DateTime.Now & "',UserID=" & GBLUserID & ",CompanyID=" & GBLCompanyID & ",FYear='" & GBLFYear & "',ModifiedBy='" & GBLUserID & "'"
            wherecndtn = "CompanyID=" & GBLCompanyID & " And FGTransactionID='" & FGTransactionID & "' "
            db.UpdateDatatableToDatabase(jsonObjectsRecordMain, TableName, AddColName, 0, wherecndtn)

            db.ExecuteNonSQLQuery("Delete from FinishGoodsTransactionDetail WHERE CompanyID='" & GBLCompanyID & "' and FGTransactionID='" & FGTransactionID & "' ")

            TableName = "FinishGoodsTransactionDetail"
            AddColName = "ModifiedDate,CreatedDate,UserID,CompanyID,FYear,CreatedBy,ModifiedBy,FGTransactionID,ParentFGTransactionID"
            AddColValue = "'" & DateTime.Now & "','" & DateTime.Now & "','" & GBLUserID & "','" & GBLCompanyID & "','" & GBLFYear & "','" & GBLUserID & "','" & GBLUserID & "','" & FGTransactionID & "','" & FGTransactionID & "'"
            db.InsertDatatableToDatabase(jsonObjectsRecordDetail, TableName, AddColName, AddColValue)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField
    End Function

    ''----------------------------Open JobQCPacking Delete  Save Data  ------------------------------------------
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function DeleteQCPacking(ByVal FGTransactionID As String) As String

        Dim KeyField As String

        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyID"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserID"))
        GBLFYear = Convert.ToString(HttpContext.Current.Session("FYear"))

        Try

            str = "Update FinishGoodsTransactionMain Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and FGTransactionID='" & FGTransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            str = "Update FinishGoodsTransactionDetail Set DeletedBy='" & GBLUserID & "',DeletedDate='" & DateTime.Now & "',IsDeletedTransaction=1  WHERE CompanyID='" & GBLCompanyID & "' and FGTransactionID='" & FGTransactionID & "'"
            db.ExecuteNonSQLQuery(str)

            KeyField = "Success"

        Catch ex As Exception
            KeyField = "fail"
        End Try
        Return KeyField

    End Function


    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class