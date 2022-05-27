
Imports System.Data
Imports Connection

Partial Class forgotpassword
    Inherits System.Web.UI.Page
    Dim db As New DBConnection

    Private Sub Btnlogin_Click(sender As Object, e As EventArgs) Handles btnlogin.Click
        Dim useremail As String = Request.Form("useremail")
        validateMsg.Visible = False

        If Trim(useremail) = "" Then
            validateMsg.InnerHtml = "Please entered email id."
            validateMsg.Visible = True
            Exit Sub
        End If

        Dim pattern As String = "^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$"
        Dim emailAddressMatch As Match = Regex.Match(useremail, pattern)
        If emailAddressMatch.Success Then
        Else
            validateMsg.InnerHtml = "You have entered incorrect email id."
            validateMsg.Visible = True
            Exit Sub
        End If

        Try
            validateMsg.InnerHtml = db.ResetPassword(useremail)
            validateMsg.Visible = True
        Catch ex As Exception
            ClientScript.RegisterStartupScript(Page.[GetType](), "validation", "<script language='javascript'>alert(" & ex.Message & ")</script>")
        End Try
    End Sub

End Class
