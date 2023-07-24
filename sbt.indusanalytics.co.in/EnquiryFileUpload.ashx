<%@ WebHandler Language="VB" Class="EnquiryFileUpload" %>

Imports System
Imports System.Web
Imports System.IO
Imports Newtonsoft

Public Class EnquiryFileUpload : Implements IHttpHandler

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        context.Response.ContentType = "text/plain"

        Dim fileNames As New List(Of String)()

        If context.Request.Files.Count > 0 Then
            Dim files As HttpFileCollection = context.Request.Files
            For i As Integer = 0 To files.Count - 1
                Dim file As HttpPostedFile = files(i)

                Dim fileName As String
                If HttpContext.Current.Request.Browser.Browser.ToUpper() = "IE" OrElse HttpContext.Current.Request.Browser.Browser.ToUpper() = "INTERNETEXPLORER" Then
                    Dim testfiles As String() = file.FileName.Split(New Char() {"\"c})
                    fileName = testfiles(testfiles.Length - 1)
                Else
                    fileName = Guid.NewGuid().ToString & file.FileName
                End If

                Dim filePath As String = Path.Combine(context.Server.MapPath("Files/Enquiry/"), fileName)
                file.SaveAs(filePath)

                fileNames.Add(fileName)
            Next

            Dim csvFileNames As String = String.Join(",", fileNames)
            context.Response.Write(csvFileNames)
        End If
    End Sub

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class
