
Partial Class DYnamicQty
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        Dim User_Id As String = Convert.ToString(Session("UserID"))

        If User_Id = "" Then
            Session.Remove("UserID")
            Response.ClearHeaders()
            Response.AddHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate")
            Response.AddHeader("Pragma", "no-cache")
            Response.Redirect("login.aspx")
        End If
    End Sub

End Class
