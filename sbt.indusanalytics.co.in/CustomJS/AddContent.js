
$.ajax({                //// Add All Active Contents
    type: 'post',
    url: 'WebServicePlanWindow.asmx/GetAllContents',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    data: {},
    crossDomain: true,
    success: function (results) {        
        var res = results.d.replace(/\\/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        //alert(res);
        var RES1 = JSON.parse(res);

        document.getElementById("AllContents").innerHTML = "";
        var contDetails = "";
        
        for (var cnt = 0; cnt < RES1.length; cnt++) {
            contDetails += '<div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" ><div onclick="onContentClick(this);" ondblclick="selectContentDblClick(this)" class="addcontentsize" title="' + RES1[cnt].ContentCaption + '" id="' + RES1[cnt].ContentName + '" style="height: 11em; float: left;" >' +
                ' <div style="width: 11em; height: 8em; text-align: center"> <img src="' + RES1[cnt].ContentClosedHref + '" style="width: 8em; height: 8em;" /></div><div style="width: 11em; height: auto; text-align: center;"> ' +
                '<b class="font-10">' + RES1[cnt].ContentCaption + '</b></div></div></div>';
        }
        $("#AllContents").append('<div class="rowcontents clearfix">' + contDetails + '</div>');
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

function selectContentDblClick(ID) {    
    $("#Btn_Select_Content").click();
}

function onContentClick(ele) {
    
    try {

        var x = document.getElementById("popContenerContent").querySelectorAll(".addcontentsize");
        for (var dx = 0; dx < x.length; dx++) {
            x[dx].style.border = '1px solid black';
        }

        document.getElementById(ele.id).style.border = '3px solid #0a5696';
        document.getElementById("Txt_Content_Name").value = ele.title;
        document.getElementById("PlanContentType").value = ele.id;
        document.getElementById("Txt_ContentImgSrc").value = $(ele).find('img').attr('src');
    } catch (e) {
        //alert(e);
    }
}