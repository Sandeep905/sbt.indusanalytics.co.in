"use strict";

var gblcolRowInex, GblPlanID;

//add Qty
var TBLQtyCol = "";
var blankQty = "";

function AddQuantityButton() {
    try {

        blankQty = "<td style='min-width:14em;width:14em'><div style='float:left;height:auto;width:14em'><div style='float:left;height:auto;width:50%;border-right:2px solid #eee;padding-right:1em;'><b style='text-align:left;margin-left:0em'>Content</b> <i title='Content Direction' id='ContentDirection' class='fa fa-arrow-circle-down fa-2x' style='float: right; position: relative; color: cadetblue; justify-content:center;margin-top: -5px;'></i></div><div style='float:left;height:auto;width:50%;padding-right:0em;'><b style='text-align:left;margin-left:1em'>Quantity</b> <i title='Qty Direction' id='QtyDirection' class='fa fa-arrow-circle-right fa-2x' style='float: right; position: relative; color: cadetblue;margin-top:-5px;'></i></div></div></td>";

        var ExtColtbl = document.getElementById('PlanTable').getElementsByTagName("tbody")[0]; // table reference  
        var tblLengthExt = ExtColtbl.rows.length;
        var mergeQty;
        if (tblLengthExt <= 1) {
            TBLQtyCol = "";
            TBLQtyCol = "<td id='td1' class='qtydelete' style='min-width:10em;width:10em'><input type='text' id='txtqty1' placeholder='Enter Qty' class='forTextBox' style='width:7em'/></td>";

            mergeQty = blankQty + "" + TBLQtyCol;

            document.getElementById('BdyQtyRow').innerHTML = mergeQty;

            document.getElementById("txtqty1").value = document.getElementById("PlanContQty").innerHTML;
            document.getElementById("txtqty1").disabled = "disabled";
        }
    } catch (e) {
        //console.log(e);
    }
}

