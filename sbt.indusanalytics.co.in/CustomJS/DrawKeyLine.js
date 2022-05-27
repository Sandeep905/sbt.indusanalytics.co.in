"use strict";
var Orient;
$("#image-indicator").dxLoadPanel({
    indicatorSrc: "images/Indus Logo.png",
    shadingColor: "rgba(0,0,0,0.4)",
    message: 'Loading...',
    width: 320,
    showPane: true,
    showIndicator: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: true
});

var queryString = new Array();
if (window.location.search.split('?').length > 1) {
    var params = window.location.search.split('?')[1].split('&');
    for (var i = 0; i < params.length; i++) {
        var key = params[i].split('=')[0];
        var value = decodeURIComponent(params[i].split('=')[1]).replace(/"/g, '');
        queryString[key] = value;
    }
}
var Keyline_Ref_ID = Number(value);
if (Keyline_Ref_ID > 0) {
    $.ajax({
        type: "POST",
        url: "WebService_Keyline.asmx/GetDataToDrawKeyline",
        data: '{Keyline_Ref_ID : ' + JSON.stringify(Keyline_Ref_ID) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":""/g, '');
            res = res.replace(/"d":null/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/u0027/g, "'");
            res = res.replace(/:,/g, ":null,");
            res = res.replace(/:}/g, ":null}");
            res = res.substr(1);
            res = res.slice(0, -1);

            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            var RES1 = JSON.parse(res.toString());
            Orient = RES1[0].Orient; /// by sandeep 27-may-2021 for generate file name of keyline
            var svg = document.getElementById("mysvg");
            if (RES1[0].x1 === 0 || RES1[0].x1 < 0) {
                alert("Something went wrong,please try again...!");
            }
            svg.setAttribute("width", RES1[0].SheetWidth + "mm");
            svg.setAttribute("height", RES1[0].Sheetheight + "mm");


            WriteTextVal(RES1[0]);
            draw_Gripper(RES1[0]);
            draw_ColorStrip(RES1[0]);

            for (let x = 0; x <= RES1[0].Upsx * RES1[0].UpsY - 1; x++) {
                if (RES1[x].Orient === "ReverseTuckIn") {
                    drawreversetuckin(RES1[x]);
                } else if (RES1[x].Orient === "StandardStraightTuckIn") {
                    StandardStraightTuckIn(RES1[x]);
                } else if (RES1[x].Orient === "StandardStraightTuckInNested") {
                    StandardStraightTuckInNested(RES1[x])
                } else if (RES1[x].Orient === "CrashLockWithPasting") {
                    CrashLockBottom(RES1[x]);
                } else if (RES1[x].Orient === "CrashLockWithoutPasting") {
                    CrashLockWithoutPasting(RES1[x]);
                } else if (RES1[x].Orient === "UniversalCarton") {
                    UniversalCarton(RES1[x]);
                } else if (RES1[x].Orient === "ReverseTuckAndTongue") {
                    ReverseTuckAndTongue(RES1[x]);
                } else if (RES1[x].Orient === "UniversalOpenCrashLockWithPasting") {
                    UniversalOpenCrashLockWithPasting(RES1[x]);
                } else if (RES1[x].Orient === "TuckToFrontOpenTop") {
                    TuckToFrontOpenTop(RES1[x]);
                } else if (RES1[x].Orient === "FourCornerHingedLid") {
                    FourCornerHingedLid(RES1[x]);
                } else if (RES1[x].Orient === "CrashLockWithPastingNeckHolder") {
                    CrashLockWithPastingNeckHolder(RES1[x]);
                } else if (RES1[x].Orient === "FourCornerBox") {
                    FourCornerBox(RES1[x]);
                } else if (RES1[x].Orient === "CakeBox") {
                    CakeBox(RES1[x]);
                }
            }

        },
        error: function errorFunc(jqXHR) {
            $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}

function drawreversetuckin(RES1) {
    CommonRecArea(RES1);
    DrawTuckinUperclauser(RES1);
    drawPastingFlap(RES1);
    Drawdust(RES1);
}

function StandardStraightTuckIn(RES1) {
    CommonRecArea(RES1);
    DrawTuckinUperclauser(RES1);
    drawPastingFlap(RES1);
    Drawdust(RES1);
}
function StandardStraightTuckInNested(RES1) {
    CommonRecArea(RES1);
    DrawTuckinUperclauser(RES1);
    drawPastingFlap(RES1);
    Drawdust(RES1);
}
function CrashLockBottom(RES1) {
    CommonRecArea(RES1);
    DrawTuckinUperclauser(RES1);
    drawPastingFlap(RES1);
    Drawdust(RES1);
    crashlock(RES1);
}
function CrashLockWithoutPasting(RES1) {
    CommonRecArea(RES1);
    DrawTuckinUperclauser(RES1);
    drawPastingFlap(RES1);
    Drawdust(RES1);
    crashlock(RES1);
}
function UniversalCarton(RES1) {
    CommonRecArea(RES1);
    drawPastingFlap(RES1);
    UniversalCartonUpper(RES1);

}
function ReverseTuckAndTongue(RES1) {
    CommonRecArea(RES1);
    DrawTuckinUperclauser(RES1);
    drawPastingFlap(RES1);
    Drawdust(RES1);
    DrawTongue(RES1);

}
function UniversalOpenCrashLockWithPasting(RES1) {
    CommonRecArea(RES1);
    drawPastingFlap(RES1);
    UniversalCartonUpper(RES1)
    crashlock(RES1);
}
function TuckToFrontOpenTop(RES1) {
    CommonRecArea(RES1);
    drawPastingFlap(RES1);
    DrawTuckinUperclauser(RES1);
    Drawdust(RES1);
}
function FourCornerHingedLid(RES1) {
    drawPastingFlap(RES1);
    DrawHingedLid(RES1);
    drawSecondPastingFlap(RES1);
}
function CrashLockWithPastingNeckHolder(RES1) {
    CommonRecArea(RES1);
    drawPastingFlap(RES1);
    DrawTuckinUperclauser(RES1);
    crashlock(RES1);
    DrawNeckHolder(RES1);
}
function FourCornerBox(RES1) {
    drawPastingFlap(RES1);
    DrawHingedLid(RES1);
    drawSecondPastingFlap(RES1);
}
function CakeBox(RES1) {
    drawPastingFlap(RES1);
    DrawcakeBox(RES1);
}

//for the all red line and text
function WriteTextVal(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        createcolour(RES1.x1, RES1.x1 - RES1.pastingflap, RES1.y1 + RES1.height * 40 / 100, RES1.y1 + RES1.height * 40 / 100, "red");
        createArrow(RES1.x1, RES1.y1 + RES1.height * 40 / 100, "L", "x", "red");
        createArrow(RES1.x1 - RES1.pastingflap, RES1.y1 + RES1.height * 40 / 100, "F", "x", "red");
        createText((RES1.x1) / 2, RES1.y1 + RES1.height * 40 / 100, RES1.pastingflap);

        if (RES1.Orient == "UniversalCarton") {
            createcolour(RES1.x3 + RES1.length / 2, RES1.x3 + RES1.length / 2, RES1.y1, RES1.y1 - RES1.height / 2, "red");
            createArrow(RES1.x3 + RES1.length / 2, RES1.y1, "L", "y", "red");
            createArrow(RES1.x3 + RES1.length / 2, RES1.y1 - RES1.height / 2, "F", "y", "red");
            createText(RES1.x3 + RES1.length / 2, RES1.y1, RES1.height / 2);
        }

        if (RES1.Orient == "FourCornerHingedLid") {
            createcolour(RES1.x2, RES1.x3, RES1.y1 + RES1.pastingflap, RES1.y1 + RES1.pastingflap, "red");
            createArrow(RES1.x2, RES1.y1 + RES1.pastingflap, "F", "x", "red");
            createArrow(RES1.x3, RES1.y1 + RES1.pastingflap, "L", "x", "red");
            createText(RES1.x2 + RES1.length / 2, RES1.y1 + RES1.pastingflap, RES1.length);
        } else if (RES1.Orient == "FourCornerBox") {
            createcolour(RES1.x3, RES1.x4, (RES1.y1 + RES1.y2) / 2, (RES1.y1 + RES1.y2) / 2, "red");
            createArrow(RES1.x3, (RES1.y1 + RES1.y2) / 2, "F", "x", "red");
            createArrow(RES1.x4, (RES1.y1 + RES1.y2) / 2, "L", "x", "red");
            createText(RES1.x3 + RES1.length * 10 / 100, (RES1.y1 + RES1.y2) / 2, RES1.length);
        } else if (RES1.Orient == "CakeBox") {
            createcolour(RES1.x3 + RES1.width / 2, RES1.x3 + RES1.width / 2, RES1.y1, RES1.y2, "red");
            createArrow(RES1.x3 + RES1.width / 2, RES1.y1, "F", "y", "red");
            createArrow(RES1.x3 + RES1.width / 2, RES1.y2, "L", "y", "red");
            createText(RES1.x3 + RES1.width / 2, RES1.y1 + RES1.length / 2, RES1.length);
        }
        else {
            createcolour(RES1.x1, RES1.x2, (RES1.y1 + RES1.y2) / 2, (RES1.y1 + RES1.y2) / 2, "red");
            createArrow(RES1.x1, (RES1.y1 + RES1.y2) / 2, "F", "x", "red");
            createArrow(RES1.x2, (RES1.y1 + RES1.y2) / 2, "L", "x", "red");
            createText(RES1.x1 + RES1.length / 2, (RES1.y1 + RES1.y2) / 2 + 5, RES1.length);
        }

        if (RES1.Orient == "FourCornerHingedLid" || RES1.Orient == "FourCornerBox") {
            createcolour((RES1.x3 + RES1.x4) / 2, (RES1.x3 + RES1.x4) / 2, RES1.y1, RES1.y2, "red");
            createArrow((RES1.x3 + RES1.x4) / 2, RES1.y1, "F", "y", "red");
            createArrow((RES1.x3 + RES1.x4) / 2, RES1.y2, "L", "y", "red");
            createText((RES1.x3 + RES1.x4) / 2, RES1.y1 + RES1.pastingflap, RES1.width);
        }
        else if (RES1.Orient == "CakeBox") {
            createcolour(RES1.x1, RES1.x2, RES1.y1 + RES1.length * 90 / 100, RES1.y1 + RES1.length * 90 / 100, "red");
            createArrow(RES1.x1, RES1.y1 + RES1.length * 90 / 100, "F", "x", "red");
            createArrow(RES1.x2, RES1.y1 + RES1.length * 90 / 100, "L", "x", "red");
            createText(RES1.x1 + RES1.width / 2, RES1.y1 + RES1.length * 90 / 100, RES1.width);
        }
        else {
            createcolour(RES1.x2, RES1.x3, RES1.y1 + RES1.pastingflap, RES1.y1 + RES1.pastingflap, "red");
            createArrow(RES1.x2, RES1.y1 + RES1.pastingflap, "F", "x", "red");
            createArrow(RES1.x3, RES1.y1 + RES1.pastingflap, "L", "x", "red");
            createText(RES1.x2 + RES1.width / 2, RES1.y1 + RES1.pastingflap, RES1.width);
        }

        if (RES1.Orient == "FourCornerHingedLid" || RES1.Orient == "FourCornerBox") {
            createcolour(RES1.x1, RES1.x2, (RES1.y1 + RES1.y2) / 2, (RES1.y1 + RES1.y2) / 2, "red");
            createArrow(RES1.x1, (RES1.y1 + RES1.y2) / 2, "F", "x", "red");
            createArrow(RES1.x2, (RES1.y1 + RES1.y2) / 2, "L", "x", "red");
            createText((RES1.x1 + RES1.x2) / 2, (RES1.y1 + RES1.y2) / 2 + 5, RES1.height);
        } else if (RES1.Orient == "CakeBox") {
            createcolour(RES1.x2, RES1.x3, RES1.y1 + RES1.width * 20 / 100, RES1.y1 + RES1.width * 20 / 100, "red");
            createArrow(RES1.x2, RES1.y1 + RES1.width * 20 / 100, "F", "x", "red");
            createArrow(RES1.x3, RES1.y1 + RES1.width * 20 / 100, "L", "x", "red");
            createText(RES1.x2 + RES1.length * 10 / 100, RES1.y1 + RES1.width * 20 / 100, RES1.height);
        }
        else {
            createcolour(RES1.x3 + RES1.length * 15 / 100, RES1.x3 + RES1.length * 15 / 100, RES1.y1, RES1.y2, "red");
            createArrow(RES1.x3 + RES1.length * 15 / 100, RES1.y1, "F", "y", "red");
            createArrow(RES1.x3 + RES1.length * 15 / 100, RES1.y2, "L", "y", "red");
            createText(RES1.x3 + RES1.length * 15 / 100, (RES1.y1 + RES1.y2) / 2 - 5, RES1.height);
        }


        if (RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "CrashLockWithPasting") {
            createcolour(RES1.x7, RES1.x7, RES1.y3, RES1.y4, "red");
            createArrow(RES1.x7, RES1.y4, "L", "y", "red");
            createArrow(RES1.x7, RES1.y3, "F", "y", "red");
            createText(RES1.x7, (RES1.y3 + RES1.y4) / 2, RES1.tuckinflap);
        }
        else if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "ReverseTuckAndTongue" || RES1.Orient == "CrashLockWithPastingNeckHolder") {
            createcolour(RES1.x7, RES1.x7, RES1.y3, RES1.y4, "red");
            createArrow(RES1.x7, RES1.y4, "F", "y", "red");
            createArrow(RES1.x7, RES1.y3, "L", "y", "red");
            createText(RES1.x7, (RES1.y3 + RES1.y4) / 2, RES1.tuckinflap);
        }
        else if (RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createcolour((RES1.x1 + RES1.x2) / 2, (RES1.x1 + RES1.x2) / 2, RES1.y1 - RES1.tuckinflap, RES1.y1, "red");
            createArrow((RES1.x1 + RES1.x2) / 2, RES1.y1 - RES1.tuckinflap, "F", "y", "red");
            createArrow((RES1.x1 + RES1.x2) / 2, RES1.y1, "L", "y", "red");
            createText((RES1.x1 + RES1.x2) / 2, ((RES1.y1 - RES1.tuckinflap) + RES1.y1) / 2, RES1.tuckinflap);
        }
        else if (RES1.Orient == "FourCornerHingedLid") {
            createcolour(RES1.x2 + RES1.length / 2, RES1.x2 + RES1.length / 2, RES1.y3, RES1.y3 - RES1.tuckinflap, "red");
            createArrow(RES1.x2 + RES1.length / 2, RES1.y3, "L", "y", "red");
            createArrow(RES1.x2 + RES1.length / 2, RES1.y3 - RES1.tuckinflap, "F", "y", "red");
            createText(RES1.x2 + RES1.length / 2, RES1.y3, RES1.tuckinflap);
        }
        else if (RES1.Orient == "FourCornerBox") {
            createcolour(RES1.x3 + RES1.length / 2, RES1.x3 + RES1.length / 2, RES1.y3, RES1.y3 + RES1.tuckinflap, "red");
            createArrow(RES1.x3 + RES1.length / 2, RES1.y3, "F", "y", "red");
            createArrow(RES1.x3 + RES1.length / 2, RES1.y3 + RES1.tuckinflap, "L", "y", "red");
            createText(RES1.x3 + RES1.length / 2, RES1.y3 + RES1.tuckinflap, RES1.tuckinflap);
        }
        if (RES1.Orient == "ReverseTuckAndTongue") {
            createcolour((RES1.x18 + RES1.x3 + RES1.length * 70 / 100) / 2, (RES1.x18 + RES1.x3 + RES1.length * 70 / 100) / 2, RES1.y9, RES1.y1, "red");
            createArrow((RES1.x18 + RES1.x3 + RES1.length * 70 / 100) / 2, RES1.y9, "F", "y", "red");
            createArrow((RES1.x18 + RES1.x3 + RES1.length * 70 / 100) / 2, RES1.y1, "L", "y", "red");
            createText(RES1.x18, (RES1.y9 + RES1.y10) / 2, RES1.tongueheight);
        }


        //for count sheetwidth And Sheetheight
        if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "ReverseTuckAndTongue") {
            createText(RES1.x3, RES1.y1 - RES1.width, "PaperSize-:" + RES1.SheetWidth + "x" + RES1.Sheetheight, "red");
        } else if (RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "CakeBox") {
            createText(RES1.x3, RES1.y2 + 5, "PaperSize-:" + RES1.SheetWidth + "x" + RES1.Sheetheight, "red");
        } else if (RES1.Orient == "UniversalCarton") {
            createText(RES1.x1, RES1.y1 * 20 / 100, "PaperSize-:" + RES1.SheetWidth + "x" + RES1.Sheetheight, "red");
        }
        else {
            createText(RES1.x1, RES1.y1 - RES1.width, "PaperSize-:" + RES1.SheetWidth + "x" + RES1.Sheetheight, "red");
        }
    }
    else {
        if (RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "ReverseTuckAndTongue" || RES1.Orient == "TuckToFrontOpenTop" || RES1.Orient == "CrashLockWithPastingNeckHolder" || RES1.Orient == "UniversalCarton" || RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createcolour(RES1.x1 + RES1.height * 40 / 100, RES1.x1 + RES1.height * 40 / 100, RES1.y1, RES1.y1 - RES1.pastingflap, "red");
            createArrow(RES1.x1 + RES1.height * 40 / 100, RES1.y1, "L", "y", "red");
            createArrow(RES1.x1 + RES1.height * 40 / 100, RES1.y1 - RES1.pastingflap, "F", "y", "red");
            createText(RES1.x1 + RES1.height * 40 / 100, (RES1.y1) / 2, RES1.pastingflap);

            createcolour((RES1.x1 + RES1.x2) / 2, (RES1.x1 + RES1.x2) / 2, RES1.y1, RES1.y2, "red");
            createArrow((RES1.x1 + RES1.x2) / 2, RES1.y1, "F", "y", "red");
            createArrow((RES1.x1 + RES1.x2) / 2, RES1.y2, "L", "y", "red");
            createText((RES1.x1 + RES1.x2) / 2 + 5, (RES1.y1 + RES1.length) / 2, RES1.length);

            createcolour(RES1.x1 + RES1.pastingflap, RES1.x1 + RES1.pastingflap, RES1.y2, RES1.y3, "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y2, "F", "y", "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y3, "L", "y", "red");
            createText(RES1.x1 + RES1.pastingflap, RES1.y2 + RES1.width / 2, RES1.width);

            createcolour(RES1.x1, RES1.x2, RES1.y3 + RES1.length * 15 / 100, RES1.y3 + RES1.length * 15 / 100, "red");
            createArrow(RES1.x1, RES1.y3 + RES1.length * 15 / 100, "F", "x", "red");
            createArrow(RES1.x2, RES1.y3 + RES1.length * 15 / 100, "L", "x", "red");
            createText((RES1.x1 + RES1.x2) / 2 - 5, RES1.y3 + RES1.length * 15 / 100, RES1.height);
        }

        if (RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "ReverseTuckAndTongue" || RES1.Orient == "TuckToFrontOpenTop" || RES1.Orient == "CrashLockWithPastingNeckHolder") {
            createcolour(RES1.x3, RES1.x4, RES1.y7, RES1.y7, "red");
            createArrow(RES1.x4, RES1.y7, "L", "x", "red");
            createArrow(RES1.x3, RES1.y7, "F", "x", "red");
            createText(RES1.x3, RES1.y7 - 5, RES1.tuckinflap);
        } else if (RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createcolour(RES1.x1, RES1.x1 - RES1.tuckinflap, RES1.y1 + RES1.length / 2, RES1.y1 + RES1.length / 2, "red");
            createArrow(RES1.x1, RES1.y1 + RES1.length / 2, "L", "x", "red");
            createArrow(RES1.x1 - RES1.tuckinflap, RES1.y1 + RES1.length / 2, "F", "x", "red");
            createText(RES1.x1 - RES1.tuckinflap, RES1.y1 + RES1.length / 2 - 2, RES1.tuckinflap);
        }
        if (RES1.Orient == "CrashLockWithPasting") {
            createcolour(RES1.x1, RES1.x18, RES1.y1 + RES1.length * 15 / 100, RES1.y1 + RES1.length * 15 / 100, "red");
            createArrow(RES1.x1, RES1.y1 + RES1.length * 15 / 100, "L", "x", "red");
            createArrow(RES1.x18, RES1.y1 + RES1.length * 15 / 100, "F", "x", "red");
            createText((RES1.x1 + RES1.x18) / 2, RES1.y1 + RES1.length * 15 / 100, RES1.CrashHeight);
        }
        if (RES1.Orient == "UniversalCarton") {
            createcolour(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y1 + RES1.length / 2, RES1.y1 + RES1.length / 2, "red");
            createArrow(RES1.x1 - RES1.height / 2, RES1.y1 + RES1.length / 2, "F", "x", "red");
            createArrow(RES1.x1, RES1.y1 + RES1.length / 2, "L", "x", "red");
            createText((RES1.x1 - RES1.height / 2), RES1.y1 + RES1.length / 2 - 2, RES1.length / 2);
        }
        if (RES1.Orient == "ReverseTuckAndTongue") {
            createcolour(RES1.x1, RES1.x9, RES1.y1 + RES1.length / 2, RES1.y1 + RES1.length / 2, "red");
            createArrow(RES1.x1, RES1.y1 + RES1.length / 2, "L", "x", "red");
            createArrow(RES1.x9, RES1.y1 + RES1.length / 2, "F", "x", "red");
            createText(RES1.x9, RES1.y1 + RES1.length / 2 - 2, RES1.tongueheight);
        }
        if (RES1.Orient == "CakeBox") {
            createcolour(RES1.x1 + RES1.pastingflap, RES1.x1 + RES1.pastingflap, RES1.y1, RES1.y1 - RES1.pastingflap, "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y1, "L", "y", "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y1 - RES1.pastingflap, "F", "y", "red");
            createText(RES1.x1 + RES1.pastingflap, RES1.y1, RES1.tuckinflap);

            createcolour(RES1.x1 + RES1.length / 2, RES1.x1 + RES1.length / 2, RES1.y1, RES1.y2, "red");
            createArrow(RES1.x1 + RES1.length / 2, RES1.y1, "F", "y", "red");
            createArrow(RES1.x1 + RES1.length / 2, RES1.y2, "L", "y", "red");
            createText(RES1.x1 + RES1.length / 2, RES1.y1 + RES1.width / 2, RES1.width);

            createcolour(RES1.x1 + RES1.pastingflap, RES1.x1 + RES1.pastingflap, RES1.y2, RES1.y3, "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y2, "F", "y", "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y3, "L", "y", "red");
            createText(RES1.x1 + RES1.pastingflap, RES1.y2 + RES1.height / 2, RES1.height);

            createcolour(RES1.x1, RES1.x2, RES1.y3 + RES1.width / 2, RES1.y3 + RES1.width / 2, "red");
            createArrow(RES1.x1, RES1.y3 + RES1.width / 2, "F", "x", "red");
            createArrow(RES1.x2, RES1.y3 + RES1.width / 2, "L", "x", "red");
            createText(RES1.x1 + RES1.length / 2, RES1.y3 + RES1.width / 2, RES1.length);
        }
        if (RES1.Orient == "FourCornerHingedLid") {
            createcolour(RES1.x3 - RES1.tuckinflap, RES1.x3, RES1.y2 + RES1.pastingflap, RES1.y2 + RES1.pastingflap, "red");
            createArrow(RES1.x3 - RES1.tuckinflap, RES1.y2 + RES1.pastingflap, "F", "x", "red");
            createArrow(RES1.x3, RES1.y2 + RES1.pastingflap, "L", "x", "red");
            createText(RES1.x3 - RES1.tuckinflap, RES1.y2 + RES1.pastingflap, RES1.tuckinflap);

            createcolour(RES1.x4, RES1.x4 + RES1.height, RES1.y2 + RES1.length / 2, RES1.y2 + RES1.length / 2, "red");
            createArrow(RES1.x4, RES1.y2 + RES1.length / 2, "F", "x", "red");
            createArrow(RES1.x4 + RES1.height, RES1.y2 + RES1.length / 2, "L", "x", "red");
            createText(RES1.x4 + RES1.width, RES1.y2 + RES1.length / 2, RES1.height);

            createcolour(RES1.x1, RES1.x2, RES1.y2 + RES1.pastingflap, RES1.y2 + RES1.pastingflap, "red");
            createArrow(RES1.x1, RES1.y2 + RES1.pastingflap, "F", "x", "red");
            createArrow(RES1.x2, RES1.y2 + RES1.pastingflap, "L", "x", "red");
            createText(RES1.x1 + RES1.width / 2, RES1.y2 + RES1.pastingflap, RES1.width);

            createcolour(RES1.x2 + RES1.height / 2, RES1.x2 + RES1.height / 2, RES1.y2, RES1.y3, "red");
            createArrow(RES1.x2 + RES1.height / 2, RES1.y2, "F", "y", "red");
            createArrow(RES1.x2 + RES1.height / 2, RES1.y3, "L", "y", "red");
            createText(RES1.x2 + RES1.height / 2, RES1.y2 + RES1.length / 2, RES1.length);

            createcolour(RES1.x1 + RES1.pastingflap, RES1.x1 + RES1.pastingflap, RES1.y1 - RES1.pastingflap, RES1.y1, "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y1 - RES1.pastingflap, "F", "y", "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y1, "L", "y", "red");
            createText(RES1.x1 + RES1.pastingflap, RES1.y1, RES1.pastingflap);

            createcolour(RES1.x4 + RES1.height / 2, RES1.x4 + RES1.height / 2, RES1.y2, RES1.y2 - RES1.FlapHeight, "red");
            createArrow(RES1.x4 + RES1.height / 2, RES1.y2, "L", "y", "red");
            createArrow(RES1.x4 + RES1.height / 2, RES1.y2 - RES1.FlapHeight, "F", "y", "red");
            createText(RES1.x4 + RES1.height / 2, (RES1.y2 + RES1.y2 - RES1.FlapHeight) / 2, RES1.FlapHeight);
        }
        if (RES1.Orient == "FourCornerBox") {
            createcolour(RES1.x3 - RES1.tuckinflap, RES1.x3, RES1.y3 + RES1.pastingflap, RES1.y3 + RES1.pastingflap, "red");
            createArrow(RES1.x3 - RES1.tuckinflap, RES1.y3 + RES1.pastingflap, "F", "x", "red");
            createArrow(RES1.x3, RES1.y3 + RES1.pastingflap, "L", "x", "red");
            createText(RES1.x3 - RES1.tuckinflap, RES1.y3 + RES1.pastingflap, RES1.tuckinflap);

            createcolour(RES1.x4, RES1.x4 + RES1.height, RES1.y3 + RES1.length / 2, RES1.y3 + RES1.length / 2, "red");
            createArrow(RES1.x4, RES1.y3 + RES1.length / 2, "F", "x", "red");
            createArrow(RES1.x4 + RES1.height, RES1.y3 + RES1.length / 2, "L", "x", "red");
            createText(RES1.x4 + RES1.width, RES1.y3 + RES1.length / 2, RES1.height)

            createcolour(RES1.x1, RES1.x2, RES1.y2 + RES1.pastingflap, RES1.y2 + RES1.pastingflap, "red");
            createArrow(RES1.x1, RES1.y2 + RES1.pastingflap, "F", "x", "red");
            createArrow(RES1.x2, RES1.y2 + RES1.pastingflap, "L", "x", "red");
            createText(RES1.x1 + RES1.width / 2, RES1.y2 + RES1.pastingflap, RES1.width);

            createcolour(RES1.x2 + RES1.height / 2, RES1.x2 + RES1.height / 2, RES1.y3, RES1.y4, "red");
            createArrow(RES1.x2 + RES1.height / 2, RES1.y3, "F", "y", "red");
            createArrow(RES1.x2 + RES1.height / 2, RES1.y4, "L", "y", "red");
            createText(RES1.x2 + RES1.height / 2, RES1.y3 + RES1.length / 2, RES1.length);

            createcolour(RES1.x1 + RES1.pastingflap, RES1.x1 + RES1.pastingflap, RES1.y1 - RES1.pastingflap, RES1.y1, "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y1 - RES1.pastingflap, "F", "y", "red");
            createArrow(RES1.x1 + RES1.pastingflap, RES1.y1, "L", "y", "red");
            createText(RES1.x1 + RES1.pastingflap, RES1.y1, RES1.pastingflap);


        }

    }
}


