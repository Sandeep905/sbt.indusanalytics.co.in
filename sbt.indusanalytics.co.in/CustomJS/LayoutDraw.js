"use strict";

function Draw_Book_Pages(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Ups_L, Ups_H) {
    var i = 0, j = 0;
    var svgdiv = document.getElementById("Layout_Ups");
    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    if (Grain_Direction === "With Grain") { // 'With in grain Direction
        DrawY = OrginY;
        for (i = 1; i <= Ups_H; i++) {
            DrawX = OrginX;
            for (j = 1; j <= Ups_L; j++) {

                DrawRectangle(svg, DrawX, DrawY, Job_L + Trimming_L + Trimming_R, Job_H + Trimming_T + Trimming_B, "black", 1, "cyan");

                DrawRectangle(svg, DrawX + Trimming_L, DrawY + Trimming_T, Job_L, Job_H, "black", 1, "red");

                DrawX = DrawX + Job_L + Trimming_R + Trimming_L;
            }
            DrawY = DrawY + Job_H + Trimming_B + Trimming_T;
        }
    } else {
        DrawY = OrginY;
        for (i = 1; i <= Ups_H; i++) {
            DrawX = OrginX;
            for (j = 1; j <= Ups_L; j++) {
                //DrawText(svg, DrawX + Trimming_T + Job_H / 2, DrawY + Trimming_R, Job_H, Job_H, 12, "black"); ///Size text

                DrawRectangle(svg, DrawX, DrawY, Job_H + Trimming_T + Trimming_B, Job_L + Trimming_L + Trimming_R, "black", 1, "Cyan");

                DrawRectangle(svg, DrawX + Trimming_T, DrawY + Trimming_R, Job_H, Job_L, "black", 1, "Red");

                //DrawText(svg, DrawX + Trimming_T, DrawY + Trimming_R + Job_L / 2, Job_L, Job_L, 12, "black"); ///Size text
                DrawX = DrawX + Job_H + Trimming_T + Trimming_B;

            }
            DrawY = DrawY + Job_L + Trimming_L + Trimming_R;
        }
    }
    document.body.appendChild(svg);
    svgdiv.appendChild(svg);

}

///////////Added by pKp
function Draw_Rectanglar(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Ups_L, Ups_H) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    var svgdiv = document.getElementById("Layout_Ups");

    if (Grain_Direction === "With Grain") { // 'With in grain Direction
        DrawY = OrginY;
        for (i = 1; i <= Ups_H; i++) {
            DrawX = OrginX;
            for (j = 1; j <= Ups_L; j++) {
                //.BrushColor = vbCyan
                //.DrawRectangle DrawX, DrawY, DrawX + Job_L + Number(Trimming_L) + Number(Trimming_R), DrawY + Number(Job_H)+ Trimming_T + Trimming_B
                DrawRectangle(svg, DrawX, DrawY, Job_L + Number(Trimming_L) + Number(Trimming_R), Job_H + Trimming_T + Trimming_B, "black", 1, "yellow");

                //.BrushColor = vbRed
                //.DrawRectangle DrawX + Trimming_L, DrawY + Trimming_T, DrawX + Job_L + Trimming_L, DrawY + Job_H + Trimming_T
                DrawRectangle(svg, (DrawX + Trimming_L), (DrawY + Trimming_T), Job_L, Job_H, "black", 1, "pink");

                DrawX = DrawX + Job_L + Trimming_R + Trimming_L;
            }
            DrawY = DrawY + Job_H + Trimming_B + Trimming_T;
        }
    } else {
        DrawY = OrginY;
        for (i = 1; i <= Ups_H; i++) {
            DrawX = OrginX;
            for (j = 1; j <= Ups_L; j++) {
                //.BrushColor = vbCyan
                //.DrawRectangle DrawX, DrawY, DrawX + Number(Job_H)+ Number(Trimming_T)+ Number(Trimming_B), DrawY + Job_L + Number(Trimming_L) + Number(Trimming_R)
                DrawRectangle(svg, DrawX, DrawY, Job_H + Number(Trimming_T) + Number(Trimming_B), Job_L + Number(Trimming_L) + Number(Trimming_R), "black", 1, "yellow");
                //.BrushColor = vbRed
                //.DrawRectangle DrawX + Trimming_T, DrawY + Trimming_R, DrawX + Job_H + Trimming_T, DrawY + Job_L + Trimming_R
                DrawRectangle(svg, (DrawX + Trimming_T), (DrawY + Trimming_R), Job_H, Job_L, "black", 1, "red");

                DrawX = Number(DrawX) + Number(Job_H) + Number(Trimming_T) + Number(Trimming_B);
            }
            DrawY = Number(DrawY) + Number(Job_L) + Number(Trimming_L) + Number(Trimming_R);
        }
    }
    document.body.appendChild(svg);
    svgdiv.appendChild(svg);
}

function Draw_Wiro_Book_Pages(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Ups_L, Ups_H) {
    var i = 0, j = 0;
    var svgdiv = document.getElementById("Layout_Ups");

    var DrawX = 0.0, DrawY = 0.0;
    if (Grain_Direction === "With Grain") { // 'With in grain Direction
        DrawY = OrginY;
        for (i = 1; i <= Ups_H; i++) {
            DrawX = OrginX;
            for (j = 1; j <= Ups_L; j++) {
                DrawRectangle(svg, DrawX, DrawY, Job_L + Trimming_L + Trimming_R, Job_H + Trimming_T + Trimming_B, "black", 1, "cyan");

                DrawRectangle(svg, DrawX + Trimming_L, DrawY + Trimming_T, Job_L + Trimming_L, Job_H + Trimming_T, "black", 1, "red");
                DrawX = DrawX + Job_L + Trimming_L + Trimming_R;
            }
            DrawY = DrawY + Job_H + Trimming_B + Trimming_T;
        }
    } else {
        DrawY = OrginY;
        for (i = 1; i <= Ups_H; i++) {
            DrawX = OrginX;
            for (j = 1; j <= Ups_L; j++) {

                DrawRectangle(svg, DrawX, DrawY, Job_H + Trimming_T + Trimming_B, Job_L + Trimming_L + Trimming_R, "black", 1, "cyan");

                DrawRectangle(svg, DrawX + Trimming_T, DrawY + Trimming_R, Job_H + Trimming_T, Job_L + Trimming_R, "black", 1, "red");

                DrawX = DrawX + Job_H + Trimming_T + Trimming_B;

            }
            DrawY = DrawY + Job_L + Trimming_L + Trimming_R;
        }
    }
    document.body.appendChild(svg);
    svgdiv.appendChild(svg);
}

////////
function Draw_Reverse_Tuck_And_Tongue(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style, Tongue_Height) {
    var i = 0, j = 0;

    var DrawX = 0, DrawY = 0.0;
    switch (Interlock_Style) {
        case 1:

            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Overlap_Flap), (Job_H), "black", 1, "yellow");
                    DrawX = DrawX + Overlap_Flap;

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY, (Job_L), (Open_Flap), "black", 1, "red");

                    //'Draw Dukkan Job_W 1
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_L), (Open_Flap + Job_W), "black", 1, "cyan");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "blue");

                    //'Draw First Tongue
                    DrawRectangle(svg, (DrawX + ((Job_L / 2) - (Job_L * 0.25) / 2)), (DrawY + Job_W + Job_H + Open_Flap), Job_L * 0.25, Tongue_Height, "black", 1, "yellow");
                    DrawX = DrawX + Job_L;

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_W), (Job_H), "black", 1, "red");
                    DrawX = DrawX + Job_W;

                    //'Draw First Tongue
                    DrawRectangle(svg, (DrawX + ((Job_L / 2) - (Job_L * 0.25) / 2)), DrawY + (Job_W) + Open_Flap - Tongue_Height, (Job_L * 0.25), (Tongue_Height), "black", 1, "green");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "blue");

                    //'Draw Dukkan Job_W 2
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap + Job_H), (Job_L), ((Job_W) + Open_Flap), "black", 1, "cyan");

                    //'Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, (DrawY + (Job_W * 2) + Open_Flap + Job_H), (Job_L), (Open_Flap), "black", 1, "red");
                    DrawX = DrawX + Job_L;

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_W), (Job_H), "black", 1, "red");
                    DrawX = DrawX + Job_W + Trimming_R;
                }
                DrawY = Number(DrawY) + Open_Flap + Job_W + Job_H + Tongue_Height + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = Number(DrawY);
                } else {
                    DrawY = Number(DrawY) + Trimming_L;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX + Trimming_B;
                    }
                    else {
                        DrawX = DrawX + Trimming_B;
                    }

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Open_Flap), (Job_L), "black", 1, "red");
                    DrawX = DrawX + Open_Flap;

                    //'Draw Dukkan Job_W 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_W), (Job_L), "black", 1, "yellow");
                    DrawX = DrawX + Job_W;

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY, (Job_H), (Overlap_Flap), "black", 1, "red");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_H), (Job_L), "black", 1, "yellow");

                    //'Draw First Tongue
                    DrawRectangle(svg, DrawX - Tongue_Height, (DrawY + Overlap_Flap + ((Job_L / 2) - (Job_L * 0.25) / 2)), (Tongue_Height), (Job_L * 0.25), "black", 1, "blue");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Job_H), (Job_L), "black", 1, "green");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_H), Job_L, "black", 1, "yellow");

                    //'Draw First Tongue
                    DrawRectangle(svg, (DrawX + Job_H), (DrawY + Overlap_Flap + Job_L + Job_W + ((Job_L / 2) - (Job_L * 0.25) / 2)), (Tongue_Height), Job_L * 0.25, "black", 1, "blue");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Job_L * 2 + Job_W + Overlap_Flap), (Job_H), Job_W, "black", 1, "green");
                    DrawX = DrawX + Job_H;

                    //'Draw Dukkan Job_W 2
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_W), (Job_L), "black", 1, "yellow");
                    DrawX = DrawX + Job_W;

                    //'Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Open_Flap), (Job_L), "black", 1, "red");
                    DrawX = DrawX - Job_W + Tongue_Height;
                }
                DrawY = Number(DrawY) + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

function Draw_Universal(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    switch (Interlock_Style) {
        case 1:

            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Overlap_Flap), (Job_H), "black", 1, "red");
                    DrawX = DrawX + Overlap_Flap;

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY, (Job_L), (Open_Flap), "black", 1, "yellow");

                    //'Draw Open_Flap 1
                    // DrawRectangle(svg, DrawX, (Job_H), ( Job_L), ( Job_H-DrawY), "black", 1, "yellow");
                    DrawRectangle(svg, DrawX, (DrawY + Job_H + Open_Flap), (Job_L), (Open_Flap), "black", 1, "yellow");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_L), (Job_H), "black", 1, "green");
                    DrawX = DrawX + Job_L;

                    //'Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, DrawY, (Job_W), (Open_Flap), "black", 1, "yellow");

                    //'Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, (DrawY + Job_H + Open_Flap), (Job_L), (Open_Flap), "black", 1, "yellow");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_W), (Job_H), "black", 1, "cyan");
                    DrawX = DrawX + Job_W;


                    //'Draw Open_Flap 3
                    DrawRectangle(svg, DrawX, DrawY, (Job_L), (Open_Flap), "black", 1, "yellow");

                    //'Draw Open_Flap 3
                    DrawRectangle(svg, DrawX, (DrawY + Job_H + Open_Flap), (Job_L), (Open_Flap), "black", 1, "yellow");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_L), (Job_H), "black", 1, "green");
                    DrawX = DrawX + Job_L;

                    //'Draw Open_Flap 4
                    DrawRectangle(svg, DrawX, DrawY, (Job_W), (Open_Flap), "black", 1, "yellow");

                    //'Draw Open_Flap 4
                    DrawRectangle(svg, DrawX, (DrawY + Job_H + Open_Flap), (Job_W), (Open_Flap), "black", 1, "yellow");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_W), (Job_H), "black", 1, "cyan");
                    DrawX = DrawX + Job_W + Trimming_R;
                }
                DrawY = Number(DrawY) + (Open_Flap * 2) + Job_H + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_R;
                    }

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Open_Flap), (Job_L), "black", 1, "yellow");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Open_Flap), (Job_W), "black", 1, "cyan");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Open_Flap), (Job_L), "black", 1, "yellow");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + (Job_L * 2) + Job_W), (Open_Flap), Job_W, "black", 1, "cyan");
                    DrawX = DrawX + Open_Flap;

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY, (Job_H), (Overlap_Flap), "black", 1, "#F200FF");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_H), (Job_L), "black", 1, "green");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Job_H), (Job_W), "black", 1, "red");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_H), Job_L, "black", 1, "green");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + (Job_L * 2) + Job_W), (Job_H), (Job_W), "black", 1, "red");
                    DrawX = DrawX + Job_H;

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Open_Flap), (Job_L), "black", 1, "yellow");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Open_Flap), (Job_W), "black", 1, "blue");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Open_Flap), Job_L, "black", 1, "yellow");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + (Job_L * 2) + Job_W), (Open_Flap), ((Job_W)), "black", 1, "blue");

                    DrawX = DrawX + Open_Flap + Trimming_L;
                }
                DrawY = Number(DrawY) + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_B;
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

/////
function Draw_Standard_Straight_Tuck_In_Nested(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    switch (Interlock_Style) {

        case 1:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), Overlap_Flap, Job_H, "black", 1, "Green");
                    DrawX = DrawX + Overlap_Flap;

                    if (i % 2 === 0) {

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, (DrawY), Job_L, Open_Flap, "black", 1, "black");

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, (DrawX), (DrawY + Open_Flap), (Job_L), (Job_W), "black", 1, "cyan");

                        //'Draw Dukkan Job_W 2
                        DrawRectangle(svg, (DrawX), (DrawY + (Open_Flap) + Job_W + (Job_H)), Job_L, Job_W, "black", 1, "yellow");

                        //'Draw Open_Flap 2
                        DrawRectangle(svg, (DrawX), (DrawY + Open_Flap + (Job_W * 2) + Job_H), (Job_L), ((Open_Flap)), "black", 1, "red");
                    }
                    else {
                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + Job_W + Job_L, DrawY, Job_L, Open_Flap, "black", 1, "red");

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX + Job_W + Job_L, (DrawY + Open_Flap), (Job_L), (Job_W), "black", 1, "blue");
                        //'Draw Dukkan Job_W 2
                        DrawRectangle(svg, DrawX + Job_W + Job_L, (DrawY + (Open_Flap) + Job_W + (Job_H)), Job_L, Job_W, "black", 1, "red");

                        //'Draw Open_Flap 2
                        DrawRectangle(svg, DrawX + Job_W + Job_L, (DrawY + Open_Flap + Job_W * 2 + Job_H), (Job_L), (Open_Flap), "black", 1, "black");

                    }
                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), Job_H, "black", 1, "#aceb44");
                    DrawX = DrawX + Job_L;

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_W), (Job_H), "black", 1, "yellow");
                    DrawX = DrawX + Job_W;

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "#aceb44");
                    DrawX = DrawX + Job_L;

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_W), (Job_H), "black", 1, "yellow");
                    DrawX = DrawX + Job_W + Trimming_R;

                }
                DrawY = DrawY + Job_W + Open_Flap + Job_H + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = Number(DrawY);
                } else {
                    DrawY = Number(DrawY) + Trimming_L;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_B;
                    }

                    if (j % 2 === 0) {

                        // Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Open_Flap), (Job_L), "black", 1, "red");
                        DrawX = DrawX + Open_Flap;

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_W), (Job_L), "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw Dukkan Job_W 2
                        DrawRectangle(svg, (DrawX + Job_H), (DrawY + Overlap_Flap), (Job_W), (Job_L), "black", 1, "yellow");

                        //'Draw Open_Flap 2
                        DrawRectangle(svg, (DrawX + Job_H + Job_W), (DrawY + Open_Flap), (Open_Flap), (Job_L), "black", 1, "red");
                    }
                    else {
                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, (DrawY + Job_L + Job_W + Overlap_Flap), (Open_Flap), (Job_L), "black", 1, "red");
                        DrawX = DrawX + Open_Flap;

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, (DrawY + Job_L + Job_W + Overlap_Flap), (Job_W), (Job_L), "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw Dukkan Job_W 2
                        DrawRectangle(svg, (DrawX + Job_H), (DrawY + Job_L + Job_W + Overlap_Flap), (Job_W), (Job_L), "black", 1, "yellow");

                        //'Draw Open_Flap 2
                        DrawRectangle(svg, (DrawX + Job_H + Job_W), (DrawY + Job_L + Job_W + Open_Flap), (Open_Flap), (Job_L), "black", 1, "red");
                    }

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY, (Job_H), (Overlap_Flap), "black", 1, "cyan");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_H), (Job_L), "black", 1, "#343421");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Job_H), (Job_W), "black", 1, "green");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_H), (Job_L), "black", 1, "#343421");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + (Job_L * 2) + Job_W), (Job_H), ((Job_W)), "black", 1, "green");
                    DrawX = DrawX + Job_H + Trimming_T;
                }
                DrawY = Number(DrawY) + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

