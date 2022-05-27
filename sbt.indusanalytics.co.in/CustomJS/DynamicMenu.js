var DynamicMenu = "";
var GetRecord = [];
//document.getElementById("DynamicMenuDiv").innerHTML = "";
$.ajax({
    type: "POST",
    async: false,
    url: "WebService_OtherMaster.asmx/CreateDynamicMenu",
    data: '{}',
    contentType: "application/json; charset=utf-8",
    dataType: "text",
    success: function (results) {
        var res = results.replace(/\\/g, '');
        res = res.replace(/"d":""/g, '');
        res = res.replace(/""/g, '');
        res = res.substr(1);
        res = res.slice(0, -1);
        DynamicMenu = JSON.parse(res);

        var CountChild = 0;
        if (DynamicMenu.length > 0) {
            var CreateLI = "";
            for (var C = 0; C < DynamicMenu.length; C++) {
                if (DynamicMenu[C].NumberOfChild > 1) {
                    CountChild = 1;
                    CreateLI += '<li class="menu__item" role="menuitem"><a class="menu__link" data-submenu="submenu-' + DynamicMenu[C].SetGroupIndex + '" aria-owns="submenu-' + DynamicMenu[C].SetGroupIndex + '" href="#" style="font-size: 14px; font-weight: 500; text-decoration: none;">' + DynamicMenu[C].ModuleHeadName + '</a></li>';
                }
                else {
                    CreateLI += '<li class="menu__item" role="menuitem"><a class="menu__link" href="' + DynamicMenu[C].ModuleName + '"  style="font-size: 14px; font-weight: 500; text-decoration: none;">' + DynamicMenu[C].ModuleHeadName + '</a></li>';
                }
            }
            if (CountChild === 1) {
                $.ajax({
                    type: "POST",
                    url: "WebService_OtherMaster.asmx/CreateDynamicSubMenu",
                    data: '{}',
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function (results) {
                        var res = results.replace(/\\/g, '');
                        res = res.replace(/"d":""/g, '');
                        res = res.replace(/""/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        var SubMenu = JSON.parse(res);

                        var CreateSubUL = "";
                        var CreateSubLI = "";
                        var AddNextSubMenu = 0;
                        for (var N = 0; N < SubMenu.length; N++) {
                            if (AddNextSubMenu === 0 || AddNextSubMenu === SubMenu[N].SetGroupIndex) {
                                AddNextSubMenu = SubMenu[N].SetGroupIndex;
                                CreateSubLI += '<li class="menu__item" role="menuitem"><a class="menu__link" href="' + SubMenu[N].ModuleName + '" style="font-size: 14px; font-weight: 500; text-decoration: none;">' + SubMenu[N].ModuleDisplayName + '</a></li>';
                            }
                            else {
                                CreateSubUL += '<ul data-menu="submenu-' + AddNextSubMenu + '" id="submenu-' + AddNextSubMenu + '" class="menu__level" tabindex="-1" role="menu" aria-label="Inventory" style="font-size: 12px; font-weight: 200; text-align: left">' + CreateSubLI + '</ul>';
                                AddNextSubMenu = SubMenu[N].SetGroupIndex;
                                CreateSubLI = "";
                                CreateSubLI += '<li class="menu__item" role="menuitem"><a class="menu__link" href="' + SubMenu[N].ModuleName + '" style="font-size: 14px; font-weight: 500; text-decoration: none;">' + SubMenu[N].ModuleDisplayName + '</a></li>';
                            }
                            if (Number((SubMenu.length) - 1) === N) { //For Last UL Append(Pradeep)
                                CreateSubUL += '<ul data-menu="submenu-' + AddNextSubMenu + '" id="submenu-' + AddNextSubMenu + '" class="menu__level" tabindex="-1" role="menu" aria-label="Inventory" style="font-size: 12px; font-weight: 200; text-align: left">' + CreateSubLI + '</ul>';
                            }
                        }

                        var CreateUL = '<ul data-menu="main" class="menu__level" tabindex="-1" role="menu" aria-label="All" style="font-size: 12px; font-weight: 500">' + CreateLI + '</ul>';
                        $("#DynamicMenuDiv").append(CreateUL);
                        $("#DynamicMenuDiv").append(CreateSubUL);


                        //$("#Master_Div").append('<nav id="ml-menu" style="margin-left: 1em; margin-top: .5em">' +
                        //  ' <div id="DynamicMenuDiv" class="menu__wrap" style="margin-top: 3.5em">' + CreateUL + CreateSubUL + '</div></div>');

                    }
                });
            }
            else {
                var CreateUL = '<ul data-menu="main" class="menu__level" tabindex="-1" role="menu" aria-label="All" style="font-size: 12px; font-weight: 500">' + CreateLI + '</ul>';
                $("#DynamicMenuDiv").append(CreateUL);
            }
        }
        else {
            document.getElementById("DynamicMenuDiv").innerHTML = "";
        }

    }
});

CheckRights();

function CheckRights() {
    $.ajax({
        type: "POST",
        url: "WebService_OtherMaster.asmx/CheckRights",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/""/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            GetRecord = JSON.parse(res);

        }
    });
}

//$("#Btn_Log").click(function () {    
//    document.getElementById("Btn_Log").setAttribute("data-toggle", "modal");
//    document.getElementById("Btn_Log").setAttribute("data-target", "#EditReasionModel");
//});