function CommonRecArea(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        // in this function if else condition used for handle dash array or dotted line 
        if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "UniversalCarton" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2);
        } else {
            createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 0);
        }
        if (RES1.Orient == "UniversalCarton" || RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 2);
            createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 2);
            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 2);
            createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y2, 2);
        } else {
            createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 0);
            createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 0);
            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 0);
            createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y2, 0);
        }

        if (RES1.Orient == "ReverseTuckIn") {
            createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1, 0);
        } else {
            createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1, 2);
        }
        createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 0);
        createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 2);
        createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 2);
        createnewelement(RES1.x3, RES1.x4, RES1.y2, RES1.y2, 2);
        createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y2, 0);
        createnewelement(RES1.x4, RES1.x5, RES1.y1, RES1.y1, 2);
        createnewelement(RES1.x4, RES1.x5, RES1.y2, RES1.y2, 2);
    } else {
        createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 0);//for the first line upper case accross grain 
        createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 0);
        createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 0);

        createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 0);//for second line accross grain 
        createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y3, 0);
        createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y3, 0);

        createnewelement(RES1.x1, RES1.x2, RES1.y3, RES1.y3, 0);//for third line accross grain
        createnewelement(RES1.x1, RES1.x1, RES1.y3, RES1.y4, 0);
        createnewelement(RES1.x2, RES1.x2, RES1.y3, RES1.y4, 0);

        createnewelement(RES1.x1, RES1.x2, RES1.y4, RES1.y4, 0);//for fourth line accross grain 
        createnewelement(RES1.x1, RES1.x1, RES1.y4, RES1.y5, 0);
        createnewelement(RES1.x2, RES1.x2, RES1.y4, RES1.y5, 0);

        createnewelement(RES1.x1, RES1.x2, RES1.y5, RES1.y5, 0);//for fifth line accross grain

    }

}

