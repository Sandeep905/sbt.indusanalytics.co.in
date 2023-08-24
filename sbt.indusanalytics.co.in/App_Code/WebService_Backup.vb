Imports System.Data.SqlClient
Imports System.IO
Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports Connection
Imports System.Web.Script.Services
Imports System.Web.Script.Serialization
Imports System.Net
Imports System.IO.Compression
Imports Ionic.Zip

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()>
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Public Class WebService_Backup
    Inherits System.Web.Services.WebService
    Dim db As New DBConnection
    Dim data As New HelloWorldData()

    '' To call the procedures  ------ exec UploadFileViaFTP "ftp://50.62.160.93","ftpuser","user@123","D:\SBTBackup","/SBTBackup.zip"
    <WebMethod()>
    Public Function GenerateBackup() As String
        Try
            db.OpenDataBase()
            ' Connection string to the database server
            Dim dbConnectionString As String = db.constring

            ' Specify the backup file name with the current date appended
            Dim backupFileName As String = "SBTBackup" & DateTime.Now.ToString("yyyyMMdd")

            ' Specify the backup file path on the hosting server
            Dim backupFilePath As String = "D:\" & backupFileName & ".bak" 'Server.MapPath("~/BackupDirectory/") & backupFileName

            ' Create a new SQL connection
            Using connection As New SqlConnection(dbConnectionString)
                ' Open the connection
                connection.Open()

                ' Execute the SQL query to generate the backup
                Dim backupQuery As String = "BACKUP DATABASE IndusEnterprise_SBT TO DISK = '" & backupFilePath & "'"
                Using command As New SqlCommand(backupQuery, connection)
                    command.ExecuteNonQuery()
                End Using

                ' Close the connection
                connection.Close()
            End Using


            'Dim str As String = "exec UploadFileViaFTP ""ftp://50.62.160.93"", ""ftpuser"", ""user@123"", " & """D:\" & backupFileName & """, " / "" & backupFileName & ".Zip"""

            Dim ftpAddress As String = "ftp://50.62.160.93"
            Dim ftpUser As String = "ftpuser"
            Dim ftpPassword As String = "user@123"
            Dim localFilePath As String = "D:\" & backupFileName
            Dim remoteFilePath As String = "/Backups/" & backupFileName & ".Zip"

            Dim ftpCommand As String = "exec UploadFileViaFTP """ & ftpAddress & """, """ & ftpUser & """, """ & ftpPassword & """, """ & localFilePath & """, """ & remoteFilePath & """"

            Dim ster = db.ExecuteNonSQLQuery(ftpCommand)

            ' Connect to the FTP server and list the files in the backup folder
            Dim ftpRequest As FtpWebRequest = CType(WebRequest.Create(New Uri(ftpAddress & "/Backups/")), FtpWebRequest)
            ftpRequest.Credentials = New NetworkCredential(ftpUser, ftpPassword)
            ftpRequest.Method = WebRequestMethods.Ftp.ListDirectory

            Dim response As FtpWebResponse = CType(ftpRequest.GetResponse(), FtpWebResponse)
            Dim responseStream As Stream = response.GetResponseStream()
            Dim reader As New StreamReader(responseStream)

            Dim fileList As New List(Of String)()
            Dim line As String = reader.ReadLine()
            While line IsNot Nothing
                fileList.Add(line)
                line = reader.ReadLine()
            End While

            reader.Close()
            response.Close()

            ' Ensure there are a maximum of five files on the FTP server
            If fileList.Count > 5 Then
                fileList.Sort()
                For i As Integer = 0 To fileList.Count - 6
                    Dim fileToDelete As String = "/Backups/" & fileList(i)
                    Dim ftpDeleteRequest As FtpWebRequest = CType(WebRequest.Create(New Uri(ftpAddress & fileToDelete)), FtpWebRequest)
                    ftpDeleteRequest.Credentials = New NetworkCredential(ftpUser, ftpPassword)
                    ftpDeleteRequest.Method = WebRequestMethods.Ftp.DeleteFile

                    Dim deleteResponse As FtpWebResponse = CType(ftpDeleteRequest.GetResponse(), FtpWebResponse)
                    deleteResponse.Close()
                Next i
            End If

            Return ster


        Catch ex As Exception
            Return ex.Message
        End Try
    End Function
    Public Sub UploadFileToFtp(sourceFilePath As String, destinationFilePath As String, ftpServer As String, ftpUsername As String, ftpPassword As String)
        Try
            Using ftpClient As New WebClient()
                ftpClient.Credentials = New NetworkCredential(ftpUsername, ftpPassword)
                ftpClient.UploadFile(ftpServer & "/" & destinationFilePath, sourceFilePath)
            End Using
        Catch ex As Exception
            Console.Write(ex.Message)
            ' Handle any exceptions here
        End Try
    End Sub

    '<WebMethod(EnableSession:=True)>
    '<ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    'Public Function GetBackupFilesList() As List(Of String)
    '    Try
    '        Dim backupFolderPath = Context.Server.MapPath("Backups")
    '        Dim backupFilesList As New List(Of String)

    '        ' Check if the backup folder exists
    '        If Directory.Exists(backupFolderPath) Then
    '            ' Get a list of files in the backup folder
    '            Dim backupFiles() As String = Directory.GetFiles(backupFolderPath)

    '            For Each filePath As String In backupFiles
    '                Dim fileName As String = Path.GetFileName(filePath)
    '                backupFilesList.Add(fileName)
    '            Next

    '            Return backupFilesList
    '        Else
    '            ' Backup folder does not exist
    '            Return New List(Of String)()
    '        End If
    '    Catch ex As Exception
    '        Return New List(Of String)()
    '    End Try
    'End Function
    <WebMethod(EnableSession:=True)>
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)>
    Public Function GetBackupFilesList() As List(Of BackupFileData)
        Try
            Dim backupFolderPath = Context.Server.MapPath("Backups")
            Dim backupFilesList As New List(Of BackupFileData)

            ' Check if the backup folder exists
            If Directory.Exists(backupFolderPath) Then
                ' Get a list of files in the backup folder
                Dim backupFiles() As String = Directory.GetFiles(backupFolderPath)

                ' Sort the backup files in latest-first order
                Array.Sort(backupFiles, Function(file1, file2)
                                            Return File.GetLastWriteTime(file2).CompareTo(File.GetLastWriteTime(file1))
                                        End Function)


                For Each filePath As String In backupFiles
                    Dim fileName As String = Path.GetFileName(filePath)
                    Dim fileDateTime As String = File.GetLastWriteTime(filePath).ToString("yyyy-MM-dd HH:mm:ss")
                    Dim backupFileData As New BackupFileData With {.Name = fileName, .DateTime = fileDateTime}
                    backupFilesList.Add(backupFileData)
                Next

                Return backupFilesList
            Else
                ' Backup folder does not exist
                Return New List(Of BackupFileData)()
            End If
        Catch ex As Exception
            Return New List(Of BackupFileData)()
        End Try
    End Function

    Public Class BackupFileData
        Public Property Name As String
        Public Property DateTime As String
    End Class


    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class