function Draw_Crash_Lock_Without_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i % 2 === 0) {

                    if (i === 1) {
                        DrawY = Number(DrawY);
                    } else {
                        DrawY = Number(DrawY) + Number(Trimming_T);
                    }
                    for (j = 1; j <= Ups_L; j++) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Overlap_Flap), (Job_H), "black", 1, "red");
                        DrawX = DrawX + Overlap_Flap;

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "yellow");

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap + Job_H), (Job_L), (Bottom_Flap), "black", 1, "cyan");
                        DrawX = DrawX + Job_L;

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_W), (Job_H), "black", 1, "pink");
                        DrawX = DrawX + Job_W;

                        //'Draw Open_Flap
                        DrawRectangle(svg, DrawX, DrawY, (Job_L), (Open_Flap), "black", 1, "yellow");

                        //'Draw Dukkan Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_L), (Job_W), "black", 1, "red");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "green");

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap + Job_H), (Job_L), (Bottom_Flap), "black", 1, "yellow");
                        DrawX = DrawX + Job_L;

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_W), (Job_H), "black", 1, "yellow");
                        DrawX = DrawX + Job_W + Trimming_R;
                    }
                    DrawY = Number(DrawY) + Open_Flap + Job_W + Job_H + Bottom_Flap + Trimming_B;
                }
                else {

                    if (i === 1) {
                        DrawY = Number(DrawY);
                    }
                    else {
                        DrawY = Number(DrawY) + Number(Trimming_B);
                    }

                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_R;
                        }

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap), (Overlap_Flap), (Job_H), "black", 1, "red");
                        DrawX = DrawX + Overlap_Flap;

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, DrawY, (Job_L), (Bottom_Flap), "black", 1, "cyan");

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap), (Job_L), (Job_H), "black", 1, "yellow");

                        //'Draw Dukkan Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap + Job_H), (Job_L), (Job_W), "black", 1, "red");

                        //'Draw Open_Flap
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap + Job_H + Job_W), (Job_L), (Open_Flap), "black", 1, "blue");
                        DrawX = DrawX + Job_L;

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap), (Job_W), (Job_H), "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, DrawY, (Job_L), (Bottom_Flap), "black", 1, "yellow");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap), (Job_L), (Job_H), "black", 1, "blue");
                        DrawX = DrawX + Job_L;

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Bottom_Flap), (Job_W), (Job_H), "black", 1, "yellow");
                        DrawX = DrawX + Job_W + Trimming_L;
                    }
                    DrawY = Number(DrawY) + Bottom_Flap + Job_H + Number(Trimming_T);
                }
            }
            break;

        case 2:

            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = Number(DrawY);
                } else {
                    DrawY = Number(DrawY) + Trimming_L;
                }

                for (j = 1; j <= Ups_L; j++) {

                    if (j % 2 === 0) {
                        if (j === 1) {
                            DrawX = DrawX;
                        }
                        else {
                            DrawX = DrawX + Trimming_T;
                        }

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Open_Flap), (Job_L), "black", 1, "red");
                        DrawX = DrawX + Open_Flap;

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_W), (Job_L), "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, (Job_H), (Overlap_Flap), "black", 1, "red");

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_H), (Job_L), "black", 1, "yellow");

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Job_H), (Job_W), "black", 1, "green");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_H), Job_L, "black", 1, "yellow");

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + (Job_L * 2) + Job_W), (Job_H), Job_W, "black", 1, "green");
                        DrawX = DrawX + Job_H;

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Bottom_Flap), (Job_L), "black", 1, "yellow");

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Bottom_Flap), (Job_L), "black", 1, "yellow");
                        DrawX = DrawX + Bottom_Flap + Number(Trimming_B);

                    }
                    else {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_B;
                        }

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Bottom_Flap), (Job_L), "black", 1, "yellow");

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Bottom_Flap), Job_L, "black", 1, "red");
                        DrawX = DrawX + Bottom_Flap;

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, (Job_H), (Overlap_Flap), "black", 1, "red");

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_H), (Job_L), "black", 1, "yellow");

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L), (Job_H), (Job_W), "black", 1, "green");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_H), (Job_L), "black", 1, "yellow");

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + (Job_L * 2) + Job_W), (Job_H), (Job_W), "black", 1, "green");
                        DrawX = DrawX + Job_H;

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Job_W), (Job_L), "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap + Job_L + Job_W), (Open_Flap), (Job_L), "black", 1, "red");

                        DrawX = DrawX - Job_W + Trimming_T;

                    }
                }
                DrawY = Number(DrawY) + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