function AddSelectedContent() {

    var TxtContentName = document.getElementById("TxtAddContentName").value;
    var PlanContentType = document.getElementById("PlanContentType").value;
    if (TxtContentName === "" || PlanContentType === "") {
        swal("Content Not Selected!", "Please select content first..!", "error");
        return false;
    }
    else {
        var ContentImg = "";
        var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;

        var lastRowNo = document.getElementById("lastRow").innerHTML;
        lastRowNo = Number(lastRowNo) + 1;

        ContentImg = "<td id='p" + lastRowNo + "' class='qtydelete' style='z-index: 5'><div id=CntImgDiv" + lastRowNo + " class='content_div'  data-toggle='modal' style='height:100%;width:100%;cursor: default;'  style='z-index:5'><img id=img" + lastRowNo + " src='" + document.getElementById("TxtContentImgSrc").value + "'/><b id=contName" + lastRowNo + " style='display:block;z-index:5'>" + document.getElementById("TxtAddContentName").value.replace(/'/g, '') + "</b><p id=contType" + lastRowNo + " style='display:none'>" + document.getElementById("PlanContentType").value + "</p></div></td>";

        var TBLContentCol = "";
        var x = 0;
        for (var i = 0; i < ColumnCunt - 1; i++) {
            x = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells[i + 1].id;
            x = x.replace('td', '');

            var tdStatus = "";
            tdStatus = "td" + x;
            if (document.getElementById(tdStatus).className !== "HideColumn") {
                TBLContentCol += "<td id='ConRecord" + lastRowNo + x + "' class='content_div' style='padding: .3em;cursor: default;'> <div id='Plan" + lastRowNo + x + "' class='planWindow planme_btn'  data-toggle='tab'  onclick='allQuantity(this);' style='height:13em;display: flex;align-items: center;justify-content: center;border-radius: 8px;border:1px solid;box-shadow: 0px 17px 10px -10px rgba(0,0,0,0.4)'>Click Me to plan..</div> </td>"; //  <div onclick='allQuantity(this);' class='planWindow' id='Para" + lastRowNo + x + "' style='text-align:center;margin:5px;'><b>Click Me to Plan</b></div> 
            }
        }
        var MergeCol = ContentImg + "" + TBLContentCol;
        $('#BodyPlanning').append("<tr id='tr" + lastRowNo + "'>" + MergeCol + "</tr>");
        document.getElementById("lastRow").innerHTML = lastRowNo;

        document.getElementById("BtnSelectContent").setAttribute("data-dismiss", "modal");
    }
}

//ContentImage MouseHover/Out
function hide(Zoo) {
    document.getElementById('DivZommer').style.display = 'none';
}

function show(Zoo) {
    var zoomId = Zoo.id;
    zoomId = zoomId.replace('p', '');

    document.getElementById('DivZommer').innerHTML = "";
    var dynaimg = "<img id=Dyna" + zoomId + " src='" + document.getElementById('img' + zoomId).getAttribute("src") + "' style='width:98%;height:98%'/>";
    var deldiv = "<div id='Hover" + zoomId + "' style='background-image: url(images/delete.png); margin-top: 3px;margin-right: 7px;position: absolute;right: 0;top: 0;display: block;height: 2em;width: 2em;margin-bottom: .2em;background-repeat: no-repeat;z-index:15;'  data-type='ajax-loader'  onclick='RemContent(this);' ></div>";
    $('#DivZommer').append(deldiv);
    $('#DivZommer').append(dynaimg);
    document.getElementById('DivZommer').remove = "contentZoomQty";
    document.getElementById('DivZommer').className = "contentZoom";
    document.getElementById('DivZommer').style.display = 'none';
}

function hoverdivIN(hover) {
    if (hover.id === 'DivZommer') {
        document.getElementById('DivZommer').style.display = 'block';
    }
}

function hoverdivOut(hoverout) {
    document.getElementById('DivZommer').style.display = 'none';
}

//QtyTd MouseHover/Out
function Qtyhide(QtyZoo) {
    document.getElementById('DivZommer').style.display = 'none';
}

function Qtyshow(QtyZoo) {
    var qtyzoomId = QtyZoo.id;
    if (document.getElementById("Plan" + qtyzoomId.split(/(\d+)/)[1]).innerHTML.includes("Click Me to plan..") === true) return;
    qtyzoomId = qtyzoomId.replace('ConRecord', '');
    document.getElementById('DivZommer').innerHTML = "";
    document.getElementById('DivZommer').innerHTML = qtyzoomId;
    document.getElementById('DivZommer').remove = "contentZoom";
    document.getElementById('DivZommer').className = "contentZoomQty";
    document.getElementById('DivZommer').style.display = 'none';
    allQuantity(QtyZoo);
}

//open bottom tab click on each column
function allQuantity(qt) {

    Gbl_RowID = "";

    var table = document.getElementById("PlanTable");
    var rowno = qt.parentNode.parentNode.rowIndex;
    var cell_no = qt.parentNode.cellIndex;

    var trid = table.rows[rowno];
    trid = Gbl_RowID = trid.id;
    var trNum = trid.split(/(\d+)/);

    var tdID = table.rows[rowno].cells[cell_no].id;
    var tdIDsplit = tdID.split(/(\d+)/);

    GblPlanID = tdIDsplit[1];

    var mergTRTD = tdIDsplit[0] + "" + trNum[1];
    var lcl_QtyID = tdID.split(mergTRTD);
    var ClickedQtyID = "txtqty" + lcl_QtyID[1];
    Gbl_TDQty = 0;
    if (!numericValidation(document.getElementById(ClickedQtyID))) {
        document.getElementById(ClickedQtyID).value = "";
        Gbl_TDQty = 0;
        return;
    }
    Gbl_TDQty = Number(document.getElementById(ClickedQtyID).value.trim());
    if (Gbl_TDQty === "" || Gbl_TDQty === 0 || Gbl_TDQty === undefined || Gbl_TDQty === null) {
        Gbl_TDQty = 0;
        return;
    }
    document.getElementById("PlanContQty").innerHTML = Gbl_TDQty;

    var rowColID = qt.id;
    var rowColID_String = rowColID.split(/(\d+)/);
    var rowColID_Num = rowColID_String[1];
    var MergeStringNum = "ptd" + rowColID_Num;

    var Bottompopup = document.getElementById('BottomTabBar');
    var Bottomoverlay = document.getElementById('MYbackgroundOverlay');
    var BottomopenButton = document.getElementById(qt.id);
    document.getElementById("displayStatusBottom").innerHTML = MergeStringNum;

    document.onclick = function (f) {
        if (f.target === BottomopenButton) {
            Bottompopup.style.height = "100%";
            Bottompopup.style.width = "100%";
            Bottomoverlay.style.display = 'block';
            //document.getElementById('L' + MergeStringNum).setAttribute("class", "active");

            PlanProductWindow(rowno);
        }
    };
}

//Clear Exist Select Content

//Add Bottom tab Content
function BottomTabConQty() {

    var tdQty = "";

    var PlanTable = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
    var PlanTableLength = PlanTable.rows.length;
    var ColumnLength = document.getElementById('PlanTable').rows[1].cells.length;

    for (var k = 2; k <= PlanTableLength; k++) {
        var Contenttd = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[k - 1].cells[0].id;
        var tabRowid = Contenttd.split(/(\d+)/);

        Contenttd = Contenttd.replace('p', '');
        Contenttd = "contName" + Contenttd;
        pContentName = "";
        pContentName = document.getElementById(Contenttd).innerHTML.replace(/'/g, '');

        for (var l = 1; l < ColumnLength; l++) {
            var qtytd = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells[l].id;
            var tabColid = qtytd.split(/(\d+)/);

            qtytd = qtytd.replace('td', '');
            qtytd = "txtqty" + qtytd;

            tdQty = "";
            tdQty = document.getElementById(qtytd).value;

            if (tdQty === "" || tdQty === undefined || tdQty === null) {
                tdQty = 0;
            } else {
                if (!numericValidation(document.getElementById(qtytd))) {
                    document.getElementById(qtytd).value = "";
                    tdQty = 0;
                }
            }

            ////match duplicate qty entered
            $('#PlanTable input').each(function () {
                if (this.type === "text" && this.id !== qtytd) {
                    var name = $(this).closest('td').hasClass('HideColumn');
                    if (name === true) {
                        this.value = "";
                    }
                    if (this.value === tdQty) {
                        this.value = "";
                    }
                }
            });
        }
    }
    //$('#bottomTabContainer').append(TabContener);
}

$("#bottomTabContainer>li.active").removeClass("active");

//Plan Window
function PlanProductWindow(RowNo) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {

        document.getElementById("PlanContImg").src = "";
        document.getElementById("PlanContName").innerHTML = "";
        document.getElementById("PlanContImg").src = document.getElementById('img' + RowNo).getAttribute("src");
        document.getElementById("PlanContName").innerHTML = document.getElementById('contName' + RowNo).innerHTML.replace(/'/g, '');

        document.getElementById("PlanContentType").value = document.getElementById('contType' + RowNo).innerHTML.replace(/'/g, '');
        readContentsSizes(document.getElementById("PlanContentType").value);
        document.getElementById("ContentOrientation").innerHTML = document.getElementById("PlanContentType").value;
        document.getElementById("LblPlanContName").innerHTML = document.getElementById("PlanContName").innerHTML;

        //find Div Scroll Height
        $("#BottomTabBar").animate({ scrollTop: 0 }, "slow");
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

//ContentImage MouseHover/Out for Plan Window
function Planhide(PZoo) {
    document.getElementById('PlanWindowDivZommer').style.display = 'none';
}

function Planshow(PZoo) {
    document.getElementById('PlanWindowDivZommer').innerHTML = "";
    var dynaimg = "<img src='" + /*"Open" +*/ document.getElementById('PlanContImg').getAttribute("src") + "' style='width:98%;height:98%'/>";
    $('#PlanWindowDivZommer').append(dynaimg);
    document.getElementById('PlanWindowDivZommer').style.display = 'block';
}

$("#PZoomBtn").click(function () {
    document.getElementById("PZoomBtn").setAttribute("data-toggle", "modal");
    document.getElementById("PZoomBtn").setAttribute("data-target", "#myModalZoom");
});

function PlanLayoutShow(PZoo) {
    document.getElementById('PlanWindowDivZommer').innerHTML = "";
    var xml = (new XMLSerializer).serializeToString(PZoo);
    //var dynaimg = "<img src='data:image/svg+xml;charset=utf-8," + xml + "' style='width:98%;height:98%'/>";
    //$('#PlanWindowDivZommer').append(dynaimg);
    //document.getElementById('PlanWindowDivZommer').style.display = 'block';
    var doctype = '<?xml version="1.0" standalone="no"?>'
        + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    var source = (new XMLSerializer()).serializeToString(PZoo);

    var blob = new Blob([doctype + source], { type: 'image/svg+xml' });
    var url = window.URL.createObjectURL(blob);
    var img = new Image();
    img.src = url;

    PZoo.onclick = function () {
        var modalImg = document.getElementById("Zoomedimg01");
        var captionText = document.getElementById("caption");
        modalImg.src = img.src; // "data:image/svg+xml;charset=utf-8," + xml + "";
        captionText.innerHTML = GblPlanValues.GrainDirection;
        $("#PZoomBtn").click();
    };
}

function PlanhideIN(hover) {
    if (hover.id === 'PlanWindowDivZommer') {
        document.getElementById('PlanWindowDivZommer').style.display = 'block';
    }
}
function PlanhideOut(hoverout) {
    document.getElementById('PlanWindowDivZommer').style.display = 'none';
}

//Close Bottom popup
function closeBottomTabBar() {
    //var optabID = document.getElementById('displayStatusBottom').innerHTML;
    document.getElementById("BottomTabBar").style.height = "0";
    //if ((document.getElementById('RightTabBar').style.width === "" || document.getElementById('RightTabBar').style.width === "0px") && (document.getElementById('mySidenav').style.width === "" || document.getElementById('mySidenav').style.width === "0px")) {
    document.getElementById('MYbackgroundOverlay').style.display = 'none';
    //}
    //else {
    //    document.getElementById('MYbackgroundOverlay').style.display = 'block';
    //}
    //document.getElementById('MYbackgroundOverlay').style.display = 'none';
    // document.getElementById('L' + optabID).setAttribute("class", "");
}

//validation
//numeric or decimal
function myvalidation(getid) {
    var regexp = /^\d+(\.\d{1,2})?$/;
    var targetValue = document.getElementById(getid.id).value;
    if (regexp.test(targetValue) === true) {
        return true;
    }
    else {
        swal({
            title: "Invalid Quantity?",
            text: "Please enter only numeric Or decimal value..!",
            type: "error",
            showCancelButton: false,
            //confirmButtonColor: "#DD6B55",
            closeOnConfirm: true
        }, function () {
            document.getElementById(getid.id).value = "";
            document.getElementById(getid.id).focus();
            return false;
        });
        document.getElementById(getid.id).value = "";
        document.getElementById(getid.id).focus();
        return false;
    }
}

function numericValidation(getid) {
    var regexp = /^\d+(\d{1,2})?$/;
    var targetValue = document.getElementById(getid.id).value;
    var contType = document.getElementById("ContentOrientation").innerHTML;

    if (regexp.test(targetValue) === true) {
        if (getid.id === "JobNoOfPages" && contType.includes("Pages")) {
            var MultipleFour = Number(targetValue) % 4;
            if (MultipleFour >= 1) {
                swal({
                    title: "Pages must be multiple of 4 only?",
                    text: "Please enter value multiple of 4 only..!",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    closeOnConfirm: true
                }, function () {
                    document.getElementById(getid.id).value = "";
                    document.getElementById(getid.id).focus();
                    return false;
                });
                document.getElementById(getid.id).value = "";
                document.getElementById(getid.id).focus();
                return false;
            }
        } else if (getid.id === "JobNoOfPages" && contType.includes("Calend")) { //contType.includes("Leaves") || 
            var MulTwo = Number(targetValue) % 2;
            if (MulTwo >= 1) {
                swal({
                    title: "Entered value must be multiple of 2 only?",
                    text: "Please enter value multiple of 2 only..!",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    closeOnConfirm: true
                }, function () {
                    document.getElementById(getid.id).value = "";
                    document.getElementById(getid.id).focus();
                    return false;
                });
                document.getElementById(getid.id).value = "";
                document.getElementById(getid.id).focus();
                return false;
            }
        }
        return true;
    }
    else {
        swal({
            title: "Invalid Quantity?",
            text: "Please enter only numeric value..!",
            type: "error",
            showCancelButton: false,
            //confirmButtonColor: "#DD6B55",
            closeOnConfirm: true
        }, function () {
            document.getElementById(getid.id).value = "";
            document.getElementById(getid.id).focus();
            return false;
        });
        document.getElementById(getid.id).value = "";
        document.getElementById(getid.id).focus();
        return false;
    }
}

function fnplnhideshow() {
    if ($("#PlanButtonHide").hasClass("fa fa-arrow-circle-up")) {
        $("#PlanButtonHide").removeClass("fa fa-arrow-circle-up");
        $("#PlanSizeContainer").slideUp(800);
        $("#PlanContainer").slideDown(800);
        $("#PlanButtonHide").addClass("fa fa-arrow-circle-down");
    } else {
        $("#PlanButtonHide").removeClass("fa fa-arrow-circle-down");
        $("#PlanButtonHide").addClass("fa fa-arrow-circle-up");
        $("#PlanSizeContainer").slideDown(800);
        $("#PlanContainer").slideUp(800);
    }
    $("#PlanSizeContainer").animate({ scrollTop: 0 }, "slow");
}

$("#ModalOperationEdit").keypress(function (e) {
    if (e.keyCode === 13)
        $("#BtnCalculateOperation").click();
});

$("#SizeWidth").keyup(function (e) {
    if (document.getElementById("SizeBottomflap").style.display === "block") {
        document.getElementById("SizeBottomflap").value = Number(document.getElementById("SizeWidth").value) * 0.75;
    } else {
        document.getElementById("SizeBottomflap").value = 0;
    }
});

/**
 * //@access
 * Convertions start
 * **/
$("#planJob_Size").keypress(function (e) {
    //if (e.which === 13) {
    //    return false;
    //}else
    if (e.which === 34) { // For "  (Double Code)
        Convert_Value(event);
    } else if (e.which === 39) { // For '  (Single Code)
        Convert_Value(event);
    }
});

$(document).ready(function () {
    $('#BodywindowPlanning').keypress(function (event) {
        if (event.target.className === "forTextBox" && event.which !== 13 && event.which !== 34 && event.which !== 39) {
            return isNumber(event, this);
        } else if (event.keyCode === 13)
            $("#PlanButton").click();
    });
});

function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode !== 45) && (charCode !== 46 || $(element).val().indexOf('.') !== -1) && ((charCode < 48 && charCode !== 8) || charCode > 57)) {
        return false;
    }
    else {
        return true;
    }
}

$("#planJob_Size").keyup(function (e) {
    var tb;
    if (e.which === 16) {
        if (event.target.id !== "") {
            tb = document.getElementById(event.target.id).value;
            document.getElementById(event.target.id).value = tb.replace("\"", '');
        }
    }
    else if (event.keyCode === 222) {
        if (event.target.id !== "") {
            tb = document.getElementById(event.target.id).value;
            document.getElementById(event.target.id).value = tb.replace("'", '');
        }
    }
});

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
////Convertions

$("#largeModalContentsList").keypress(function (e) {
    if (e.keyCode === 13)
        AddSelectedContent();
});

$("#ChkPlanInStandardSizePaper").dxCheckBox({
    value: false,
    text: "Plan In Standard Size Paper"
});
$("#ChkPlanInAvailableStock").dxCheckBox({
    value: false,
    text: "Plan In Available stock"
});
$("#ChkPlanInSpecialSizePaper").dxCheckBox({
    value: false,
    text: "Plan In Special Size Paper"
});
$("#ChkUseFirstPlanAsMaster").dxCheckBox({
    value: false,
    disabled: false,
    text: "Set First Plan As Master"
});
$("#ChkPaperByClient").dxCheckBox({
    value: false,
    text: "Paper Supplied By Client"
});


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
        var RES1 = JSON.parse(res);

        document.getElementById("AllContents").innerHTML = "";
        var contDetails = "";

        for (var cnt = 0; cnt < RES1.length; cnt++) {
            contDetails += '<div class="col-lg-2 col-md-2 col-sm-3 col-xs-6" ><div onclick="onContentClick(this);" class="addcontentsize" title="' + RES1[cnt].ContentCaption + '" id="' + RES1[cnt].ContentName + '" style="height: 11em; float: left;" >' +
                ' <div style="width: 11em; height: 8em; text-align: center"> <img src="' + RES1[cnt].ContentClosedHref + '" style="width: 8em; height: 8em;" /></div><div style="width: 11em; height: auto; text-align: center;"> ' +
                '<b class="font-10">' + RES1[cnt].ContentCaption + '</b></div></div></div>';
        }
        $("#AllContents").append('<div class="rowcontents clearfix">' + contDetails + '</div>');
    },
    error: function errorFunc(jqXHR) {
        // alert("not show");
    }
});

