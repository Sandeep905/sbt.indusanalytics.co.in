
Imports System.Data
Imports Connection

Partial Class MasterPageMIS
    Inherits System.Web.UI.MasterPage
    Dim db As New DBConnection

    Private Sub FormMIS_Load(sender As Object, e As EventArgs) Handles FormMIS.Load
        Dim lblCompanyName As String = Convert.ToString(Session("CompanyName"))
        Dim UserId As String = Convert.ToString(Session("UserID"))
        Dim UserName As String = Convert.ToString(Session("UserName"))
        Dim CompanyID As String = Convert.ToString(Session("CompanyID"))

        If UserId = "" Then
            Session.Remove("UserID")
            Response.ClearHeaders()
            Response.AddHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
            Response.AddHeader("Pragma", "no-cache")
            Response.Redirect("Login.aspx")
        Else
            CompanyName.InnerText = lblCompanyName
            CompanyName.Title = lblCompanyName
            UName.InnerText = UserName

            If Not Me.IsPostBack Then
                'Get the Current Page Name.
                Dim currentPageName As String = Request.Url.Segments((Request.Url.Segments.Length - 1))
                Page.Title = currentPageName
                Dim previousPageName As String = "Home.aspx"
                'Get the Previous Page Name.
                If (Not (Request.UrlReferrer) Is Nothing) Then
                    previousPageName = Request.UrlReferrer.Segments((Request.UrlReferrer.Segments.Length - 1))
                End If

                Dim DT As New DataTable
                Dim ModuleID As Integer

                Dim Str As String
                Str = "Select Isnull(CanView,'False') As Action,MM.ModuleID,MM.ModuleDisplayName From UserModuleAuthentication As A Inner Join ModuleMaster As MM On MM.ModuleID=A.ModuleID And MM.CompanyID=A.CompanyID Where Isnull(A.IsDeletedTransaction,0)=0 And A.UserID=" & UserId & " And MM.ModuleName='" & currentPageName & "' And A.CompanyID=" & CompanyID
                db.FillDataTable(DT, Str)
                If DT.Rows.Count > 0 Then
                    If DT.Rows(0)("Action") = False And Request.Url.ToString().Contains("localhost") = False Then
                        Response.Redirect(previousPageName)
                    End If
                    Page.Title = DT.Rows(0)("ModuleDisplayName")
                    ModuleID = DT.Rows(0)("ModuleID")
                    db.ExecuteNonSQLQuery("Insert Into UserTransactionLogs( ModuleID, ModuleName, Details, RecordID, RecordName, ActionType, UserID, CompanyID, CreatedDate) Values(" & ModuleID & ",'" & currentPageName & "','" & currentPageName & ":CanView performed',0,'','CanView'," & UserId & "," & CompanyID & ",Getdate())")
                Else
                    Response.Redirect(previousPageName)
                End If
            End If

        End If
    End Sub

    Protected Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        Try
            db.ExecuteNonSQLQuery("Update UserLoginInfo Set LogOutTime=Getdate() Where UserID=" & Session("UserID") & " And CompanyID=" & Session("CompanyID") & "  And SessionID=" & Session("SessionID") & "")

            Session.Clear()
            Session.Abandon()
            Response.Cache.SetExpires(Date.UtcNow.AddSeconds(-1))
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Response.Cache.SetNoStore()

            Session.Abandon()
            FormsAuthentication.SignOut()    ' not neccessory to write this line
            Response.Cache.SetCacheability(HttpCacheability.NoCache)
            Response.Buffer = True
            Response.ExpiresAbsolute = DateAndTime.Now.AddDays(-1D)   ' not neccessory to write this line
            Response.Expires = -1000
            Response.CacheControl = "no-cache"
            Response.Redirect("Login.aspx", True)

        Catch ex As Exception
            Response.Write(ex.Message)
        End Try
        Response.Redirect("~/Login.aspx")
    End Sub

End Class