function Draw_Cut_Sheet(Orientation, Interlock_Style, Colorstrip, Gripper, Gripper_Side, Sheet_Size, Grain_Direction, Printing_Style, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Striping_L, Striping_R, Striping_T, Striping_B, Printing_Margin_L, Printing_Margin_R, Printing_Margin_T, Printing_Margin_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Tongue_Height) {
    var drx = 20;
    var dry = 30;

    var X1 = drx, Y1 = dry, X2 = drx, Y2 = dry;
    var Rect_H = 0.0, Rect_L = 0.0;
    var DX = drx, DY = dry;

    var OrginX = drx;
    var OrginY = dry;

    var i = 0, j = 0;
    var Sheet_L = 0.0, Sheet_H = 0.0;

    var s = Sheet_Size.split("x");
    Sheet_H = parseFloat(s[0]);
    Sheet_L = parseFloat(s[1]);

    if (Job_H === 0 && Job_W !== 0) {
        Job_H = Job_W;
    } else if (Job_W === 0 && Job_H !== 0) {
        Job_W = Job_H;
    }

    if (Grain_Direction === "With Grain") {
        Rect_H = Number(Job_H) + Number(Trimming_T) + Number(Trimming_B);
        Rect_L = Number(Job_L) + Number(Trimming_L) + Number(Trimming_R);
    } else {
        Rect_L = Number(Job_H) + Number(Trimming_T) + Number(Trimming_B);
        Rect_H = Number(Job_L) + Number(Trimming_L) + Number(Trimming_R);
    }

    //'Draw full sheet 

    var svg = document.getElementById("svg_Shape_Container");
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
    //    svg.style = "border:solid; border-width: 1px;  height: " + Sheet_H + "px; width: " + Sheet_L + "px;";
    DrawRectangle(svg, OrginX, OrginY, Sheet_L, Sheet_H, "black", 1, "white");
    //'Draw Gripper

    var Gripper_Top = 0.0, Gripper_Bottom = 0.0;

    if (Printing_Style === "Work & Tumble" || Printing_Style === "FB-Perfection") {
        Gripper_Top = parseFloat(Gripper) / 2;
        Gripper_Bottom = parseFloat(Gripper) / 2;
    } else {
        Gripper_Top = parseFloat(Gripper);
        Gripper_Bottom = 0;
    }

    if (Gripper_Side === "L") {
        //.DrawRectangle OrginX, OrginY, OrginX + Gripper_Top, OrginY + Sheet_H 'Gripper
        DrawRectangle(svg, OrginX, OrginY, Gripper_Top, Sheet_H, "black", 1, "green");

        DY = OrginY;
        if (Colorstrip > 0) {
            while (DY < Sheet_H) {
                //.BrushColor = vbCyan
                DrawRectangle(svg, OrginX + Sheet_L - Gripper_Bottom - Colorstrip, DY, Colorstrip, Sheet_H / Colorstrip / 4, "black", 1, "Cyan");
                DY = DY + Sheet_H / Colorstrip / 4;

                //.BrushColor = vbMagenta
                DrawRectangle(svg, OrginX + Sheet_L - Gripper_Bottom - Colorstrip, DY, Colorstrip, Sheet_H / Colorstrip / 4, "black", 1, "Magenta");
                DY = DY + Sheet_H / Colorstrip / 4;

                //.BrushColor = vbYellow
                DrawRectangle(svg, OrginX + Sheet_L - Gripper_Bottom - Colorstrip, DY, Colorstrip, Sheet_H / Colorstrip / 4, "black", 1, "Yellow");
                DY = DY + Sheet_H / Colorstrip / 4;

                //.BrushColor = vbBlack
                DrawRectangle(svg, OrginX + Sheet_L - Gripper_Bottom - Colorstrip, DY, Colorstrip, Sheet_H / Colorstrip / 4, "black", 1, "Black");
                DY = DY + Sheet_H / Colorstrip / 4;
            }
        }

        //.BrushColor = &H8000&
        //.DrawRectangle (OrginX + Sheet_L - Gripper_Bottom), OrginY, OrginX + Sheet_L, OrginY + Sheet_H  'Gripper
        DrawRectangle(svg, OrginX + Sheet_L - Gripper_Bottom, OrginY, Gripper_Bottom, Sheet_H, "black", 1, "green");

        OrginX = OrginX + Gripper_Top;  // 'shift origin from grain width

        //'Draw with printing margin
        X1 = OrginX + Printing_Margin_T;
        X2 = Sheet_L - Printing_Margin_B - Number(Colorstrip) - Gripper_Top - Gripper_Bottom;
        Y1 = OrginY + Printing_Margin_R;
        Y2 = Sheet_H - Printing_Margin_L;

        //.BrushColor = &HFCE0BE
        //.DrawRectangle X1, Y1, X2, Y2
        DrawRectangle(svg, X1, Y1, X2, Y2, "black", 1, "#FFEFD5");

        // 'Draw with Stripping margin
        X1 = OrginX + Striping_T;
        X2 = Sheet_L - Printing_Margin_B - Number(Colorstrip) - Striping_B - Gripper_Top - Gripper_Bottom;
        Y1 = OrginY + Striping_R;
        Y2 = Sheet_H - Printing_Margin_L - Striping_L;

        OrginX = X1;
        OrginY = Y1;
        //.BrushColor = vbWhite
        //.DrawRectangle X1, Y1, X2, Y2
        DrawRectangle(svg, X1, Y1, X2, Y2, "black", 1, "white");

    } else {
        // .BrushColor = &H8000&
        //.DrawRectangle OrginX, OrginY, (OrginX + Sheet_L), OrginY + Gripper_Top        'Gripper
        DrawRectangle(svg, OrginX, OrginY, Sheet_L, Gripper_Top, "black", 1, "green");

        DX = OrginX;
        if (Number(Colorstrip) > 0) {
            while (DX < Sheet_L) {
                DrawRectangle(svg, DX, OrginY + Sheet_H - Gripper_Bottom - Colorstrip, Sheet_L / Colorstrip / 4, Colorstrip, "black", 1, "Cyan");
                DX = DX + Sheet_L / Colorstrip / 4;
                DrawRectangle(svg, DX, OrginY + Sheet_H - Gripper_Bottom - Colorstrip, Sheet_L / Colorstrip / 4, Colorstrip, "black", 1, "Magenta");
                DX = DX + Sheet_L / Colorstrip / 4;
                DrawRectangle(svg, DX, OrginY + Sheet_H - Gripper_Bottom - Colorstrip, Sheet_L / Colorstrip / 4, Colorstrip, "black", 1, "Yellow");
                DX = DX + Sheet_L / Colorstrip / 4;
                DrawRectangle(svg, DX, OrginY + Sheet_H - Gripper_Bottom - Colorstrip, Sheet_L / Colorstrip / 4, Colorstrip, "black", 1, "Black");
                DX = DX + Sheet_L / Colorstrip / 4;
            }
        }
        //.BrushColor = &H8000&
        //Gripper Bottom
        DrawRectangle(svg, OrginX, OrginY + Sheet_H - Gripper_Bottom, Sheet_L, Gripper_Bottom, "black", 1, "green");
        OrginY = OrginY + Gripper_Top; //  'shift orgin from grain width

        //'Draw with printing margin
        X1 = OrginX + Printing_Margin_L;
        X2 = Sheet_L - Printing_Margin_R;
        Y1 = OrginY + Printing_Margin_T;
        Y2 = Sheet_H - Printing_Margin_B - Number(Colorstrip) - Gripper_Top - Gripper_Bottom;

        //.BrushColor = &HFCE0BE
        //.DrawRectangle X1, Y1, X2, Y2
        DrawRectangle(svg, X1, Y1, X2, Y2, "black", 1, "#FFEFD5");

        //'Draw with Stripping margin
        X1 = OrginX + Number(Striping_L);
        X2 = Sheet_L - Printing_Margin_R - Striping_R;
        Y1 = OrginY + Number(Striping_T);
        Y2 = Sheet_H - Printing_Margin_B - Number(Colorstrip) - Striping_B - Gripper_Top - Gripper_Bottom;

        OrginX = X1;
        OrginY = Y1;
        //.BrushColor = &HFFFFFF
        //.DrawRectangle X1, Y1, X2, Y2
        //   DrawRectangle(svg, X1, Y1, X2, Y2, "black", 1, "white");
        document.body.appendChild(svg);

    }

    try {

        if (Orientation === "Rectangular" || Orientation === "PrePlannedSheet" || Orientation === "WiroPrePlannedSheet" || Orientation === "BookCover" || Orientation === "MultipleLeaves" || Orientation === "WrintingPad" || Orientation === "AccordionFold" || Orientation === "DoubleGateFold" || Orientation === "DoubleParallelFold" || Orientation === "GateFold" || Orientation === "FrenchFold" || Orientation === "HalfFold" || Orientation === "RollFold" || Orientation === "TriFold" || Orientation === "WeddingCardSets" || Orientation === "Brochure") {
            Draw_Rectanglar(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_W, Ups_L, Ups_H);
        }
        else if (Orientation === "WiroBookPages" || Orientation === "WiroLeaves" || Orientation === "Calendar") {
            Draw_Wiro_Book_Pages(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Ups_L, Ups_H);
        }
        else if (Orientation === "ReverseTuckAndTongue") {
            Draw_Reverse_Tuck_And_Tongue(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style, Tongue_Height);
        }
        else if (Orientation === "UniversalCarton") {
            Draw_Universal(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "StandardStraightTuckInNested") {
            Draw_Standard_Straight_Tuck_In_Nested(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "CrashLockWithoutPasting") {
            Draw_Crash_Lock_Without_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "BookPages") {
            Draw_Book_Pages(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Ups_L, Ups_H);
        }
        else if (Orientation === "ReverseTuckIn") {
            Draw_Reverse_Tuck_In(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style)
        }
        else if (Orientation === "FourCornerBox") {
            Draw_Four_Corner_Box(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style)
        }
        else if (Orientation === "StandardStraightTuckIn") {
            Draw_Standard_Straight_Tuck_In(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style)
        }
        else if (Orientation === "CrashLockWithPasting") {
            Draw_Crash_Lock_With_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "CarryBag") {
            Draw_Carry_Bag(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "EnvCenterPasting") {
            Draw_Env_Center_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "EnvSidePasting") {
            Draw_Env_Side_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "CatchCover") {
            Draw_Catch_Cover(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "TuckToFrontOpenTop") {
            Draw_Tuck_To_Front_Open_Top(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "WebbedSelfLockingTray") {
            Draw_Webbed_Self_locking_Tray(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style, Tongue_Height);
        }
        else if (Orientation === "RingFlap") {
            Draw_Ring_Flap(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "UniversalOpenCrashLockWithPasting") {
            Draw_Universal_Crash_Lock_With_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "TurnOverEndTray") {
            Draw_Turn_Over_End_Tray(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "6CornerBox" || Orientation === "SixCornerBox") {
            Draw_6_Corner_Box(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "OvelShape") {
            Draw_Ovel_Shape(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "EnvLPasting") {
            Draw_Env_L_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "FourCornerHingedLid") {
            Draw_Four_Corner_Hinged_Lid(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "StandardStraightTuckInHang") {
            DrawStandardStraightTuckInHang(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
        else if (Orientation === "PastryTypeBox") {
            DrawPastryTypeBox(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style);
        }
    } catch (e) {
        console.log(e);
    }
}

function Draw_Sheets(Paper_Size, Sheet_Size, Plan_Type, Grain_Direction) {

    var drx = 20;
    var dry = 30;
    var OrginX = drx;
    var OrginY = dry;

    var i = 0, j = 0;

    var Cut_L = 0, Cut_H = 0;
    var Cut_L_H = 0, Cut_H_L = 0;
    var Bal_L = 0, Bal_H = 0;

    var Paper_L = 0.0, Paper_H = 0.0;
    var Sheet_L = 0.0, Sheet_H = 0.0;

    var s = Paper_Size.split("x");
    Paper_H = parseFloat(s[0]);
    Paper_L = parseFloat(s[1]);

    s = Sheet_Size.split("x");
    Sheet_H = parseFloat(s[0]);
    Sheet_L = parseFloat(s[1]);

    var svg = document.getElementById("svg_Sheet_Container");
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
    //Draw Paper Sheet
    DrawRectangle(svg, OrginX, OrginY, Paper_L, Paper_H, "black", 1, "white");

    //Drawing Grain Lines
    while (i < Paper_H) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute("x1", OrginX);
        line.setAttribute("y1", OrginY + i);
        line.setAttribute("x2", OrginX + Paper_L);
        line.setAttribute("y2", OrginY + i);
        line.setAttribute("stroke", "gray");
        line.setAttribute("strokeWidth", 1);
        svg.appendChild(line);
        i = i + 10;
    }


    if (Plan_Type === "Reel Planning") {
        Cut_L = 1;
        Cut_H = 1;
    } else {
        Cut_L = Math.floor(Paper_L / Sheet_L); //RoundDown(Paper_L / Sheet_L) vb6
        Cut_H = Math.floor(Paper_H / Sheet_H);
    }


    // 'Calculating Balance Piece
    Bal_L = Paper_L - (Sheet_L * Cut_L);
    Bal_H = Paper_H - (Sheet_H * Cut_H);

    OrginX = drx;
    for (i = 1; i <= Cut_L; i++) {
        OrginY = dry;

        for (j = 1; j <= Cut_H; j++) {
            //.DrawRectangle OrginX, OrginY, OrginX + Sheet_L, OrginY + sheet_h
            var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            DrawRectangle(svg, OrginX, OrginY, Sheet_L, Sheet_H, "blue", 1, "white");
            OrginY = OrginY + Sheet_H;
        }
        OrginX = OrginX + Sheet_L;
    }

    if (Grain_Direction === "Both") {
        if (Bal_L > Sheet_H) {
            Cut_L_H = Math.floor(Bal_L / Sheet_H)
            Cut_H_L = Math.floor(Paper_H / Sheet_L)
            for (i = 1; i <= Cut_L_H; i++) {
                OrginY = dry;
                for (j = 1; j <= Cut_H_L; j++) {
                    //.DrawRectangle OrginX, OrginY, OrginX + Sheet_H, OrginY + Sheet_L
                    DrawRectangle(svg, OrginX, OrginY, Sheet_H, Sheet_L, "blue", 1, "white");
                    OrginY = OrginY + Sheet_L;
                }
                OrginX = OrginX + Sheet_H;
            }
        }

        if (Bal_H > Sheet_L) {
            Cut_H_L = Math.floor(Bal_H / Sheet_L);
            Cut_L_H = Math.floor(Paper_L / Sheet_H);
            for (i = 1; i <= Cut_H_L; i++) {
                OrginX = drx;
                for (j = 1; j <= Cut_L_H; j++) {
                    //.DrawRectangle OrginX, OrginY, OrginX + Sheet_H, OrginY + Sheet_L
                    DrawRectangle(svg, OrginX, OrginY, Sheet_H, Sheet_L, "blue", 1, "white");
                    OrginX = OrginX + Sheet_H;
                }
                OrginY = OrginY + Sheet_L;
            }
        }
    }

    document.body.appendChild(svg);
    var Draw_Sheet = document.getElementById("Layout_Sheet");
    Draw_Sheet.appendChild(svg);
}

function DrawRectangle(svg, OrginX, OrginY, Width, Height, Border_Color, Border_Width, Fill_Color) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttributeNS(null, "x", OrginX);
    rect.setAttributeNS(null, "y", OrginY);
    rect.setAttributeNS(null, "width", Width);
    rect.setAttributeNS(null, "height", Height);
    rect.setAttributeNS(null, "stroke", Border_Color);
    // rect.setAttributeNS(null, "strokeWidth", Border_Width);
    rect.setAttributeNS(null, "fill", Fill_Color);
    svg.appendChild(rect);
    //'#' + Math.round(0xffffff * Math.random()).toString(16)
}

function Drawellipse(svg, OrginX, OrginY, Width, Height, Border_Color, Border_Width, Fill_Color) {

    var ellipse = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
    ellipse.setAttributeNS(null, "cx", OrginX);
    ellipse.setAttributeNS(null, "cy", OrginY);
    ellipse.setAttributeNS(null, "rx", Width);
    ellipse.setAttributeNS(null, "ry", Height);
    ellipse.setAttributeNS(null, "stroke", Border_Color);
    ellipse.setAttributeNS(null, "strokeWidth", Border_Width);
    ellipse.setAttributeNS(null, "fill", Fill_Color);

    svg.appendChild(ellipse);
    //'#' + Math.round(0xffffff * Math.random()).toString(16)
}

function DrawText(svg, OrginX, OrginY, Width, text, fontSize, Fill_Color) {
    var text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text1.setAttributeNS(null, 'x', OrginX);
    text1.setAttributeNS(null, 'y', OrginY);
    text1.setAttributeNS(null, 'width', Width);
    text1.style.fill = Fill_Color;
    text1.style.fontFamily = 'Calibri';
    text1.style.fontSize = fontSize;
    text1.style.fontWeight = 700;
    text1.innerHTML = text;

    svg.appendChild(text1);
}

/////
function Draw_Four_Corner_Hinged_Lid(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var Flap_Width = 0;
    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    if (Flap_Width === 0) {
        Flap_Width = (Job_H + Overlap_Flap) / 2;
    }
    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }
                    if (i % 2 === 0) {
                        DrawX = DrawX + Job_H;
                        // DrawY = OrginY;
                        DrawY = DrawY + Job_L
                        //'1 'Draw Job w 1
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_L, "black", 1, "#123ace");
                        DrawX = DrawX + Job_W;

                        //   //'1  'Draw First Job_h
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'2  'Draw Job w 2
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_L, "black", 1, "#123ace");
                        DrawX = DrawX + Job_W;

                        //'2  'Draw Job_h 2
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Job_L, "black", 1, "#ace123");

                        DrawX = DrawX + Job_H;
                        DrawX = DrawX - (Job_H * 3) - (Job_W * 2);

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + Job_H - Open_Flap, DrawY, Open_Flap, Job_L, "black", 1, "red");

                        //'upper height * width
                        DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY - Job_H, Job_W, Job_H, "black", 1, "cyan");

                        //'Lower height * width
                        DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY + Job_L, Job_W, Job_H, "black", 1, "cyan");

                        //'Draw upper Overlap_Flap
                        DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY - Job_H - Overlap_Flap, Job_W, Overlap_Flap, "black", 1, "pink");

                        //'Draw lower Overlap_Flap
                        DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY + Job_L + Job_H, Job_W, Overlap_Flap, "black", 1, "pink");

                        //' upper flap 1
                        DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY - Flap_Width, Job_H, Flap_Width, "black", 1, "black");

                        //'upper flap 2
                        DrawRectangle(svg, DrawX + (Job_H * 2) + (Job_W * 2), DrawY - Flap_Width, Job_H, Flap_Width, "black", 1, "black");

                        //' lower flap 1
                        DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY + Job_L, Job_H, Flap_Width, "black", 1, "black");

                        //' lower flap 2
                        DrawRectangle(svg, DrawX + (Job_H * 2) + (Job_W * 2), DrawY + Job_L, Job_H, Flap_Width, "black", 1, "black");
                        DrawX = DrawX + Job_H * 2 + Job_W * 2 + Open_Flap;
                        DrawY = DrawY - Job_L;
                    }
                    else {
                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + (Job_H * 2) + (Job_W * 2), DrawY + Overlap_Flap + Job_H, Open_Flap, Job_L, "black", 1, "red");

                        //'upper height * width
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap, Job_W, Job_H, "black", 1, "cyan");

                        //'Lower height * width
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + Job_L + Job_H, Job_W, Job_H, "black", 1, "cyan");

                        //' upper flap 1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_H) - Flap_Width, Job_H, Flap_Width, "black", 1, "black");

                        //' upper flap 2
                        DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY + Overlap_Flap + (Job_H) - Flap_Width, Job_H, Flap_Width, "black", 1, "black");

                        //'lower flap 1
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Job_L + Overlap_Flap, Job_H, Flap_Width, "black", 1, "black");

                        //'lower flap 2
                        DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY + Job_H + Job_L + Overlap_Flap, Job_H, Flap_Width, "black", 1, "black");

                        //'Draw upper Overlap_Flap
                        DrawRectangle(svg, DrawX + Job_H, DrawY, Job_W, Overlap_Flap, "black", 1, "pink");

                        //'Draw lower Overlap_Flap
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + Job_H * 2 + Job_L, Job_W, Overlap_Flap, "black", 1, "pink");

                        //'1  'Draw First Job_h
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'2  'Draw Job w 1
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Overlap_Flap, Job_W, Job_L, "black", 1, "#123ace");
                        DrawX = DrawX + Job_W;

                        //'3  'Draw Second Job_h
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'4  'Draw Job w 2
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Overlap_Flap, Job_W, Job_L, "black", 1, "#123ace");
                        DrawX = DrawX + Job_W + Open_Flap;
                    }
                }

                if (i % 2 === 0) {
                    DrawX = DrawX + (Job_H * 2) + Open_Flap + (Job_W * 2) + Trimming_R;
                }
                else {
                    DrawX = DrawX + Open_Flap + Trimming_R;
                }

                if (i % 2 === 0) {
                    if (Flap_Width > ((Job_H + Overlap_Flap) / 2)) {
                        DrawY = DrawY + (Job_L * 2) + Job_H + (Flap_Width * 4) + Overlap_Flap + Trimming_B;
                    } else {
                        DrawY = DrawY + (Job_L * 2) + Trimming_B;
                    }
                }
                else {
                    if (Flap_Width > ((Job_H + Overlap_Flap) / 2)) {
                        DrawY = DrawY + Job_L + Job_H + (Flap_Width * 2) + Overlap_Flap + Trimming_B;
                    } else {
                        DrawY = DrawY + (Job_H * 2) + (Overlap_Flap * 2) + Trimming_B;
                    }
                }
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;

                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_L;
                }
                for (j = 1; j <= Ups_L; j++) {

                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_B;
                    }
                    if (j % 2 === 0) {

                        // DrawY = DrawY-Job_H;

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY - Open_Flap, Job_L, Open_Flap, "black", 1, "pink");

                        //'1  'Draw job w
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_W, "black", 1, "#123ace");

                        //'1  'Draw Job h
                        DrawRectangle(svg, DrawX, DrawY + Job_W, Job_L, Job_H, "black", 1, "#ace123");

                        //'2  'Draw Job_w
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Job_W, Job_L, Job_W, "black", 1, "#123ace");

                        //'2  'Draw Job h
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Job_W + Job_W, Job_L, Job_H, "black", 1, "#ace123");

                        //'left height * width
                        DrawRectangle(svg, DrawX - Job_H, DrawY + Job_H + Job_W, Job_H, Job_W, "black", 1, "cyan");

                        //'Right height * width
                        DrawRectangle(svg, DrawX + Job_L, DrawY + Job_H + Job_W, Job_H, Job_W, "black", 1, "cyan");

                        //'Draw Left Overlap_Flap
                        DrawRectangle(svg, DrawX - Job_H - Overlap_Flap, DrawY + Job_H + Job_W, Overlap_Flap, Job_W, "black", 1, "red");

                        //'Draw Right Overlap_Flap
                        DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + Job_W + Job_H, Overlap_Flap, Job_W, "black", 1, "red");

                        //'left upper flap 1
                        DrawRectangle(svg, DrawX - Flap_Width, DrawY + Job_W, Flap_Width, Job_H, "black", 1, "black");

                        //'left lower flap 2
                        DrawRectangle(svg, DrawX - Flap_Width, DrawY + Job_H + Job_W + Job_W, Flap_Width, Job_H, "black", 1, "black");

                        //' right upper flap 1
                        DrawRectangle(svg, DrawX + Job_L, DrawY + Job_W, Flap_Width, Job_H, "black", 1, "black");

                        //' right lower flap 2
                        DrawRectangle(svg, DrawX + Job_L, DrawY + Job_H + Job_W + Job_W, Flap_Width, Job_H, "black", 1, "black");

                    }
                    else {
                        if (i % 2 === 1) {
                            DrawY = OrginY;
                        } else {
                            DrawY = Job_H * 2 + Open_Flap * 1.75 + Job_W * 2;
                        }
                        //'1  'Draw Job h
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY, Job_L, Job_H, "black", 1, "#ace123");

                        //'1  'Draw job w
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY + Job_H, Job_L, Job_W, "black", 1, "#123ace");

                        //'2  'left Job h + length
                        DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + Job_H, Job_H, Job_W, "black", 1, "cyan");

                        //'Draw Left Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_H, Overlap_Flap, Job_W, "black", 1, "red");

                        //'2  'right Job h + length
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H + Job_L, DrawY + Job_H, Job_H, Job_W, "black", 1, "cyan");

                        //'Draw Right Overlap_Flap
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H + Job_H + Job_L, DrawY + Job_H, Overlap_Flap, Job_W, "black", 1, "red");

                        //' left upper flap 1
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H - Flap_Width, DrawY, Flap_Width, Job_H, "black", 1, "black");

                        //'left lower flap 1
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H - Flap_Width, DrawY + Job_H + Job_W, Flap_Width, Job_H, "black", 1, "black");

                        //' Right upper flap 2
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H + Job_L, DrawY, Flap_Width, Job_H, "black", 1, "black");

                        //'Right lower flap 2
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H + Job_L, DrawY + Job_H + Job_W, Flap_Width, Job_H, "black", 1, "black");

                        //'2  'Draw Job h
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY + Job_H + Job_W, Job_L, Job_H, "black", 1, "#ace123");

                        //'2  'Draw Job_w
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY + Job_H + Job_W + Job_H, Job_L, Job_W, "black", 1, "#123ace");

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY + Job_H + Job_W + Job_H + Job_W, Job_L, Open_Flap, "black", 1, "pink");

                    }

                    if (j % 2 === 0) {
                        if (Flap_Width > ((Job_H + Overlap_Flap) / 2)) {
                            DrawX = DrawX + (Job_L * 2) + Job_H + (Flap_Width * 4) + Overlap_Flap + Trimming_B;
                        } else {
                            DrawX = DrawX + (Job_L) + Trimming_B;
                        }
                    }
                    else {
                        if (Flap_Width > ((Job_H + Overlap_Flap) / 2)) {
                            DrawX = DrawX + Job_L + Job_H + (Flap_Width * 2) + Overlap_Flap + Trimming_B;
                        }
                        else {
                            DrawX = DrawX + Job_L + (Job_H * 2) + (Overlap_Flap * 2) + Trimming_B;
                        }

                    }
                    DrawY = DrawY + Job_H;
                }
                DrawY = DrawY + (Job_H * 2) + (Job_L * 2) + Open_Flap;
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