function onContentClick(ele) {
    try {

        var x = document.getElementById("popContenerContent").querySelectorAll(".addcontentsize");
        for (var dx = 0; dx < x.length; dx++) {
            x[dx].style.border = '1px solid black';
        }

        document.getElementById(ele.id).style.border = '3px solid #42909A';
        document.getElementById("TxtAddContentName").value = ele.title;
        document.getElementById("PlanContentType").value = ele.id;
        document.getElementById("TxtContentImgSrc").value = $(ele).find('img').attr('src');
    } catch (e) {
        //console.log(e);
    }
}

$("#btnApplyProductCost").click(function () {

    if (Number(document.getElementById("finalCost").value) <= 0 || isNaN(document.getElementById("finalCost").value)) {
        swal({
            title: "Empty or Invalid Cost?",
            text: "Please select plan first",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            closeOnConfirm: true
        }, function () {
            return;
        });
        return;
    }
    if (GblPlanValues === []) {
        swal("Empty selection", "Please select plan", "warning");
        return;
    }
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var lclGridOperItems = $("#GridOperationDetails").dxDataGrid('instance')._controllers.data._dataSource._items;
        var lclGridForms = $("#GridFormsDetails").dxDataGrid('instance')._controllers.data._dataSource._items;

        var procCost = $("#GridOperationDetails").dxDataGrid('instance').getTotalSummaryValue("Amount");
        var displayStatusBottom = document.getElementById("displayStatusBottom").innerHTML.trim().split(/(\d+)/);
        var unitCost = Number(Number(document.getElementById("finalCost").value) / Number(document.getElementById("PlanContQty").innerHTML)).toFixed(3);

        //if (document.getElementById("Plan21").innerHTML.includes("Click Me to plan") === true) {
        var PlanContName = document.getElementById("PlanContName").innerHTML;
        //var PlanContentType = document.getElementById("ContentOrientation").innerHTML;

        ObjContentsDataAll = ObjContentsDataAll.filter(function (obj) {
            return obj.PlanContName !== PlanContName; //obj.PlanContentType !== PlanContentType && 
        });
        ////var ObjAllContData = [];
        ////for (var i = 0; i < ObjContentsDataAll.length; i++) {
        ////    if (ObjContentsDataAll[i].PlanContentType === PlanContentType && ObjContentsDataAll[i].PlanContName === PlanContName) {
        ////        console.log("duplicate contents remove");
        ////    } else {
        ////        ObjAllContData.push(ObjContentsDataAll[i]);
        ////    }
        ////}
        ////ObjContentsDataAll = ObjAllContData;

        document.getElementById("Plan21").innerHTML = "";
        var divPara = '<div style="margin-top: 0em; margin-bottom: 0px; background: transparent;"><div><div style="padding: 2px; font-size: 11px;">Paper:₹' + GblPlanValues.PaperAmount + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Printing:₹' + Number(GblPlanValues.PrintingAmount).toFixed(2) + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Process:₹' + procCost.toFixed(2) + ' </div></div><div><div style="padding: 2px; font-size: 11px;">Total:₹ <span id="finalCstSpan' + displayStatusBottom[1] + '" class="th">' + Number(document.getElementById("finalCost").value).toFixed(2) + '</span></div>' +
            '</div > <div><div style="padding: 2px; font-size: 11px;">Unit:₹ ' + unitCost + '</div></div> <div style="display: none"><div style="padding: 2px; font-size: 11px;">Unit/1000:₹' + Number(Number(unitCost) * 1000).toFixed(3) + ' </div></div></div >';
        document.getElementById("Plan21").innerHTML = divPara;

        GblPlanValues.OldGrantAmount = Number(document.getElementById("TxtOldGrantAmount").value);
        if (GblContentId !== undefined && GblContentId > 0) {
            GblPlanValues.JobBookingJobCardContentsID = GblContentId;
        } else if (GblProductContID !== undefined && GblProductContID > 0) {
            GblPlanValues.ProductMasterContentsID = GblProductContID;
        }
        GblPlanValues.SpecialInstructions = document.getElementById("TxtProductRemark").value;
        removeContentQtyWise(GblPlanValues, lclGridOperItems, lclGridForms);
        saveContentsSizeValues(GblInputValues);
        saveContentsOprations(GblInputOpr);
        removeSelectedFormsDetails(GblPlanValues, lclGridForms); ////JC Form wise detaails remove added on 11-09-2019       

        var LclInputValue = {};
        for (var key in GblPlanValues) {
            LclInputValue[key] = GblPlanValues[key];
        }
        for (key in GblInputValues) {
            LclInputValue[key] = GblInputValues[key];
        }
        ObjContentsDataAll.push(LclInputValue);

        $("#GridProductContentDetails").dxDataGrid({
            dataSource: ObjContentsDataAll
        });

        closeBottomTabBar();

        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
});

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