function drawPastingFlap(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        createnewelement(RES1.x1, RES1.x1 - RES1.pastingflap, RES1.y1, RES1.y1 + RES1.pastingflap * 20 / 100, 0); // for top down line
        createnewelement(RES1.x1 - RES1.pastingflap, RES1.x1 - RES1.pastingflap, RES1.y1 + RES1.pastingflap * 20 / 100, RES1.y2 - RES1.pastingflap * 20 / 100, 0); // for Straight line
        createnewelement(RES1.x1, RES1.x1 - RES1.pastingflap, RES1.y2, RES1.y2 - RES1.pastingflap * 20 / 100, 0); // for bottom up line
    } else {
        //for across grain pasting flap
        createnewelement(RES1.x1 + RES1.pastingflap * 20 / 100, RES1.x2 - RES1.pastingflap * 20 / 100, RES1.y1 - RES1.pastingflap, RES1.y1 - RES1.pastingflap, 0); // for Straight line
        createnewelement(RES1.x1, RES1.x1 + RES1.pastingflap * 20 / 100, RES1.y1, RES1.y1 - RES1.pastingflap, 0);
        createnewelement(RES1.x2, RES1.x2 - RES1.pastingflap * 20 / 100, RES1.y1, RES1.y1 - RES1.pastingflap, 0);
    }
}
function drawSecondPastingFlap(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        if (RES1.Orient == "FourCornerHingedLid") {
            createnewelement(RES1.x4, RES1.x4 + RES1.pastingflap, RES1.y1, RES1.y1 + RES1.pastingflap * 20 / 100, 0); // for top down line
            createnewelement(RES1.x4 + RES1.pastingflap, RES1.x4 + RES1.pastingflap, RES1.y1 + RES1.pastingflap * 20 / 100, RES1.y2 - RES1.pastingflap * 20 / 100, 0); // for Straight line
            createnewelement(RES1.x4, RES1.x4 + RES1.pastingflap, RES1.y2, RES1.y2 - RES1.pastingflap * 20 / 100, 0); // for bottom up line
        } else {
            //for four corner
            createnewelement(RES1.x6, RES1.x6 + RES1.pastingflap, RES1.y1, RES1.y1 + RES1.pastingflap * 20 / 100, 0); // for top down line
            createnewelement(RES1.x6 + RES1.pastingflap, RES1.x6 + RES1.pastingflap, RES1.y1 + RES1.pastingflap * 20 / 100, RES1.y2 - RES1.pastingflap * 20 / 100, 0); // for Straight line
            createnewelement(RES1.x6, RES1.x6 + RES1.pastingflap, RES1.y2, RES1.y2 - RES1.pastingflap * 20 / 100, 0); // for bottom up line
        }
    }
    else {
        if (RES1.Orient == "FourCornerHingedLid") {
            createnewelement(RES1.x1 + RES1.pastingflap * 20 / 100, RES1.x2 - RES1.pastingflap * 20 / 100, RES1.y4 + RES1.pastingflap, RES1.y4 + RES1.pastingflap, 0); // for Straight line
            createnewelement(RES1.x1, RES1.x1 + RES1.pastingflap * 20 / 100, RES1.y4, RES1.y4 + RES1.pastingflap, 0);
            createnewelement(RES1.x2, RES1.x2 - RES1.pastingflap * 20 / 100, RES1.y4, RES1.y4 + RES1.pastingflap, 0);
        }
        else {
            createnewelement(RES1.x1 + RES1.pastingflap * 20 / 100, RES1.x2 - RES1.pastingflap * 20 / 100, RES1.y6 + RES1.pastingflap, RES1.y6 + RES1.pastingflap, 0); // for Straight line
            createnewelement(RES1.x1, RES1.x1 + RES1.pastingflap * 20 / 100, RES1.y6, RES1.y6 + RES1.pastingflap, 0);
            createnewelement(RES1.x2, RES1.x2 - RES1.pastingflap * 20 / 100, RES1.y6, RES1.y6 + RES1.pastingflap, 0);
        }

    }


}
function UniversalCartonUpper(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        if (RES1.Orient == "UniversalCarton") {
            //for upper clouser
            createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y1 - RES1.height / 2, 0); // for universalclouser first length line
            createnewelement(RES1.x2 - 3, RES1.x2 - 3, RES1.y1, RES1.y1 - RES1.height / 2, 0); //  for universalclouser second length line
            createnewelement(RES1.x1, RES1.x2 - 3, RES1.y1 - RES1.height / 2, RES1.y1 - RES1.height / 2, 0);

            createnewelement(RES1.x2 + 3, RES1.x2 + 3, RES1.y1, RES1.y1 - RES1.height / 2, 0);
            createnewelement(RES1.x2 + 3, RES1.x3 - 3, RES1.y1 - RES1.height / 2, RES1.y1 - RES1.height / 2, 0);
            createnewelement(RES1.x3 - 3, RES1.x3 - 3, RES1.y1, RES1.y1 - RES1.height / 2, 0);

            createnewelement(RES1.x3 + 3, RES1.x3 + 3, RES1.y1, RES1.y1 - RES1.height / 2, 0);
            createnewelement(RES1.x4 - 3, RES1.x4 - 3, RES1.y1, RES1.y1 - RES1.height / 2, 0);
            createnewelement(RES1.x3 + 3, RES1.x4 - 3, RES1.y1 - RES1.height / 2, RES1.y1 - RES1.height / 2, 0);

            createnewelement(RES1.x4 + 3, RES1.x4 + 3, RES1.y1, RES1.y1 - RES1.height / 2, 0);
            createnewelement(RES1.x4 + 3, RES1.x5, RES1.y1 - RES1.height / 2, RES1.y1 - RES1.height / 2, 0);
            createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y1 - RES1.height / 2, 0);

            ////for bottom
            createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x2 - 3, RES1.x2 - 3, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x1, RES1.x2 - 3, RES1.y2 + RES1.height / 2, RES1.y2 + RES1.height / 2, 0);

            createnewelement(RES1.x2 + 3, RES1.x2 + 3, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x3 - 3, RES1.x3 - 3, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x2 + 3, RES1.x3 - 3, RES1.y2 + RES1.height / 2, RES1.y2 + RES1.height / 2, 0);

            createnewelement(RES1.x3 + 3, RES1.x3 + 3, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x4 - 3, RES1.x4 - 3, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x3 + 3, RES1.x4 - 3, RES1.y2 + RES1.height / 2, RES1.y2 + RES1.height / 2, 0);

            createnewelement(RES1.x4 + 3, RES1.x4 + 3, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y2 + RES1.height / 2, 0);
            createnewelement(RES1.x4 + 3, RES1.x5, RES1.y2 + RES1.height / 2, RES1.y2 + RES1.height / 2, 0);
        } else if (RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x2 - 3, RES1.x2 - 3, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x2 + 3, RES1.x2 + 3, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);

            createnewelement(RES1.x1, RES1.x2 - 3, RES1.y1 - RES1.tuckinflap, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x2 + 3, RES1.x3 - 3, RES1.y1 - RES1.tuckinflap, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x3 + 3, RES1.x4 - 3, RES1.y1 - RES1.tuckinflap, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x4 + 3, RES1.x5, RES1.y1 - RES1.tuckinflap, RES1.y1 - RES1.tuckinflap, 0);

            createnewelement(RES1.x3 - 3, RES1.x3 - 3, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x3 + 3, RES1.x3 + 3, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x4 - 3, RES1.x4 - 3, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);


            createnewelement(RES1.x4 + 3, RES1.x4 + 3, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);
            createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y1 - RES1.tuckinflap, 0);
        }
        //here allcode for across grain
    } else {
        if (RES1.Orient == "UniversalCarton") {
            //for bottom across grain universal carton
            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y1, RES1.y1, 0);
            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y2 - 3, RES1.y2 - 3, 0); //  for universalclouser second length line
            createnewelement(RES1.x1 - RES1.height / 2, RES1.x1 - RES1.height / 2, RES1.y1, RES1.y2 - 3, 0);


            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y2 + 3, RES1.y2 + 3, 0);
            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y3 - 3, RES1.y3 - 3, 0);
            createnewelement(RES1.x1 - RES1.height / 2, RES1.x1 - RES1.height / 2, RES1.y2 + 3, RES1.y3 - 3, 0);

            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y3 + 3, RES1.y3 + 3, 0);
            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y4 - 3, RES1.y4 - 3, 0);
            createnewelement(RES1.x1 - RES1.height / 2, RES1.x1 - RES1.height / 2, RES1.y3 + 3, RES1.y4 - 3, 0);

            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y4 + 3, RES1.y4 + 3, 0);
            createnewelement(RES1.x1, RES1.x1 - RES1.height / 2, RES1.y5, RES1.y5, 0);
            createnewelement(RES1.x1 - RES1.height / 2, RES1.x1 - RES1.height / 2, RES1.y4 + 3, RES1.y5, 0);
            //for Top across grain universal carton
            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y1, RES1.y1, 0);
            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y2 - 3, RES1.y2 - 3, 0); //  for universalclouser second length line
            createnewelement(RES1.x2 + RES1.height / 2, RES1.x2 + RES1.height / 2, RES1.y1, RES1.y2 - 3, 0);


            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y2 + 3, RES1.y2 + 3, 0);
            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y3 - 3, RES1.y3 - 3, 0);
            createnewelement(RES1.x2 + RES1.height / 2, RES1.x2 + RES1.height / 2, RES1.y2 + 3, RES1.y3 - 3, 0);

            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y3 + 3, RES1.y3 + 3, 0);
            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y4 - 3, RES1.y4 - 3, 0);
            createnewelement(RES1.x2 + RES1.height / 2, RES1.x2 + RES1.height / 2, RES1.y3 + 3, RES1.y4 - 3, 0);

            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y4 + 3, RES1.y4 + 3, 0);
            createnewelement(RES1.x2, RES1.x2 + RES1.height / 2, RES1.y5, RES1.y5, 0);
            createnewelement(RES1.x2 + RES1.height / 2, RES1.x2 + RES1.height / 2, RES1.y4 + 3, RES1.y5, 0);
        }
        else if (RES1.Orient == "UniversalOpenCrashLockWithPasting") {
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y1, RES1.y1, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y2 - 3, RES1.y2 - 3, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1 - RES1.tuckinflap, RES1.y1, RES1.y2 - 3, 0);

            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y2 + 3, RES1.y2 + 3, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y3 - 3, RES1.y3 - 3, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1 - RES1.tuckinflap, RES1.y2 + 3, RES1.y3 - 3, 0);

            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y3 + 3, RES1.y3 + 3, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y4 - 3, RES1.y4 - 3, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1 - RES1.tuckinflap, RES1.y3 + 3, RES1.y4 - 3, 0);

            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y4 + 3, RES1.y4 + 3, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1, RES1.y5, RES1.y5, 0);
            createnewelement(RES1.x1 - RES1.tuckinflap, RES1.x1 - RES1.tuckinflap, RES1.y4 + 3, RES1.y5, 0);

        }

    }

}
function DrawTongue(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        //for first top tonugue line
        createnewelement(RES1.x18, RES1.x18, RES1.y1, RES1.y9, 0);
        createnewelement(RES1.x3 + RES1.length * 70 / 100, RES1.x3 + RES1.length * 70 / 100, RES1.y1, RES1.y9, 0);
        createnewelement(RES1.x18, RES1.x3 + RES1.length * 70 / 100, RES1.y9, RES1.y9, 0);
        //////for second top tonugue
        createnewelement(RES1.x18, RES1.x18, RES1.y1, RES1.y10, 0);
        createnewelement(RES1.x3 + RES1.length * 70 / 100, RES1.x3 + RES1.length * 70 / 100, RES1.y1, RES1.y10, 0);
        createnewelement(RES1.x18, RES1.x3 + RES1.length * 70 / 100, RES1.y10, RES1.y10, 0);
        ////for second top tonugue line
        createnewelement(RES1.x19, RES1.x19, RES1.y2, RES1.y11, 0);
        createnewelement(RES1.x20, RES1.x20, RES1.y2, RES1.y11, 0);
        createnewelement(RES1.x19, RES1.x20, RES1.y11, RES1.y11, 0);

        createnewelement(RES1.x19, RES1.x19, RES1.y2, RES1.y12, 0);
        createnewelement(RES1.x20, RES1.x20, RES1.y2, RES1.y12, 0);
        createnewelement(RES1.x19, RES1.x20, RES1.y12, RES1.y12, 0);
    } else {
        createnewelement(RES1.x1, RES1.x9, RES1.y14, RES1.y14, 0);
        createnewelement(RES1.x1, RES1.x9, RES1.y15, RES1.y15, 0);
        createnewelement(RES1.x9, RES1.x9, RES1.y14, RES1.y15, 0);

        createnewelement(RES1.x1, RES1.x10, RES1.y14, RES1.y14, 0);
        createnewelement(RES1.x1, RES1.x10, RES1.y15, RES1.y15, 0);
        createnewelement(RES1.x10, RES1.x10, RES1.y14, RES1.y15, 0);

        createnewelement(RES1.x2, RES1.x11, RES1.y16, RES1.y16, 0);
        createnewelement(RES1.x2, RES1.x11, RES1.y17, RES1.y17, 0);
        createnewelement(RES1.x11, RES1.x11, RES1.y16, RES1.y17, 0);

        createnewelement(RES1.x2, RES1.x12, RES1.y16, RES1.y16, 0);
        createnewelement(RES1.x2, RES1.x12, RES1.y17, RES1.y17, 0);
        createnewelement(RES1.x12, RES1.x12, RES1.y16, RES1.y17, 0);

    }
}