/////Draw Standard Straight Tuck In Hang added on 11-04-2019
function DrawStandardStraightTuckInHang(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent
    var Job_Flap_H = Number(document.getElementById("JobFlapHeight").value);

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i % 2 === 0) {

                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }

                    for (j = 1; j <= Ups_L; j++) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }

                        //'1 ''Draw Overlap Flap
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Overlap_Flap, "black", 1, "#123ace");
                        DrawY = DrawY + Overlap_Flap;

                        //   //'1  'Draw First Job L
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_W, "black", 1, "#ace123");
                        DrawY = DrawY + Job_W;

                        //'2  'Draw First Job H
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_H, "black", 1, "#123ace");
                        DrawY = DrawY + Job_H;

                        //'3  'Draw Second Job L
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_W, "black", 1, "#ace123");
                        DrawY = DrawY + Job_W;

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY, DrawX + Open_Flap, DrawY + Job_H, "black", 1, "red");

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX + Open_Flap, DrawY, DrawX + Open_Flap + Job_W, DrawY + Job_H, "black", 1, "cyan");

                        //'Draw Dukkan Job_W 2
                        DrawRectangle(svg, DrawX + Open_Flap + Job_W + Job_L, DrawY, DrawX + Open_Flap + (Job_W * 2) + Job_L, DrawY + Job_H, "black", 1, "cyan");

                        //'Draw upper Overlap_Flap
                        DrawRectangle(svg, DrawX + Open_Flap + (Job_W * 2) + Job_L, DrawY, DrawX + Open_Flap + (Job_W * 2) + Job_L + Open_Flap, DrawY + Job_H, "black", 1, "pink");

                        //'Draw Second Job H
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_H, "black", 1, "pink");
                        DrawY = DrawY + Job_H;

                        //'Draw upper Flap H1
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_Flap_H, "black", 1, "black");
                        DrawY = DrawY + Job_Flap_H;

                        //'upper flap H2
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_Flap_H, "black", 1, "black");

                        DrawX = DrawX + Job_W + Trimming_R;
                    }
                    DrawY = DrawY + Open_Flap + Job_W + Job_H + Trimming_B; //After next loop
                } else {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_B;
                    }

                    for (j = 1; j <= Ups_L; j++) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_R;
                        }

                        //'Draw Flap H1
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_Flap_H, "black", 1, "red");
                        DrawY = DrawY + Job_Flap_H;

                        //'Draw Flap H2
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_Flap_H, "black", 1, "cyan");
                        DrawY = DrawY + Job_Flap_H;

                        //' Open flap 1
                        DrawRectangle(svg, DrawX, DrawY, DrawX + Open_Flap, DrawY + Job_H, "black", 1, "black");

                        //' Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX + Open_Flap, DrawY, DrawX + Open_Flap + Job_W, DrawY + Job_H, "black", 1, "black");

                        //' Draw Dukkan Job_W 2
                        DrawRectangle(svg, DrawX + Open_Flap + Job_W + Job_L, DrawY, DrawX + Open_Flap + (Job_W * 2) + Job_L, DrawY + Job_H, "black", 1, "black");

                        //'Open flap 1
                        DrawRectangle(svg, DrawX + Open_Flap + (Job_W * 2) + Job_L, DrawY, DrawX + Open_Flap + (Job_W * 2) + Job_L + Open_Flap, DrawY + Job_H, "black", 1, "black");

                        //'1  'Draw First Job_h
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_H, "black", 1, "#ace123");
                        DrawY = DrawY + Job_H;

                        //'2  'Draw Job L 1
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_W, "black", 1, "#123ace");
                        DrawY = DrawY + Job_W;

                        //'3  'Draw Second Job_h
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_H, "black", 1, "#ace123");
                        DrawY = DrawY + Job_H;

                        //'4  'Draw Second Job L2
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Job_W, "black", 1, "#123ace");
                        DrawY = DrawY + Job_W;

                        //'5  'Draw Overlap_Flap2
                        DrawRectangle(svg, DrawX + Job_W + Open_Flap, DrawY, DrawX + Job_W + Open_Flap + Job_L, DrawY + Overlap_Flap, "black", 1, "#123ace");

                        DrawY = OrginY;
                        DrawX = DrawX + Job_W + Open_Flap + Job_L + Trimming_L;
                    }
                }
                DrawY = DrawY + Job_H + Trimming_T;
            }

            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_L; i++) {
                DrawX = OrginX;

                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_L;
                }
                for (j = 1; j <= Ups_H; j++) {

                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_T;
                    }
                    if (j % 2 === 0) {

                        //'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Overlap_Flap, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "red");
                        DrawX = DrawX + Overlap_Flap;

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Job_W, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#123ace");
                        DrawX = DrawX + Job_W;

                        //'Draw First Job_H
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Job_H, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Job_W, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#123ace");
                        DrawX = DrawX + Job_W;

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY, DrawX + Job_H, DrawY + Open_Flap, "black", 1, "pink");

                        //'Draw Dukkan Job_W 1                                 
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, DrawX + Job_H, DrawY + Open_Flap + Job_W, "black", 1, "#123ace");

                        // 'Draw Dukkan Job_W 2                                
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W + Job_L, DrawX + Job_H, DrawY + Open_Flap + (Job_W * 2) + Job_L, "black", 1, "#123ace");

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + (Job_W * 2) + Job_L, DrawX + Job_H, DrawY + (Open_Flap * 2) + (Job_W * 2) + Job_L, "black", 1, "pink");

                        //'Draw Second Job H
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, DrawX + Job_H, DrawY + Open_Flap + Job_W + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'Draw Flap H
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W + Job_L, "black", 1, "cyan");
                        DrawX = DrawX + Job_Flap_H;

                        //'Draw Flap H2
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W + Job_L, "black", 1, "cyan");

                        DrawX = DrawX + Trimming_B;
                    }
                    else {

                        //'1  'Draw Flap H
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_Flap_H;

                        //'1  'Draw Flap H2
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_Flap_H;

                        //'1  'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY, DrawX + Job_H, DrawY + Open_Flap, "black", 1, "#ace123");

                        //'1  'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, DrawX + Job_H, DrawY + Open_Flap + Job_W, "black", 1, "#123ace");

                        //'1  'Draw Dukkan Job_W 2
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W + Job_L, DrawX + Job_H, DrawY + Open_Flap + (Job_W * 2) + Job_L, "black", 1, "#123ace");

                        //'1  'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + (Job_W * 2) + Job_L, DrawX + Job_H, DrawY + (Open_Flap * 2) + (Job_W * 2) + Job_L, "black", 1, "#ace123");

                        //'Draw First Job H
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Job_H, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Job_W, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_W;

                        //'Draw Second Job H
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, DrawX + Job_H, DrawY + Open_Flap + Job_W + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Job_W, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_W;

                        //'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, DrawX + Overlap_Flap, DrawY + Job_W + Open_Flap + Job_L, "black", 1, "#ace123");

                        DrawX = OrginX;
                    }

                    DrawY = DrawY + Job_H;
                }
                DrawY = DrawY + Open_Flap + Job_W + Job_L + Trimming_R;
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

//
function Draw_Reverse_Tuck_In(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {

    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:

            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //Draw Overlap_Flap                

                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Overlap_Flap), (Job_H), "black", 1, "green");
                    DrawX = DrawX + Overlap_Flap;
                    //Draw Open_Flap             
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "Red");

                    //Draw  Dukkan Job_W 1
                    DrawRectangle(svg, DrawX, (DrawY + Open_Flap), (Job_L), (Job_W), "black", 1, "yellow");

                    //Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "cyan");
                    DrawX = DrawX + Job_L;
                    //Draw First Job_W
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "yellow");
                    DrawX = DrawX + Job_W;
                    //Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "cyan");
                    DrawX = DrawX + Job_L;

                    //Draw Second Job L
                    DrawRectangle(svg, DrawX - Job_L, (DrawY + Job_W + (Open_Flap) + Job_H), (Job_L), (Job_W), "black", 1, "yellow");
                    //Draw Dukkan Job_W 2
                    DrawRectangle(svg, DrawX - Job_L, DrawY + Job_W + Open_Flap + Job_H + Job_W, Job_L, Open_Flap, "black", 1, "red");
                    DrawX = DrawX + Job_W;
                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX - Job_W, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "yellow");
                    DrawX = DrawX + Trimming_R;
                }
                DrawY = DrawY + Open_Flap + Job_W + Job_H + Trimming_B;
            }
            break;

        case 2:

            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_L;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_B;
                    }

                    //Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Open_Flap, Job_L, "black", 1, "blue");
                    DrawX = DrawX + Open_Flap;

                    //Draw Dukkan Job_W 1 
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_W, Job_L, "black", 1, "yellow");
                    DrawX = DrawX + Job_W;

                    // Draw Overlap_Flap 
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "green");
                    //Draw  First Job L 
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "cyan");
                    //Draw First Job_W 
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "red");

                    //Draw  Second Job L 
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "cyan");
                    //Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "red");
                    DrawX = DrawX + Job_H;
                    //Draw Dukkan Job_W 2
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_W, Job_L, "black", 1, "yellow");
                    DrawX = DrawX + Job_W;
                    //Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "blue");
                    DrawX = DrawX - Job_W + Trimming_T;
                }
                // DrawX = DrawX + Job_H;
                DrawY = DrawY + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

/////
function Draw_Four_Corner_Box(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //Draw base for Job H
                    DrawRectangle(svg, DrawX, DrawY, Job_W + (Job_H * 2), Job_L + (Job_H * 2), "black", 1, "#ace123");

                    //Draw Job L, Job W
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Job_H, Job_W, Job_L, "black", 1, "green");
                    DrawX = DrawX + Job_W + (Job_H * 2) + Trimming_R;
                }
                DrawY = DrawY + Job_L + (Job_H * 2) + Trimming_B;


            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    //DrawY = DrawY + Trimming_T;
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //Draw base for Job H
                    DrawRectangle(svg, DrawX, DrawY, Job_L + (Job_H * 2), Job_W + (Job_H * 2), "black", 1, "#ace123");

                    //Draw Job L, Job W 
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Job_H, Job_L, Job_W, "black", 1, "green");
                    DrawX = DrawX + Job_L + (Job_H * 2) + Trimming_R;
                }
                DrawY = DrawY + Job_W + (Job_H * 2) + Trimming_B;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

function Draw_Standard_Straight_Tuck_In(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_T;
                }


                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                    DrawX = DrawX + Overlap_Flap;

                    //Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_L, Job_H, "black", 1, "blue");
                    DrawX = DrawX + Job_L;

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "green");
                    DrawX = DrawX + Job_W;

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, (DrawY + Job_W + Open_Flap), (Job_L), (Job_H), "black", 1, "blue");

                    //Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "red");

                    //Draw Dukkan Job_W 1
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_W, "black", 1, "cyan");

                    //Draw Dukkan Job_W 2
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap + Job_H, Job_L, Job_W, "black", 1, "cyan");

                    //Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, DrawY + (Job_W * 2) + Open_Flap + Job_H, Job_L, Open_Flap, "black", 1, "red");
                    DrawX = DrawX + Job_L;

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "green");
                    DrawX = DrawX + Job_W + Trimming_R;
                }
                DrawY = DrawY + (Open_Flap * 2) + (Job_W * 2) + Job_H + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    //DrawY = DrawY + Trimming_T;
                    DrawY = DrawY + Trimming_T;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    } else {
                        DrawX = DrawX + Trimming_L;
                    }

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Open_Flap, Job_L, "black", 1, "red");
                    DrawX = DrawX + Open_Flap;

                    //'Draw Dukkan Job_W 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_W, Job_L, "black", 1, "cyan");
                    DrawX = DrawX + Job_W;

                    //'Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "green");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), (Job_H), (Job_L), "black", 1, "#ace123");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "pink");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "cyan");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L * 2 + Job_W, Job_H, Job_W, "black", 1, "pink");
                    DrawX = DrawX + Job_H;

                    //'Draw Dukkan Job_W 2
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_W, Job_L, "black", 1, "cyan");
                    DrawX = DrawX + Job_W;

                    //'Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Open_Flap, Job_L, "black", 1, "red");
                    DrawX = DrawX + Open_Flap + Trimming_R;

                }
                DrawY = DrawY + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_B;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

//
function Draw_Crash_Lock_With_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i % 2 === 0) {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }

                    for (j = 1; j <= Ups_L; j++) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Overlap_Flap, Job_H, "black", 1, "green");
                        DrawX = DrawX + Overlap_Flap;

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_L, Job_H, "black", 1, "#aceb44");

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "cyan");
                        DrawX = DrawX + Job_L;

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Job_W;

                        //'Draw Open_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "red");

                        //'Draw Dukkan Job_W
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_W, "black", 1, "yellow");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_L, Job_H, "black", 1, "#aceb44");

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "cyan");
                        DrawX = DrawX + Job_L;

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Job_W + Trimming_R

                    }
                    DrawY = DrawY + Open_Flap + Job_W + Job_H + Bottom_Flap + Trimming_B;
                }
                else {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_B;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_R;
                        }
                        //'Draw OverLap_Flap

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Overlap_Flap;

                        //'Draw Bottom_Flap1

                        DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "cyan");

                        //'Draw First Job L

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#aceb44");

                        //'Draw Dukkan Job_W

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H, Job_L, Job_W, "black", 1, "yellow");

                        //'Draw Open_Flap

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H + Job_W, Job_L, Open_Flap, "black", 1, "red");
                        DrawX = DrawX + Job_L;

                        //'Draw First Job_W

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_W, Job_H, "black", 1, "#67ac45");
                        DrawX = DrawX + Job_W;

                        //'Draw Bottom_Flap2

                        DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "cyan");

                        //'Draw Second Job L

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#aceb44");
                        DrawX = DrawX + Job_L;

                        //'Draw Second Job_W

                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_W, Job_H, "black", 1, "#67ac45");
                        DrawX = DrawX + Job_W + Trimming_L;

                    }
                    DrawY = DrawY + Bottom_Flap + Job_H + Trimming_T;
                }
            }
            break;

        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_L;
                }

                for (j = 1; j <= Ups_L; j++) {
                    if (j % 2 === 0) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_T;
                        }
                        //  'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, (DrawY + Overlap_Flap), Open_Flap, Job_L, "black", 1, "blue");
                        DrawX = DrawX + Open_Flap;

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_W, Job_L, "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "green");

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#aceb14");

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "#12acb1");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#aceb14");

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "#12acb1");
                        DrawX = DrawX + Job_H;

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "cyan");

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Bottom_Flap, Job_L, "black", 1, "cyan");

                        DrawX = DrawX + Bottom_Flap + Trimming_B;

                    }
                    else {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_B;
                        }

                        //'Draw Bottom_Flap1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "cyan");

                        //'Draw Bottom_Flap2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Bottom_Flap, (Job_L), "black", 1, "cyan");
                        DrawX = DrawX + Bottom_Flap;

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "green");

                        //'Draw First Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#aceb14");

                        //'Draw First Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "#12acb1");

                        //'Draw Second Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#aceb14");

                        //'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "#12acb1");
                        DrawX = DrawX + Job_H;

                        //'Draw Dukkan Job_W 1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_W, Job_L, "black", 1, "yellow");
                        DrawX = DrawX + Job_W;

                        //'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Open_Flap, Job_L, "black", 1, "red");

                        DrawX = DrawX - Job_W + Trimming_T;

                    }
                }
                DrawY = DrawY + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

