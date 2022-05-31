﻿Imports System.Configuration
Imports System.Data
Imports System.Web.Configuration
Imports System.Web.Services
Imports Connection

Partial Class MasterPage_Main
    Inherits System.Web.UI.MasterPage
    Dim db As New DBConnection


    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load

        'Response.Cache.SetCacheability(HttpCacheability.NoCache)
        '  If Not Me.IsPostBack Then
        '' Session("Reset") = True
        '' Dim config As Configuration = WebConfigurationManager.OpenWebConfiguration("~/Web.Config")
        '' Dim section As SessionStateSection = DirectCast(config.GetSection("system.web/sessionState"), SessionStateSection)
        '' Dim timeout As Integer = CInt(section.Timeout.TotalMinutes) * 1000 * 60
        'Dim timeout As Integer = 1 * 1000 * 60
        '' Page.ClientScript.RegisterStartupScript(Me.GetType(), "SessionAlert", "SessionExpireAlert(" & timeout & ");", True)
        '  Session("Reset") = True
        'Dim timeout As Integer = GetSessionTimeout()
        '' Page.ClientScript.RegisterStartupScript(Me.[GetType](), "SessionAlert", "SessionExpireAlert(" & timeout & ");", True)
        'Page.ClientScript.RegisterStartupScript(Me.GetType(), "SessionAlert", "SessionExpireAlert(" & timeout & ");", True)

        ' End If

        Dim str As String = ""
        Dim UserId As String = Convert.ToString(Session("UserID"))
        Dim BranchId As String = Convert.ToString(Session("BranchId"))
        Dim CompanyId As String = Convert.ToString(Session("CompanyId"))
        Dim UserName As String = Convert.ToString(Session("UserName"))
        Dim FYear As String = Convert.ToString(Session("FYear"))
        Dim lblCompanyName As String = Convert.ToString(Session("CompanyName"))

        UName.InnerText = UserName
        CompanyName.InnerText = lblCompanyName

        If UserId = "" Then
            ReadCookie()
            'Session.Remove("UserID")
            'Response.ClearHeaders()
            'Response.AddHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
            'Response.AddHeader("Pragma", "no-cache")
            'Response.Redirect("Login.aspx")
        Else
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
                If currentPageName <> "Home.aspx" Then
                    str = "Select Isnull(CanView,'False') As Action,MM.ModuleID,MM.ModuleDisplayName From UserModuleAuthentication As A Inner Join ModuleMaster As MM On MM.ModuleID=A.ModuleID And MM.CompanyID=A.CompanyID Where Isnull(A.IsDeletedTransaction,0)=0 And A.UserID=" & UserId & " And MM.ModuleName='" & currentPageName & "' And A.CompanyID=" & CompanyId
                    db.FillDataTable(DT, str)

                    If DT.Rows.Count > 0 Then
                        ModuleID = DT.Rows(0)("ModuleID")
                        'If db.IsDeletable("ModuleID", "UserTransactionLogs", " Where ModuleID=" & ModuleID & " And SessionID='" & Session("SessionID") & "'") = False Then
                        '    ScriptManager.RegisterStartupScript(Me, Me.GetType(), "Close_Window", "window.close();", True)
                        'End If

                        If DT.Rows(0)("Action") = False And Request.Url.ToString().Contains("localhost") = False Then
                            Response.Redirect(previousPageName)
                        End If
                        Page.Title = DT.Rows(0)("ModuleDisplayName")
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
            db.ExecuteNonSQLQuery("Update UserLoginInfo Set LogOutTime=Getdate() Where UserID=" & Session("UserID") & " And CompanyID=" & Session("CompanyID") & "  And SessionID='" & Session("SessionID") & "'")

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
            Session("Con_String") = ""
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

    'Private Sub ButtonHome_Click(sender As Object, e As EventArgs) Handles ButtonHome.Click
    '    Dim currentPageName As String = Request.Url.Segments((Request.Url.Segments.Length - 1))
    '    If currentPageName <> "Home.aspx" And Session("CompanyID") <> "" Then
    '        db.ExecuteNonSQLQuery("Update UserModuleAuthentication Set IsHomePage=0 Where UserID=" & Session("UserID") & " And CompanyID=" & Session("CompanyID"))
    '        db.ExecuteNonSQLQuery("Update UserModuleAuthentication Set IsHomePage=1 Where ModuleID =(Select ModuleID From ModuleMaster Where ModuleName ='" & currentPageName & "') And UserID=" & Session("UserID") & " And CompanyID=" & Session("CompanyID"))
    '    End If
    'End Sub    
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

