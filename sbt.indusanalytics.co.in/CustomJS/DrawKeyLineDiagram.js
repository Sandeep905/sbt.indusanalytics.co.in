"use strict";

var queryString = new Array();
if (window.location.search.split('?').length > 1) {
    var params = window.location.search.split('?')[1].split('&');
    for (var i = 0; i < params.length; i++) {
        var key = params[i].split('=')[0];
        var value = decodeURIComponent(params[i].split('=')[1]).replace(/"/g, '');
        queryString[key] = value;
    }

    var ObjInputData = [];
    var rowData = {};
    var splStr = queryString["inputdata"].substr(1).slice(0, -1).split(",");

    for (key in splStr) {
        var spKey = splStr[key].split(':');
        rowData[spKey[0]] = spKey[1];
    }

    ObjInputData.push(rowData);

    $.ajax({
        type: "POST",
        url: "WebService_Keyline.asmx/GetDataToDrawKeyline",
        data: '{ObjInputData:' + JSON.stringify(ObjInputData) + '}',
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
            var RES1 = JSON.parse(res.toString());
            var svg = document.getElementById("mysvg");
            svg.setAttribute("width", RES1[0].SheetWidth + "mm");
            svg.setAttribute("height", RES1[0].Sheetheight + "mm");
            WriteTextVal(RES1[0]);

            for (let x = 0; x <= RES1[0].Upsx * RES1[0].UpsY - 1; x++) {
                if (RES1[x].Orient === "ReverseTuckIn") {
                    drawReverseTuckIn(RES1[x]);
                } else if (RES1[x].Orient === "StandardStraightTuckIn") {
                    StandardStraightTuckIn(RES1[x]);
                } else if (RES1[x].Orient === "StandardStraightTuckInNested") {
                    StandardStraightTuckInNested(RES1[x]);
                } else if (RES1[x].Orient === "CrashLockBottom") {
                    CrashLockBottom(RES1[x]);
                }
            }
        },
        error: function errorFunc(jqXHR) {
            //   $("#image-indicator").dxLoadPanel("instance").option("visible", false);
            console.log(jqXHR);
        }
    });
}