///////////Completed by pKp
function Draw_Carry_Bag(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    DrawX = DrawX + Trimming_L;

                    ////'Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "blue");
                    DrawX = DrawX + Overlap_Flap;

                    ////'Draw Open_Flap
                    DrawRectangle(svg, DrawX, DrawY, (Job_L * 2) + (Job_W * 2), Open_Flap, "black", 1, "yellow");

                    ////'Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "Green");

                    ////'Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_H + Open_Flap, (Job_L * 2) + (Job_W * 2), Bottom_Flap, "black", 1, "#800000");
                    DrawX = DrawX + Job_L;

                    ////'Draw First Job_W
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_W, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Job_W;

                    ////'Draw Second Job L
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "green");
                    DrawX = DrawX + Job_L;

                    ////'Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_W, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Job_W + Trimming_R;

                }
                DrawY = DrawY + Open_Flap + Job_H + Bottom_Flap + Trimming_B;
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                DrawY = DrawY + Trimming_L;

                for (j = 1; j <= Ups_L; j++) {
                    DrawX = DrawX + Trimming_T;

                    ////'Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, (Job_L * 2) + (Job_W * 2), "black", 1, "#800000");
                    DrawX = DrawX + Bottom_Flap;

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "red");

                    //Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "yellow");

                    //Draw  Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "cyan");

                    //Draw Second Job_L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, (Job_L), "black", 1, "yellow");

                    //Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, (Job_W), "black", 1, "cyan");
                    DrawX = DrawX + Job_H;

                    //Draw Open_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, (Job_L * 2) + (Job_W * 2), "black", 1, "green");
                    DrawX = DrawX + Open_Flap + Trimming_L;

                }
                DrawY = DrawY + Overlap_Flap + (Job_L * 2) + (Job_W * 2) + Trimming_T;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);

}


function Draw_Env_Center_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                if (i % 2 === 0) {
                    DrawX = OrginX;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_B;

                    } for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }
                        if (j % 2 === 0) {

                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                            DrawX = DrawX + Overlap_Flap;
                        }
                        //Draw Bottom_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY, Job_L, Bottom_Flap, "black", 1, "green");

                        //Draw Open_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY + Bottom_Flap + Job_H, Job_L, Open_Flap, "black", 1, "red");

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + (Job_L / 2);

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#123ace");
                        DrawX = DrawX + Job_L;

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, (Job_L / 2), Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + (Job_L / 2);

                        if (j % 2 === 1) {

                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                            DrawX = DrawX + Overlap_Flap;
                        }
                        DrawX = DrawX + Trimming_R;
                    }
                    DrawY = DrawY + Job_H + Open_Flap + Bottom_Flap + Trimming_T;
                }
                else {
                    DrawX = OrginX;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }
                        if (j % 2 === 0) {
                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                            DrawX = DrawX + Overlap_Flap;
                        }
                        //Draw Open_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY, Job_L, Open_Flap, "black", 1, "red");

                        //Draw Bottom_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "green");

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, (Job_L / 2), Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + (Job_L / 2);

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#123ace");
                        DrawX = DrawX + Job_L;

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, (Job_L / 2), Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + (Job_L / 2);

                        if (j % 2 === 1) {
                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                            DrawX = DrawX + Overlap_Flap;
                        }
                        DrawX = DrawX + Trimming_R;
                    }
                    DrawY = DrawY + Open_Flap + Bottom_Flap + Job_H + Trimming_B;
                }
            }
            break;
        case 5:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                DrawX = OrginX;
                if (i % 2 === 0) {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_L;

                    } for (j = 1; j <= Ups_L; j++) {

                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_B;
                            }
                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");

                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX + Bottom_Flap + Job_H, DrawY + Overlap_Flap + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");

                            DrawX = DrawX + Bottom_Flap;
                        } else {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX;
                            }
                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");

                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX + Open_Flap + Job_H, DrawY + Overlap_Flap + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");

                            DrawX = DrawX + Open_Flap;
                        }
                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "pink");

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, (Job_L / 2), "black", 1, "#ace123");

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2), Job_H, Job_L, "black", 1, "green");

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2) + Job_L, Job_H, (Job_L / 2), "black", 1, "#ace123");

                        if (j % 2 === 0) {
                            DrawX = DrawX + Job_H + Open_Flap + Trimming_T;
                        } else {
                            DrawX = DrawX + Job_H + Bottom_Flap + Trimming_B;
                        }
                    }
                    DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_R;
                }
                else {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_L;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_B;
                            }
                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX + Open_Flap + Job_H, DrawY + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");

                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");

                            DrawX = DrawX + Open_Flap;
                        }
                        else {
                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");
                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX + Open_Flap + Job_H, DrawY + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");
                            DrawX = DrawX + Open_Flap;
                        }

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY, Job_H, (Job_L / 2), "black", 1, "#ace123");

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + (Job_L / 2), Job_H, Job_L, "black", 1, "green");

                        //Draw Seocond Half Job L

                        DrawRectangle(svg, DrawX, DrawY + (Job_L / 2) + Job_L, Job_H, (Job_L / 2), "black", 1, "#ace123");
                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + (Job_L * 2), Job_H, Overlap_Flap, "black", 1, "pink");

                        if (j % 2 === 0) {
                            DrawX = DrawX + Job_H + Open_Flap + Trimming_T;
                        } else {
                            DrawX = DrawX + Job_H + Bottom_Flap + Trimming_B;
                        }
                        //  DrawX = DrawX +Trimming_B;
                    }
                    DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_R;
                }
            }
            break;
        case 7:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                if (i % 2 === 0) {
                    DrawX = OrginX + Job_L;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_B;
                    }

                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX + Trimming_L;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }
                        if (j % 2 === 1) {

                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "pink");

                            DrawX = DrawX + Overlap_Flap;

                        }
                        //Draw Bottom_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY, Job_L, Bottom_Flap, "black", 1, "cyan");

                        //Draw Open_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY + Bottom_Flap + Job_H, Job_L, Open_Flap, "black", 1, "black");

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, (Job_L / 2), Job_H, "black", 1, "green");
                        DrawX = DrawX + (Job_L / 2);

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX + (Job_L), DrawY + Bottom_Flap, (Job_L / 2), Job_H, "black", 1, "green");

                        DrawX = DrawX + (Job_L / 2);

                        if (j % 2 === 0) {
                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX + (Job_L), DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "pink");

                            DrawX = DrawX + Overlap_Flap;
                        }
                        DrawX = DrawX + Job_L + Trimming_R;
                    }
                    DrawY = DrawY + Job_H + Bottom_Flap + Trimming_T;
                }
                else {
                    DrawX = OrginX;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX + Trimming_L;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }
                        if (j % 2 === 1) {
                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "yellow");

                            DrawX = DrawX + Overlap_Flap;
                        }
                        //Draw Open_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY, Job_L, Open_Flap, "black", 1, "black");

                        //Draw Bottom_Flap
                        DrawRectangle(svg, DrawX + (Job_L / 2), DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "cyan");

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, (Job_L / 2), Job_H, "black", 1, "green");
                        DrawX = DrawX + (Job_L / 2);

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, (Job_L / 2), Job_H, "black", 1, "green");
                        DrawX = DrawX + (Job_L / 2);

                        if (j % 2 === 0) {
                            //Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "yellow");
                            DrawX = DrawX + Overlap_Flap;

                        }
                        DrawX = DrawX + Trimming_R;
                    }
                    DrawY = DrawY + Open_Flap + Job_H + Trimming_B;
                }
            }
            break;
        case 9:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                DrawX = OrginX;
                if (i % 2 === 0) {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_L;

                    } for (j = 1; j <= Ups_L; j++) {

                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_B;
                            }
                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");

                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX + Bottom_Flap + Job_H, DrawY + Overlap_Flap + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");

                            DrawX = DrawX + Bottom_Flap;
                        } else {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_T;
                            }
                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");

                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX + Open_Flap + Job_H, DrawY + Overlap_Flap + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");

                            DrawX = DrawX + Open_Flap;
                        }
                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "pink");

                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, (Job_L / 2), "black", 1, "#ace123");

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2), Job_H, Job_L, "black", 1, "green");

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L / 2) + Job_L, Job_H, (Job_L / 2), "black", 1, "#ace123");

                        if (j % 2 === 0) {
                            DrawX = DrawX + Job_H + Trimming_T;
                            DrawY = DrawY - Job_L;
                        } else {
                            DrawX = DrawX + Job_H + Trimming_B;
                            DrawY = DrawY + Job_L;
                        }
                    }

                    if (Ups_L % 2 === 0) {
                        DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_R;
                    } else {
                        DrawY = DrawY + Job_L + Overlap_Flap + Trimming_R;
                    }
                }
                else {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_L;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_B;
                            }
                            //Draw Open_Flap
                            DrawRectangle(svg, DrawX + Job_H, DrawY + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");

                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX - Bottom_Flap, DrawY + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");
                        }
                        else {

                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_T;
                            }
                            DrawRectangle(svg, DrawX, DrawY + (Job_L / 2), Open_Flap, Job_L, "black", 1, "red");
                            //Draw Bottom_Flap
                            DrawRectangle(svg, DrawX + Open_Flap + Job_H, DrawY + (Job_L / 2), Bottom_Flap, Job_L, "black", 1, "cyan");
                            DrawX = DrawX + Open_Flap;
                        }
                        //Draw First Half Job L
                        DrawRectangle(svg, DrawX, DrawY, Job_H, (Job_L / 2), "black", 1, "#ace123");

                        //Draw Full Job L
                        DrawRectangle(svg, DrawX, DrawY + (Job_L / 2), Job_H, Job_L, "black", 1, "green");

                        //Draw Seocond Half Job L
                        DrawRectangle(svg, DrawX, DrawY + (Job_L / 2) + Job_L, Job_H, (Job_L / 2), "black", 1, "#ace123");
                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + (Job_L * 2), Job_H, Overlap_Flap, "black", 1, "pink");

                        if (j % 2 === 0) {
                            DrawX = DrawX + Job_H + Trimming_T;
                            DrawY = DrawY - Job_L;
                        } else {
                            DrawX = DrawX + Job_H + Bottom_Flap + Trimming_B;
                            DrawY = DrawY + Job_L;
                        }
                    }

                    if (Ups_L % 2 === 0) {
                        DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_R;
                    } else {
                        DrawY = DrawY + Job_L + Overlap_Flap + Trimming_R;
                    }
                }
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}


function Draw_Env_Side_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_T;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }
                    ////'Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Overlap_Flap;

                    ////'Draw Open_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "pink");

                    ////'Draw  Job L
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "green");

                    ////Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "yellow");
                    DrawX = DrawX + Job_L;

                    ////'Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Overlap_Flap + Trimming_R;

                }
                DrawY = DrawY + Job_H + Open_Flap + Bottom_Flap + Trimming_B;
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_B;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_L;

                    ////Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Overlap_Flap;

                    //Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "#345acb");

                    //Draw  Job L
                    DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#acbe12");

                    //Draw Open_Flap
                    DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H, Job_L, Open_Flap, "black", 1, "green");
                    DrawX = DrawX + Job_L;

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Overlap_Flap + Trimming_R;
                }
                DrawY = DrawY + Job_H + Open_Flap + Bottom_Flap + Trimming_T;
            }
            break;
        case 3:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_R;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_T;

                    ////Draw Open_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "cyan");
                    DrawX = DrawX + Open_Flap;

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "green");

                    //Draw  Job L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ac1421");

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Overlap_Flap, "black", 1, "green");
                    DrawX = DrawX + Job_H;

                    //Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "yellow");
                    DrawX = DrawX + Bottom_Flap + Trimming_B;
                }
                DrawY = DrawY + Job_L + (Overlap_Flap * 2) + Trimming_L;
            }
            break;

        case 4:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_L;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_B;

                    ////Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "cyan");
                    DrawX = DrawX + Bottom_Flap;

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "green");

                    //Draw  Job L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Overlap_Flap, "black", 1, "green");
                    DrawX = DrawX + Job_H;

                    //Draw Open_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "yellow");
                    DrawX = DrawX + Open_Flap + Trimming_T;
                }
                DrawY = DrawY + Job_L + (Overlap_Flap * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}


function Draw_Catch_Cover(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_L;

                    ////'Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_H + Job_H, Overlap_Flap, Bottom_Flap, "black", 1, "pink");
                    DrawX = DrawX + Overlap_Flap;

                    ////'Draw  Job L1
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "green");

                    ////'Draw  Job L1
                    DrawRectangle(svg, DrawX, DrawY + Job_H, Job_L, Job_H, "black", 1, "green");

                    ////Draw Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_H + Job_H, Job_L, Bottom_Flap, "black", 1, "cyan");
                    DrawX = DrawX + Job_L;

                    ////'Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_H + Job_H, Overlap_Flap, Bottom_Flap, "black", 1, "pink");
                    DrawX = DrawX + Overlap_Flap + Trimming_R;

                }
                DrawY = DrawY + Job_H + Job_H + Bottom_Flap + Trimming_B;
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_B;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j % 2 === 0) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }
                        ////Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Overlap_Flap, Bottom_Flap, "black", 1, "pink");
                        DrawX = DrawX + Overlap_Flap;

                        //Draw Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "cyan");

                        //Draw  Job L1
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "green");

                        //Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H, Job_L, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_L;

                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Overlap_Flap, Bottom_Flap, "black", 1, "pink");
                        DrawX = DrawX + Trimming_R;
                    }
                    else {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }

                        ////Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Job_H, Overlap_Flap, Bottom_Flap, "black", 1, "pink");
                        DrawX = DrawX + Overlap_Flap;

                        //Draw  Job L1
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "green");

                        //Draw  Job L1
                        DrawRectangle(svg, DrawX, DrawY + Job_H, Job_L, Job_H, "black", 1, "green");

                        //Draw Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Job_H, Job_L, Bottom_Flap, "black", 1, "cyan");
                        DrawX = DrawX + Job_L;

                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_H + Job_H, Overlap_Flap, Bottom_Flap, "black", 1, "pink");
                        //DrawX = DrawX + Bottom_Flap + Trimming_L;
                    }
                }
                DrawY = DrawY + Job_H + Job_H + Bottom_Flap + Trimming_T;
            }
            break;

        case 3:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_R;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_T;

                    ////Draw Job L1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");
                    DrawX = DrawX + Job_H;

                    //Draw Job L2
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");
                    DrawX = DrawX + Job_H;

                    //Draw  Bottom_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "cyan");

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY, Bottom_Flap, Overlap_Flap, "black", 1, "pink");
                    // DrawX = DrawX + Job_H;

                    //Draw OverLap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Bottom_Flap, Overlap_Flap, "black", 1, "pink");
                    DrawX = DrawX + Bottom_Flap + Trimming_B;
                }
                DrawY = DrawY + Job_L + (Overlap_Flap * 2) + Trimming_L;
            }
            break;
        case 4:

            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i % 2 === 0) {
                    if (i === 1) {
                        DrawY = DrawY;
                    }
                    else {
                        DrawY = DrawY + Trimming_L;
                    }
                    for (j = 1; j <= Ups_L; j++) {
                        if (j === 1) {
                            DrawX = DrawX;
                        }
                        else {
                            DrawX = DrawX + Trimming_B;
                        }
                        ////Draw Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "cyan");

                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Bottom_Flap, Overlap_Flap, "black", 1, "pink");

                        //Draw  OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Bottom_Flap, Overlap_Flap, "black", 1, "pink");
                        DrawX = DrawX + Bottom_Flap;

                        //Draw  Job L1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");
                        DrawX = DrawX + Job_H;

                        //Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");
                        DrawX = DrawX + Job_H + Trimming_T;
                    }
                    DrawY = DrawY + Job_L + (Overlap_Flap) + Trimming_R;
                }
                else {
                    //DrawX = DrawX + Trimming_R;
                    for (j = 1; j <= Ups_L; j++) {
                        if (j === 1) {
                            DrawX = DrawX;
                        }
                        else {
                            DrawX = DrawX + Trimming_T;
                        }
                        ////Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");
                        DrawX = DrawX + Job_H;

                        //Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");
                        DrawX = DrawX + Job_H;

                        //Draw  Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "cyan");

                        //Draw  OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Bottom_Flap, Overlap_Flap, "black", 1, "pink");

                        //Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Bottom_Flap, Overlap_Flap, "black", 1, "pink");
                        DrawX = DrawX + Bottom_Flap + Trimming_B;
                    }
                    DrawY = DrawY + Job_L + (Overlap_Flap) + Trimming_L;
                }
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);

}


