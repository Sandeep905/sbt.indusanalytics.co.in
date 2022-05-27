
Imports System.Data
Imports Connection

Partial Class activateaccount
    Inherits System.Web.UI.Page
    Dim db As New DBConnection

    Private Sub FormSetPassword_Load(sender As Object, e As EventArgs) Handles FormSetPassword.Load
        If Page.IsPostBack = False Then
            Dim emailid As String = Convert.ToString(HttpContext.Current.Request.QueryString("mailid"))
            Dim HashCode As String = Convert.ToString(HttpContext.Current.Request.QueryString("hash"))
            If emailid = Nothing Then
                Response.Redirect("errordocs/error404.html")
                Exit Sub
            End If
            If emailid.ToString() = "" Or emailid.Contains("@") = False Or emailid.Split("@")(0).Length = 0 Or emailid.Split("@")(1).Length = 0 Then
                Response.Redirect("errordocs/error404.html")
                Exit Sub
            End If

            If db.ChangePassword(Trim(emailid)) <> HashCode Then
                Response.Redirect("errordocs/error405.html")
                Exit Sub
            End If
            Dim Str As String = "Select UA.UserID,UA.UserName,UA.Password,CCM.CompanyID,CCM.CompanyName,CCM.IsVerifiedMail FROM UserMaster As UA Inner Join CompanyMaster as CCM on UA.CompanyID=CCM.CompanyID Where Isnull(CCM.HashCode,'')='" & HashCode & "' And CCM.Email='" & Trim(emailid) & "' "
            Dim dt As New DataTable

            db.FillDataTable(dt, Str)
            If dt.Rows.Count > 0 Then
                If dt.Rows(0)("IsVerifiedMail") = True Then
                    If IsNumeric(dt.Rows(0)("Password")) = False Then
                        FormSetPassword.Visible = True
                    Else
                        Response.Redirect("errordocs/success200.html")
                    End If
                ElseIf dt.Rows(0)("IsVerifiedMail") = False Then
                    db.ExecuteNonSQLQuery("Update CompanyMaster Set IsVerifiedMail=1 Where CompanyID=" & dt.Rows(0)("CompanyID") & " And HashCode='" & HashCode & "' And Email='" & emailid & "'")

                    'validateMsg.InnerHtml = "Your Account is verified and activated. Please create your password and enjoy inPrint."
                    'validateMsg.Visible = True
                    FormSetPassword.Visible = True
                End If
            Else
                Response.Redirect("errordocs/error404.html")
            End If

        End If
    End Sub

    Private Sub BtnSubmit_Click(sender As Object, e As EventArgs) Handles BtnSubmit.Click
        Dim pass As String = Request.Form("txt_password")
        Dim cofirmpass As String = Request.Form("TxtConfirmPassword")
        Dim userFieldName As String = ""
        validateMsg.Visible = False

        If Trim(pass) = "" Or Trim(cofirmpass) = "" Then
            validateMsg.InnerHtml = "Please enter password and confirm password"
            validateMsg.Visible = True
            Exit Sub
        End If
        If Trim(pass) <> Trim(cofirmpass) Then
            validateMsg.InnerHtml = "Password did not match"
            validateMsg.Visible = True
        End If
        Dim emailid As String = Convert.ToString(HttpContext.Current.Request.QueryString("mailid"))
        db.ExecuteNonSQLQuery("Update UserMaster Set Password='" & db.ChangePassword(Trim(pass)) & "' Where EmailID='" & emailid & "'")

        Response.Redirect(Request.RawUrl)
    End Sub
End Class
