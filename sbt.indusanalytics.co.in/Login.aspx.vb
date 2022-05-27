Imports System.Data
Imports Connection

Partial Class Login
    Inherits System.Web.UI.Page
    Dim db As New DBConnection

    Private Sub btnlogin_Click(sender As Object, e As EventArgs) Handles btnlogin.Click
        Dim user As String = Request.Form("txt_user")
        Dim pass As String = Request.Form("txt_password")
        Dim userFieldName As String = ""
        If Trim(user) = "" Then
            ' MsgBox("Please enter user name")
            Exit Sub
        End If
        If Trim(pass) = "" Then
            ' MsgBox("Please enter password name")
            'Exit Sub
        End If
        validateMsg.Visible = False

        If (Trim(user).Length <> 10) And IsNumeric(user) = True Then
            validateMsg.InnerHtml = "You have entered incorrect mobile number."
            validateMsg.Visible = True
            Exit Sub
        ElseIf Trim(user).Length = 10 And IsNumeric(user) = True Then
            userFieldName = " UA.ContactNo"
        End If

        If userFieldName = "" Then
            Dim pattern As String = "^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$"
            Dim emailAddressMatch As Match = Regex.Match(user, pattern)
            If emailAddressMatch.Success Then
                userFieldName = " UA.EmailID"
            Else
                validateMsg.InnerHtml = "You have entered incorrect email id."
                validateMsg.Visible = True
                Exit Sub
            End If
        End If

        Dim Version As String = "New"
        Dim str As String = ""
        Dim dt As New DataTable

        Try

            'strIPAddress = System.Net.Dns.GetHostByName(strHostName).AddressList(0).ToString()
            str = "Select UA.UserID,UA.UserName,UA.FYear,UA.CompanyID,CCM.CompanyName,CCM.IsVerifiedMail,UA.VendorID,/*(Select Distinct DATEDIFF(DAY,GETDATE(),PaymentDueDate) From CompanySubscriptionStatusDetail Where CompanyID=UA.CompanyID) As PaymentDueDays,*/(Select Top 1 ModuleName from UserModuleAuthentication Where UserID=UA.UserID And CompanyID=UA.CompanyID And Isnull(CanView,0)=1 And Isnull(IsHomePage,0)=1) As HomePage FROM UserMaster as UA Inner Join CompanyMaster as CCM on UA.CompanyID=CCM.CompanyID Where Isnull(UA.IsBlocked,0)=0 And Isnull(UA.Password,'')='" & db.ChangePassword(Trim(pass)) & "' And " & userFieldName & "='" & Trim(user) & "' "

            db.FillDataTable(dt, str)
            If dt.Rows.Count > 0 Then
                If dt.Rows(0)("IsVerifiedMail") = 0 Then
                    validateMsg.InnerHtml = "Account is not verified. Please check your mail inbox and activate your account."
                    validateMsg.Visible = True
                    Exit Sub
                    'ElseIf iif(IsDBNull(dt.Rows(0)("PaymentDueDays")), 0, dt.Rows(0)("PaymentDueDays")) <= 0 Then
                    '    validateMsg.InnerHtml = "Subscription expired. Please contact administrator."
                    '    validateMsg.Visible = True
                    '    Response.Redirect("PaymentPage.html")
                    '    Exit Sub
                End If

                Session("UserID") = dt.Rows(0)("UserID").ToString
                Session("UserName") = dt.Rows(0)("UserName").ToString
                Session("FYear") = dt.Rows(0)("FYear").ToString
                Session("ReportFYear") = dt.Rows(0)("FYear").ToString
                Session("CompanyID") = dt.Rows(0)("CompanyID").ToString
                Session("VendorID") = dt.Rows(0)("VendorID").ToString
                Session("CompanyName") = dt.Rows(0)("CompanyName").ToString

                Session("Version") = Version
                System.Configuration.ConfigurationManager.AppSettings("CompanyName") = Session("CompanyName")
                Session("SessionID") = Session.SessionID
                WriteCookie()

                Dim formURL As String
                formURL = dt.Rows(0)("HomePage").ToString
                If formURL = "" Then formURL = "Home.aspx"

                Dim ip = Request.UserHostAddress
                Dim hostname = Request.UserHostName

                db.ExecuteNonSQLQuery("Insert Into UserLoginInfo([MachineID], [MachineName], UserID, CompanyID,Narration,SessionID) Values('" & ip & "','" & hostname & "'," & Session("UserID") & "," & Session("CompanyID") & ",'" & Request.Url.AbsoluteUri & "','" & Session("SessionID") & "')")

                Response.Redirect(formURL)
                'Response.Redirect("BookingPanel.aspx")
            Else
                validateMsg.InnerHtml = "You have entered incorrect username or password."
                validateMsg.Visible = True
            End If

        Catch ex As Exception
            ClientScript.RegisterStartupScript(Page.[GetType](), "validation", "<script language='javascript'>alert(" & ex.Message & ")</script>")
        End Try
    End Sub

    Private Sub form1_Load(sender As Object, e As EventArgs) Handles form1.Load

        If Request.QueryString("action") = "logout" Then
            Session.Clear()
            Session.Abandon()
            Session.RemoveAll()
            'Set the Expiry date.
            Dim nameCookie As New HttpCookie("StrgSessionState") With {
                .Expires = DateAndTime.Now.AddDays(-1)
            }
            'Add the Cookie to Browser.
            Response.Cookies.Add(nameCookie)

            Response.Redirect("Login.aspx")
        End If
        If IsPostBack = False Then
            Try
                If Request.Cookies.Count <= 2 Then
                    Exit Sub
                End If
                If IsNothing(Request.Cookies("userid")) = False Then
                    txt_user.Value = Request.Cookies("userid").Value
                Else
                    Exit Sub
                End If

                If Request.Cookies("pwd").Value <> "" Then
                    'txt_password.Attributes.Add("value", Request.Cookies("pwd").Value)
                    txt_password.Value = Request.Cookies("pwd").Value
                End If

                If Request.Cookies("userid").Value <> "" Or Request.Cookies("pwd").Value <> "" Then
                    rememberme.Checked = True
                End If

            Catch ex As Exception

            End Try
        End If

    End Sub

    Protected Sub WriteCookie()
        'Create a Cookie with a suitable Key.
        Dim nameCookie As New HttpCookie("StrgSessionState")

        'Set the Cookie value.
        nameCookie.Values("UserName") = Session("UserName").ToString()
        nameCookie.Values("CompanyID") = Session("CompanyID").ToString()
        nameCookie.Values("VendorID") = Session("VendorID").ToString()
        nameCookie.Values("UserID") = Session("UserID").ToString()
        nameCookie.Values("FYear") = Session("FYear").ToString()
        nameCookie.Values("Version") = Session("Version").ToString()
        nameCookie.Values("ReportFYear") = Session("ReportFYear").ToString()
        nameCookie.Values("CompanyName") = Session("CompanyName").ToString()

        'Set the Expiry date.
        nameCookie.Expires = DateTime.MaxValue

        'Add the Cookie to Browser.
        Response.Cookies.Add(nameCookie)
    End Sub

End Class
