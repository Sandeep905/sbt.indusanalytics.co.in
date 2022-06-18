
///////// File Attachment Start
function uploadFileProduction(productionType) {
    var fd = new FormData();
    fd.append('UserAttchedFiles', $('#file')[0].files[0]);
    let Url = 'WebService_StartJob.asmx/UploadFileProductionStart'
    if (productionType === "Update") {
        Url = 'WebService_UpdateJob.asmx/UploadFileProductionUpdate';
    } else if (productionType === "Product") {
        Url = 'WebServiceProductMaster.asmx/UploadProductImageFile';
    }
    $.ajax({
        url: Url,
        data: fd,
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (fd) {
            console.log(fd);
            if (productionType === "Update") { window.location = "StartJob.aspx"; } else { window.location = "UpdateJob.aspx"; }
        }
    });
}

$("#BtnRemoveFile").click(function () {
    $("#PreviewAttachedFile").fadeIn("fast").attr('src', "");
    document.getElementById('file').value = "";
});

if (window.File && window.FileReader && window.FormData) {
    var $inputField = $('#file');

    $inputField.on('change', function (e) {
        var file = e.target.files[0];

        if (file) {
            if (/^image\//i.test(file.type) || "application/pdf" === file.type) {
                readFile(file);
            } else {
                alert('Not a valid image!');
            }
        }
    });
} else {
    alert("File upload is not supported!");
}

function readFile(file) {
    var reader = new FileReader();

    reader.onloadend = function () {
        processFile(reader.result, file.type, file.name);
    };
    reader.onerror = function () {
        alert('There was an error reading the file!');
    };
    reader.readAsDataURL(file);
}

function processFile(dataURL, fileType, fileName) {
    var maxWidth = 700;
    var maxHeight = 700;

    var image = new Image();
    image.src = dataURL;
    image.onload = function () {
        var width = image.width;
        var height = image.height;
        var shouldResize = (width > maxWidth) || (height > maxHeight);
        var xdataURL;
        var ext = dataURL.split(';')[0].match(/jpeg|png|gif|jpg/)[0];

        if (!shouldResize) {
            var canvas = document.createElement('canvas');

            canvas.width = width;
            canvas.height = height;

            var context = canvas.getContext('2d');

            context.drawImage(this, 0, 0, width, height);

            dataURL = canvas.toDataURL(fileType);
            // sendFile(dataURL);
            $("#PreviewAttachedFile").fadeIn("fast").attr('src', dataURL);

            xdataURL = dataURL.replace("data:image/" + ext + ";base64,", '');
            return;
        }

        var newWidth;
        var newHeight;

        if (width > height) {
            newHeight = height * (maxWidth / width);
            newWidth = maxWidth;
        } else {
            newWidth = width * (maxHeight / height);
            newHeight = maxHeight;
        }

        var canvas1 = document.createElement('canvas');

        canvas1.width = newWidth;
        canvas1.height = newHeight;

        var context1 = canvas1.getContext('2d');

        context1.drawImage(this, 0, 0, newWidth, newHeight);

        dataURL = canvas1.toDataURL(fileType);

        $("#PreviewAttachedFile").fadeIn("fast").attr('src', dataURL);

        xdataURL = dataURL.replace("data:image/" + ext + ";base64,", '');
        return false;
        // sendFile(dataURL);
    };

    image.onerror = function () {
        alert('There was an error processing your file!');
    };
}