function drawReverseTuckIn(RES1) {
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
//for the all red line and text
function WriteTextVal(RES1) {
    createcolour(RES1.x1, RES1.x1 - RES1.pastingflap, Number(RES1.y2) / 2, Number(RES1.y2) / 2, "red");
    createArrow(RES1.x1, Number(RES1.y2) / 2, "L", "x", "red");
    createArrow(RES1.x1 - RES1.pastingflap, Number(RES1.y2) / 2, "F", "x", "red");
    createText(RES1.x1, Number(RES1.y2) / 2, RES1.pastingflap);

    createcolour(RES1.x7, RES1.x7, RES1.y3, RES1.y4, "red");
    createArrow(RES1.x7, RES1.y4, "F", "y", "red");
    createArrow(RES1.x7, RES1.y3, "L", "y", "red");
    createText(RES1.x7, (RES1.y3 + RES1.y4) / 2, RES1.tuckinflap);

    createcolour(RES1.x1, RES1.x2, (RES1.y1 + RES1.y2) / 2, (RES1.y1 + RES1.y2) / 2, "red");
    createArrow(RES1.x1, (RES1.y1 + RES1.y2) / 2, "F", "x", "red");
    createArrow(RES1.x2, (RES1.y1 + RES1.y2) / 2, "L", "x", "red");
    createText(RES1.x1, (RES1.y1 + RES1.y2) / 2 + 5, RES1.length);

    createcolour(RES1.x9, RES1.x9, RES1.y1, RES1.y2, "red");
    createArrow(RES1.x9, RES1.y1, "F", "y", "red");
    createArrow(RES1.x9, RES1.y2, "L", "y", "red");
    createText(RES1.x9, (RES1.y1 + RES1.y2) / 2 - 5, RES1.height);

    createcolour(RES1.x2, RES1.x3, RES1.y1 + RES1.pastingflap, RES1.y1 + RES1.pastingflap, "red");
    createArrow(RES1.x2, RES1.y1 + RES1.pastingflap, "F", "x", "red");
    createArrow(RES1.x3, RES1.y1 + RES1.pastingflap, "L", "x", "red");
    createText((RES1.x2 + RES1.x3) / 2, RES1.y1 + RES1.pastingflap, RES1.width);

    //for count sheetwidth And Sheetheight
    if (RES1.Orient === "ReverseTuckIn" || RES1.Orient === "StandardStraightTuckInNested") {
        createText(RES1.x3, RES1.y1 - RES1.width, "PaperSize-:" + RES1.SheetWidth + "x" + RES1.Sheetheight);
    } else {
        createText(RES1.x1, RES1.y1 - RES1.width, "PaperSize-:" + RES1.SheetWidth + "x" + RES1.Sheetheight);
    }
}

function CommonRecArea(RES1) {
    createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y2, 2);
    if (RES1.Orient === "ReverseTuckIn") {
        createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 2);
    } else {
        createnewelement(RES1.x1, RES1.x2, RES1.y1, RES1.y1, 0);
    }

    createnewelement(RES1.x1, RES1.x2, RES1.y2, RES1.y2);


    createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y2);
    createnewelement(RES1.x2, RES1.x3, RES1.y1, RES1.y1, 2);
    createnewelement(RES1.x2, RES1.x3, RES1.y2, RES1.y2, 2);

    createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y2);
    if (RES1.Orient === "ReverseTuckIn") {
        createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1);
    } else {
        createnewelement(RES1.x3, RES1.x4, RES1.y1, RES1.y1, 2);
    }

    createnewelement(RES1.x3, RES1.x4, RES1.y2, RES1.y2, 2);
    createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y2);

    createnewelement(RES1.x5, RES1.x5, RES1.y1, RES1.y2);
    createnewelement(RES1.x4, RES1.x5, RES1.y1, RES1.y1, 2);
    createnewelement(RES1.x4, RES1.x5, RES1.y2, RES1.y2, 2);
}

function drawPastingFlap(RES1) {
    createnewelement(RES1.x1, RES1.x1 - RES1.pastingflap, RES1.y1, RES1.y1 + RES1.pastingflap); // for top down line
    createnewelement(RES1.x1 - RES1.pastingflap, RES1.x1 - RES1.pastingflap, RES1.y1 + RES1.pastingflap, RES1.y2 - RES1.pastingflap); // for Straight line
    createnewelement(RES1.x1, RES1.x1 - RES1.pastingflap, RES1.y2, RES1.y2 - RES1.pastingflap); // for bottom up line
}

