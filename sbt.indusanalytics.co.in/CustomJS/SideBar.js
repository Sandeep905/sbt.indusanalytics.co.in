"use strict";

function closeNavLeft() {

    document.getElementById("mySidenav").style.width = "0";
    if ((document.getElementById('BottomTabBar').style.height === "" || document.getElementById('BottomTabBar').style.height === "0px") && (document.getElementById('RightTabBar').style.width === "" || document.getElementById('RightTabBar').style.width === "0px")) {
        document.getElementById('MYbackgroundOverlay').style.display = 'none';
    }
    else {
        document.getElementById('MYbackgroundOverlay').style.display = 'block';
    }

    //document.getElementById('MYbackgroundOverlay').style.display = 'none';
    document.getElementById('TabquotationDetails_LI').setAttribute("class", "");
}

function closeRightTabBar() {
    document.getElementById("RightTabBar").style.width = "0";
    if ((document.getElementById('BottomTabBar').style.height === "" || document.getElementById('BottomTabBar').style.height === "0px") && (document.getElementById('mySidenav').style.width === "" || document.getElementById('mySidenav').style.width === "0px")) {
        document.getElementById('MYbackgroundOverlay').style.display = 'none';
    }
    else {
        document.getElementById('MYbackgroundOverlay').style.display = 'block';
    }

    //document.getElementById('MYbackgroundOverlay').style.display = 'none';
    document.getElementById('RightSETTINGS_LI').setAttribute("class", "");
}

function menubar(OPT) {
    var leftopenButton = document.getElementById(OPT.id);

    if (OPT.id === "Quotation_Finalize") {

        document.onclick = function (e) {

            if (e.target === leftopenButton || e.target.id === "menuimgEstmate") {

                var leftpopup = document.getElementById('mySidenav');
                var leftoverlay = document.getElementById('MYbackgroundOverlay');

                if (leftpopup.style.width === "250px") {
                    if (document.getElementById("ExistMenuBar").style.display === "block") {
                        document.getElementById("ExistMenuBar").style.display = "none";
                        document.getElementById("displayStatus").innerHTML = OPT.id.replace('_', ' ');
                        document.getElementById('TabquotationDetails_LI').setAttribute("class", "active");
                        document.getElementById("Main_div").style.display = "block";
                    }
                    else {
                        leftpopup.style.width = "0";
                        if ((document.getElementById('BottomTabBar').style.height === "" || document.getElementById('BottomTabBar').style.height === "0px") && (document.getElementById('RightTabBar').style.width === "" || document.getElementById('RightTabBar').style.width === "0px")) {
                            leftoverlay.style.display = 'none';
                        }
                        else {
                            leftoverlay.style.display = 'block';
                        }
                        document.getElementById('TabquotationDetails_LI').setAttribute("class", "");
                    }
                }
                else {
                    document.getElementById("Main_div").style.display = "block";
                    document.getElementById("ExistMenuBar").style.display = "none";
                    document.getElementById("displayStatus").innerHTML = OPT.id.replace('_', ' ');
                    document.getElementById('TabquotationDetails_LI').setAttribute("class", "active");

                    leftpopup.style.width = "250px";
                    leftoverlay.style.display = 'block';
                }

            }
        };
    }
    else if (OPT.id === "Customleftsidebar1" || OPT.id === "Customleftsidebar1_Span") {

        var leftpopup = document.getElementById('mySidenav');
        var leftoverlay = document.getElementById('MYbackgroundOverlay');

        if (document.getElementById("Main_div").style.display === "block") {
            document.getElementById("displayStatus").innerHTML = "Menu Gallery";
            document.getElementById('TabquotationDetails_LI').setAttribute("class", "");
            document.getElementById("Main_div").style.display = "none";
            document.getElementById("ExistMenuBar").style.display = "block";
        }

        else if (leftpopup.style.width === "250px") {
            leftpopup.style.width = "0";
            if ((document.getElementById('BottomTabBar').style.height === "" || document.getElementById('BottomTabBar').style.height === "0px") && (document.getElementById('RightTabBar').style.width === "" || document.getElementById('RightTabBar').style.width === "0px")) {
                leftoverlay.style.display = 'none';
            }
            else {
                leftoverlay.style.display = 'block';
            }
        }
        else {
            document.getElementById("displayStatus").innerHTML = "Menu Gallery";
            leftpopup.style.width = "250px";
            leftoverlay.style.display = 'block';

            document.getElementById('TabquotationDetails_LI').setAttribute("class", "");
            document.getElementById("Main_div").style.display = "none";
            document.getElementById("ExistMenuBar").style.display = "block";
        }


    }
}

function Righttabbar(RT) {

    var rightpopup = document.getElementById('RightTabBar');
    var rightoverlay = document.getElementById('MYbackgroundOverlay');
    var rightopenButton = document.getElementById(RT.id);
    document.getElementById("displayStatusRight").innerHTML = RT.id.replace('_', ' ');

    document.onclick = function (e) {
        if (e.target === rightopenButton) {
            //document.getElementById('mySidenav').style.width = "0px";
            //document.getElementById('BottomTabBar').style.height = "0px";


            if (rightpopup.style.width === "250px") {
                rightpopup.style.width = "0";
                //rightoverlay.style.display = 'none';
                if ((document.getElementById('mySidenav').style.width === "" || document.getElementById('mySidenav').style.width === "0px") && (document.getElementById('BottomTabBar').style.height === "" || document.getElementById('BottomTabBar').style.height === "0px") && (document.getElementById('RightTabBar').style.width === "" || document.getElementById('RightTabBar').style.width === "0px")) {
                    rightoverlay.style.display = 'none';
                }
                else {
                    rightoverlay.style.display = 'block';
                }
            }
            else {
                rightpopup.style.width = "250px";
                rightoverlay.style.display = 'block';

                document.getElementById('RightSETTINGS_LI').setAttribute("class", "active");
                document.getElementById('TabquotationDetails_LI').setAttribute("class", "");
            }

        }
    };

}

//function Bottombar(Bottom) {

//    var Bottompopup = document.getElementById('BottomTabBar');
//    var Bottomoverlay = document.getElementById('MYbackgroundOverlay');
//    var BottomopenButton = document.getElementById(Bottom.id);    
//    document.getElementById("displayStatusBottom").innerHTML = Bottom.id;

//    document.onclick = function (e) {        
//        if (e.target.id !== 'BottomTabBar') {
//            document.getElementById('RightTabBar').style.width = "0px";
//            document.getElementById('mySidenav').style.width = "0px";
//            Bottompopup.style.height = "0px";
//            Bottomoverlay.style.display = 'none';
//            document.getElementById('L' + Bottom.id).setAttribute("class", "");
//        }
//        if (e.target === BottomopenButton) {           
//            document.getElementById('RightTabBar').style.width = "0px";
//            document.getElementById('mySidenav').style.width = "0px";
//            Bottompopup.style.height = "80%";
//            Bottomoverlay.style.display = 'block';
//            document.getElementById('L' + Bottom.id).setAttribute("class", "active");

//            PlanWindow();
//        }
//    };
//};

