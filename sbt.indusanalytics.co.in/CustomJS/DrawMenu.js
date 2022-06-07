﻿
$.ajax({
    type: "POST",
    url: "WebService_OtherMaster.asmx/CreateDynamicMenuWithSubMenu",
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
        var AddNextSubMenu = "";

        for (var N = 0; N < SubMenu.length; N++) {
            if (SubMenu[N].NumberOfChild > 1) {
                let found = checkforModuleName(SubMenu[N].ModuleHeadName);
                if (found === false) {
                    AddNextSubMenu = SubMenu[N].ModuleHeadName.replace(/ /g, '-');
                    CreateSubLI = '<li class="nav-item has-treeview"><a href="#" class="nav-link"><p>' + SubMenu[N].ModuleHeadName + '<i class="right fa fa-angle-left"></i><span class="badge badge-info right"></span></p></a><ul class="nav nav-treeview" id="submenu-' + AddNextSubMenu + '"></ul></li>';
                    $("#DynamicMenuDiv").append(CreateSubLI);
                    CreateSubUL = '<li class="nav-item"><a href="' + SubMenu[N].ModuleName + '" class="nav-link"><i class="fa fa-circle-o nav-icon"></i><p>' + SubMenu[N].ModuleDisplayName + '</p></a></li>';
                    $('#submenu-' + AddNextSubMenu).append(CreateSubUL);
                }
                else {
                    CreateSubUL = '<li class="nav-item"><a href="' + SubMenu[N].ModuleName + '" class="nav-link"><i class="fa fa-circle-o nav-icon"></i><p>' + SubMenu[N].ModuleDisplayName + '</p></a></li>';
                    $('#submenu-' + AddNextSubMenu).append(CreateSubUL);
                }
            } else {
                AddNextSubMenu = 0;
                AddNextSubMenu = "";
                CreateSubUL = '<li class="nav-item"><a href="' + SubMenu[N].ModuleName + '" class="nav-link"><p>' + SubMenu[N].ModuleDisplayName + '<span class="right badge badge-danger"></span></p></a></li>';
                $("#DynamicMenuDiv").append(CreateSubUL);
                CreateSubUL = "";
            }
        }
    }
});

function checkforModuleName(ModuleHeadName) {
    let found = false;

    $("#DynamicMenuDiv li").each((id, elem) => {
        if (elem.innerText === (ModuleHeadName)) {
            found = true;
        }
    });

    return found;
}

function searchInputMenu() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("DynamicMenuDiv");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function setDataGridRowCss(e) {
    if (e.rowType === "header") {
        e.rowElement.css('background', '#0a5696');
        e.rowElement.css('color', 'white');
        e.rowElement.css('font-weight', 'bold');
        e.rowElement.css('text-align', 'left');
    } else if (e.rowType === "totalFooter") {
        e.rowElement.css('background', '#ccf5ff');
        e.rowElement.css('color', 'white');
        e.rowElement.css('font-weight', 'bold');
    }
    e.rowElement.css('fontSize', '11px');
}