function DrawTuckinUperclauser(RES1) {
    if (RES1.Orient === "StandardStraightTuckIn" || RES1.Orient === "StandardStraightTuckInNested") {
        if (RES1.TuckinType !== "" && RES1.TuckinType !== null) {
            if (RES1.DustType === "T") {
                // for curve middle line
                createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0, 2);
                //for top curve
                create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4);
                create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4);
                //for reverse tucking top clouser
                createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1);
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1);
                createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                //for upper right cut
                createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0);
                //for left upper cut
                createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0);
            } else {
                // for curve middle line
                createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0, 2);
                //for top curve
                create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4);
                create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4);
                //for reverse tucking top clouser
                createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1);
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1);
                createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                //for upper right cut
                createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 - 4, 0);
                //for left upper cut
                createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 - 4, 0);

                //createcolour(RES1.x7, RES1.x7, RES1.y3, RES1.y4, "red");
                //createArrow(RES1.x7, RES1.y4, "L", "y", "red");
                //createArrow(RES1.x7, RES1.y3, "F", "y", "red");
                //createText(RES1.x7, (RES1.y3 + RES1.y4) / 2, RES1.tuckinflap);
            }
        }
        else {
            createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0, 2); // for curve middle line
            //for top curve
            create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4);
            create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4);
            //for upper clouser
            createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1);
            createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1);
            createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
            //for right upper cut
            createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
            createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0);
            //for left upper cut
            createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
            createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0);

            // for bottom
            createnewelement(RES1.x11, RES1.x13, RES1.y6, RES1.y6, 0, 2); // for line
            //for top curve
            create_new_curve(RES1.x10, RES1.x11, RES1.y5, RES1.y6);
            create_new_curve(RES1.x12, RES1.x13, RES1.y5, RES1.y6);
            //for bottom clouser
            createnewelement(RES1.x10, RES1.x10, RES1.y5, RES1.y2);
            createnewelement(RES1.x12, RES1.x12, RES1.y5, RES1.y2);
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
            if (RES1.TuckinType === "T") {
                createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0, 2); // for line
                //for top curve
                create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4);
                create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4);

                createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1);
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1);
                createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                //for left upper cut
                createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0);

                createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
                createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0);
            } else {
                createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0, 2); // for line
                //for top curve
                create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4);
                create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4);

                createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1);
                createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1);
                createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);
                //for left upper cut
                //createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0)
                //createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 - 4, 0)

                //createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0)
                //createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 - 4, 0)
            }

        } else {
            // for top
            createnewelement(RES1.x7, RES1.x9, RES1.y4, RES1.y4, 0, 2); // for line
            //for top curve
            create_new_curve(RES1.x6, RES1.x7, RES1.y3, RES1.y4);
            create_new_curve(RES1.x8, RES1.x9, RES1.y3, RES1.y4);
            //for upper clouser
            createnewelement(RES1.x6, RES1.x6, RES1.y3, RES1.y1);
            createnewelement(RES1.x8, RES1.x8, RES1.y3, RES1.y1);
            createnewelement(RES1.x6, RES1.x8, RES1.y3, RES1.y3, 2);

            //for left upper cut
            createnewelement(RES1.x6, RES1.x7, RES1.y3, RES1.y3, 0);
            createnewelement(RES1.x7, RES1.x7, RES1.y3, RES1.y3 + 4, 0);

            createnewelement(RES1.x8, RES1.x9, RES1.y3, RES1.y3, 0);
            createnewelement(RES1.x9, RES1.x9, RES1.y3, RES1.y3 + 4, 0);

            // for bottom
            createnewelement(RES1.x11, RES1.x13, RES1.y6, RES1.y6, 0, 2); // for line
            //for top curve
            create_new_curve(RES1.x10, RES1.x11, RES1.y5, RES1.y6);
            create_new_curve(RES1.x12, RES1.x13, RES1.y5, RES1.y6);
            //for bottom clouser
            createnewelement(RES1.x10, RES1.x10, RES1.y5, RES1.y2);
            createnewelement(RES1.x12, RES1.x12, RES1.y5, RES1.y2);
            createnewelement(RES1.x10, RES1.x12, RES1.y5, RES1.y5, 2);
            //for right bottom cut
            createnewelement(RES1.x10, RES1.x11, RES1.y5, RES1.y5, 0);
            createnewelement(RES1.x11, RES1.x11, RES1.y5, RES1.y5 - 4, 0);

            createnewelement(RES1.x12, RES1.x13, RES1.y5, RES1.y5, 0);
            createnewelement(RES1.x13, RES1.x13, RES1.y5, RES1.y5 - 4, 0);
        }
    }
}

