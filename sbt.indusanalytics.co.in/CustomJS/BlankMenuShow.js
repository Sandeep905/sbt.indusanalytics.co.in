"use strict";

var interval_BlankMenu;
var timeLeft_BlankMenu = 1000 * (3), seconds_BlankMenu = "";

FillBlankMenuDiv();
function FillBlankMenuDiv() {
    var DMDiv = document.getElementById("DynamicMenuDiv");
    var DMDiv_child = DMDiv.getElementsByTagName('ul');

    if (DMDiv_child.length === 0) {
        countdown_BlankMenu(timeLeft_BlankMenu);
    }
}

function countdown_BlankMenu(timeLeft_BlankMenu) {
    try {

        clearInterval(interval_BlankMenu);
        seconds_BlankMenu = timeLeft_BlankMenu / 1000;
        interval_BlankMenu = setInterval(function () {
            document.getElementById('displayStatus').style.display = "block";
            document.getElementById('displayStatus').innerHTML = "wait.." + seconds_BlankMenu + 'sec.';
            if (seconds_BlankMenu === 0) {
                clearInterval(interval_BlankMenu);
                var parent = document.getElementById("ml-menu");
                var child = parent.getElementsByTagName('nav');
                if (child.length > 0) {
                    var dd = child[0].getElementsByTagName("a");
                    var CountChild = dd.length;
                    if (CountChild > 0) {
                        var CurrentNode = dd[Number(CountChild) - 1].innerHTML;
                        var Count_UL = document.getElementById("DynamicMenuDiv").getElementsByTagName('ul');
                        if (Count_UL.length > 0) {
                            //if (document.getElementById(CurrentNode).className !== "menu__level menu__level--current") {
                            //    document.getElementById(CurrentNode).className = "menu__level menu__level--current";
                                document.getElementById('displayStatus').style.display = "none";
                            //}
                        }
                        else {
                            location.reload();
                        }
                    }
                    else {
                        location.reload();
                    }
                }
            }
            else {
                document.getElementById('displayStatus').innerHTML = "wait.." + seconds_BlankMenu + 'sec.';
                seconds_BlankMenu--;
            }
        }, 1000);

    } catch (e) {
        console.log(e);
    }
};