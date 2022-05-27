Imports System.Data
Imports System.Data.SqlClient
Imports Microsoft.Reporting.WebForms
Imports Connection

Partial Class PrintMachineWiseSchedule
    Inherits System.Web.UI.Page
    Dim GBLCompanyID As String
    Dim db As New DBConnection

    Private Sub form1_Load(sender As Object, e As EventArgs) Handles form1.Load
        If Not IsPostBack Then
            GBLCompanyID = Convert.ToString(HttpContext.Current.Session("CompanyId"))
            ShowData()
        End If
    End Sub

    Public Sub ShowData()
        Dim dtmain As New DataTable
        dtmain = getData("SELECT JSRM.ScheduleID, Replace(Convert(nvarchar(30),JC.DeliveryDate ,106),'','-') As DeliveryDate, JSRM.JobBookingJobcardContentsID, JSRM.MachineSpeed, JSR.RateFactor, JSRM.JCFormNo As JobCardFormNo, JSRM.RefNo, JSRM.ScheduleQty, JSRM.TransID, JSRM.ProcessID, JSRM.MachineID, JSRM.StartTime, JSRM.EndTime, JSRM.TotalTimeToBeTaken As TotalTime, JSRM.ScheduleDate, MM.MachineName,Case When Isnull(JSR.RateFactor,'')='' Then PM.ProcessName Else PM.ProcessName+'('+JSR.RateFactor+')' End As ProcessName, JC.JobName, JC.JobBookingNo, JC.ClientName, LM.LedgerName, JCC.JobCardContentNo , JCC.JobPriority,JCC.PlanContName As ContentName " &
                        "FROM LedgerMaster AS LM INNER JOIN JobBookingJobCard AS JC ON JC.LedgerID = LM.LedgerID AND LM.CompanyID = JC.CompanyID INNER JOIN JobBookingJobCardContents AS JCC ON JC.JobBookingID = JCC.JobBookingID AND JC.CompanyID = JCC.CompanyID INNER JOIN JobScheduleReleaseMachineWiseTemp AS JSRM  ON JCC.JobBookingJobcardContentsID = JSRM.JobBookingJobcardContentsID AND JCC.CompanyID = JSRM.CompanyID INNER JOIN JobScheduleRelease AS JSR ON JSR.ScheduleID = JSRM.ScheduleID AND JSR.CompanyID = JSRM.CompanyID AND JSRM.ProcessID = JSR.ProcessID And Isnull(JSR.Status,'In Queue')='In Queue' INNER JOIN MachineMaster AS MM ON JSRM.MachineID = MM.MachineId AND JSRM.CompanyID = MM.CompanyID INNER JOIN ProcessMaster AS PM ON JSRM.ProcessID = PM.ProcessID AND JSRM.CompanyID = PM.CompanyID Where JC.CompanyID=" & GBLCompanyID & " AND (ISNULL(JSR.IsDeletedTransaction, 0) = 0) Order By JSRM.MachineID,JSRM.TransID")
        'reset
        ReportViewer1.Reset()
        'path
        ReportViewer1.LocalReport.ReportPath = Server.MapPath("~/MachineWiseScheduleReport.rdlc")
        'dataSource
        Dim MachineWiseScheduleData As ReportDataSource = New ReportDataSource("MachineWiseSchedule", dtmain)
        ReportViewer1.LocalReport.DataSources.Add(MachineWiseScheduleData)
        'refresh
        ReportViewer1.LocalReport.Refresh()
    End Sub

    Private Function getData(query As String) As DataTable
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
End Class
