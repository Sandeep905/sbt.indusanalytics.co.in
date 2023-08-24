$("#image-indicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "/images/settingspinner.gif",
    message: 'Please wait it will take several minutes',
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false
});


$(document).ready(function () {
    // AJAX call to retrieve backup files list
    // AJAX call to retrieve backup files list
    $.ajax({
        url: 'WebService_Backup.asmx/GetBackupFilesList', // Replace with the actual web service URL
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.d.length > 0) {
                // Populate the list of backup files with download buttons
                var backupList = $('#backup-list');
                $.each(data.d, function (index, backupFile) {
                    var listItem = $('<li>')
                        .css({
                            margin: '10px 0',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        });

                    var fileName = backupFile.Name;
                    var fileDateTime = backupFile.DateTime;
                    var downloadLink = $('<a class="download-link">')
                        .attr('href', 'Backups/' + fileName) // Replace with the actual download link
                        .text('Download');
                    listItem.append(fileName + ' (' + fileDateTime + ') ');
                    listItem.append(downloadLink);
                    backupList.append(listItem);
                });
            } else {
                $('#backup-list').html('<li>No backup files found.</li>');
            }
        },
        error: function () {
            $('#backup-list').html('<li>Error loading backup files.</li>');
        }
    });
});

$('#Backup').click(function () {
    try {

        $("#image-indicator").dxLoadPanel("instance").option("visible", true);
        // Make the AJAX request using jQuery
        $.ajax({
            url: 'WebService_Backup.asmx/GenerateBackup',
            type: "POST",
            data: {},
            dataType: "json",
            success: function (response) {
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                // Request succeeded, process the response here
                alert(response);
            },
            error: function (xhr, status, error) {
                // Request failed
                $("#image-indicator").dxLoadPanel("instance").option("visible", false);
                console.error("Request failed with status", status, error);
            }
        });
    } catch (e) {
        console.log(e);
    }
})