function Draw_Sleev_Box(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_T;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }
                    if (i % 2 === 0) {

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Overlap_Flap, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Overlap_Flap;

                        ////'Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////'Draw First Job_W
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                    }
                    else {

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Overlap_Flap, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Overlap_Flap;

                        ////Draw Job L 1
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////First Job_W
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                    }
                    DrawX = DrawX + Trimming_R;
                }
                if (i % 2 === 0) {
                    DrawY = DrawY + Job_H + Trimming_B;
                }
                else {
                    DrawY = DrawY + Job_H + Trimming_B
                }
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_L;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_B;
                    }
                    if (j % 2 === 0) {
                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX + Job_H, DrawY, Job_H, Overlap_Flap, "black", 1, "cyan");
                        //DrawX = DrawX + Overlap_Flap;

                        ////'Draw Job L1
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");
                        //DrawX = DrawX + Job_L;

                        ////'Draw First Job_W
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "green");
                        //DrawX = DrawX + Job_W;

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#ace123");
                        //DrawX = DrawX + Job_L;

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "green");
                        //DrawX = DrawX + Job_W;

                    }
                    else {

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "cyan");

                        ////Draw Job L 1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                        ////First Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "green");

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#ace123");

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "green");
                    }          // DrawX = DrawX + Open_Flap;


                    if (j % 2 === 0) {
                        DrawX = DrawX + (Job_H * 2) + Trimming_T;
                    }
                    else {
                        DrawX = DrawX + Trimming_T;
                    }

                }
                DrawY = DrawY + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}


function Draw_Tuck_To_Front_Open_Top(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_T;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }
                    if (i % 2 === 0) {
                        ////'Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + Overlap_Flap, DrawY, Job_L, Open_Flap, "black", 1, "red");


                        ////'open flap+width
                        DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + Open_Flap, Job_L, Job_W, "black", 1, "yellow");

                        ////'Draw flap1
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_L, DrawY + Job_W + Open_Flap - ((Job_W + Open_Flap) * (40 / 100)), Job_W, ((Job_W + Open_Flap) * (40 / 100)), "black", 1, "cyan");

                        ////'Draw flap1
                        DrawRectangle(svg, DrawX + Overlap_Flap + (Job_L * 2) + (Job_W), DrawY + Job_W + Open_Flap - ((Job_W + Open_Flap) * (40 / 100)), Job_W, ((Job_W + Open_Flap) * (40 / 100)), "black", 1, "cyan");

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Overlap_Flap;

                        ////'Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////'Draw First Job_W
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY + Job_W + Open_Flap, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                    }
                    else {
                        ////'open flap + width
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_L + Job_W, DrawY + Job_H, Job_L, Job_W, "black", 1, "yellow");

                        ////Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_L + Job_W, DrawY + Job_H + Job_W, Job_L, Open_Flap, "black", 1, "red");

                        ////'Draw flap1
                        DrawRectangle(svg, DrawX + Overlap_Flap + Job_L, DrawY + Job_H, Job_W, ((Job_W + Open_Flap) * (40 / 100)), "black", 1, "cyan");

                        //Draw flap1
                        DrawRectangle(svg, DrawX + Overlap_Flap + (Job_L * 2) + (Job_W), DrawY + Job_H, (Job_W), ((Job_W + Open_Flap) * (40 / 100)), "black", 1, "cyan");

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Overlap_Flap, Job_H, "black", 1, "cyan");
                        DrawX = DrawX + Overlap_Flap;

                        ////Draw Job L 1
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////First Job_W
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY, Job_W, Job_H, "black", 1, "green");
                        DrawX = DrawX + Job_W;

                    }
                    DrawX = DrawX + Trimming_R;
                }
                if (i % 2 === 0) {
                    DrawY = DrawY + Job_W + Open_Flap + Job_H + Trimming_B;
                }
                else {
                    DrawY = DrawY + Job_H + Trimming_B
                }
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_L;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_B;
                    }
                    if (j % 2 === 0) {
                        ////open flap+width
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap, DrawY + Job_L + Overlap_Flap + Job_W, Job_W, Job_L, "black", 1, "yellow");


                        ////'open Open_Flap
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Job_L + Overlap_Flap + Job_W, Open_Flap, Job_L, "black", 1, "red");

                        ////'Draw flap1
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W - ((Job_W + Open_Flap) * (40 / 100)), DrawY + Job_L + Overlap_Flap, ((Job_W + Open_Flap) * (40 / 100)), Job_W, "black", 1, "cyan");

                        ////'Draw flap1
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W - ((Job_W + Open_Flap) * (40 / 100)), DrawY + (Job_L * 2) + Overlap_Flap + Job_W, ((Job_W + Open_Flap) * (40 / 100)), Job_W, "black", 1, "cyan");

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W, DrawY, Job_H, Overlap_Flap, "black", 1, "cyan");
                        //DrawX = DrawX + Overlap_Flap;

                        ////'Draw Job L1
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");
                        //DrawX = DrawX + Job_L;

                        ////'Draw First Job_W
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "green");
                        //DrawX = DrawX + Job_W;

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "cyan");
                        //DrawX = DrawX + Job_L;

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX + Job_H + Open_Flap + Job_W, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "green");
                    }
                    else {
                        ////'open flap + width
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap, Job_W, Job_L, "black", 1, "yellow");

                        ////Draw Open_Flap 1
                        DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "red");

                        ////'Draw flap1
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + Job_L, ((Job_W + Open_Flap) * (40 / 100)), Job_W, "black", 1, "cyan");

                        ////Draw flap1
                        DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, ((Job_W + Open_Flap) * (40 / 100)), (Job_W), "black", 1, "cyan");

                        ////'Draw Overlap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "cyan");

                        ////Draw Job L 1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                        ////First Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "green");

                        ////Draw Job L 2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#ace123");

                        ////'Draw Second Job_W
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "green");
                    }

                    if (j % 2 === 0) {
                        DrawX = DrawX + (Job_H * 2) + Job_W + Trimming_T;
                    }
                    else {
                        DrawX = DrawX + Trimming_T;
                    }
                }
                DrawY = DrawY + Overlap_Flap + (Job_W * 2) + (Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}


function Draw_Webbed_Self_locking_Tray(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style, Tongue_Height) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_L;

                    // 'Draw Overlap_Flap left
                    DrawRectangle(svg, DrawX, DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Overlap_Flap, Job_W, "black", 1, "pink");

                    ////'Draw Overlap_Flap right
                    DrawRectangle(svg, DrawX + (Job_H * 4) + Job_L + Overlap_Flap + (Tongue_Height * 2), DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Overlap_Flap, Job_W, "black", 1, "pink");

                    //draw left height + length 1
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Job_H, Job_W, "black", 1, "yellow");

                    //draw left Wall Width
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Tongue_Height, Job_W, "black", 1, "green");

                    //draw left height + length 2
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_H + Tongue_Height, DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Job_H, Job_W, "black", 1, "cyan");

                    //draw Right height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Job_L + Overlap_Flap + Tongue_Height, DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Job_H, Job_W, "black", 1, "cyan");

                    //draw Right Wall Width
                    DrawRectangle(svg, DrawX + (Job_H * 3) + Job_L + Overlap_Flap + Tongue_Height, DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Tongue_Height, Job_W, "black", 1, "green");

                    //draw Right height + length 2
                    DrawRectangle(svg, DrawX + (Job_H * 3) + Job_L + Overlap_Flap + (Tongue_Height * 2), DrawY + (Job_H * 2) + Open_Flap + Tongue_Height, Job_H, Job_W, "black", 1, "yellow");

                    //Draw upper flap 1
                    DrawRectangle(svg, DrawX + Job_H + Overlap_Flap + Tongue_Height, DrawY + Job_H + Open_Flap + Tongue_Height, Job_H, Job_H, "black", 1, "cyan");

                    //Draw upper flap 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Job_L + Tongue_Height, DrawY + Job_H + Open_Flap + Tongue_Height, Job_H, Job_H, "black", 1, "cyan");

                    //Draw lower flap 1
                    DrawRectangle(svg, DrawX + Job_H + Overlap_Flap + Tongue_Height, DrawY + (Job_H * 2) + Open_Flap + Job_W + Tongue_Height, Job_H, Job_H, "black", 1, "cyan");

                    //Draw lower flap 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Job_L + Tongue_Height, DrawY + (Job_H * 2) + Open_Flap + Job_W + Tongue_Height, Job_H, Job_H, "black", 1, "cyan");

                    //Draw Open_Flap Top
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY, Job_L, Open_Flap, "black", 1, "black");

                    //Draw Open_Flap Top
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + (Job_H * 4) + Job_W + Open_Flap + (Tongue_Height * 2), Job_L, Open_Flap, "black", 1, "black");

                    //draw upper height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");

                    //draw upper Wll Width
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap + Job_H, Job_L, Tongue_Height, "black", 1, "green");

                    //draw upper height + length 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap + Job_H + Tongue_Height, Job_L, Job_H, "black", 1, "#123ace");

                    //Draw Width
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap + (Job_H * 2) + Tongue_Height, Job_L, Job_W, "black", 1, "red");

                    //draw lower height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap + (Job_H * 2) + Job_W + Tongue_Height, Job_L, Job_H, "black", 1, "#123ace");

                    //draw lower Wall Width
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap + (Job_H * 3) + Job_W + Tongue_Height, Job_L, Tongue_Height, "black", 1, "green");

                    //draw lower height + length 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap + Tongue_Height, DrawY + Open_Flap + (Job_H * 3) + Job_W + (Tongue_Height * 2), Job_L, Job_H, "black", 1, "#ace123");
                    DrawX = DrawX + (Job_H * 4) + Job_L + (Overlap_Flap * 2) + (Tongue_Height * 2) + Trimming_R;
                }
                DrawY = DrawY + (Job_H * 4) + Job_W + (Open_Flap * 2) + (Tongue_Height * 2) + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_L;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_B;

                    //Draw Open Flap left
                    DrawRectangle(svg, DrawX, DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Open_Flap, Job_L, "black", 1, "red");

                    //Draw OPen Flap Right
                    DrawRectangle(svg, DrawX + (Job_H * 4) + Job_W + Open_Flap + (Tongue_Height * 2), DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Open_Flap, Job_L, "black", 1, "green");

                    //draw left height + length 1
                    DrawRectangle(svg, DrawX + Open_Flap, DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Job_H, Job_L, "black", 1, "yellow");

                    //'draw left Wall Width
                    DrawRectangle(svg, DrawX + Open_Flap + Job_H, DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Tongue_Height, Job_L, "black", 1, "cyan");

                    //'draw left height + length 2
                    DrawRectangle(svg, DrawX + Open_Flap + Job_H + Tongue_Height, DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Job_H, Job_L, "black", 1, "blue");

                    //'draw Right height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W + Open_Flap + Tongue_Height, DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Job_H, Job_L, "black", 1, "blue");

                    //draw Right Wall Width
                    DrawRectangle(svg, DrawX + (Job_H * 3) + Job_W + Open_Flap + Tongue_Height, DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Tongue_Height, Job_L, "black", 1, "cyan");

                    //'draw Right height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 3) + Job_W + Open_Flap + (Tongue_Height * 2), DrawY + (Job_H * 2) + Overlap_Flap + Tongue_Height, Job_H, Job_L, "black", 1, "yellow");

                    //''Draw upper flap 1
                    DrawRectangle(svg, DrawX + Job_H + Open_Flap + Tongue_Height, DrawY + Job_H + Overlap_Flap + Tongue_Height, Job_H, Job_H, "black", 1, "#ace123");

                    //''Draw upper flap 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Job_W + Tongue_Height, DrawY + Job_H + Overlap_Flap + Tongue_Height, Job_H, Job_H, "black", 1, "#ace123");

                    //'Draw lower flap 1
                    DrawRectangle(svg, DrawX + Job_H + Open_Flap + Tongue_Height, DrawY + Job_H + Job_H + Job_L + Overlap_Flap + Tongue_Height, Job_H, Job_H, "black", 1, "#ace123");

                    //''Draw lower flap 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Job_W + Tongue_Height, DrawY + Job_H + Job_H + Job_L + Overlap_Flap + Tongue_Height, Job_H, Job_H, "black", 1, "#ace123");

                    //'Draw Overlap_Flap Top
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY, Job_W, Overlap_Flap, "black", 1, "yellow");

                    //'Draw Overlap_Flap Bottom
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + (Job_H * 4) + Job_L + Overlap_Flap + (Tongue_Height * 2), Job_W, Overlap_Flap, "black", 1, "yellow");

                    //'draw upper height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap, Job_W, Job_H, "black", 1, "cyan");

                    //'draw upper Wall Width
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap + Job_H, Job_W, Tongue_Height, "black", 1, "red");

                    //draw upper height + length 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap + Job_H + Tongue_Height, Job_W, Job_H, "black", 1, "cyan");

                    //Draw Width
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap + (Job_H * 2) + Tongue_Height, Job_W, Job_L, "black", 1, "Pink");

                    //'draw lower height + length 1
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap + (Job_H * 2) + Job_L + Tongue_Height, Job_W, Job_H, "black", 1, "cyan");

                    //draw lower Wall Width
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap + (Job_H * 3) + Job_L + Tongue_Height, Job_W, Tongue_Height, "black", 1, "red");

                    //'draw lower height + length 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Open_Flap + Tongue_Height, DrawY + Overlap_Flap + (Job_H * 3) + Job_L + (Tongue_Height * 2), Job_W, Job_H, "black", 1, "cyan");

                    DrawX = DrawX + (Job_H * 4) + Job_W + (Open_Flap * 2) + (Tongue_Height * 2) + Trimming_B;
                }
                DrawY = DrawY + (Job_H * 4) + Job_L + (Overlap_Flap * 2) + (Tongue_Height * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}