function DrawTuckinUperclauser(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        if (RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "StandardStraightTuckInNested") {
            if (RES1.TuckinType !== "" && RES1.TuckinType !== null) {
                if (RES1.TuckinType == "T") {
                    // for curve middle line
                    createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0);
                    //for top curve
                    create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4, 0);
                    create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4, 0);
                    //for reverse tucking top clouser
                    createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1, 0);
                    createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1, 0);
                    createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                    //for upper right cut
                    createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0)
                    //for left upper cut
                    createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0)
                } else {
                    // for curve middle line
                    createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0);
                    //for top curve
                    create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4, 0);
                    create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4, 0);
                    //for reverse tucking top clouser
                    createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1, 0);
                    createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1, 0);
                    createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                    //for upper right cut
                    createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 - 4, 0)
                    //for left upper cut
                    createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 - 4, 0)
                }

            }
            else {
                createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0); // for curve middle line
                //for top curve
                create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4, 0);
                create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4, 0);
                //for upper clouser
                createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1, 0);
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1, 0);
                createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                //for right upper cut
                createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0);
                //for left upper cut
                createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0);

                // for bottom
                createnewelement(RES1.x11, RES1.x13, RES1.y6, RES1.y6, 0); // for line
                //for top curve
                create_new_curve(RES1.x10, RES1.x11, RES1.y5, RES1.y6, 0);
                create_new_curve(RES1.x12, RES1.x13, RES1.y5, RES1.y6, 0);
                //for bottom clouser
                createnewelement(RES1.x10, RES1.x10, RES1.y5, RES1.y2, 0);
                createnewelement(RES1.x12, RES1.x12, RES1.y5, RES1.y2, 0);
                createnewelement(RES1.x10, RES1.x12, RES1.y5, RES1.y5, 2);
                //for right bottom cut
                createnewelement(RES1.x10, RES1.x11, RES1.y5, RES1.y5, 0);
                createnewelement(RES1.x11, RES1.x11, RES1.y5, RES1.y5 - 4, 0);
                //for left bottom cut
                createnewelement(RES1.x12, RES1.x13, RES1.y5, RES1.y5, 0);
                createnewelement(RES1.x13, RES1.x13, RES1.y5, RES1.y5 - 4, 0);
            }
        } else {

            if (RES1.TuckinType !== "" && RES1.TuckinType !== null) {
                if (RES1.TuckinType == "T") {
                    createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0); // for line
                    //for top curve
                    create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4, 0);
                    create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4, 0);

                    createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1, 0);
                    createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1, 0);
                    createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                    //for left upper cut
                    createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0)

                    createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0)
                } else {
                    createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0); // for line
                    //for top curve
                    create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4, 0);
                    create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4, 0);

                    createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y2, 0);
                    createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y2, 0);
                    createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                    //for left upper cut
                    createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
                    createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 - 4, 0);

                    createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
                    createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 - 4, 0);
                }

            } else {
                // for top
                createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0); // for line
                //for top curve
                create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4, 0);
                create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4, 0);
                //for upper clouser
                createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1, 0);
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1, 0);
                createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);

                //for left upper cut
                createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0)
                createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0)

                createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0)
                createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0)

                // for bottom
                createnewelement(RES1.x11, RES1.x13, RES1.y6, RES1.y6, 0, 2); // for line
                //for top curve
                create_new_curve(RES1.x10, RES1.x11, RES1.y5, RES1.y6, 0);
                create_new_curve(RES1.x12, RES1.x13, RES1.y5, RES1.y6, 0);
                //for bottom clouser
                createnewelement(RES1.x10, RES1.x10, RES1.y5, RES1.y2, 0);
                createnewelement(RES1.x12, RES1.x12, RES1.y5, RES1.y2, 0);
                createnewelement(RES1.x10, RES1.x12, RES1.y5, RES1.y5, 2);
                //for right bottom cut
                createnewelement(RES1.x10, RES1.x11, RES1.y5, RES1.y5, 0)
                createnewelement(RES1.x11, RES1.x11, RES1.y5, RES1.y5 - 4, 0)

                createnewelement(RES1.x12, RES1.x13, RES1.y5, RES1.y5, 0)
                createnewelement(RES1.x13, RES1.x13, RES1.y5, RES1.y5 - 4, 0)
            }
        }
    } else {// for across grain tuckin code
        if (RES1.TuckinType !== "" && RES1.TuckinType !== null) {
            if (RES1.TuckinType == "T") {
                if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "TuckToFrontOpenTop" || RES1.Orient == "CrashLockWithPastingNeckHolder") {
                    //for Top
                    //for first Accross clouser 
                    createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 0);
                    createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 0);
                    createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 2);

                    createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0);
                    create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y1, 0);
                    create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y2, 0);
                    ////for top right side cut
                    createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y1 + 5, 0);
                    createnewelement(RES1.x3, RES1.x3 - 5, RES1.y1 + 5, RES1.y1 + 5, 0);
                    createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y2 - 5, 0);
                    createnewelement(RES1.x3, RES1.x3 - 5, RES1.y2 - 5, RES1.y2 - 5, 0);
                } else if (RES1.Orient == "StandardStraightTuckIn") {
                    createnewelement(RES1.x2, RES1.x3, RES1.y3, RES1.y3, 0);
                    createnewelement(RES1.x2, RES1.x3, RES1.y4, RES1.y4, 0);
                    createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y4, 0);

                    createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0);
                    create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y3, 0);
                    create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y4, 0);
                }
            }
            else {
                if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "TuckToFrontOpenTop") {
                    //for Bottom
                    //for second Accross clouser 
                    createnewelement(RES1.x1, RES1.x3, RES1.y3, RES1.y3, 0)
                    createnewelement(RES1.x1, RES1.x3, RES1.y4, RES1.y4, 0)
                    createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y4, 2)
                    ////for first Across Grain Tuckin 
                    createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0)
                    create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y3, 0);
                    create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y4, 0);

                    //for bottom left side cut
                    createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y3 + 5, 0);
                    createnewelement(RES1.x3, RES1.x3 + 5, RES1.y3 + 5, RES1.y3 + 5, 0);
                    createnewelement(RES1.x3, RES1.x3, RES1.y4, RES1.y4 - 5, 0);
                    createnewelement(RES1.x3, RES1.x3 + 5, RES1.y4 - 5, RES1.y4 - 5, 0);

                }
                else if (RES1.Orient == "StandardStraightTuckInNested") {
                    //for Bottom
                    //for second Accross clouser 
                    createnewelement(RES1.x1, RES1.x3, RES1.y1, RES1.y1, 0)
                    createnewelement(RES1.x1, RES1.x3, RES1.y2, RES1.y2, 0)
                    createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 0)
                    //for first Across Grain Tuckin 
                    createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0)
                    create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y1, 0);
                    create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y2, 0);
                }

            }
        } else {
            if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "ReverseTuckAndTongue") {
                //for both Across Grain 
                //for first Accross clouser 
                createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 0);
                createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 2);
                ////for curve
                createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0);
                create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y1, 0);
                create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y2, 0);

                ////for top right side cut
                createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y1 + 5, 0);
                createnewelement(RES1.x3, RES1.x3 - 5, RES1.y1 + 5, RES1.y1 + 5, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y2 - 5, 0);
                createnewelement(RES1.x3, RES1.x3 - 5, RES1.y2 - 5, RES1.y2 - 5, 0);


                //for bottom left side cut
                createnewelement(RES1.x5, RES1.x5, RES1.y3, RES1.y3 + 5, 0);
                createnewelement(RES1.x5, RES1.x5 + 5, RES1.y3 + 5, RES1.y3 + 5, 0);
                createnewelement(RES1.x5, RES1.x5, RES1.y4, RES1.y4 - 5, 0)
                createnewelement(RES1.x5, RES1.x5 + 5, RES1.y4 - 5, RES1.y4 - 5, 0)

                //for second Accross clouser 
                createnewelement(RES1.x1, RES1.x5, RES1.y3, RES1.y3, 0)
                createnewelement(RES1.x1, RES1.x5, RES1.y4, RES1.y4, 0)
                createnewelement(RES1.x5, RES1.x5, RES1.y3, RES1.y4, 2)
                //for curve    
                createnewelement(RES1.x6, RES1.x6, RES1.y8, RES1.y9, 0)
                create_new_curve(RES1.x6, RES1.x5, RES1.y8, RES1.y3, 0);
                create_new_curve(RES1.x6, RES1.x5, RES1.y9, RES1.y4, 0);
            }
            else if (RES1.Orient == "StandardStraightTuckIn") {
                //for first Accross clouser 
                createnewelement(RES1.x2, RES1.x3, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x2, RES1.x3, RES1.y4, RES1.y4, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y4, 2);
                //for curve
                createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0);
                create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y3, 0);
                create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y4, 0);
                //for upper left side cut
                createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y3 + 5, 0);
                createnewelement(RES1.x3, RES1.x3 - 5, RES1.y3 + 5, RES1.y3 + 5, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y4, RES1.y4 - 5, 0);
                createnewelement(RES1.x3, RES1.x3 - 5, RES1.y4 - 5, RES1.y4 - 5, 0);



                ////for second Accross clouser 
                createnewelement(RES1.x1, RES1.x5, RES1.y3, RES1.y3, 0)
                createnewelement(RES1.x1, RES1.x5, RES1.y4, RES1.y4, 0)
                createnewelement(RES1.x5, RES1.x5, RES1.y3, RES1.y4, 2)
                //for curve    
                createnewelement(RES1.x6, RES1.x6, RES1.y6, RES1.y7, 0)
                create_new_curve(RES1.x6, RES1.x5, RES1.y6, RES1.y3, 0);
                create_new_curve(RES1.x6, RES1.x5, RES1.y7, RES1.y4, 0);

                //for bottom left side cut
                createnewelement(RES1.x5, RES1.x5, RES1.y3, RES1.y3 + 5, 0);
                createnewelement(RES1.x5, RES1.x5 + 5, RES1.y3 + 5, RES1.y3 + 5, 0);
                createnewelement(RES1.x5, RES1.x5, RES1.y4, RES1.y4 - 5, 0);
                createnewelement(RES1.x5, RES1.x5 + 5, RES1.y4 - 5, RES1.y4 - 5, 0);
            } else if (RES1.Orient == "StandardStraightTuckInNested") {
                createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 0);
                createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 2);

                createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0);
                create_new_curve(RES1.x4, RES1.x3, RES1.y6, RES1.y1, 0);
                create_new_curve(RES1.x4, RES1.x3, RES1.y7, RES1.y2, 0);
                // first cut for Across grain standered staighttuck In nested
                createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y1 + 5, 0);
                createnewelement(RES1.x3, RES1.x3 - 5, RES1.y1 + 5, RES1.y1 + 5, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y2 - 5, 0);
                createnewelement(RES1.x3, RES1.x3 - 5, RES1.y2 - 5, RES1.y2 - 5, 0);

                //for Bottom
                //for second Accross clouser 
                ////for second Accross clouser 
                createnewelement(RES1.x1, RES1.x5, RES1.y1, RES1.y1, 0)
                createnewelement(RES1.x1, RES1.x5, RES1.y2, RES1.y2, 0)
                createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y2, 2)
                ////for curve    
                createnewelement(RES1.x6, RES1.x6, RES1.y6, RES1.y7, 0)
                create_new_curve(RES1.x6, RES1.x5, RES1.y6, RES1.y1, 0);
                create_new_curve(RES1.x6, RES1.x5, RES1.y7, RES1.y2, 0);
                //second cut for standered staight tuckin nested
                createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y1 + 5, 0);
                createnewelement(RES1.x5, RES1.x5 + 5, RES1.y1 + 5, RES1.y1 + 5, 0);
                createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y2 - 5, 0);
                createnewelement(RES1.x5, RES1.x5 + 5, RES1.y2 - 5, RES1.y2 - 5, 0);

            }
        }
    }


}
function DrawHingedLid(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        if (RES1.Orient == "FourCornerHingedLid") {
            createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 2)

            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 2)

            createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x3, RES1.x4, RES1.y2, RES1.y2, 2)

            createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y2, 2)
            //for y axis upper height
            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y4, 0)
            createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y4, 0)
            createnewelement(RES1.x2, RES1.x3, RES1.y4, RES1.y4, 2)
            //for y axis lower height
            createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y2 + RES1.height, 0)
            createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y2 + RES1.height, 0)
            createnewelement(RES1.x2, RES1.x3, RES1.y2 + RES1.height, RES1.y2 + RES1.height, 0)
            //for clouser flap
            createnewelement(RES1.x2, RES1.x2, RES1.y3, RES1.y1 - RES1.height, 0)
            createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y1 - RES1.height, 0)
            createnewelement(RES1.x2, RES1.x3, RES1.y3, RES1.y3, 2)

            //createnewelement(RES1.x5, RES1.x6, RES1.y3 - RES1.tuckinflap, RES1.y3 - RES1.tuckinflap);
            //for top curve
            create_new_curve(RES1.x2, RES1.x5, RES1.y3, RES1.y3 - RES1.tuckinflap, 0);
            create_new_curve(RES1.x3, RES1.x6, RES1.y3, RES1.y3 - RES1.tuckinflap, 0);
            createnewelement(RES1.x5, RES1.x6, RES1.y3 - RES1.tuckinflap, RES1.y3 - RES1.tuckinflap, 0);
            //for dust upper
            createnewelement(RES1.x7, RES1.x7, RES1.y1, RES1.y4 + RES1.height * 20 / 100, 0)
            createnewelement(RES1.x7, RES1.x2, RES1.y4 + RES1.height * 20 / 100, RES1.y4, 0)

            createnewelement(RES1.x8, RES1.x8, RES1.y1, RES1.y4 + RES1.height * 20 / 100, 0)
            createnewelement(RES1.x8, RES1.x3, RES1.y4 + RES1.height * 20 / 100, RES1.y4, 0)
            //for dust bottom
            createnewelement(RES1.x7, RES1.x7, RES1.y2, RES1.y2 + RES1.height * 80 / 100, 0)
            createnewelement(RES1.x7, RES1.x2, RES1.y2 + RES1.height * 80 / 100, RES1.y2 + RES1.height, 0)

            createnewelement(RES1.x8, RES1.x8, RES1.y2, RES1.y2 + RES1.height * 80 / 100, 0)
            createnewelement(RES1.x8, RES1.x3, RES1.y2 + RES1.height * 80 / 100, RES1.y2 + RES1.height, 0)
        } else {
            //
            //for all rect area
            createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 0)

            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 2)

            createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x3, RES1.x4, RES1.y2, RES1.y2, 2)


            createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x4, RES1.x5, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x4, RES1.x5, RES1.y2, RES1.y2, 2)

            createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y2, 2)
            createnewelement(RES1.x5, RES1.x6, RES1.y1, RES1.y1, 0)
            createnewelement(RES1.x5, RES1.x6, RES1.y2, RES1.y2, 0)

            createnewelement(RES1.x6, RES1.x6, RES1.y1, RES1.y2, 2)

            //for y -axis first height
            createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y5, 0)
            createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y5, 0)
            createnewelement(RES1.x3, RES1.x4, RES1.y5, RES1.y5, 2)

            createnewelement(RES1.x3, RES1.x3, RES1.y5, RES1.y4, 0)
            createnewelement(RES1.x4, RES1.x4, RES1.y5, RES1.y4, 0)
            createnewelement(RES1.x3, RES1.x4, RES1.y4, RES1.y4, 2)

            //FOR Y-AXIS SECOND HEIGHT
            createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y6, 0)
            createnewelement(RES1.x4, RES1.x4, RES1.y2, RES1.y6, 0)
            createnewelement(RES1.x3, RES1.x4, RES1.y6, RES1.y6, 2)

            createnewelement(RES1.x3, RES1.x3, RES1.y6, RES1.y7, 0)
            createnewelement(RES1.x4, RES1.x4, RES1.y6, RES1.y7, 0)
            createnewelement(RES1.x3, RES1.x4, RES1.y7, RES1.y7, 2)

            //FOR UPPER TUCKIN
            create_new_curve(RES1.x3, RES1.x7, RES1.y4, RES1.y4 - RES1.tuckinflap, 0);
            create_new_curve(RES1.x4, RES1.x8, RES1.y4, RES1.y4 - RES1.tuckinflap, 0);
            createnewelement(RES1.x7, RES1.x8, RES1.y4 - RES1.tuckinflap, RES1.y4 - RES1.tuckinflap, 0);
            //FOR LOWER TUCKIN
            create_new_curve(RES1.x3, RES1.x7, RES1.y7, RES1.y7 + RES1.tuckinflap, 0);
            create_new_curve(RES1.x4, RES1.x8, RES1.y7, RES1.y7 + RES1.tuckinflap, 0);
            createnewelement(RES1.x7, RES1.x8, RES1.y7 + RES1.tuckinflap, RES1.y7 + RES1.tuckinflap, 0);
            // FOR UPPER DUST
            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y8, 0)
            createnewelement(RES1.x2, RES1.x3, RES1.y8, RES1.y5, 0)
            createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y8, 0)
            createnewelement(RES1.x5, RES1.x4, RES1.y8, RES1.y5, 0)
            //FOR BOTTOM DUST
            createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y9, 0)
            createnewelement(RES1.x2, RES1.x3, RES1.y9, RES1.y6, 0)
            createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y9, 0)
            createnewelement(RES1.x5, RES1.x4, RES1.y9, RES1.y6, 0)
        }

    }
    else {
        if (RES1.Orient == "FourCornerHingedLid") {
            createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 0)

            createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y3, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y3, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y3, RES1.y3, 0)

            createnewelement(RES1.x1, RES1.x1, RES1.y3, RES1.y4, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y3, RES1.y4, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y4, RES1.y4, 2)

            createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y3, 2)
            createnewelement(RES1.x3, RES1.x4, RES1.y2, RES1.y2, 0)
            createnewelement(RES1.x3, RES1.x4, RES1.y3, RES1.y3, 0)
            createnewelement(RES1.x4, RES1.x4, RES1.y2, RES1.y3, 0)
            createnewelement(RES1.x4, RES1.x1, RES1.y2, RES1.y2, 0)
            createnewelement(RES1.x4, RES1.x1, RES1.y3, RES1.y3, 0)

            createnewelement(RES1.x2, RES1.x5, RES1.y2, RES1.y2, 0)
            createnewelement(RES1.x2, RES1.x5, RES1.y3, RES1.y3, 0)
            createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y3, 0)

            //for curve hing lid
            create_new_curve(RES1.x3 - RES1.tuckinflap, RES1.x3, RES1.y2 + RES1.tuckinflap / 2, RES1.y2, 0)
            create_new_curve(RES1.x3 - RES1.tuckinflap, RES1.x3, RES1.y3 - RES1.tuckinflap / 2, RES1.y3, 0)
            createnewelement(RES1.x3 - RES1.tuckinflap, RES1.x3 - RES1.tuckinflap, RES1.y2 + RES1.tuckinflap / 2, RES1.y3 - RES1.tuckinflap / 2, 0)

            createnewelement(RES1.x1 - RES1.height * 80 / 100, RES1.x1, RES1.y5, RES1.y5, 0)
            createnewelement(RES1.x1 - RES1.height * 80 / 100, RES1.x4, RES1.y5, RES1.y2, 0)

            createnewelement(RES1.x1 - RES1.height * 80 / 100, RES1.x1, RES1.y6, RES1.y6, 0)
            createnewelement(RES1.x1 - RES1.height * 80 / 100, RES1.x4, RES1.y6, RES1.y3, 0)

            createnewelement(RES1.x2 + RES1.height * 80 / 100, RES1.x2, RES1.y5, RES1.y5, 0)
            createnewelement(RES1.x2 + RES1.height * 80 / 100, RES1.x5, RES1.y5, RES1.y2, 0)
            createnewelement(RES1.x2 + RES1.height * 80 / 100, RES1.x2, RES1.y6, RES1.y6, 0)
            createnewelement(RES1.x2 + RES1.height * 80 / 100, RES1.x5, RES1.y6, RES1.y3, 0)
        }
        else {
            createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2)
            createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 2)

            createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y3, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y3, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y3, RES1.y3, 2)

            createnewelement(RES1.x1, RES1.x1, RES1.y3, RES1.y4, 2)
            createnewelement(RES1.x2, RES1.x2, RES1.y3, RES1.y4, 2)
            createnewelement(RES1.x1, RES1.x2, RES1.y4, RES1.y4, 2)

            createnewelement(RES1.x1, RES1.x1, RES1.y4, RES1.y5, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y4, RES1.y5, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y5, RES1.y5, 2)

            createnewelement(RES1.x1, RES1.x1, RES1.y5, RES1.y6, 0)
            createnewelement(RES1.x2, RES1.x2, RES1.y5, RES1.y6, 0)
            createnewelement(RES1.x1, RES1.x2, RES1.y6, RES1.y6, 2)

            //for first x axis height
            createnewelement(RES1.x3, RES1.x4, RES1.y3, RES1.y3, 0)
            createnewelement(RES1.x3, RES1.x4, RES1.y4, RES1.y4, 0)
            createnewelement(RES1.x4, RES1.x4, RES1.y3, RES1.y4, 2)
            createnewelement(RES1.x3, RES1.x3, RES1.y3, RES1.y4, 2)
            //for second x axis height
            createnewelement(RES1.x4, RES1.x1, RES1.y3, RES1.y3, 0)
            createnewelement(RES1.x4, RES1.x1, RES1.y4, RES1.y4, 0)
            //for third x axis height
            createnewelement(RES1.x2, RES1.x5, RES1.y3, RES1.y3, 0)
            createnewelement(RES1.x2, RES1.x5, RES1.y4, RES1.y4, 0)
            createnewelement(RES1.x5, RES1.x5, RES1.y3, RES1.y4, 2)
            //for fouth x axis height
            createnewelement(RES1.x5, RES1.x6, RES1.y3, RES1.y3, 0)
            createnewelement(RES1.x5, RES1.x6, RES1.y4, RES1.y4, 0)
            createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y4, 2)
            //for flap
            createnewelement(RES1.x7, RES1.x1, RES1.y2, RES1.y2, 0)
            createnewelement(RES1.x7, RES1.x4, RES1.y2, RES1.y3, 0)
            //second flap
            createnewelement(RES1.x7, RES1.x1, RES1.y5, RES1.y5, 0)
            createnewelement(RES1.x7, RES1.x4, RES1.y5, RES1.y4, 0)
            //third flap
            createnewelement(RES1.x8, RES1.x2, RES1.y2, RES1.y2, 0)
            createnewelement(RES1.x8, RES1.x5, RES1.y2, RES1.y3, 0)
            //fourth flap
            createnewelement(RES1.x8, RES1.x2, RES1.y5, RES1.y5, 0)
            createnewelement(RES1.x8, RES1.x5, RES1.y5, RES1.y4, 0)


            ////for first curve for four corner box
            create_new_curve(RES1.x3 - RES1.tuckinflap, RES1.x3, RES1.y3 + RES1.tuckinflap / 2, RES1.y3, 0)
            create_new_curve(RES1.x3 - RES1.tuckinflap, RES1.x3, RES1.y4 - RES1.tuckinflap / 2, RES1.y4, 0)
            createnewelement(RES1.x3 - RES1.tuckinflap, RES1.x3 - RES1.tuckinflap, RES1.y3 + RES1.tuckinflap / 2, RES1.y4 - RES1.tuckinflap / 2, 0)
            ////for second curve for four corner box
            create_new_curve(RES1.x6 + RES1.tuckinflap, RES1.x6, RES1.y3 + RES1.tuckinflap / 2, RES1.y3, 0)
            create_new_curve(RES1.x6 + RES1.tuckinflap, RES1.x6, RES1.y4 - RES1.tuckinflap / 2, RES1.y4, 0)
            createnewelement(RES1.x6 + RES1.tuckinflap, RES1.x6 + RES1.tuckinflap, RES1.y3 + RES1.tuckinflap / 2, RES1.y4 - RES1.tuckinflap / 2, 0)

        }
    }


}
function DrawNeckHolder(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        createnewelement(RES1.x2, RES1.x14, RES1.y7, RES1.y7, 0);
        createnewelement(RES1.x3, RES1.x15, RES1.y7, RES1.y7, 0);
        create_new_curve(RES1.x14, RES1.x16, RES1.y7, RES1.y13, 0);//for curve
        create_new_curve(RES1.x15, RES1.x16, RES1.y7, RES1.y13, 0);//for curve


        //for middle circle
        create_circle(RES1.x3 + RES1.length / 2, RES1.y12 + RES1.width / 2, RES1.CircleRadious);
        //for middle neckholder clouser
        createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y8, 0);
        createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y8, 0);
        createnewelement(RES1.x3, RES1.x4, RES1.y8, RES1.y8, 0);
        createnewelement(RES1.x3, RES1.x3, RES1.y8, RES1.y12, 0);
        createnewelement(RES1.x4, RES1.x4, RES1.y8, RES1.y12, 0);
        createnewelement(RES1.x3, RES1.x4, RES1.y12, RES1.y12, 0);
        //for second dust
        createnewelement(RES1.x4, RES1.x4 + RES1.width * 30 / 100, RES1.y7, RES1.y7, 0);
        createnewelement(RES1.x5, RES1.x5 - RES1.width * 30 / 100, RES1.y7, RES1.y7, 0);
        createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y7, 0);
        create_new_curve(RES1.x4 + RES1.width * 30 / 100, RES1.x4 + RES1.width / 2, RES1.y7, RES1.y13, 0);//for curve
        create_new_curve(RES1.x5 - RES1.width * 30 / 100, RES1.x4 + RES1.width / 2, RES1.y7, RES1.y13, 0);//for curve
    }
    else {
        //for dust
        createnewelement(RES1.x7, RES1.x7, RES1.y2, RES1.y10, 0);
        createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y11, 0);
        //for round area
        //createnewelement(RES1.x2, RES1.x7 - RES1.tuckinflap*30/100, RES1.y11, RES1.y11, 0);
        create_new_curve(RES1.x12, RES1.x7, RES1.y12, RES1.y11, 0);//for curve
        create_new_curve(RES1.x12, RES1.x7, RES1.y12, RES1.y10, 0);//for curve
        //create_new_curve(RES1.x1 - RES1.CrashHeight, RES1.x1, RES1.y4, RES1.y4 + RES1.width , 0);//for curve


        //for clouser
        createnewelement(RES1.x2, RES1.x8, RES1.y3, RES1.y3, 0);
        createnewelement(RES1.x2, RES1.x8, RES1.y4, RES1.y4, 0);
        createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y4, 0);
        createnewelement(RES1.x8, RES1.x8 + RES1.width, RES1.y3, RES1.y3, 0);
        createnewelement(RES1.x8, RES1.x8 + RES1.width, RES1.y4, RES1.y4, 0);
        createnewelement(RES1.x8 + RES1.width, RES1.x8 + RES1.width, RES1.y3, RES1.y4, 0);

        createnewelement(RES1.x2, RES1.x7, RES1.y5, RES1.y5, 0);
        createnewelement(RES1.x7, RES1.x7, RES1.y4 + RES1.width * 30 / 100, RES1.y4, 0);
        createnewelement(RES1.x7, RES1.x7, RES1.y5 - RES1.width * 30 / 100, RES1.y5, 0);
        create_new_curve(RES1.x12, RES1.x7, RES1.y4 + RES1.width / 2, RES1.y4 + RES1.width * 30 / 100, 0);//for curve
        create_new_curve(RES1.x12, RES1.x7, RES1.y4 + RES1.width / 2, RES1.y5 - RES1.width * 30 / 100, 0);

        //for middle circule
        create_circle(RES1.x8 + RES1.width / 2, RES1.y3 + RES1.length / 2, RES1.CircleRadious);

    }
}
function DrawcakeBox(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        //for rect area
        createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 0)
        createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2)
        createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 2)

        createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 0)
        createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 2)
        createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 2)

        createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2, 0)
        createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1, 2)
        createnewelement(RES1.x3, RES1.x4, RES1.y2, RES1.y2, 2)

        createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y2, 0)
        createnewelement(RES1.x4, RES1.x5, RES1.y1, RES1.y1, 2)
        createnewelement(RES1.x4, RES1.x5, RES1.y2, RES1.y2, 2)
        createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y2, 0)
        //FOR UPPER CLOUSER
        createnewelement(RES1.x1, RES1.x6, RES1.y1, RES1.y3, 0)
        createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y5, 0)

        createnewelement(RES1.x2, RES1.x7, RES1.y1, RES1.y3, 0)
        createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y5, 0)
        createnewelement(RES1.x6, RES1.x7, RES1.y5, RES1.y5, 0)

        //FOR LOWER CLOUSER
        createnewelement(RES1.x1, RES1.x6, RES1.y2, RES1.y4, 0)
        createnewelement(RES1.x6, RES1.x6, RES1.y4, RES1.y6, 0)

        createnewelement(RES1.x2, RES1.x7, RES1.y2, RES1.y4, 0)
        createnewelement(RES1.x7, RES1.x7, RES1.y4, RES1.y6, 0)
        createnewelement(RES1.x6, RES1.x7, RES1.y6, RES1.y6, 0)
        //FOR MIDDLE UPPER CLOUSER
        createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y5, 0)
        createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y5, 0)
        createnewelement(RES1.x3, RES1.x4, RES1.y5, RES1.y5, 0)
        createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0)

        //FOR MIDDLE LOWER CLOUSER
        createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y6, 0)
        createnewelement(RES1.x4, RES1.x4, RES1.y2, RES1.y6, 0)
        createnewelement(RES1.x3, RES1.x4, RES1.y6, RES1.y6, 0)
        createnewelement(RES1.x8, RES1.x9, RES1.y4, RES1.y4, 0)
        //FOR UPPER DUST
        createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y5, 0)
        createnewelement(RES1.x2, RES1.x3 - 3, RES1.y5, RES1.y5, 0)
        createnewelement(RES1.x3 - 3, RES1.x10, RES1.y5, RES1.y3, 0)
        createnewelement(RES1.x3, RES1.x10, RES1.y1, RES1.y3, 0)
        //for second upper dust
        createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y5, 0)
        createnewelement(RES1.x4 + 3, RES1.x5, RES1.y5, RES1.y5, 0)
        createnewelement(RES1.x4, RES1.x11, RES1.y1, RES1.y3, 0)
        createnewelement(RES1.x4 + 3, RES1.x11, RES1.y5, RES1.y3, 0)
        //FOR lower DUST
        createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y6, 0)
        createnewelement(RES1.x2, RES1.x3 - 3, RES1.y6, RES1.y6, 0)
        createnewelement(RES1.x3 - 3, RES1.x10, RES1.y6, RES1.y4, 0)
        createnewelement(RES1.x3, RES1.x10, RES1.y2, RES1.y4, 0)
        //for second lower dust
        createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y6, 0)
        createnewelement(RES1.x4 + 3, RES1.x5, RES1.y6, RES1.y6, 0)
        createnewelement(RES1.x4 + 3, RES1.x11, RES1.y6, RES1.y4, 0)
        createnewelement(RES1.x4, RES1.x11, RES1.y2, RES1.y4, 0)
    } else {
        //for cake box rect area across grain 
        createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 2);
        createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2, 2);
        createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2);
        createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2, 0);

        createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y3, 2);
        createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y3, 2);
        createnewelement(RES1.x1, RES1.x2, RES1.y3, RES1.y3, 0);

        createnewelement(RES1.x1, RES1.x1, RES1.y3, RES1.y4, 2);
        createnewelement(RES1.x2, RES1.x2, RES1.y3, RES1.y4, 2);
        createnewelement(RES1.x1, RES1.x2, RES1.y4, RES1.y4, 0);

        createnewelement(RES1.x1, RES1.x1, RES1.y4, RES1.y5, 2);
        createnewelement(RES1.x2, RES1.x2, RES1.y4, RES1.y5, 2);
        createnewelement(RES1.x1, RES1.x2, RES1.y5, RES1.y5, 0);
        //for clouser top
        createnewelement(RES1.x1, RES1.x3, RES1.y1, RES1.y6, 0);
        createnewelement(RES1.x3, RES1.x5, RES1.y6, RES1.y6, 0);
        createnewelement(RES1.x1, RES1.x3, RES1.y2, RES1.y7, 0);
        createnewelement(RES1.x3, RES1.x5, RES1.y7, RES1.y7, 0);
        createnewelement(RES1.x5, RES1.x5, RES1.y6, RES1.y7, 0);
        //for uppar dust
        createnewelement(RES1.x1, RES1.x5, RES1.y2, RES1.y2, 0);
        createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y3 - 3, 0);
        createnewelement(RES1.x5, RES1.x3, RES1.y3 - 3, RES1.y8, 0);
        createnewelement(RES1.x3, RES1.x1, RES1.y8, RES1.y3, 0);
        //for middle upper clouser
        createnewelement(RES1.x1, RES1.x5, RES1.y3, RES1.y3, 0);
        createnewelement(RES1.x1, RES1.x5, RES1.y4, RES1.y4, 0);
        createnewelement(RES1.x5, RES1.x5, RES1.y3, RES1.y4, 0);
        createnewelement(RES1.x3, RES1.x3, RES1.y9, RES1.y10, 0);

        //for uppar clouser
        createnewelement(RES1.x1, RES1.x5, RES1.y5, RES1.y5, 0);
        createnewelement(RES1.x5, RES1.x5, RES1.y4 + 3, RES1.y5, 0);

        createnewelement(RES1.x5, RES1.x3, RES1.y4 + 3, RES1.y11, 0);
        createnewelement(RES1.x3, RES1.x1, RES1.y11, RES1.y4, 0);

        //for clouser bottom
        createnewelement(RES1.x2, RES1.x4, RES1.y1, RES1.y6, 0);
        createnewelement(RES1.x4, RES1.x6, RES1.y6, RES1.y6, 0);

        createnewelement(RES1.x2, RES1.x4, RES1.y2, RES1.y7, 0);
        createnewelement(RES1.x4, RES1.x6, RES1.y7, RES1.y7, 0);
        createnewelement(RES1.x6, RES1.x6, RES1.y6, RES1.y7, 0);

        //for bottom dust
        createnewelement(RES1.x2, RES1.x6, RES1.y2, RES1.y2, 0);
        createnewelement(RES1.x6, RES1.x6, RES1.y2, RES1.y3 - 3, 0);
        createnewelement(RES1.x6, RES1.x4, RES1.y3 - 3, RES1.y8, 0);
        createnewelement(RES1.x4, RES1.x2, RES1.y8, RES1.y3, 0);

        //for middle bottom clouser
        createnewelement(RES1.x2, RES1.x6, RES1.y3, RES1.y3, 0);
        createnewelement(RES1.x2, RES1.x6, RES1.y4, RES1.y4, 0);
        createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y4, 0);
        createnewelement(RES1.x4, RES1.x4, RES1.y9, RES1.y10, 0);
        //for Bottom clouser
        createnewelement(RES1.x2, RES1.x6, RES1.y5, RES1.y5, 0);
        createnewelement(RES1.x6, RES1.x6, RES1.y4 + 3, RES1.y5, 0);

        createnewelement(RES1.x6, RES1.x4, RES1.y4 + 3, RES1.y11, 0);
        createnewelement(RES1.x4, RES1.x2, RES1.y11, RES1.y4, 0);


    }


}

