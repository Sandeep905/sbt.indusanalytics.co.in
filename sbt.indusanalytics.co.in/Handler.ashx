<%@ WebHandler Language="VB" Class="Handler" %>

Imports System
Imports System.Web
Imports System.IO

Public Class Handler : Implements IHttpHandler

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim fname As String
        Dim F_Name As String
        If context.Request.Files.Count > 0 Then
            Dim files As HttpFileCollection = context.Request.Files
            For i As Integer = 0 To files.Count - 1
                Dim file As HttpPostedFile = files(i)

                If HttpContext.Current.Request.Browser.Browser.ToUpper() = "IE" OrElse HttpContext.Current.Request.Browser.Browser.ToUpper() = "INTERNETEXPLORER" Then
                    Dim testfiles As String() = file.FileName.Split(New Char() {"\"c})
                    fname = testfiles(testfiles.Length - 1)
                Else
                    fname = Guid.NewGuid().ToString & file.FileName
                End If
                ' F_Name = fname
                F_Name = "Profile_Images/" + fname
                fname = Path.Combine(context.Server.MapPath("Profile_Images/"), fname)

                file.SaveAs(fname)
                context.Response.Write(fname)
            Next

        End If
    End Sub

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class