function Draw_Ring_Flap(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }
                    //'Draw Main Box
                    //'Draw Open Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_W, Open_Flap, "black", 1, "black");

                    //'Draw 1st length BOX
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_W, Job_L, "black", 1, "green");

                    //'Draw 1st width Box
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_L, Job_W, Job_H, "black", 1, "#ace123");

                    //'Draw 2nd Length
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_L + Job_H, Job_W, Job_L, "black", 1, "green");

                    //'Draw 2st width Box
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + (Job_L * 2) + Job_H, Job_W, Job_H, "black", 1, "#ace123");

                    //'Draw Overlap Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + (Job_L * 2) + (Job_H * 2), Job_W, Overlap_Flap, "black", 1, "pink");

                    //'Draw Side Wall Box
                    //'Draw upper Overlap Flap
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap, DrawY, Job_H, Overlap_Flap, "black", 1, "cyan");

                    //'Draw Bottom Overlap Flap
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Overlap_Flap, "black", 1, "cyan");

                    //'Draw First wall
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "green");

                    //'Draw Second Wall
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "#b13b11");

                    //'Draw third wall
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#123ace");

                    //'Draw overlap Flap Left For First Wall
                    DrawRectangle(svg, DrawX + Job_W, DrawY + Overlap_Flap, Overlap_Flap, Job_L, "black", 1, "cyan");

                    //'Draw overlap Flap Right For First Wall
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap + Job_H, DrawY + Overlap_Flap, Overlap_Flap, Job_L, "black", 1, "cyan");

                    //'Draw overlap Flap Right Third Wall
                    DrawRectangle(svg, DrawX + Job_W + Overlap_Flap + Job_H, DrawY + Overlap_Flap + Job_W + Job_L, Overlap_Flap, Job_L, "black", 1, "cyan");

                    //'Draw overlap Flap Left For Third Wall
                    DrawRectangle(svg, DrawX + Job_W, DrawY + Overlap_Flap + Job_W + Job_L, Overlap_Flap, Job_L, "black", 1, "cyan");

                    DrawX = DrawX + Job_W + (Overlap_Flap * 2) + Job_H + Trimming_R;
                }
                if ((Job_L * 2) + (Job_W * 2) + Open_Flap + Overlap_Flap > (Overlap_Flap * 2) + (Job_L * 2) + Job_H) {
                    DrawY = DrawY + (Job_L * 2) + (Job_W * 2) + Open_Flap + Overlap_Flap + Trimming_B;
                }
                else {
                    DrawY = DrawY + (Overlap_Flap * 2) + (Job_L * 2) + Job_H + Trimming_B;
                }
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_L;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_B;
                    }
                    //Draw Main Box
                    //Draw Overlap Flap
                    DrawRectangle(svg, DrawX, DrawY, Overlap_Flap, Job_W, "black", 1, "black");

                    //'Draw 1st width Box
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY, Job_H, Job_W, "black", 1, "#ace123");

                    //'Draw 1st length BOX
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY, Job_L, Job_W, "black", 1, "green");

                    //'Draw 2st width Box
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_H + Job_L, DrawY, Job_H, Job_W, "black", 1, "#ace123");

                    //'Draw 2nd Length
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_H * 2) + Job_L, DrawY, Job_L, Job_W, "black", 1, "green");

                    //'Draw Open Flap
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_H * 2) + (Job_L * 2), DrawY, Open_Flap, Job_W, "black", 1, "blak");

                    //'Draw Side Wall Box
                    //'Draw upper Overlap Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_W + Overlap_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");

                    //'Draw Bottom Overlap Flap
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_L * 2) + Job_W, DrawY + Job_W + Overlap_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");

                    //'Draw First wall
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + Job_W + Overlap_Flap, Job_L, Job_H, "black", 1, "pink");

                    //'Draw Second Wall
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_L, DrawY + Job_W + Overlap_Flap, Job_W, Job_H, "black", 1, "#123ace");

                    //'Draw third wall 
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_L + Job_W, DrawY + Job_W + Overlap_Flap, Job_L, Job_H, "black", 1, "pink");

                    //'Draw overlap Flap Left For First Wall
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + Job_W, Job_L, Overlap_Flap, "black", 1, "cyan");

                    //'Draw overlap Flap Right For First Wall
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + Job_W + Overlap_Flap + Job_H, Job_L, Overlap_Flap, "black", 1, "cyan");

                    //'Draw overlap Flap Right Third Wall
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_W + Job_L, DrawY + Job_W, Job_L, Overlap_Flap, "black", 1, "cyan");

                    //'Draw overlap Flap Left For Third Wall
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_W + Job_L, DrawY + Job_W + Overlap_Flap + Job_H, Job_L, Overlap_Flap, "black", 1, "cyan");

                    DrawX = DrawX + (Job_H * 2) + (Job_L * 2) + (Overlap_Flap) + Open_Flap + Trimming_T;

                }
                DrawY = DrawY + Job_W + Job_H + (Overlap_Flap * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

function Draw_Universal_Crash_Lock_With_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    DrawX = DrawX + Trimming_L;

                    //Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Overlap_Flap;

                    //Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "black");

                    //'Draw Bottom_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "green");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                    DrawX = DrawX + Job_L;

                    //Draw Open_Flap 2
                    DrawRectangle(svg, DrawX, DrawY, Job_W, Open_Flap, "black", 1, "cyan");

                    //'Draw Bottom_Flap 2
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_W, Bottom_Flap * (75 / 100), "black", 1, "cyan");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_W, Job_H, "black", 1, "#123ace");
                    DrawX = DrawX + Job_W;

                    //Draw Open_Flap 3
                    DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "black");

                    //'Draw Bottom_Flap 3
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "green");

                    //'Draw Second Job L
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                    DrawX = DrawX + Job_L;

                    //'Draw Open_Flap 4
                    DrawRectangle(svg, DrawX, DrawY, Job_W, Open_Flap, "black", 1, "cyan");

                    //'Draw Bottom_Flap 4
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_W, Bottom_Flap * (75 / 100), "black", 1, "cyan");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_W, Job_H, "black", 1, "#123ace");

                    DrawX = DrawX + Job_W + Trimming_R;

                }
                DrawY = DrawY + Open_Flap + Bottom_Flap + Job_H + Trimming_B;
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                DrawY = DrawY + Trimming_L;

                for (j = 1; j <= Ups_L; j++) {
                    DrawX = DrawX + Trimming_B;

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "black");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX + ((Bottom_Flap) * 25 / 100), DrawY + Overlap_Flap + Job_L, ((Bottom_Flap) * 75 / 100), Job_W, "black", 1, "cyan");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Bottom_Flap, Job_L, "black", 1, "black");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX + ((Bottom_Flap) * 25 / 100), DrawY + Overlap_Flap + (Job_L * 2) + Job_W, ((Bottom_Flap) * 75 / 100), Job_W, "black", 1, "cyan");
                    DrawX = DrawX + Bottom_Flap;

                    //Draw Overlap_Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "cyan");

                    //'Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                    //'Draw First Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_W, "black", 1, "cyan");

                    //Draw Second Job L
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Job_H, Job_L, "black", 1, "#ace123");

                    //'Draw Second Job_W
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Job_H, Job_W, "black", 1, "#123ace");
                    DrawX = DrawX + Job_H;

                    //Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "black");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Open_Flap, Job_W, "black", 1, "cyan");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_W, Open_Flap, Job_L, "black", 1, "black");

                    //'Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_L * 2) + Job_W, Open_Flap, Job_W, "black", 1, "cyan");

                    DrawX = DrawX + Open_Flap + Trimming_T;

                }
                DrawY = DrawY + Overlap_Flap + Number(Job_W * 2) + Number(Job_L * 2) + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

////////
function Draw_Turn_Over_End_Tray(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_L;

                    //Draw Overlap_Flap Top
                    DrawRectangle(svg, DrawX + Job_H, DrawY, Job_L, Overlap_Flap, "black", 1, "red");

                    //'Draw Overlap_Flap Down
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + (Job_H * 4) + Job_W, Job_L, (Overlap_Flap), "black", 1, "red");

                    //'draw left height + Width 1
                    DrawRectangle(svg, DrawX, DrawY + (Job_H * 2) + Overlap_Flap, Job_H, Job_W, "black", 1, "cyan");

                    //'draw Right height + Width 1
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + (Job_H * 2) + Overlap_Flap, Job_H, Job_W, "black", 1, "cyan");

                    //'draw upper height + length 1
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap, Job_L, Job_H, "black", 1, "green");

                    //'draw upper height + length 2
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + Job_H, Job_L, (Job_H), "black", 1, "cyan");

                    //'draw lower height + length 1
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + (Job_H * 2) + Job_W, Job_L, (Job_H), "black", 1, "cyan");

                    //'draw lower height + length 2
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Overlap_Flap + (Job_H * 3) + Job_W, Job_L, (Job_H), "black", 1, "green");

                    //'draw Upper Side Wall Left

                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, (Job_H * 2), "black", 1, "blue");

                    //'draw Upper Side Wall Right
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + Overlap_Flap, Job_H, (Job_H * 2), "black", 1, "blue");

                    //'draw Lower Side Wall Left
                    DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + (Job_H * 2) + Job_W, Job_H, (Job_H * 2), "black", 1, "red");

                    //'draw Lower Side Wall Right
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + Overlap_Flap + (Job_H * 2) + Job_W, Job_H, (Job_H * 2), "black", 1, "red");

                    //'Draw Length
                    DrawRectangle(svg, DrawX + Job_H, DrawY + (Job_H * 2) + Overlap_Flap, Job_L, Job_W, "black", 1, "red");

                    DrawX = DrawX + (Job_H * 2) + Job_L + Trimming_R;
                }
                DrawY = DrawY + (Job_H * 4) + Job_W + (Overlap_Flap * 2) + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else
                    DrawY = DrawY + Trimming_L;

                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else
                        DrawX = DrawX + Trimming_B

                    //Draw Overlap_Flap Left
                    DrawRectangle(svg, DrawX, DrawY + (Job_H), Overlap_Flap, Job_L, "black", 1, "red");

                    //'Draw Overlap_Flap Right
                    DrawRectangle(svg, DrawX + (Job_H * 4) + Job_W + Overlap_Flap, DrawY + (Job_H), Overlap_Flap, Job_L, "black", 1, "red");

                    //'draw Top height + Width 2
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY, Job_H * 2, Job_H, "black", 1, "red");

                    //'draw Bottom height + Width 1
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + (Job_H) + Job_L, Job_H * 2, Job_H, "black", 1, "red");

                    //draw Left height + length 1
                    DrawRectangle(svg, DrawX + Overlap_Flap, DrawY + (Job_H), Job_H, Job_L, "black", 1, "cyan");

                    //'draw Left height + length 2
                    DrawRectangle(svg, DrawX + Overlap_Flap + Job_H, DrawY + (Job_H), Job_H, Job_L, "black", 1, "cyan");

                    //'draw Right height + length 1
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_H * 2) + Job_W, DrawY + (Job_H), Job_H, Job_L, "black", 1, "cyan");

                    //'draw Right height + length 2
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_H * 3) + Job_W, DrawY + (Job_H), Job_H, Job_L, "black", 1, "cyan");

                    //'draw Upper Side Wall Left
                    DrawRectangle(svg, DrawX + Job_H * 2 + Overlap_Flap, DrawY, (Job_W), (Job_H), "black", 1, "pink");

                    //'draw Upper Side Wall Right
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_H * 2) + Job_W, DrawY, (Job_H * 2), (Job_H), "black", 1, "red");

                    //'draw Lower Side Wall Left
                    DrawRectangle(svg, DrawX + Job_H * 2 + Overlap_Flap, DrawY + Job_H + Job_L, (Job_W), (Job_H), "black", 1, "pink");

                    //'draw Lower Side Wall Right
                    DrawRectangle(svg, DrawX + Overlap_Flap + (Job_H * 2) + Job_W, DrawY + Job_H + Job_L, (Job_H * 2), (Job_H), "black", 1, "red");

                    //'Draw Length
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Overlap_Flap, DrawY + (Job_H), Job_W, Job_L, "black", 1, "blue");

                    DrawX = DrawX + (Job_H * 4) + Job_W + (Overlap_Flap * 2) + Trimming_L + Trimming_R;

                }
                DrawY = DrawY + (Job_H * 2) + Job_L + Trimming_T + Trimming_B;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);

}

//
function Draw_6_Corner_Box(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_T;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_L;
                    }
                    //draw left height + Width 1
                    DrawRectangle(svg, DrawX, DrawY + Job_H, Job_H, Job_W, "black", 1, "green");

                    //'draw Right height + Width 1
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + Job_H, Job_H, Job_W, "black", 1, "green");

                    //'draw left height + Width 2
                    DrawRectangle(svg, DrawX, DrawY + (Job_H * 2) + Job_W, Job_H, Job_W, "black", 1, "green");

                    //'draw Right height + Width 2
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + (Job_H * 2) + Job_W, Job_H, Job_W, "black", 1, "green");

                    //'draw upper height + length 1
                    DrawRectangle(svg, DrawX + Job_H, DrawY, Job_L, Job_H, "black", 1, "#ace123");

                    //'draw lower height + length 1
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Job_H + Job_W, Job_L, Job_H, "black", 1, "#ace123");

                    //'draw lower height + length 2
                    DrawRectangle(svg, DrawX + Job_H, DrawY + (Job_H * 2) + (Job_W * 2), Job_L, Job_H, "black", 1, "#ace123");

                    //'Draw Length  1
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Job_H, Job_L, Job_W, "black", 1, "cyan");

                    //'Draw Length  2
                    DrawRectangle(svg, DrawX + Job_H, DrawY + (Job_H * 2) + Job_W, Job_L, Job_W, "black", 1, "cyan");

                    //'Draw Flap Upper Left
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap Upper Right
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap middle Left
                    DrawRectangle(svg, DrawX, DrawY + Job_H + Job_W, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap middle Right
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + Job_H + Job_W, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap lower Left
                    DrawRectangle(svg, DrawX, DrawY + (Job_H * 2) + (Job_W * 2), Job_H, Job_H, "black", 1, "#123456");

                    //Draw Flap lower Right
                    DrawRectangle(svg, DrawX + Job_H + Job_L, DrawY + (Job_H * 2) + (Job_W * 2), Job_H, Job_H, "black", 1, "#123456");

                    DrawX = DrawX + (Job_H * 2) + Job_L + Trimming_R;
                }
                DrawY = DrawY + (Job_H * 3) + (Job_W * 2) + Trimming_B;
            }
            break;

        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                if (i === 1) {
                    DrawY = DrawY;
                }
                else {
                    DrawY = DrawY + Trimming_L;
                }
                for (j = 1; j <= Ups_L; j++) {
                    if (j === 1) {
                        DrawX = DrawX;
                    }
                    else {
                        DrawX = DrawX + Trimming_T;
                    }
                    //'draw Top height + Width 1
                    DrawRectangle(svg, DrawX + Job_H, DrawY, Job_W, Job_H, "black", 1, "green");

                    //'draw Bottom height + Width 1 
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Job_H + Job_L, Job_W, Job_H, "black", 1, "green");

                    //'draw Top height + Width 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY + Job_H + Job_L, Job_W, Job_H, "black", 1, "green");

                    //'draw Bottom height + Width 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY, Job_W, Job_H, "black", 1, "green");

                    //draw left height + length 1
                    DrawRectangle(svg, DrawX, DrawY + Job_H, Job_H, Job_L, "black", 1, "cyan");

                    //'draw Right height + length 1
                    DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY + Job_H, Job_H, Job_L, "black", 1, "cyan");

                    //'draw Middle height + length 2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + (Job_W * 2), DrawY + Job_H, Job_H, Job_L, "black", 1, "cyan");

                    //'Draw Length  1   
                    DrawRectangle(svg, DrawX + Job_H, DrawY + Job_H, Job_W, Job_L, "black", 1, "yellow");

                    //'Draw Length  2
                    DrawRectangle(svg, DrawX + (Job_H * 2) + Job_W, DrawY + Job_H, Job_W, Job_L, "black", 1, "yellow");

                    //'Draw Flap Left Top
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap middle Top
                    DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap Right Top
                    DrawRectangle(svg, DrawX + (Job_H * 2) + (Job_W * 2), DrawY, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap Left Bottom
                    DrawRectangle(svg, DrawX, DrawY + Job_H + Job_L, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap middle Bottom
                    DrawRectangle(svg, DrawX + Job_H + Job_W, DrawY + Job_H + Job_L, Job_H, Job_H, "black", 1, "#123456");

                    //'Draw Flap Right Bottom
                    DrawRectangle(svg, DrawX + (Job_H * 2) + (Job_W * 2), DrawY + Job_H + Job_L, Job_H, Job_H, "black", 1, "#123456");

                    DrawX = DrawX + (Job_H * 3) + (Job_W * 2) + Trimming_B;

                }
                DrawY = DrawY + (Job_H * 2) + Job_L + Trimming_R;
            }
    }

    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

//
function Draw_Ovel_Shape(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                if (Ups_H > 1) {
                    if (i % 2 === 0) {
                        DrawX = OrginX + (Job_L / 2);
                    } else {
                        DrawX = OrginX;
                    }
                } else {
                    DrawX = OrginX;
                }
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    DrawX = DrawX + Trimming_L;

                    //'Draw Circle
                    Drawellipse(svg, DrawX, DrawY, Job_L, Job_H, "black", 1, "cyan");
                    DrawX = DrawX + Job_L * 2 + Trimming_R;

                }
                DrawY = DrawY + Job_H * 2 + Trimming_B + Trimming_T;
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                if (Ups_H > 1) {
                    if (i % 2 === 0) {
                        DrawX = OrginX + (Job_H / 2);
                    } else {
                        DrawX = OrginX;
                    }
                } else {
                    DrawX = OrginX;
                }
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {

                    DrawX = DrawX + Trimming_L;

                    //'Draw Circle
                    Drawellipse(svg, DrawX, DrawY, Job_H, Job_L, "black", 1, "cyan");
                    DrawX = DrawX + Job_H * 2 + Trimming_R;
                }
                DrawY = DrawY + Job_L * 2 + Trimming_B + Trimming_T;
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