function Drawdust(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        if (RES1.DustType !== "" && RES1.DustType !== null) {
            if (RES1.DustType == "T") {
                if (RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "TuckToFrontOpenTop") {
                    // for standard
                    createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y7, 0)
                    createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y1, 0)

                    createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y1, 0)
                    createnewelement(RES1.x4, RES1.x15, RES1.y7, RES1.y7, 0)

                } else {
                    //for reverse
                    createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y7, 0)
                    createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y1, 0)
                    createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                    createnewelement(RES1.x5, RES1.x15, RES1.y7, RES1.y7, 0)
                    createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y1, 0)
                }
            } else {
                if (RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "TuckToFrontOpenTop") {
                    createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y7, 0)
                    createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y2, 0)
                    createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y2, 0)
                    createnewelement(RES1.x5, RES1.x15, RES1.y7, RES1.y7, 0)
                    createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y2, 0)
                } else {
                    // for bottom dust flap
                    createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y2, 0)
                    createnewelement(RES1.x3, RES1.x14, RES1.y7, RES1.y7, 0)

                    //createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                    createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y2, 0)
                    createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y7, 0)
                }
            }
        } else {
            if (RES1.Orient == "StandardStraightTuckIn") {
                createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y7, 0)
                createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y1, 0)

                //createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x4, RES1.x15, RES1.y7, RES1.y7, 0)
                // for bottom
                createnewelement(RES1.x16, RES1.x2, RES1.y8, RES1.y2, 0)
                createnewelement(RES1.x16, RES1.x3, RES1.y8, RES1.y8, 0)

                createnewelement(RES1.x17, RES1.x5, RES1.y8, RES1.y2, 0)
                createnewelement(RES1.x17, RES1.x4, RES1.y8, RES1.y8, 0)
            }
            else if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "ReverseTuckAndTongue") {
                // for top 
                createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x2, RES1.x14, RES1.y7, RES1.y7, 0)

                createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y7, 0)
                createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y1, 0)
                // for bottom
                createnewelement(RES1.x16, RES1.x2, RES1.y8, RES1.y2, 0)
                createnewelement(RES1.x16, RES1.x3, RES1.y8, RES1.y8, 0)

                createnewelement(RES1.x17, RES1.x5, RES1.y8, RES1.y2, 0)
                createnewelement(RES1.x17, RES1.x4, RES1.y8, RES1.y8, 0)
            }
            else if (RES1.Orient == "StandardStraightTuckInNested") {
                createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y7, 0)
                createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x5, RES1.x15, RES1.y7, RES1.y7, 0)
                createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y1, 0)

                createnewelement(RES1.x14, RES1.x2, RES1.y8, RES1.y8, 0)
                createnewelement(RES1.x14, RES1.x3, RES1.y8, RES1.y2, 0)
                createnewelement(RES1.x5, RES1.x5, RES1.y8, RES1.y2, 0)
                createnewelement(RES1.x5, RES1.x15, RES1.y8, RES1.y8, 0)
                createnewelement(RES1.x15, RES1.x4, RES1.y8, RES1.y2, 0)
            }
        }
    } else {
        //here dust code acorss grain
        if (RES1.DustType !== "" && RES1.DustType !== null) {
            if (RES1.DustType == "T") {
                if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "StandardStraightTuckInNested" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "TuckToFrontOpenTop") {
                    //for Top
                    //for first upper Accross dust 
                    createnewelement(RES1.x7, RES1.x7, RES1.y2, RES1.y10, 0)
                    createnewelement(RES1.x7, RES1.x2, RES1.y10, RES1.y3, 0)
                    createnewelement(RES1.x2, RES1.x7, RES1.y5, RES1.y5, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y5, RES1.y11, 0)
                    createnewelement(RES1.x7, RES1.x2, RES1.y11, RES1.y4, 0)
                }
                else if (RES1.Orient == "StandardStraightTuckIn") {
                    createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y10, 0)
                    createnewelement(RES1.x7, RES1.x2, RES1.y10, RES1.y2, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y11, RES1.y4, 0)
                    createnewelement(RES1.x7, RES1.x2, RES1.y11, RES1.y5, 0)
                }

            } else {
                if (RES1.Orient == "StandardStraightTuckIn" || RES1.Orient == "ReverseTuckIn" || RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "CrashLockWithoutPasting" || RES1.Orient == "TuckToFrontOpenTop") {
                    //for Bottom
                    //for second bottom Accross dust 
                    createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y10, 0)
                    createnewelement(RES1.x1, RES1.x7, RES1.y2, RES1.y10, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y4, RES1.y11, 0)
                    createnewelement(RES1.x7, RES1.x1, RES1.y11, RES1.y5, 0)
                }
                else if (RES1.Orient == "StandardStraightTuckInNested") {
                    createnewelement(RES1.x7, RES1.x7, RES1.y2, RES1.y10, 0)
                    createnewelement(RES1.x1, RES1.x7, RES1.y3, RES1.y10, 0)
                    createnewelement(RES1.x1, RES1.x7, RES1.y5, RES1.y5, 0)
                    createnewelement(RES1.x7, RES1.x7, RES1.y11, RES1.y5, 0)
                    createnewelement(RES1.x1, RES1.x7, RES1.y4, RES1.y11, 0)
                }
            }
        } else {
            if (RES1.Orient == "ReverseTuckIn" || RES1.Orient == "ReverseTuckAndTongue") {
                //for both Across Grain 
                //for first Accross clouser 
                createnewelement(RES1.x7, RES1.x7, RES1.y2, RES1.y10, 0)
                createnewelement(RES1.x7, RES1.x2, RES1.y10, RES1.y3, 0)
                createnewelement(RES1.x2, RES1.x7, RES1.y5, RES1.y5, 0)
                createnewelement(RES1.x7, RES1.x7, RES1.y5, RES1.y11, 0)
                createnewelement(RES1.x7, RES1.x2, RES1.y11, RES1.y4, 0)

                //for second Accross clouser 
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y12, 0)
                createnewelement(RES1.x1, RES1.x8, RES1.y2, RES1.y12, 0)
                createnewelement(RES1.x8, RES1.x8, RES1.y4, RES1.y13, 0)
                createnewelement(RES1.x8, RES1.x1, RES1.y13, RES1.y5, 0)
            }
            else if (RES1.Orient == "StandardStraightTuckIn") {
                createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y10, 0)
                createnewelement(RES1.x7, RES1.x2, RES1.y10, RES1.y2, 0)
                createnewelement(RES1.x7, RES1.x7, RES1.y11, RES1.y4, 0)
                createnewelement(RES1.x7, RES1.x2, RES1.y11, RES1.y5, 0)

                //for second Accross clouser 
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y12, 0)
                createnewelement(RES1.x1, RES1.x8, RES1.y2, RES1.y12, 0)
                createnewelement(RES1.x8, RES1.x8, RES1.y4, RES1.y13, 0)
                createnewelement(RES1.x8, RES1.x1, RES1.y13, RES1.y5, 0)
            }
            else if (RES1.Orient == "StandardStraightTuckInNested") {
                createnewelement(RES1.x7, RES1.x7, RES1.y2, RES1.y10, 0)
                createnewelement(RES1.x7, RES1.x2, RES1.y10, RES1.y3, 0)
                createnewelement(RES1.x7, RES1.x2, RES1.y5, RES1.y5, 0)
                createnewelement(RES1.x7, RES1.x7, RES1.y11, RES1.y5, 0)
                createnewelement(RES1.x2, RES1.x7, RES1.y4, RES1.y11, 0)

                ////for second Accross clouser 
                createnewelement(RES1.x8, RES1.x8, RES1.y2, RES1.y12, 0)
                createnewelement(RES1.x1, RES1.x8, RES1.y3, RES1.y12, 0)
                createnewelement(RES1.x1, RES1.x8, RES1.y5, RES1.y5, 0)
                createnewelement(RES1.x8, RES1.x8, RES1.y5, RES1.y13, 0)
                createnewelement(RES1.x8, RES1.x1, RES1.y13, RES1.y4, 0)

            }

        }

    }
}