async function GetSelectedContentPlans() {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        $.ajax({
            type: 'post',
            url: 'WebServiceProductionWorkOrder.asmx/ReloadProductContDetails',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: '{BookingID:' + GblBookingID + ',ProdMasCode:' + JSON.stringify(GblProdMasCode) + ',JobCardNo:' + JSON.stringify(GblJobCardNo) + ',Qty:' + GblOrderQuantity + '}',
            crossDomain: true,
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.replace(/":,/g, '":null,');
                res = res.replace(/u0026/g, '&');
                res = res.replace(/":}/g, '":null}');
                res = res.replace(/":,/g, ":null,");
                res = res.substr(1);
                res = res.slice(0, -1);
                if (res.includes("error code:404")) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    DevExpress.ui.notify("Data not found", "error", 1000);
                    return;
                }
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                var RES1 = JSON.parse(res.toString());

                if (results.d.includes("TblBooking") === false) {
                    alert(results.d);
                } else {
                    LoadContPlans(RES1);
                }
            },
            error: function errorFunc(jqXHR) {
                // alert("not show");
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        });

    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

function LoadContPlans(dataSource) {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

        var JobCont = dataSource.TblBookingContents;
        ObjContentsDataAll = [];
        for (var i = 0; i < JobCont.length; i++) {
            if (FlagEdit === false) {
                JobCont[i].PlanContQty = Number(document.getElementById("TxtQuantity").value);
            }
            document.getElementById("PlanContQty").innerHTML = JobCont[i].PlanContQty;
            document.getElementById("PlanContName").innerHTML = JobCont[i].PlanContName;
            document.getElementById("ContentOrientation").innerHTML = JobCont[i].PlanContentType;
            GblContentName =  JobCont[i].PlanContName;;
            GblContentType = JobCont[i].PlanContentType;

            GblInputValues = {};
            var JobValues = JobCont[i].ContentSizeValues.split('AndOr');
            for (var key in JobValues) {
                var spKey = JobValues[key].split('=');
                if (FlagEdit === false && spKey[0] === "PlanContQty") {
                    spKey[1] = Number(document.getElementById("TxtQuantity").value);
                }
                GblInputValues[spKey[0]] = spKey[1];
            }

            var GDFormStore = [];
            for (var Pi = 0; Pi < dataSource.TblBookingForms.length; Pi++) {
                if (dataSource.TblBookingForms[Pi].PlanContName === JobCont[i].PlanContName &&
                    //Number(dataSource.TblBookingForms[Pi].PlanContQty) === Number(JobCont[i].PlanContQty) &&
                    dataSource.TblBookingForms[Pi].PlanContentType === JobCont[i].PlanContentType) {
                    if (FlagEdit === false) {
                        dataSource.TblBookingForms[Pi].PlanContQty = Number(document.getElementById("TxtQuantity").value);
                    }
                    GDFormStore.push(dataSource.TblBookingForms[Pi]);
                }
            }

            var GDFormDetailsStore = [];
            for (Pi = 0; Pi < dataSource.TblJCBookFormsDetail.length; Pi++) {
                if (dataSource.TblJCBookFormsDetail[Pi].PlanContName === JobCont[i].PlanContName &&
                    //Number(dataSource.TblBookingForms[Pi].PlanContQty) === Number(JobCont[i].PlanContQty) &&
                    dataSource.TblJCBookFormsDetail[Pi].PlanContentType === JobCont[i].PlanContentType) {
                    if (FlagEdit === false) {
                        dataSource.TblJCBookFormsDetail[Pi].PlanContQty = Number(document.getElementById("TxtQuantity").value);
                    }
                    GDFormDetailsStore.push(dataSource.TblJCBookFormsDetail[Pi]);
                }
            }

            var GDOprstore = [], GDOprnStore = [];
            for (Pi = 0; Pi < dataSource.TblBookingProcess.length; Pi++) {
                var GDOpr = {};
                if (dataSource.TblBookingProcess[Pi].PlanContName === JobCont[i].PlanContName
                    //&& Number(dataSource.TblBookingProcess[Pi].PlanContQty) === Number(JobCont[i].PlanContQty)
                    && dataSource.TblBookingProcess[Pi].PlanContentType === JobCont[i].PlanContentType) {

                    GDOpr.ProcessID = dataSource.TblBookingProcess[Pi].ProcessID;  //cellValue(i, 0);
                    GDOpr.Rate = dataSource.TblBookingProcess[Pi].Rate;
                    GDOpr.RateFactor = dataSource.TblBookingProcess[Pi].RateFactor;
                    GDOpr.ProcessName = dataSource.TblBookingProcess[Pi].ProcessName;

                    GDOprstore.push(GDOpr);
                    if (FlagEdit === false) {
                        dataSource.TblBookingProcess[Pi].PlanContQty = Number(document.getElementById("TxtQuantity").value);
                    }
                    GDOprnStore.push(dataSource.TblBookingProcess[Pi]);
                }
            }
            GblInputOpr = GDOprstore;
            GblPlanValues = dataSource.TblBookingContents[i];

            var GDMatstore = [], GDInkstore = [];
            for (Pi = 0; Pi < dataSource.TblBookingMaterials.length; Pi++) {
                if (dataSource.TblBookingMaterials[Pi].PlanContName === JobCont[i].PlanContName
                    //&& Number(dataSource.TblBookingMaterials[Pi].PlanContQty) === Number(JobCont[i].PlanContQty)
                    && dataSource.TblBookingMaterials[Pi].PlanContentType === JobCont[i].PlanContentType) {
                    if (FlagEdit === false) {
                        dataSource.TblBookingMaterials[Pi].PlanContQty = Number(document.getElementById("TxtQuantity").value);
                    }
                    GDMatstore.push(dataSource.TblBookingMaterials[Pi]);
                }
            }
            for (Pi = 0; Pi < dataSource.TblBookingInks.length; Pi++) {
                if (dataSource.TblBookingInks[Pi].PlanContName === JobCont[i].PlanContName
                    //&& Number(dataSource.TblBookingInks[Pi].PlanContQty) === Number(JobCont[i].PlanContQty)
                    && dataSource.TblBookingInks[Pi].PlanContentType === JobCont[i].PlanContentType) {
                    if (FlagEdit === false) {
                        dataSource.TblBookingInks[Pi].PlanContQty = Number(document.getElementById("TxtQuantity").value);
                    }
                    GDInkstore.push(dataSource.TblBookingInks[Pi]);
                }
            }
            if (FlagEdit === false) {
                (async () => {
                    await RePlanQuantityChanged(GblPlanValues, GDOprnStore, GDFormStore);
                })();
            } else {
                ObjContentsDataAll.push(GblPlanValues);
                (async () => {
                    await saveSelectedPlan(GblPlanValues, GDOprnStore, GDFormStore);
                })();
            }

            SaveJCFormDetails(GDFormDetailsStore);

            (async () => {
                await saveContentsSizeValues(GblInputValues);
            })();
            (async () => {
                await saveContentsOprations(GblInputOpr);
            })();
            saveMaterialsRequirement(GDMatstore);
            saveInkShadesDetails(GDInkstore);

            for (key in JobValues) {
                spKey = JobValues[key].split('=');
                ObjContentsDataAll[i][spKey[0]] = spKey[1];
            }
        }

        var grid = $("#GridProductContentDetails").dxDataGrid('instance');
        grid.clearSelection();
        $("#GridProductContentDetails").dxDataGrid({
            dataSource: ObjContentsDataAll
        });
        ProcesssData();
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

function clearPlanContWindow() {

    var tBodyContent = document.getElementById("BodyPlanning");
    var BodyLength = tBodyContent.rows.length;
    if (BodyLength > 1) {
        for (var j = 0; j < BodyLength; j++) {
            if (j > 0) {
                document.getElementById("BodyPlanning").deleteRow(1);
            }
        }
    }

    document.getElementById('lastCol').innerHTML = 0;
    document.getElementById('lastRow').innerHTML = 1;
    document.getElementById('BdyQtyRow').innerHTML = "";
    document.getElementById('FinalCostDivFooter').innerHTML = "";
}


function RePlanQuantityChanged(PlanValues, OprnStore, FormStore) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    var Obj_Job_Size = {};
    var Job_Size_Obj = [];

    Obj_Job_Size.CutSize = PlanValues.CutSize;
    Obj_Job_Size.PlanContentType = GblInputValues.PlanContentType;
    Obj_Job_Size.UpsH = Number(PlanValues.UpsW);
    Obj_Job_Size.UpsL = Number(PlanValues.UpsL);
    Obj_Job_Size.MachineId = PlanValues.MachineID;
    Obj_Job_Size.PlanContQty = Number(document.getElementById("TxtQuantity").value);
    Obj_Job_Size.JobNoOfPages = Number(GblInputValues.JobNoOfPages);
    Obj_Job_Size.PlanPrintingStyle = PlanValues.PrintingStyle.replace(/ {1,}/g, " "); //r//replace multiple space into 1 space
    Obj_Job_Size.PlanFColor = Number(GblInputValues.PlanFColor);
    Obj_Job_Size.PlanBColor = Number(GblInputValues.PlanBColor);
    Obj_Job_Size.PlanSpeFColor = GblInputValues.PlanSpeFColor;
    Obj_Job_Size.PlanSpeBColor = GblInputValues.PlanSpeBColor;
    Obj_Job_Size.PlanWastageType = GblInputValues.PlanWastageType;
    Obj_Job_Size.PlanWastageValue = Number(GblInputValues.PlanWastageValue);
    Obj_Job_Size.PlanPrintingGrain = PlanValues.GrainDirection;

    Obj_Job_Size.ItemPlanQuality = GblInputValues.ItemPlanQuality;
    Obj_Job_Size.ItemPlanGsm = GblInputValues.ItemPlanGsm;
    Obj_Job_Size.ItemPlanMill = GblInputValues.ItemPlanMill;
    Obj_Job_Size.ItemPlanFinish = GblInputValues.ItemPlanFinish;

    Obj_Job_Size.PlanPlateType = GblInputValues.PlanPlateType;
    Obj_Job_Size.PlanType = PlanValues.PlanType;
    Obj_Job_Size.PaperID = PlanValues.PaperID;
    Obj_Job_Size.PlanOnlineCoating = GblInputValues.PlanOnlineCoating;
    Obj_Job_Size.PaperGroup = PlanValues.PaperGroup;
    Obj_Job_Size.GripperSide = PlanValues.GripperSide;
    Obj_Job_Size.PlanGripper = PlanValues.Gripper;
    Obj_Job_Size.OperId = GblInputValues.OperId;

    Job_Size_Obj.push(Obj_Job_Size);
    var ObjJobSize = JSON.stringify(Job_Size_Obj);
    var ObjOpr = JSON.stringify(GblInputOpr);
    try {
        $.ajax({
            async: false,
            type: "POST",
            url: "Api_shiring_service.asmx/ShirinJobMaster",
            data: '{ObjJobSize:' + ObjJobSize + ',ObjOpr:' + ObjOpr + ',PlateRate:' + PlanValues.PlateRate + ',PaperRate:' + PlanValues.PaperRate + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (results) {
                var res = results.d.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/"d":null/g, '');
                res = res.replace(/":,/g, '":null,');
                res = res.replace(/u0026/g, '&');
                res = res.substr(1);
                res = res.slice(0, -1);
                var No_Plan = results.d;
                if (results.d.includes("TblPlanning") === false) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    if (No_Plan.includes("Conversion from string")) {
                        No_Plan = "Session Expired, Please login again";
                        DevExpress.ui.notify(No_Plan, "warning", 1500);
                        location.reload(true);
                    } else if (No_Plan !== "") {
                        DevExpress.ui.notify(No_Plan, "warning", 1500);
                        (async () => {
                            await saveSelectedPlan(PlanValues, OprnStore, FormStore);
                        })();
                        ObjContentsDataAll.push(PlanValues);
                        return false;
                    }
                } else if (res === "[]") {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    (async () => {
                        await saveSelectedPlan(PlanValues, OprnStore, FormStore);
                    })();
                    ObjContentsDataAll.push(PlanValues);
                    DevExpress.ui.notify(No_Plan, "warning", 1500);
                    return false;
                }
                var RES1 = JSON.parse(res);
                if (RES1.TblPlanning.length < 1) {
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                    DevExpress.ui.notify(res, "warning", 5000);
                    (async () => {
                        await saveSelectedPlan(PlanValues, OprnStore, FormStore);
                    })();
                    ObjContentsDataAll.push(PlanValues);
                } else {
                    (async () => {
                        RES1.TblPlanning[0].UpsLayout = PlanValues.UpsLayout;
                        RES1.TblPlanning[0].SheetLayout = PlanValues.SheetLayout;
                        RES1.TblPlanning[0].UserAttachedPicture = PlanValues.UserAttachedPicture;
                        RES1.TblPlanning[0].AttachedFileName = PlanValues.AttachedFileName;
                        RES1.TblPlanning[0].JobType = PlanValues.JobType;
                        RES1.TblPlanning[0].PlateType = PlanValues.PlateType;
                        RES1.TblPlanning[0].SpecialInstructions = PlanValues.SpecialInstructions;
                        RES1.TblPlanning[0].SequenceNo = PlanValues.SequenceNo;
                        await saveSelectedPlan(RES1.TblPlanning[0], RES1.TblOperations, RES1.TblBookForms);
                    })();
                    ObjContentsDataAll.push(RES1.TblPlanning[0]);
                }
            },
            error: function errorFunc(jqXHR) {
                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
            }
        });
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

if (window.File && window.FileReader && window.FormData) {
    var $inputField = $('#file');

    $inputField.on('change', function (e) {
        var file = e.target.files[0];

        if (file) {
            $("#BtnRemoveFile").click();
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
        if ("application/pdf" === file.type) {
            PreviewFile(reader.result, file);
        } else
            processFile(reader.result, file.type, file.name);
    };

    reader.onerror = function () {
        alert('There was an error reading the file!');
    };
    reader.readAsDataURL(file);
}

function PreviewFile(pdffile, file) {
    let pdffile_url = URL.createObjectURL(file);
    $('#viewer').attr('src', pdffile_url);
    //const ext = pdffile.name.split('.')[1].match(/jpeg|png|gif|jpg|pdf/)[0];
    //const xdataURL = pdffile.replace("data:" + pdffile.type + ";base64,", '');
    try {
        if (GblContentName !== "" && file !== "") {
            updateAttachedPicture(GblContentName, GblContentType, "", file.name);
        }
    } catch (e) {
        console.log("Attachement err: " + e);
    }
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
            try {
                if (GblContentName !== "" && xdataURL !== "") {
                    updateAttachedPicture(GblContentName, GblContentType, xdataURL, fileName);
                }
            } catch (e) {
                console.log("Attachement err: " + e);
            }
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
        try {
            if (GblContentName !== "" && xdataURL !== "") {
                updateAttachedPicture(GblContentName, GblContentType, xdataURL, fileName);
            }
        } catch (e) {
            console.log("Attachement err: " + e);
        }
        return false;
        // sendFile(dataURL);
    };

    image.onerror = function () {
        alert('There was an error processing your file!');
    };
}

function saveBase64AsFile(base64, fileName) {
    var link = document.createElement("a");
    link.setAttribute("href", base64);

    link.setAttribute("download", fileName);
    link.click();
}

$("#BtnApplySpecialInstructions").click(function () {
    var SpecialInst = document.getElementById("TxtProductRemark").value.trim();
    GblPlanValues.SpecialInstructions = SpecialInst;
    updateSpecialInstructions(GblContentName, GblContentType, SpecialInst);
});