function Drawdust(RES1) {
    if (RES1.DustType !== "" && RES1.DustType !== null) {
        if (RES1.DustType === "T") {
            if (RES1.Orient === "StandardStraightTuckIn" || RES1.Orient === "CrashLockBottom") {
                // for standard
                createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y7, 0);
                createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y1, 0);

                //createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y1, 0);
                createnewelement(RES1.x4, RES1.x15, RES1.y7, RES1.y7, 0);

            } else {
                //for reverse
                createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y7, 0);
                createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y1, 0);
                createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0);
                createnewelement(RES1.x5, RES1.x15, RES1.y7, RES1.y7, 0);
                createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y1, 0);
            }
        } else {
            if (RES1.Orient === "StandardStraightTuckInNested" || RES1.Orient === "CrashLockBottom") {
                createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y7, 0);
                createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y2, 0);
                createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y2, 0);
                createnewelement(RES1.x5, RES1.x15, RES1.y7, RES1.y7, 0);
                createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y2, 0);
            } else {
                // for bottom dust flap
                createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y2, 0);
                createnewelement(RES1.x3, RES1.x14, RES1.y7, RES1.y7, 0);

                //createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
                createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y2, 0);
                createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y7, 0);
            }
        }
    } else {
        if (RES1.Orient === "StandardStraightTuckIn") {
            createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y7, 0);
            createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y1, 0);

            //createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0)
            createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y1, 0);
            createnewelement(RES1.x4, RES1.x15, RES1.y7, RES1.y7, 0);
            // for bottom
            createnewelement(RES1.x16, RES1.x2, RES1.y8, RES1.y2, 0);
            createnewelement(RES1.x16, RES1.x3, RES1.y8, RES1.y8, 0);

            createnewelement(RES1.x17, RES1.x5, RES1.y8, RES1.y2, 0);
            createnewelement(RES1.x17, RES1.x4, RES1.y8, RES1.y8, 0);
        }
        else if (RES1.Orient === "ReverseTuckIn") {
            // for top 
            createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y1, 0);
            createnewelement(RES1.x2, RES1.x14, RES1.y7, RES1.y7, 0);

            createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y1, 0);
            createnewelement(RES1.x15, RES1.x5, RES1.y7, RES1.y7, 0);
            createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y1, 0);
            // for bottom
            createnewelement(RES1.x16, RES1.x2, RES1.y8, RES1.y2, 0);
            createnewelement(RES1.x16, RES1.x3, RES1.y8, RES1.y8, 0);

            createnewelement(RES1.x17, RES1.x5, RES1.y8, RES1.y2, 0);
            createnewelement(RES1.x17, RES1.x4, RES1.y8, RES1.y8, 0);
        }
        else if (RES1.Orient === "StandardStraightTuckInNested") {
            createnewelement(RES1.x14, RES1.x2, RES1.y7, RES1.y7, 0);
            createnewelement(RES1.x14, RES1.x3, RES1.y7, RES1.y1, 0);
            createnewelement(RES1.x5, RES1.x5, RES1.y7, RES1.y2, 0);
            createnewelement(RES1.x5, RES1.x15, RES1.y7, RES1.y7, 0);
            createnewelement(RES1.x15, RES1.x4, RES1.y7, RES1.y1, 0);

            createnewelement(RES1.x14, RES1.x2, RES1.y8, RES1.y8, 0);
            createnewelement(RES1.x14, RES1.x3, RES1.y8, RES1.y2, 0);
            createnewelement(RES1.x5, RES1.x5, RES1.y8, RES1.y2, 0);
            createnewelement(RES1.x5, RES1.x15, RES1.y8, RES1.y8, 0);
            createnewelement(RES1.x15, RES1.x4, RES1.y8, RES1.y2, 0);
        }
    }
}