function crashlock(RES1) {
    if (RES1.GrainDirection == "WithGrain") {
        if (RES1.crashType === "T") {
            if (RES1.Orient === "CrashLockWithPasting") {
                createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x1, RES1.x18, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y10, 0);
                createnewelement(RES1.x20, RES1.x19, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x2, RES1.x20, RES1.y1, RES1.y10, 2);
                createnewelement(RES1.x20, RES1.x2, RES1.y10, RES1.y9, 0);
                createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y9, 0);
                //for first bottom dust
                createnewelement(RES1.x3, RES1.x2 + RES1.width * 50 / 100, RES1.y1, RES1.y10, 0);
                createnewelement(RES1.x2, RES1.x2 + RES1.width * 50 / 100, RES1.y10, RES1.y10, 0);
                //for second bottom clouser
                createnewelement(RES1.x3, RES1.x18 + RES1.width + RES1.length, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x18 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y9, RES1.y10, 0);
                createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x2 + RES1.width + RES1.length, RES1.x20 + RES1.width + RES1.length, RES1.y1, RES1.y10, 2);
                createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x2 + RES1.width + RES1.length, RES1.y10, RES1.y9, 0);
                createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y9, 0);
                //for second bottom dust
                createnewelement(RES1.x4, RES1.x4 + RES1.width * 50 / 100, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x5, RES1.x4 + RES1.width * 50 / 100, RES1.y1, RES1.y10, 0);

            } else if (RES1.Orient == "CrashLockWithoutPasting") {
                createnewelement(RES1.x1, RES1.x18, RES1.y1, RES1.y10, 0);
                createnewelement(RES1.x2, RES1.x19, RES1.y1, RES1.y10, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y10, RES1.y9, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y9, RES1.y10, 0);

                //for dust
                createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x2 + RES1.width / 2, RES1.x3, RES1.y10, RES1.y1, 0);
                createnewelement(RES1.x2, RES1.x2 + RES1.width * 60 / 100, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x2 + RES1.width * 60 / 100, RES1.x2 + RES1.width / 2, RES1.y9, RES1.y10, 0);

                //for middle clouser
                createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x3, RES1.x3 + RES1.length * 30 / 100, RES1.y9, RES1.y9, 0);

                createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x4, RES1.x4 - RES1.length * 30 / 100, RES1.y9, RES1.y9, 0);

                createnewelement(RES1.x3 + RES1.length * 30 / 100, RES1.x4 - RES1.length * 30 / 100, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x3 + RES1.length * 30 / 100, RES1.x3 + RES1.length * 30 / 100, RES1.y9, RES1.y10, 0);
                createnewelement(RES1.x4 - RES1.length * 30 / 100, RES1.x4 - RES1.length * 30 / 100, RES1.y9, RES1.y10, 0);

                createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x5, RES1.x5 - RES1.width * 60 / 100, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x4, RES1.x5 - RES1.width / 2, RES1.y1, RES1.y10, 0);
                createnewelement(RES1.x5 - RES1.width * 60 / 100, RES1.x5 - RES1.width / 2, RES1.y9, RES1.y10, 0);;

            }
        } else {
            if (RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "UniversalOpenCrashLockWithPasting" || RES1.Orient == "CrashLockWithPastingNeckHolder") {
                //for first bottom clouser
                createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y9, 0);
                createnewelement(RES1.x1, RES1.x18, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y10, 0);
                createnewelement(RES1.x20, RES1.x19, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x2, RES1.x20, RES1.y2, RES1.y10, 2);
                createnewelement(RES1.x20, RES1.x2, RES1.y10, RES1.y9, 0);
                createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y9, 0);
                //for first bottom dust
                createnewelement(RES1.x3, RES1.x2 + RES1.width * 50 / 100, RES1.y2, RES1.y10, 0);
                createnewelement(RES1.x2, RES1.x2 + RES1.width * 50 / 100, RES1.y10, RES1.y10, 0);
                //for second bottom clouser
                //createnewelement(RES1.x3, RES1.x18 + RES1.width + RES1.length, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y9, 0);
                createnewelement(RES1.x18 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y9, RES1.y10, 0);
                createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x2 + RES1.width + RES1.length, RES1.x20 + RES1.width + RES1.length, RES1.y2, RES1.y10, 2);
                createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x2 + RES1.width + RES1.length, RES1.y10, RES1.y9, 0);
                createnewelement(RES1.x4, RES1.x4, RES1.y2, RES1.y9, 0);
                //for second bottom dust
                createnewelement(RES1.x4, RES1.x4 + RES1.width * 50 / 100, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x5, RES1.x4 + RES1.width * 50 / 100, RES1.y2, RES1.y10, 0);
            }
            else if (RES1.Orient == "CrashLockWithoutPasting") {
                createnewelement(RES1.x18, RES1.x1, RES1.y10, RES1.y2, 0);
                createnewelement(RES1.x19, RES1.x2, RES1.y10, RES1.y2, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y10, RES1.y9, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y10, RES1.y9, 0);

                //for dust
                createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y9, 0);
                createnewelement(RES1.x2 + RES1.width / 2, RES1.x3, RES1.y10, RES1.y2, 0);
                createnewelement(RES1.x2, RES1.x2 + RES1.width * 60 / 100, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x2 + RES1.width * 60 / 100, RES1.x2 + RES1.width / 2, RES1.y9, RES1.y10, 0);

                //for middle clouser
                createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y9, 0);
                createnewelement(RES1.x3, RES1.x3 + RES1.length * 30 / 100, RES1.y9, RES1.y9, 0);

                createnewelement(RES1.x4, RES1.x4, RES1.y2, RES1.y9, 0);
                createnewelement(RES1.x4, RES1.x4 - RES1.length * 30 / 100, RES1.y9, RES1.y9, 0);

                createnewelement(RES1.x3 + RES1.length * 30 / 100, RES1.x4 - RES1.length * 30 / 100, RES1.y10, RES1.y10, 0);
                createnewelement(RES1.x3 + RES1.length * 30 / 100, RES1.x3 + RES1.length * 30 / 100, RES1.y9, RES1.y10, 0);
                createnewelement(RES1.x4 - RES1.length * 30 / 100, RES1.x4 - RES1.length * 30 / 100, RES1.y9, RES1.y10, 0);

                createnewelement(RES1.x5, RES1.x5, RES1.y2, RES1.y9, 0);
                createnewelement(RES1.x5, RES1.x5 - RES1.width * 60 / 100, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x4, RES1.x5 - RES1.width / 2, RES1.y2, RES1.y10, 0);
                createnewelement(RES1.x5 - RES1.width * 60 / 100, RES1.x5 - RES1.width / 2, RES1.y9, RES1.y10, 0);
            }

        }
    } else {
        if (RES1.crashType === "T") {
            if (RES1.Orient === "CrashLockWithPasting" || RES1.Orient === "UniversalOpenCrashLockWithPasting") {
                createnewelement(RES1.x2, RES1.x18, RES1.y1, RES1.y1, 0);
                createnewelement(RES1.x2, RES1.x18, RES1.y2, RES1.y2, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y14, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y14, RES1.y15, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y2, RES1.y15, 0);
                createnewelement(RES1.x19, RES1.x2, RES1.y15, RES1.y2, 2);

                createnewelement(RES1.x19, RES1.x19, RES1.y2, RES1.y2 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x2, RES1.x19, RES1.y3, RES1.y2 + RES1.width * 60 / 100, 0);

                createnewelement(RES1.x2, RES1.x18, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y3, RES1.y16, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y16, RES1.y17, 0);


                createnewelement(RES1.x19, RES1.x19, RES1.y17, RES1.y18, 0);
                createnewelement(RES1.x18, RES1.x2, RES1.y4, RES1.y4, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y4, RES1.y18, 0);
                createnewelement(RES1.x2, RES1.x19, RES1.y4, RES1.y18, 2);
                createnewelement(RES1.x19, RES1.x19, RES1.y4, RES1.y4 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x2, RES1.x19, RES1.y5, RES1.y4 + RES1.width * 60 / 100, 0);

            } else if (RES1.Orient == "CrashLockWithoutPasting") {
                createnewelement(RES1.x2, RES1.x18, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x2, RES1.x18, RES1.y2, RES1.y14, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y14, RES1.y14, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y9, RES1.y14, 0);
                ////for bottom first dust 
                createnewelement(RES1.x2, RES1.x19, RES1.y2, RES1.y2, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y2, RES1.y2 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y2 + RES1.width / 2, RES1.y2 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x2, RES1.y2 + RES1.width / 2, RES1.y3, 0);
                //for second bottom dust
                createnewelement(RES1.x2, RES1.x19, RES1.y5, RES1.y5, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y5, RES1.y5 - RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y5 - RES1.width / 2, RES1.y5 - RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x2, RES1.y5 - RES1.width / 2, RES1.y4, 0);


                createnewelement(RES1.x2, RES1.x19, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y3, RES1.y15, 0);
                createnewelement(RES1.x19, RES1.x18, RES1.y15, RES1.y15, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y15, RES1.y16, 0);

                createnewelement(RES1.x2, RES1.x19, RES1.y4, RES1.y4, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y4, RES1.y16, 0);
                createnewelement(RES1.x19, RES1.x18, RES1.y16, RES1.y16, 0);

            }
        } else {
            if (RES1.Orient == "CrashLockWithPasting" || RES1.Orient == "UniversalOpenCrashLockWithPasting" || RES1.Orient == "CrashLockWithPastingNeckHolder") {
                //for first bottom clouser
                createnewelement(RES1.x1, RES1.x18, RES1.y1, RES1.y1, 0);
                createnewelement(RES1.x1, RES1.x18, RES1.y2, RES1.y2, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y1, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y14, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y14, RES1.y15, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y2, RES1.y15, 0);
                createnewelement(RES1.x19, RES1.x1, RES1.y15, RES1.y2, 2);

                createnewelement(RES1.x19, RES1.x19, RES1.y2, RES1.y2 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x1, RES1.x19, RES1.y3, RES1.y2 + RES1.width * 60 / 100, 0);

                createnewelement(RES1.x1, RES1.x18, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y3, RES1.y16, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y16, RES1.y17, 0);


                createnewelement(RES1.x19, RES1.x19, RES1.y17, RES1.y18, 0);
                createnewelement(RES1.x18, RES1.x1, RES1.y4, RES1.y4, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y4, RES1.y18, 0);
                createnewelement(RES1.x1, RES1.x19, RES1.y4, RES1.y18, 2);
                createnewelement(RES1.x19, RES1.x19, RES1.y4, RES1.y4 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x1, RES1.x19, RES1.y5, RES1.y4 + RES1.width * 60 / 100, 0);
            }
            else if (RES1.Orient == "CrashLockWithoutPasting") {
                createnewelement(RES1.x1, RES1.x18, RES1.y1, RES1.y9, 0)
                createnewelement(RES1.x1, RES1.x18, RES1.y2, RES1.y14, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y9, RES1.y9, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y14, RES1.y14, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y9, RES1.y14, 0);
                //for bottom first dust 
                createnewelement(RES1.x1, RES1.x19, RES1.y2, RES1.y2, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y2, RES1.y2 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y2 + RES1.width / 2, RES1.y2 + RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x1, RES1.y2 + RES1.width / 2, RES1.y3, 0);
                //for second bottom dust
                createnewelement(RES1.x1, RES1.x19, RES1.y5, RES1.y5, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y5, RES1.y5 - RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x19, RES1.y5 - RES1.width / 2, RES1.y5 - RES1.width * 60 / 100, 0);
                createnewelement(RES1.x18, RES1.x1, RES1.y5 - RES1.width / 2, RES1.y4, 0);


                createnewelement(RES1.x1, RES1.x19, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y3, RES1.y15, 0);
                createnewelement(RES1.x19, RES1.x18, RES1.y15, RES1.y15, 0);
                createnewelement(RES1.x18, RES1.x18, RES1.y15, RES1.y16, 0);

                createnewelement(RES1.x1, RES1.x19, RES1.y4, RES1.y4, 0);
                createnewelement(RES1.x19, RES1.x19, RES1.y4, RES1.y16, 0);
                createnewelement(RES1.x19, RES1.x18, RES1.y16, RES1.y16, 0);


            }

        }

    }

}