function Draw_Polygon_Shape(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    var diff, half_diff, a, b, c;
    // PenStyle = psTransparent
    diff = Gbl_lower_Width - Gbl_upper_Width;
    half_diff = diff / 2;

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                DrawX = OrginX;
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {

                    DrawX = DrawX + Trimming_L;
                    //'Draw Polygon
                    //      .BrushColor = &HA8380
                    //      .PenColor = &HA8380
                    //'.Draw
                    if (Ups_L > 1) {
                        if (j % 2 === 0) {
                            Polygon
                        } else {
                            Polygon
                        }
                    } else {
                        Polygon
                    }
                    if (j % 2 === 0) {
                        DrawX = DrawX + Gbl_upper_Width - half_diff + Gbl_Job_Trimming_R;
                    } else {
                        DrawX = DrawX + Gbl_lower_Width - half_diff + Gbl_Job_Trimming_R;
                    }
                }
                DrawY = DrawY + Job_H + Trimming_B;
            }
            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                DrawX = OrginX;
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {

                    DrawX = DrawX + Trimming_L;
                    //'Draw Polygon
                    //      .BrushColor = &HA8380
                    //      .PenColor = &HA8380
                    if (Ups_H > 1) {
                        if (j % 2 === 0) {
                            Polygon
                        } else {
                            Polygon
                        }
                    } else {
                        Polygon
                    }

                    DrawX = DrawX + Job_H + Gbl_Job_Trimming_R;
                }
                if (j % 2 === 0) {
                    DrawY = DrawY + Gbl_upper_Width - half_diff + Trimming_B;
                } else {
                    DrawY = DrawY + Gbl_lower_Width - half_diff + Trimming_B;
                }
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

//
function Draw_Env_L_Pasting(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Bottom_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;

    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent

    switch (Interlock_Style) {
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                if (i % 2 === 0) {
                    DrawX = OrginX;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_B;
                    }

                    for (j = 1; j <= Ups_L; j++) {
                        if (j % 2 === 0) {
                            // DrawX = OrginX+Job_H+;
                            if (i === 1) {
                                DrawY = DrawY;
                            } else {
                                DrawY = DrawY;
                                //   DrawY = DrawY + Trimming_L;
                            }

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                            DrawX = DrawX + Overlap_Flap;

                            //'Draw  Job L2
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H, Job_L, Open_Flap, "black", 1, "cyan");

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "green");
                            DrawX = DrawX + Job_L;

                            //'Draw  Job L1
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");
                            DrawX = DrawX + Job_L + Trimming_R;
                        }

                        else {
                            if (j === 1) {
                                DrawX = DrawX;
                            }
                            else {
                                DrawX = DrawX + Trimming_R;
                            }

                            //'Draw  Job L1
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");
                            DrawX = DrawX + Job_L;

                            //'Draw  Job L2
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H, Job_L, Open_Flap, "black", 1, "cyan");

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "green");
                            DrawX = DrawX + Job_L;

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                            DrawX = DrawX + Overlap_Flap + Trimming_L;
                        }

                    }
                    DrawY = DrawY + Job_H + Open_Flap + Bottom_Flap + Trimming_T;
                }
                else {

                    DrawX = OrginX;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }

                    for (j = 1; j <= Ups_L; j++) {
                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX;
                                //  DrawX = DrawX + Trimming_L;
                            }

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                            DrawX = DrawX + Overlap_Flap;

                            //'Draw  Job L2
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "cyan");

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "green");
                            DrawX = DrawX + Job_L;

                            //'Draw  Job L1
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                            DrawX = DrawX + Job_L + Trimming_R;

                        }
                        else {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_R;
                            }

                            //'Draw  Job L1
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                            DrawX = DrawX + Job_L;

                            //'Draw  Job L2
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "cyan");

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "green");
                            DrawX = DrawX + Job_L;

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                            DrawX = DrawX + Overlap_Flap + Trimming_L;
                        }
                    }
                    DrawY = DrawY + Open_Flap + Bottom_Flap + Job_H + Trimming_B;
                }
            }
            break;

        case 5:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {

                DrawX = OrginX;

                if (i % 2 === 0) {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_L;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_L;
                            }

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "green");
                            DrawX = DrawX + Bottom_Flap;

                            //'Draw Job L2
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw First Job L1
                            DrawRectangle(svg, DrawX, DrawY + Job_L + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "red");
                            DrawX = DrawX + Job_H;

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "cyan");
                            DrawX = DrawX + Open_Flap + Trimming_R;
                        }
                        else {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_L;
                            }
                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "cyan");
                            DrawX = DrawX + Open_Flap;

                            //'Draw Job L2
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw First Job L1
                            DrawRectangle(svg, DrawX, DrawY + Job_L + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "red");
                            DrawX = DrawX + Job_H;

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "green");

                            DrawX = DrawX + Bottom_Flap + Trimming_R;
                        }
                    }
                    DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_T;
                }
                else {
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }

                    for (j = 1; j <= Ups_L; j++) {
                        if (j % 2 === 0) {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_L;
                            }
                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Job_L, Bottom_Flap, Job_L, "black", 1, "green");
                            DrawX = DrawX + Bottom_Flap;


                            //'Draw First Job L1
                            DrawRectangle(svg, DrawX, DrawY, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw Job L2
                            DrawRectangle(svg, DrawX, DrawY + Job_L, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Job_L + Job_L, Job_H, Overlap_Flap, "black", 1, "red");
                            DrawX = DrawX + Job_H

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Job_L, Open_Flap, Job_L, "black", 1, "cyan");
                            DrawX = DrawX + Open_Flap + Trimming_R;
                        }
                        else {
                            if (j === 1) {
                                DrawX = DrawX;
                            } else {
                                DrawX = DrawX + Trimming_L;
                            }

                            //'Draw Open_Flap
                            DrawRectangle(svg, DrawX, DrawY + Job_L, Open_Flap, Job_L, "black", 1, "cyan");
                            DrawX = DrawX + Open_Flap;

                            //'Draw First Job L1
                            DrawRectangle(svg, DrawX, DrawY, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw Job L2
                            DrawRectangle(svg, DrawX, DrawY + Job_L, Job_H, Job_L, "black", 1, "#ace123");

                            //'Draw OverLap_Flap
                            DrawRectangle(svg, DrawX, DrawY + Job_L + Job_L, Job_H, Overlap_Flap, "black", 1, "red");
                            DrawX = DrawX + Job_H;

                            //'Draw Bottom_Flap
                            DrawRectangle(svg, DrawX, DrawY + Job_L, Bottom_Flap, Job_L, "black", 1, "green");

                            DrawX = DrawX + Bottom_Flap + Trimming_R;
                        }
                    }
                    DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_B;
                }
            }
            break;
        case 7:
            DrawY = OrginY;
            for (i = 1; i <= Ups_H; i++) {

                if (i % 2 === 0) {
                    DrawX = OrginX + Overlap_Flap;


                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_B;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_R;
                        }
                        //'Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        //'Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Job_L, Job_H, "black", 1, "#ace123");

                        //'Draw Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Bottom_Flap, "black", 1, "green");

                        //'Draw Open_Flap
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap + Job_H, Job_L, Open_Flap, "black", 1, "cyan");
                        DrawX = DrawX + Job_L;

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Bottom_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                        DrawX = DrawX + Overlap_Flap;

                        DrawX = DrawX + Trimming_L;
                    }
                    DrawY = DrawY + Job_H + Bottom_Flap + Trimming_T;
                }
                else {

                    DrawX = OrginX;
                    if (i === 1) {
                        DrawY = DrawY;
                    } else {
                        DrawY = DrawY + Trimming_T;
                    }
                    for (j = 1; j <= Ups_L; j++) {

                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_L;
                        }

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, Overlap_Flap, Job_H, "black", 1, "red");
                        DrawX = DrawX + Overlap_Flap;

                        //'Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");

                        //'Draw Open_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_L, Open_Flap, "black", 1, "cyan");

                        //'Draw Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_H, Job_L, Bottom_Flap, "black", 1, "green");
                        DrawX = DrawX + Job_L;

                        //'Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_L, Job_H, "black", 1, "#ace123");
                        DrawX = DrawX + Job_L;

                        DrawX = DrawX + Trimming_R;
                    }
                    DrawY = DrawY + Open_Flap + Job_H + Trimming_B;
                }
            }
            break;
        case 9:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;

                if (i === 1) {
                    DrawY = DrawY;
                } else {
                    DrawY = DrawY + Trimming_L;
                }

                for (j = 1; j <= Ups_L; j++) {

                    if (j % 2 === 0) {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_B;
                        }
                        //'Draw Bottom_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Bottom_Flap, Job_L, "black", 1, "green");
                        DrawX = DrawX + Bottom_Flap;

                        //'Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");

                        //'Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_L, "black", 1, "#ace123");

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L + Job_L, Job_H, Overlap_Flap, "black", 1, "red");
                        DrawX = DrawX + Job_H;

                        //'Draw Open_Flap

                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Open_Flap, Job_L, "black", 1, "cyan");

                        DrawX = DrawX + Trimming_T;
                    }

                    else {
                        if (j === 1) {
                            DrawX = DrawX;
                        } else {
                            DrawX = DrawX + Trimming_T;
                        }
                        //'Draw Open_Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Open_Flap, Job_L, "black", 1, "cyan");
                        DrawX = DrawX + Open_Flap;

                        //'Draw OverLap_Flap
                        DrawRectangle(svg, DrawX, DrawY, Job_H, Overlap_Flap, "black", 1, "red");

                        //'Draw Job L2
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Job_H, Job_L, "black", 1, "#ace123");
                        //'Draw Job L1
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap + Job_L, Job_H, Job_L, "black", 1, "#ace123");
                        DrawX = DrawX + Job_H;

                        //////Draw Bottom Flap
                        DrawRectangle(svg, DrawX, DrawY + Overlap_Flap, Bottom_Flap, Job_L, "black", 1, "green");

                        DrawX = DrawX + Trimming_B;
                    }
                }
                DrawY = DrawY + (Job_L * 2) + Overlap_Flap + Trimming_R;
            }

            break;
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}

/////Draw Pastry Type Box added on 11-06-2021
function DrawPastryTypeBox(svg, OrginX, OrginY, Grain_Direction, Trimming_L, Trimming_R, Trimming_T, Trimming_B, Job_L, Job_H, Job_W, Open_Flap, Overlap_Flap, Ups_L, Ups_H, Interlock_Style) {
    var i = 0, j = 0;
    var DrawX = 0.0, DrawY = 0.0;
    // PenStyle = psTransparent
    let Job_Flap_H = Number(document.getElementById("JobFlapHeight").value);

    switch (Interlock_Style) {
        case 1:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;
                DrawY = DrawY + Trimming_T;

                for (j = 1; j <= Ups_L; j++) {
                    DrawX = DrawX + Trimming_L;

                    //Draw Open_Flap 1
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H, Open_Flap, Job_L, "black", 1, "yellow");
                    DrawX = DrawX + Open_Flap;

                    //Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H, Job_W, Job_L, "black", 1, "cyan");

                    //Draw First Job L Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_W, Job_Flap_H, "black", 1, "#ace123");

                    //Draw First Job L 2 Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H + Job_L, Job_W, Job_Flap_H, "black", 1, "#ace123");

                    DrawX = DrawX + Job_W;

                    //Draw First Job W
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H, Job_H, Job_L, "black", 1, "#123ace");

                    //Draw First Job W Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Job_Flap_H, "black", 1, "#ace123");

                    //Draw First Job W 2 Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H + Job_L, Job_H, Job_Flap_H, "black", 1, "#ace123");
                    DrawX = DrawX + Job_H;

                    //Draw First Job L
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H, Job_W, Job_L, "black", 1, "cyan");

                    //Draw First Job L Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_W, Job_Flap_H, "black", 1, "#ace123");

                    //Draw First Job L 2 Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H + Job_L, Job_W, Job_Flap_H, "black", 1, "#ace123");

                    DrawX = DrawX + Job_W;

                    //Draw First Job W
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H, Job_H, Job_L, "black", 1, "#123ace");

                    //Draw First Job W Flap
                    DrawRectangle(svg, DrawX, DrawY, Job_H, Job_Flap_H, "black", 1, "#ace123");

                    //Draw First Job W 2 Flap
                    DrawRectangle(svg, DrawX, DrawY + Job_Flap_H + Job_L, Job_H, Job_Flap_H, "black", 1, "#ace123");

                    DrawX = DrawX + Job_H + Trimming_R;

                }

                DrawY = DrawY + Job_L + (Job_Flap_H * 2) + Trimming_B;
            }

            break;
        case 2:
            DrawY = OrginY;

            for (i = 1; i <= Ups_H; i++) {
                DrawX = OrginX;

                for (j = 1; j <= Ups_L; j++) {

                    DrawX = DrawX + Trimming_L;
                    //Draw Open_Flap 1
                    DrawRectangle(svg, DrawX + Job_Flap_H, DrawY, Job_L, Open_Flap, "black", 1, "yellow");

                    //Draw First Job L
                    DrawRectangle(svg, DrawX + Job_Flap_H, DrawY + Open_Flap, Job_L, Job_W, "black", 1, "#ace123");

                    //Draw First Job L Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap, Job_Flap_H, Job_W, "black", 1, "#123ace");

                    //Draw First Job L 2 Flap
                    DrawRectangle(svg, DrawX + Job_Flap_H + Job_L, DrawY + Open_Flap, Job_Flap_H, Job_W, "black", 1, "#123ace");


                    //Draw First Job W
                    DrawRectangle(svg, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W, Job_L, Job_H, "black", 1, "#ace123");

                    //Draw First Job W Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W, Job_Flap_H, Job_H, "black", 1, "#123ace");

                    //Draw First Job W 2 Flap
                    DrawRectangle(svg, DrawX + Job_Flap_H + Job_L, DrawY + Open_Flap + Job_W, Job_Flap_H, Job_H, "black", 1, "#123ace");


                    //Draw First Job H
                    DrawRectangle(svg, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W + Job_H, Job_L, Job_W, "black", 1, "#ace123");

                    //Draw First Job H Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W + Job_H, Job_Flap_H, Job_W, "black", 1, "#123ace");

                    //Draw First Job H 2 Flap
                    DrawRectangle(svg, DrawX + Job_Flap_H + Job_L, DrawY + Open_Flap + Job_W + Job_H, Job_Flap_H, Job_W, "black", 1, "#123ace");


                    //Draw First Job W
                    DrawRectangle(svg, DrawX + Job_Flap_H, DrawY + Open_Flap + Job_W + Job_H + Job_W, Job_L, Job_H, "black", 1, "#ace123");

                    //Draw First Job W Flap
                    DrawRectangle(svg, DrawX, DrawY + Open_Flap + Job_W + Job_H + Job_W, Job_Flap_H, Job_H, "black", 1, "#123ace");

                    //Draw First Job W 2 Flap
                    DrawRectangle(svg, DrawX + Job_Flap_H + Job_L, DrawY + Open_Flap + Job_W + Job_H + Job_W, Job_Flap_H, Job_H, "black", 1, "#123ace");

                    DrawX = DrawX + Job_L + (Job_Flap_H * 2) + Trimming_R;

                }
                DrawY = DrawY + Open_Flap + (Job_W * 2) + (Job_H * 2) + Trimming_B;
            }
    }
    document.body.appendChild(svg);
    var svgdiv = document.getElementById("Layout_Ups");
    svgdiv.appendChild(svg);
}
