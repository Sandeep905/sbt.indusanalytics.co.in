<%@ Page Title="" Language="VB" MasterPageFile="~/MasterPage_Main.master" AutoEventWireup="false" CodeFile="BackupMaster.aspx.vb" Inherits="BackupMaster" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
    <style>
        .containerbk {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin-bottom: 20px;
        }
        /*form {
            text-align: center;
        }*/
        buttonbk {
            background-color: #3498db;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 3px;
            cursor: pointer;
        }

        ulbk {
            list-style: none;
            padding: 0;
        }

        libk {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .download-link {
            text-decoration: none;
            background-color: #3498db;
            color: #fff;
            padding: 5px 10px;
            border-radius: 3px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div id="image-indicator"></div>
    <div class="containerbk">

        <h1 class="h1bk">Backup Management</h1>
       <a class="btn btn-success" id="Backup">Backup</a>
        <h2 class="h2bk">Backup Files</h2>
        <ul class="ulbk" id="backup-list">
            <!-- List items will be dynamically added here using JavaScript -->
        </ul>
    </div>
   <script src="CustomJS/backups.js"></script>
</asp:Content>