//for CreateNewElement
function createnewelement(x1, x2, y1, y2, dasharray) {

    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("stroke", "black")
    newLine.setAttribute("stroke-width", 0.2)
    newLine.setAttribute("stroke-dasharray", dasharray);

    $("g").append(newLine);

}
///for line
function createcolour(x1, x2, y1, y2, stroke) {

    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("stroke", stroke);
    newLine.setAttribute("stroke-width", 0.2);
    $("g").append(newLine);

}

function createText(x, y, text, stroke) {

    var newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    newText.setAttribute('x', x);
    newText.setAttribute('y', y);
    newText.setAttributeNS(null, "font-size", "7");
    newText.setAttribute("fill", stroke);
    newText.setAttribute("stroke-width", "0.3");

    newText.appendChild(document.createTextNode(text + "mm"));
    $("g").append(newText);


}
function createArrow(x, y, type, pos, stroke) {
    if (pos === "x") {
        if (type === "F") {
            createcolour(x, x + 2, y, y + 2, stroke);
            createcolour(x, x + 2, y, y - 2, stroke);
        } else {
            createcolour(x, x - 2, y, y + 2, stroke);
            createcolour(x, x - 2, y, y - 2, stroke);
        }
    } else {
        if (type === "F") {
            createcolour(x, x + 2, y, y + 2, stroke);
            createcolour(x, x - 2, y, y + 2, stroke);
        } else {
            createcolour(x, x + 2, y, y - 2, stroke);
            createcolour(x, x - 2, y, y - 2, stroke);
        }
    }
}

