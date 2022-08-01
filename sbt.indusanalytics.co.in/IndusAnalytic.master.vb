
Imports System.Data
Imports Connection

Partial Class IndusAnalytic
    Inherits System.Web.UI.MasterPage
    Dim db As New DBConnection

    Private Sub form1_Load(sender As Object, e As EventArgs) Handles form1.Load
        Dim UserId As String = Convert.ToString(Session("UserID"))

        If UserId = "" Then
            ReadCookie()
            'Session.Remove("UserID")
            'Response.ClearHeaders()
            'Response.AddHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
            'Response.AddHeader("Pragma", "no-cache")
            'Response.Redirect("Login.aspx")
        Else
            Dim UserName As String = Convert.ToString(Session("UserName"))
            Dim CompanyId As String = Convert.ToString(Session("CompanyId"))
            Dim lblCompanyName As String = Convert.ToString(Session("CompanyName"))

            CompanyName.InnerText = lblCompanyName
            CompanyName.Title = lblCompanyName
            UName.InnerText = UserName
            If Not Me.IsPostBack Then
                'Get the Current Page Name.
                Dim currentPageName As String = Request.Url.Segments((Request.Url.Segments.Length - 1))
                'Page.Title = currentPageName
                Dim previousPageName As String = "Home.aspx"
                'Get the Previous Page Name.
                If (Not (Request.UrlReferrer) Is Nothing) Then
                    previousPageName = Request.UrlReferrer.Segments((Request.UrlReferrer.Segments.Length - 1))
                End If

                Dim DT As New DataTable
                Dim ModuleID As Integer
                If currentPageName <> "Home.aspx" Then
                    Dim Str = "Select Isnull(CanView,'False') As Action,MM.ModuleID,MM.ModuleDisplayName,(Select Top 1 ModuleID From UserTransactionLogs) From UserModuleAuthentication As A Inner Join ModuleMaster As MM On MM.ModuleID=A.ModuleID And MM.CompanyID=A.CompanyID Where Isnull(A.IsDeletedTransaction,0)=0 And A.UserID=" & UserId & " And MM.ModuleName='" & currentPageName & "' And A.CompanyID=" & CompanyId
                    db.FillDataTable(DT, Str)

                    If DT.Rows.Count > 0 Then
                        ModuleID = DT.Rows(0)("ModuleID")
                        'If db.IsDeletable("ModuleID", "UserTransactionLogs", " Where ModuleID=" & ModuleID & " And SessionID='" & Session("SessionID") & "'") = False Then
                        '    ScriptManager.RegisterStartupScript(Me, Me.GetType(), "Close_Window", "window.close();", True)
                        'End If

                        If DT.Rows(0)("Action") = False Then
                            Response.Redirect(previousPageName)
                        End If
                        'Page.Title = DT.Rows(0)("ModuleDisplayName")
                        db.ExecuteNonSQLQuery("Insert Into UserTransactionLogs( ModuleID, ModuleName, Details, RecordID, RecordName, ActionType, UserID, CompanyID, CreatedDate,SessionID) Values(" & ModuleID & ",'" & currentPageName & "','" & currentPageName & ":CanView performed',0,'','CanView'," & UserId & "," & CompanyId & ",Getdate(),'" & Session("SessionID") & "')")
                    Else
                        Response.Redirect(previousPageName)
                    End If
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

            'Set the Expiry date.
            Dim nameCookie As New HttpCookie("StrgSessionState") With {
                .Expires = DateAndTime.Now.AddDays(-1)
            }
            'Add the Cookie to Browser.
            Response.Cookies.Add(nameCookie)

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

    Protected Sub ReadCookie()
        'Fetch the Cookie using its Key.
        Dim nameCookie As HttpCookie = Request.Cookies("StrgSessionState")

        'If Cookie exists fetch its value.
        Try
            Session("UserName") = nameCookie.Item("UserName").ToString()
            Session("CompanyID") = nameCookie.Item("CompanyID").ToString()
            Session("VendorID") = nameCookie.Item("VendorID").ToString()
            Session("UserID") = nameCookie.Item("UserID").ToString()
            Session("FYear") = nameCookie.Item("FYear").ToString()
            Session("Version") = nameCookie.Item("Version").ToString()
            Session("CompanyName") = nameCookie.Item("CompanyName").ToString()
            Session("ReportFYear") = nameCookie.Item("ReportFYear").ToString()
        Catch ex As Exception
            Response.Redirect("Login.aspx")
        End Try
    End Sub

End Class

