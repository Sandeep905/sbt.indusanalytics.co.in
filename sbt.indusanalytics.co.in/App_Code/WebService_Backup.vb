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


    <WebMethod()>
    Public Function GenerateBackup() As String
        Try
            db.OpenDataBase()
            ' Connection string to the database server
            Dim dbConnectionString As String = db.constring

            ' Specify the backup file name with the current date appended
            Dim backupFileName As String = "SBTBackup" & DateTime.Now.ToString("yyyyMMdd") & ".bak"

            ' Specify the backup file path on the hosting server
            Dim backupFilePath As String = "D:\" & backupFileName 'Server.MapPath("~/BackupDirectory/") & backupFileName

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


            ' Create a zip file using the backup file
            Dim zipFileName As String = "SBTBackup" & DateTime.Now.ToString("yyyyMMdd") & ".zip"


            ' Create a zip file using a command-line utility like 7-Zip using xp_cmdshell
            Dim zipCommand As String = "EXEC xp_cmdshell 'C:\Path\to\7z.exe a -tzip """ & backupFilePath & ".zip"" """ & backupFilePath & """'"
            Using connection As New SqlConnection(dbConnectionString)
                ' Open the connection
                connection.Open()

                ' Execute the zip command
                Using command As New SqlCommand(zipCommand, connection)
                    command.ExecuteNonQuery()
                End Using

                ' Close the connection
                connection.Close()
            End Using

            ' Delete the original backup file
            ' File.Delete(backupFilePath)



            ' Transfer the backup file to the hosting server
            Dim sourceFilePath As String = backupFilePath


            Dim destinationFilePath As String = backupFileName


            ' File.Copy(sourceFilePath, destinationFilePath)

            '' Transfer the backup file to the hosting server using FTP
            'Dim ftpServer As String = "ftp://itrack.quickpathlabs.in"
            'Dim ftpUsername As String = "Sandeepftp"
            'Dim ftpPassword As String = "s4vj?P194"

            Dim ftpServer As String = "ftp://erp.softberry.in"
            Dim ftpUsername As String = "Sandeepftp" '"erpSoft"
            Dim ftpPassword As String = "lxv264no7deZU$vXz"

            Using ftpClient As New WebClient()
                ftpClient.Credentials = New NetworkCredential(ftpUsername, ftpPassword)
                ftpClient.UploadFile(ftpServer & "/" & destinationFilePath, sourceFilePath)
            End Using

            '  UploadFileToFtp(sourceFilePath, destinationFilePath, ftpServer, ftpUsername, ftpPassword)


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
    Public Class HelloWorldData
        Public Message As [String]
    End Class

End Class