function create_new_curve(x1, x2, y1, y2) {
    var string = 'M' + ' ' + x1 + ' ' + y1 + ' ' + 'Q' + ' ' + x1 + ' ' + y2 + ' ' + x2 + ' ' + y2
    var newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    newpath.setAttribute("d", string)
    newpath.setAttribute("stroke", "black")
    newpath.setAttribute("stroke-width", 0.2)
    newpath.setAttribute("fill", "transparent")
    $("g").append(newpath);
}

function draw_Gripper(RES1) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', 0);
    newLine.setAttribute('y1', 0);
    if (RES1.Gripper_Side === "T") {
        newLine.setAttribute('x2', 0);
        newLine.setAttribute('y2', RES1.Gripper);
        newLine.setAttribute("stroke-width", RES1.SheetWidth + 'mm');
    } else {
        newLine.setAttribute('x2', RES1.Gripper);
        newLine.setAttribute('y2', 0);
        newLine.setAttribute("stroke-width", RES1.Sheetheight + 'mm');
    }
    newLine.setAttribute("stroke", "green");
    $("g").append(newLine);
}

function draw_ColorStrip(RES1) {
    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', RES1.SheetWidth);
    newLine.setAttribute('y1', RES1.Sheetheight);

    if (RES1.Gripper_Side === "T") {
        newLine.setAttribute('x2', RES1.SheetWidth );
        newLine.setAttribute('y2', RES1.Sheetheight - RES1.Color_Strip );
        newLine.setAttribute("stroke-width", RES1.SheetWidth + 'mm');
    } else {
        newLine.setAttribute('x2', RES1.SheetWidth - RES1.Color_Strip);
        newLine.setAttribute('y2', RES1.Sheetheight);
        newLine.setAttribute("stroke-width", RES1.Sheetheight +'mm' );
    }

    newLine.setAttribute("stroke", "red");
    $("g").append(newLine);
}

function create_circle(cx, cy, r) {

    //var string = 'M' + ' ' + x1 + ' ' + y1 + ' ' + 'Q' + ' ' + x1 + ' ' + y2 + ' ' + x2 + ' ' + y2
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", 0.1);
    circle.setAttribute("fill", "transparent")
    $("g").append(circle);

}

document.querySelector("#SaveSVG").onclick = function () {
    saveSvg(document.getElementById("mysvg"), Orient + '_' + "KeyLine")
};

function saveSvg(svgEl, name) {

    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;

    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

