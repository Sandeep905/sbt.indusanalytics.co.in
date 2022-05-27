
Partial Class QuotePreview
    Inherits System.Web.UI.Page

    Private Sub form1_Load(sender As Object, e As EventArgs) Handles form1.Load

        Dim UserId As String = Convert.ToString(Session("UserID"))
        HdnUser.Value = UserId
        If UserId = "" Then
            Session.Remove("UserID")
            Response.ClearHeaders()
            Response.AddHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
            Response.AddHeader("Pragma", "no-cache")
            HdnUser.Value = ""
        End If
    End Sub
End Class