function crashlock(RES1) {
    if (RES1.crashType === "T") {
        //for upper left clouser
        createnewelement(RES1.x1, RES1.x1, RES1.y1, RES1.y1 - RES1.width, 0);
        createnewelement(RES1.x1, RES1.x18, RES1.y1 - RES1.width, RES1.y1 - RES1.width, 0);
        createnewelement(RES1.x18, RES1.x19, RES1.y1 - RES1.width, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x2, RES1.x2, RES1.y1, RES1.y1 - RES1.width, 0);

        createnewelement(RES1.x20, RES1.x19, RES1.y1 - RES1.width / 2, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x2, RES1.x20, RES1.y1 - RES1.width, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x20, RES1.x2, RES1.y1 - RES1.width / 2, RES1.y1, 2);
        //for upeer right clouser
        createnewelement(RES1.x3, RES1.x3, RES1.y1, RES1.y1 - RES1.width, 0);
        createnewelement(RES1.x3, RES1.x18 + RES1.width + RES1.length, RES1.y1 - RES1.width, RES1.y1 - RES1.width, 0);
        createnewelement(RES1.x18 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y1 - RES1.width, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x4, RES1.x4, RES1.y1, RES1.y1 - RES1.width, 0);
        createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y1 - RES1.width / 2, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x2 + RES1.width + RES1.length, RES1.x20 + RES1.width + RES1.length, RES1.y1 - RES1.width, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x2 + RES1.width + RES1.length, RES1.y1 - RES1.width / 2, RES1.y1, 2);
        //for upper dust
        createnewelement(RES1.x2, RES1.x2 + RES1.width * 50 / 100, RES1.y1 - RES1.width / 2, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x3, RES1.x2 + RES1.width * 50 / 100, RES1.y1, RES1.y1 - RES1.width / 2, 0);

        createnewelement(RES1.x4, RES1.x4 + RES1.width * 50 / 100, RES1.y1 - RES1.width / 2, RES1.y1 - RES1.width / 2, 0);
        createnewelement(RES1.x5, RES1.x4 + RES1.width * 50 / 100, RES1.y1, RES1.y1 - RES1.width / 2, 0);
    } else {
        createnewelement(RES1.x1, RES1.x1, RES1.y2, RES1.y2 + RES1.width, 0);
        createnewelement(RES1.x1, RES1.x18, RES1.y2 + RES1.width, RES1.y2 + RES1.width, 0);
        createnewelement(RES1.x18, RES1.x19, RES1.y2 + RES1.width, RES1.y2 + RES1.width / 2, 0);

        createnewelement(RES1.x20, RES1.x19, RES1.y2 + RES1.width / 2, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x2, RES1.x20, RES1.y2 + RES1.width, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x20, RES1.x2, RES1.y2 + RES1.width / 2, RES1.y2, 2);
        createnewelement(RES1.x2, RES1.x2, RES1.y2, RES1.y2 + RES1.width, 0);


        createnewelement(RES1.x3, RES1.x3, RES1.y2, RES1.y2 + RES1.width, 0);
        createnewelement(RES1.x3, RES1.x18 + RES1.width + RES1.length, RES1.y2 + RES1.width, RES1.y2 + RES1.width, 0);
        createnewelement(RES1.x18 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y2 + RES1.width, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x19 + RES1.width + RES1.length, RES1.y2 + RES1.width / 2, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x2 + RES1.width + RES1.length, RES1.x20 + RES1.width + RES1.length, RES1.y2 + RES1.width, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x20 + RES1.width + RES1.length, RES1.x2 + RES1.width + RES1.length, RES1.y2 + RES1.width / 2, RES1.y2, 2);
        createnewelement(RES1.x4, RES1.x4, RES1.y2, RES1.y2 + RES1.width, 0);

        createnewelement(RES1.x2, RES1.x2 + RES1.width * 50 / 100, RES1.y2 + RES1.width / 2, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x3, RES1.x2 + RES1.width * 50 / 100, RES1.y2, RES1.y2 + RES1.width / 2, 0);

        createnewelement(RES1.x4, RES1.x4 + RES1.width * 50 / 100, RES1.y2 + RES1.width / 2, RES1.y2 + RES1.width / 2, 0);
        createnewelement(RES1.x5, RES1.x4 + RES1.width * 50 / 100, RES1.y2, RES1.y2 + RES1.width / 2, 0);
    }
}

//for CreateNewElement
function createnewelement(x1, x2, y1, y2, dasharray) {

    var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute("stroke", "black");
    newLine.setAttribute("stroke-width", 0.2);
    newLine.setAttribute("stroke-dasharray", dasharray);

    $("g").append(newLine);
}

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
    newText.setAttributeNS(null, "font-size", "5");
    newText.setAttribute("stroke", stroke);
    newText.appendChild(document.createTextNode(text + " mm"));
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

    newpath.setAttribute("d", string);
    newpath.setAttribute("stroke", "black");
    newpath.setAttribute("stroke-width", 0.2);
    newpath.setAttribute("fill", "transparent");

    $("g").append(newpath);
}
