Imports System.Data
Imports System.Configuration
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection
Imports System.Net.Mail
Imports System.Net

Partial Class ReportQuotation
    Inherits System.Web.UI.Page
    Dim db As New DBConnection
    Dim GBLCompanyID, GBLUserID, GblBookingNo As String

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack Then
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            GBLUserID = Convert.ToString(HttpContext.Current.Session("UserId"))
            If (db.CheckAuthories("DYnamicQty.aspx", GBLUserID, GBLCompanyID, "CanPrint", GblBookingNo) = False) Then
                MailError.InnerHtml = "You are not authorized to print..!, Can't Print"
                Exit Sub
            End If

            ShowData()
        End If
    End Sub

    Public Sub ShowData()
        Dim BookingID As String
        BookingID = Convert.ToString(HttpContext.Current.Request.QueryString("BookingID"))

        Dim QuoteDetails As New DataTable
        QuoteDetails = GetData("Select JE.BookingID,JE.ConcernPerson,JE.MailingName,JE.EmailSubject,JE.MailingAddress,JE.EmailBody,JE.EmailTo,CCM.CINNo,CCM.ContactNO,CCM.GSTIN,Case When Isnull(JE.Designation,'') ='' Then UM.Designation Else JE.Designation End As Designation,Case When Isnull(JE.QuoteByUser,'')='' Then UM.UserName Else JE.QuoteByUser End As UserName,UM.ContactNo As UserContactNo,Nullif(JE.ProductCode,'') As ProductCode,JE.BookingNo,Replace(Convert(Nvarchar(30), JE.CreatedDate, 106),' ','-') as Job_Date,LM.LedgerName As LedgerName,  " &
                                " Case When Isnull(JE.MailingAddress,'')='' Then LM.MailingAddress Else JE.MailingAddress End As Address, JE.JobName ,CCM.CompanyName,nullif(JE.Remark,'') as Remark,nullif(JE.HeaderText,'') as HeaderText,nullif(JE.FooterText,'') as FooterText,IsNull(JE.ProcessContentRemarks,'') As ProcessContentRemarks,Isnull(CCM.PictureQuotationPath,'') As PictureQuotationPath " &
                                " From JobBooking As JE Inner Join LedgerMaster as LM On LM.LedgerID=JE.LedgerID  " &
                                " Inner Join CompanyMaster As CCM On JE.CompanyId=CCM.CompanyID Inner Join UserMaster As UM On JE.QuotedByUserID=UM.UserID And JE.CompanyID=UM.CompanyID And Isnull(UM.IsBlocked,0)=0 " &
                                " Where JE.BookingID = '" & BookingID & "' And JE.CompanyId ='" & GBLCompanyID & "'")
        ''fill mail details
        TxtSubject.Value = QuoteDetails.Rows(0)("EmailSubject")
        TxtEmailBody.Value = QuoteDetails.Rows(0)("EmailBody")
        TxtEmailTo.Value = QuoteDetails.Rows(0)("EmailTo")
        GblBookingNo = QuoteDetails.Rows(0)("BookingNo")
        ''

        ReportViewer1.Reset()
        ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/QuoteMain.rdlc")
        'dataSource
        Dim QD As ReportDataSource = New ReportDataSource("QuotationDetails", QuoteDetails)
        ReportViewer1.LocalReport.DataSources.Add(QD)

        If QuoteDetails(0)("PictureQuotationPath") = "" Then
            QuoteDetails(0)("PictureQuotationPath") = Server.MapPath("~/images/ProfileBackground.jpeg")
        End If
        ReportViewer1.LocalReport.EnableExternalImages = True
        Dim imagePath As String = New Uri(QuoteDetails(0)("PictureQuotationPath")).AbsoluteUri
        Dim parameter As New ReportParameter("ImagePath", imagePath)
        ReportViewer1.LocalReport.SetParameters(parameter)
        ReportViewer1.LocalReport.Refresh()

        ' ProductDetail
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf ProductDetailSubreportProcessing
        'PriceDetail
        AddHandler ReportViewer1.LocalReport.SubreportProcessing, AddressOf PriceDetailSubreportProcessing
    End Sub

    Private Sub ProductDetailSubreportProcessing(ByVal sender As Object, ByVal e As SubreportProcessingEventArgs)
        Dim BookingID As Integer = e.Parameters("BookingID").Values(0)
        Dim LclContIDStr = ""
        Dim ContIDStr = Convert.ToString(HttpContext.Current.Request.QueryString("ContStr"))
        Dim ContHide = Convert.ToString(HttpContext.Current.Request.QueryString("ContHide"))
        If ContIDStr <> "" And ContIDStr <> Nothing Then LclContIDStr = "And JEC.PlanContName IN(" & ContIDStr & ") "
        If ContHide = "true" Or ContHide = True Then LclContIDStr = "And JEC.PlanContName IN('') "

        Dim ProductDetail As New DataTable
        ProductDetail = GetData("Select Distinct JEC.BookingID,Convert(nvarchar(max),JEC.PlanContName) as Content_Name,  Stuff((Select ', '+ ProcessName From ProcessMaster Where ProcessID In   " &
                                "(Select ProcessID From JobBookingProcess  Where BookingID=JEO.BookingID And ContentsID=JEO.ContentsID And PlanContQty = JEO.PlanContQty And Isnull(IsDisplay,0)=1) For XML PATH('')),1,2,'') AS Operatios ,  Case When Isnull(VCS.JobPrePlan,'')<>'' Then Replace(Replace(Replace(VCS.JobPrePlan,'O:','OF:'),'P:','PF:'),'B:','BF:') Else 'H:'+VCS.SizeHeight+', L:'+VCS.SizeLength+', W:' +VCS.SizeWidth+', OF:'+VCS.SizeOpenflap+', PF:'+VCS.SizePastingflap+', BF:'+ VCS.SizeBottomflap+', Pages:'+VCS.JobNoOfPages End As Job_Size, 'F:'+VCS.PlanFColor + ' / ' +'B:'+VCS.PlanBColor As Printing,'Quality:'+VCS.ItemPlanQuality+', GSM:'+ VCS.ItemPlanGsm As Paper  " &
                                "  From JobBooking As JB Inner Join JobBookingContents As JEC On JB.BookingID = JEC.BookingID And JB.CompanyID=JEC.CompanyID     " &
                                "  Inner Join ViewJobBookingContents As VCS On VCS.JobContentsID=JEC.JobContentsID Inner Join JobBookingCostings As JCO On JCO.BookingID = JEC.BookingID And JCO.PlanContQty = JEC.PlanContQty And JCO.CompanyID=JEC.CompanyID     " &
                                "  Left Join JobBookingProcess As JEO On JEO.ContentsID = JEC.JobContentsID And JEC.PlanContQty = JEO.PlanContQty And JEO.CompanyID=JEC.CompanyID     " &
                                "  And VCS.BookingID=JEC.BookingID And VCS.CompanyID=JEC.CompanyID  Where JEC.BookingID In(" & BookingID & ") " & LclContIDStr & " And JEC.CompanyId = '" & GBLCompanyID & "'")

        Dim datasource As ReportDataSource = New ReportDataSource("ProductDetails", ProductDetail)
        e.DataSources.Add(datasource)
    End Sub

    Private Sub PriceDetailSubreportProcessing(ByVal sender As Object, ByVal k As SubreportProcessingEventArgs)
        Dim BookingID As Integer = k.Parameters("BookingID").Values(0)
        Dim LclQtyStr = ""
        Dim QtyStr = Convert.ToString(HttpContext.Current.Request.QueryString("QtyStr"))
        If QtyStr <> "" And QtyStr <> Nothing Then LclQtyStr = "And JEC.PlanContQty IN(" & QtyStr & ") "

        Dim PriceDetail As DataTable = GetData("Select Distinct JEC.BookingID ,Nullif(JB.ProductCode,'') As ProductCode,JB.BookingNo,JCO.GrandTotalCost As FinalCost ,JEC.PlanContQty,JCO.UnitCost,JCO.UnitCost1000,JB.TypeOfCost,Cast(JCO.QuotedCost AS Nvarchar(50))+' '+Isnull(JCO.CurrencySymbol,'INR') As QuotedCost,JB.JobName,Replace(Convert(Nvarchar(30), JB.CreatedDate, 106),' ','-') as Job_Date From JobBooking As JB Inner Join JobBookingContents As JEC On JB.BookingID = JEC.BookingID And JB.CompanyID=JEC.CompanyID     " &
                                               " Inner Join ViewJobBookingContents As VCS On VCS.JobContentsID=JEC.JobContentsID Inner Join JobBookingCostings As JCO On JCO.BookingID = JEC.BookingID And JCO.PlanContQty = JEC.PlanContQty And JCO.CompanyID=JEC.CompanyID     " &
                                               " Left Join JobBookingProcess As JEO On JEO.ContentsID = JEC.JobContentsID And JEC.PlanContQty = JEO.PlanContQty And JEO.CompanyID=JEC.CompanyID     " &
                                               " And VCS.BookingID=JEC.BookingID and VCS.CompanyID=JEC.CompanyID  Where JEC.BookingID In(" & BookingID & ") " & LclQtyStr & " And JEC.CompanyId = '" & GBLCompanyID & "'")

        Dim datasource As ReportDataSource = New ReportDataSource("PriceDetails", PriceDetail)
        k.DataSources.Add(datasource)
    End Sub

    Private Function GetData(query As String) As DataTable
        Dim con As New SqlConnection
        Dim dss As DataSet = New DataSet()
        Dim sql As String = ""
        Dim dt As New DataTable
        Try
            con = db.OpenDataBase()
            sql = query
            Dim cmd As SqlCommand = New SqlCommand(sql, con)
            Dim adapter As New SqlDataAdapter(cmd)
            adapter.Fill(dt)
            con.Close()
            Return dt
        Catch ex As Exception
            Return dt
        End Try
    End Function

    Protected Sub Email(ByVal sender As Object, ByVal e As EventArgs)
        MailError.InnerHtml = ""
        Dim BookingID As String
        BookingID = Convert.ToString(HttpContext.Current.Request.QueryString("BookingID"))
        GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
        GBLUserID = Convert.ToString(HttpContext.Current.Session("UserId"))
        If BookingID <= 0 Or GBLCompanyID <= 0 Or GBLUserID <= 0 Then Exit Sub
        If (db.CheckAuthories("DYnamicQty.aspx", GBLUserID, GBLCompanyID, "CanPrint", BookingID) = False) Then
            MailError.InnerHtml = "You are not authorized to print..!, Can't Print"
            Exit Sub
        End If

        Dim DtUser As New DataTable
        db.FillDataTable(DtUser, "SELECT Distinct IsnuLL(Nullif(EmailID,''),smtpUserName) As smtpUserID,  Isnull(smtpUserPassword,'') As smtpUserPassword,  Isnull(smtpServer,'smtp.gmail.com') As smtpServer,  Isnull(smtpServerPort,'587') As smtpServerPort,  Isnull(smtpAuthenticate,'True') As smtpAuthenticate,  Isnull(smtpUseSSL,'True') As smtpUseSSL FROM UserMaster Where Isnull(IsBlocked,0)=0 And IsnuLL(IsHidden,0)=0 And ISNULL(IsDeletedUser,0)=0 And CompanyID=" & GBLCompanyID & " And UserID=" & GBLUserID)
        If DtUser.Rows.Count <= 0 Then MailError.InnerHtml = "Invalid user details" : Exit Sub
        If DtUser.Rows(0)("smtpUserID") = "" Or DtUser.Rows(0)("smtpUserID").contains("@") = False Then
            MailError.InnerHtml = "Invalid sender mail id, Please update mail id in user master"
            Exit Sub
        End If
        Try
            Dim mm As MailMessage = New MailMessage(DtUser.Rows(0)("smtpUserID").ToString(), TxtEmailTo.Value.ToString()) With {
                .Subject = TxtSubject.Value.ToString(),
                .Body = TxtEmailBody.Value.ToString()
            }
            mm.Attachments.Add(New Attachment(ExportReportToPDF(Server.MapPath("~/Files/"), "Quote " & BookingID & ".pdf")))
            mm.IsBodyHtml = True
            mm.Priority = MailPriority.High
            If TxtEmailCC.Value.ToString() <> "" And TxtEmailCC.Value.Contains("@") = True Then
                mm.CC.Add(TxtEmailCC.Value.ToString())
            End If
            If TxtEmailBcc.Value.ToString() <> "" And TxtEmailBcc.Value.Contains("@") = True Then
                mm.Bcc.Add(TxtEmailBcc.Value.ToString())
            End If

            Dim credential As NetworkCredential = New NetworkCredential With {
                .UserName = DtUser.Rows(0)("smtpUserID").ToString(),
                .Password = DtUser.Rows(0)("smtpUserPassword").ToString()
            }

            Dim smtp As SmtpClient = New SmtpClient With {
                .Host = DtUser.Rows(0)("smtpServer").ToString(),
                .Credentials = credential,
                .Port = DtUser.Rows(0)("smtpServerPort").ToString(),
                .EnableSsl = DtUser.Rows(0)("smtpUseSSL").ToString()
                }
            smtp.Send(mm)

            'Dim PlanWindow As New WebServicePlanWindow
            'MailError.InnerHtml = PlanWindow.SubmitMail(mm)
            MailError.InnerHtml = "Email Send Successfully"
            db.ExecuteNonSQLQuery("Update JobBooking set IsMailSent=1 Where BookingID=" & BookingID & " And CompanyId =" & GBLCompanyID)
        Catch ex As Exception
            'MsgBox(ex.Message)
            MailError.InnerHtml = ex.Message
        End Try
    End Sub

    Private Function ExportReportToPDF(ByVal path As String, ByVal reportName As String) As String
        Dim warnings As Warning()
        Dim streamids As String()
        Dim mimeType As String = ""
        Dim encoding As String = ""
        Dim filenameExtension As String = ""
        Dim bytes As Byte() = ReportViewer1.LocalReport.Render("PDF", Nothing, mimeType, encoding, filenameExtension, streamids, warnings)
        Dim filename As String = path & reportName

        Using fs = New System.IO.FileStream(filename, System.IO.FileMode.Create)
            fs.Write(bytes, 0, bytes.Length)
            fs.Close()
        End Using

        Return filename
    End Function
End Class
