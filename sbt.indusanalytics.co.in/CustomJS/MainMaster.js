
function closeNavLeft() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById('MYbackgroundOverlay').style.display = 'none';   
}


function menubar(OPT) {
    var leftpopup = document.getElementById('mySidenav');
    var leftoverlay = document.getElementById('MYbackgroundOverlay');

    var leftopenButton = document.getElementById(OPT.id);
    
    document.onclick = function (e) {
       
        if (e.target === leftopenButton || e.target.id === "Customleftsidebar1_Span") {
            if (leftpopup.style.width === "250px") {
                leftpopup.style.width = "0";
                leftoverlay.style.display = 'none';
            }
            else {
                leftpopup.style.width = "250px";
                leftoverlay.style.display = 'block';
            }
        }
    };
}

////Convertions
function Convert_Value(evtobj) {
    var target = evtobj.target || evtobj.srcElement;
    var tb = document.getElementById(target.id).value;
    if (evtobj.keyCode === 34 && evtobj.shiftKey) {
        H = Number(tb) * 25.4;
        H = H.toFixed(1);
        H = H.replace(".0", '');
        document.getElementById(target.id).value = H;
        H = document.getElementById(target.id).value;
        return false;
    } else if (evtobj.keyCode === 39) {
        H = Number(tb) * 10;
        document.getElementById(target.id).value = H;
        return false;
    }
}