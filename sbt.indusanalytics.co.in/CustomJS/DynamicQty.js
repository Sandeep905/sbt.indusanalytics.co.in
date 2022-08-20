var gblContentImgState, gblContentImgStateID = "";
var gblcolRowInex, GblPlanID;

//add Qty
var TBLQtyCol = "";
var blankQty = "";

var finalCostTfooterHeader = "", finalCostTfooterColumn = "";

$("#LoadIndicator").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    indicatorSrc: "images/Indus logo.png",
    message: 'Please Wait...',
    width: 310,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false,
    visible: false,
    onShowing: function () {

    }
});

$("#Add_Quantity_Button").click(function () {
    // var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;
    try {

        var lastColNo = document.getElementById("lastCol").innerHTML;
        var ColumnCunt = Number(lastColNo);
        if (ColumnCunt >= 50) {
            DevExpress.ui.notify("Add more than fifty quantities is not allowed..!", "warning", 1000);
            return;
        }
        blankQty = "";
        finalCostTfooterHeader = "";
        if (ColumnCunt < 1) {
            // blankQty = "<td style='min-width:17em;'><div style='float:left;height:auto;width:100%'><div style='float:left;height:auto;width:50%;border-right:2px solid #eee'><b style='text-align:left;margin-left:1em'>Content</b> <img src='images/aero_down.png' class='firstcolumn'/>   </div><div style='float:left;height:auto;width:50%'><b style='text-align:left;margin-left:1em'>Quantity</b><img src='images/aero_forword.png' class='firstcolumn'/></div>      </div></td>";
            blankQty = "<td style='min-width:14em;width:14em'><div style='float:left;height:auto;width:14em'><div style='float:left;height:auto;width:50%;border-right:2px solid #eee;padding-right:1em;'><b style='text-align:left;margin-left:0em'>Content</b> <i title='Content Direction' id='Content_Direction' class='fa fa-arrow-circle-down fa-2x' style='float: right; position: relative; color: #0a5696; justify-content:center;margin-top: -5px;'></i></div><div style='float:left;height:auto;width:50%;padding-right:0em;'><b style='text-align:left;margin-left:1em'>Quantity</b> <i title='Qty Direction' id='Qty_Direction' class='fa fa-arrow-circle-right fa-2x' style='float: right; position: relative; color: #0a5696;margin-top: -5px;'></i> </div>      </div></td>";

            finalCostTfooterHeader = '<td style="min-width:14em;width:14em"><div style="float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:14em;width:14em"><b>Total Cost:₹ </b></div><div style="float:left; padding:2px; width:100%;border-bottom:1px solid #eee"><b>Misc. Cost:(%) </b><input class="finalizeTextBox" style="float:right;width:5em;" type="number" min="0" id="FinalMiscPer' + ColumnCunt + '" onchange="onChangeUpdatePer(this.id)" /></div><div style="float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee"><b>Shipping Cost </b></div><div style="float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee"><b>Profit :(%)</b><input class="finalizeTextBox" style="float:right;width:5em;" type="number" min="0" id="FinalPftPer' + ColumnCunt + '" onchange="onChangeUpdatePer(this.id)" /></div><div style="float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee"><b>Disc. Cost:(%) </b><input class="finalizeTextBox" style="float:right;width:5em;" type="number" max="0" id="FinalDiscPer' + ColumnCunt + '" onchange="onChangeUpdatePer(this.id)" /></div><div style="float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee"><b>Tax Cost:(%) </b><input class="finalizeTextBox" style="float:right;width:5em;" type="number" min="0" id="FinalTaxPer' + ColumnCunt + '" onchange="onChangeUpdatePer(this.id)" /></div><div class="finalize" id="lblGrandTotalCost" onclick="setFinalCostType(this)"><b>Grand Total:₹ </b></div><div class="finalize" id="lblUnitCost" onclick="setFinalCostType(this)"><b>Unit Cost:₹ </b></div><div class="finalize" id="lblUnitThCost" onclick="setFinalCostType(this)"><b style="float:left;">Unit Cost/1000:₹ </b></div><div style="float: left;background-color:green;color:whitesmoke;padding: 3px; width: 100%;border-bottom:1px solid #eee"><b>Final Cost:₹ </b></div><div style="float: left;background-color:green;color:whitesmoke;padding: 3px; width: 100%;border-bottom:1px solid #eee"><b>Quoted Cost: </b></div></td>';
            ColumnCunt = ColumnCunt + 1;

            $("#trCurrencytype").show();
        }
        else {
            ColumnCunt = ColumnCunt;
        }

        var ExtColtbl = document.getElementById('PlanTable').getElementsByTagName("tbody")[0]; // table reference  
        //var TblFooter = document.getElementById('Footer_Cost').getElementsByTagName("tfoot")[0];

        var tblLengthExt = ExtColtbl.rows.length;
        var mergeQty;
        var mergeFinalCost;
        if (tblLengthExt > 1) {

            TBLQtyCol = "";
            // TBLQtyCol = "<td id='td" + ColumnCunt + "' class='qtydelete'> <input type='image' src='images/delete.png' id='btnRem" + ColumnCunt + "' value='Remove Qty' class='delete' data-type='ajax-loader' style='margin-bottom: .2em' onclick='Remove_Column(this);'/><br /><input type='text' id='txtqty" + ColumnCunt + "' placeholder='Enter Qty" + ColumnCunt + "' class='forTextBox' onchange='BottomTabConQty();'/></td>";
            TBLQtyCol = "<td id='td" + ColumnCunt + "' class='qtydelete' style='min-width:10em;width:10em'>  <div id='btnRem" + ColumnCunt + "' class='delete' style='background-image: url(images/delete.png);margin-right: 0px'  data-type='ajax-loader'  onclick='Remove_Column(this);' ></div> <input type='text' id='txtqty" + ColumnCunt + "' placeholder='Enter Qty" + ColumnCunt + "' class='forTextBox' onchange='BottomTabConQty();' style='width:7em'/></td>";
            //finalCostTfooterColumn = "<td id='FinalCost_Fix" + ColumnCunt + "' class='qtydelete' style='min-width:4.5em;width:4.5em'><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><b id='FinaltotalCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding:2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input style='float:left;width:25%;' type='number' min='0' id='FinalMiscPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input type='number' id='FinalMiscCost" + ColumnCunt + "' style='width:60%;float:right;'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><input type='number' id='FinalProfitCost" + ColumnCunt + "' style='min-width:10em;width:10em'/></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><input type='number' max='0' id='FinalDisCost" + ColumnCunt + "' style='min-width:10em;width:10em' /></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><input type='number' min='0' id='FinalTaxCost" + ColumnCunt + "' style='min-width:10em;width:10em' /></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><b id='FinalGrandTotalCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><b id='FinalUnitCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><b id='FinalUnitThCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 0px; width: 100%;background-color:green;border-bottom:1px solid #eee;min-width:10em;width:10em'><input type='number' min='0' id='FinalfinalCost" + ColumnCunt + "' style='min-width:10em;width:10em'/></div></td>";
            finalCostTfooterColumn = "<td id='FinalCost_Fix" + ColumnCunt + "' class='qtydelete' style='min-width:10em;width:10em'><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinaltotalCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding:2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' min='0' id='FinalMiscPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalMiscCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='width:auto'><input class='finalizeTextBox' type='text' id='FinalShipperCost" + ColumnCunt + "' onchange='onChangeCalcAmount(this.id)' style='min-width:10em;width:10em;text-align:right'/></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' min='0' id='FinalPftPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalProfitCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' max='0' id='FinalDiscPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalDisCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' min='0' id='FinalTaxPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalTaxCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinalGrandTotalCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinalUnitCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinalUnitThCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 0px; width: 100%;background-color:green;border-bottom:1px solid #eee;min-width:10em;width:10em'><input class='finalizeTextBox' onkeypress='return isNumber(event, this);' onInput='onchangeQuotedCost();' type='text' min='0' id='FinalfinalCost" + ColumnCunt + "' style='min-width:10em;width:10em;text-align:right'/></div><input class='finalizeTextBox' type='text' min='0' id='FinalQuotedCost" + ColumnCunt + "' onkeypress='return isNumber(event, this);' style='min-width:10em;width:10em;text-align:right'/></div></td>";

            mergeQty = blankQty + "" + TBLQtyCol;
            mergeFinalCost = finalCostTfooterHeader + "" + finalCostTfooterColumn;

            $('#Bdy_QtyRow').append(mergeQty);
            $('#FinalCostDivFooter').append(mergeFinalCost);
            //Auto Genrate column after exist Column & Row
            for (gblcolRowInex = 0; gblcolRowInex < ExtColtbl.rows.length; gblcolRowInex++) {
                if (gblcolRowInex > 0) {
                    createCell(ExtColtbl.rows[gblcolRowInex].insertCell(ExtColtbl.rows[gblcolRowInex].cells.length), gblcolRowInex, 'col');
                }
            }
            document.getElementById("lastCol").innerHTML = ColumnCunt + 1;
            BottomTabConQty();
        }
        else {

            TBLQtyCol = "";
            //TBLQtyCol = "<td id='td" + ColumnCunt + "' class='qtydelete'> <input type='image' src='images/delete.png' id='btnRem" + ColumnCunt + "' value='Remove Qty' class='delete' style='margin-bottom: .2em' onclick='Remove_Column(this);'/><br /><input type='text' id='txtqty" + ColumnCunt + "' placeholder='Enter Qty" + ColumnCunt + "' class='forTextBox' onchange='BottomTabConQty();'/></td>";
            TBLQtyCol = "<td id='td" + ColumnCunt + "' class='qtydelete' style='min-width:10em;width:10em'> <div id='btnRem" + ColumnCunt + "' class='delete' style='background-image: url(images/delete.png);margin-right: 0px'  data-type='ajax-loader'  onclick='Remove_Column(this);' ></div><input type='text' id='txtqty" + ColumnCunt + "' placeholder='Enter Qty" + ColumnCunt + "' class='forTextBox' onchange='BottomTabConQty();' style='width:7em'/></td>";
            //finalCostTfooterColumn = "<td id='FinalCost_Fix" + ColumnCunt + "' class='qtydelete' style='min-width:10em;width:10em'><div style='float: left; padding: 0px; width: 100%;'><input type='number' readonly='readonly' id='FinaltotalCost" + ColumnCunt + "' /></div><div style='float: left; padding: 5px 0px 4px 0px; width: 100%'><input type='number' id='FinalMiscCost" + ColumnCunt + "' /></div><div style='float: left; padding: 5px; width: 100%'><input type='number' id='FinalProfitCost" + ColumnCunt + "'/></div><div style='float: left; padding: 5px; width: 100%'><input type='number' id='FinalDisCost" + ColumnCunt + "' /></div><div style='float: left; padding: 5px; width: 100%'><input type='number' id='FinalTaxCost" + ColumnCunt + "' /></div><div style='float: left; padding: 5px; width: 100% '><input type='number' readonly='readonly' id='FinalGrandTotalCost" + ColumnCunt + "' /></div><div style='float: left; padding: 5px; width: 100%'><input type='number' readonly='readonly' id='FinalUnitCost" + ColumnCunt + "' /></div><div style='float: left; padding: 5px; width: 100%'><input type='number' readonly='readonly' id='FinalUnitThCost" + ColumnCunt + "' /></div> <div style='float: left; padding: 5px; width: 100%'><input type='number' min='0' id='FinalfinalCost" + ColumnCunt + "' /></div></td>";
            finalCostTfooterColumn = "<td id='FinalCost_Fix" + ColumnCunt + "' class='qtydelete' style='min-width:10em;width:10em'><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinaltotalCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding:2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' min='0' id='FinalMiscPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalMiscCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='width:auto'><input class='finalizeTextBox' type='text' id='FinalShipperCost" + ColumnCunt + "' onchange='onChangeCalcAmount(this.id)' style='min-width:10em;width:10em;text-align:right'/></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' min='0' id='FinalPftPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalProfitCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;;text-align:right'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' max='0' id='FinalDiscPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalDisCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em'><div style='width:auto'><input class='finalizeTextBox' style='float:left;width:30%;' type='number' min='0' id='FinalTaxPer" + ColumnCunt + "'onchange='onChangeCalcAmount(this.id)'/><b>%</b><input class='finalizeTextBox' type='text' id='FinalTaxCost" + ColumnCunt + "' readOnly=readOnly style='width:60%;float:right;text-align:right'/></div></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinalGrandTotalCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinalUnitCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 2px; width: 100%;border-bottom:1px solid #eee;min-width:10em;width:10em;text-align:right'><b id='FinalUnitThCost" + ColumnCunt + "'>0</b></div><div style='float: left; padding: 0px; width: 100%;background-color:green;border-bottom:1px solid #eee;min-width:10em;width:10em'><input class='finalizeTextBox' onkeypress='return isNumber(event, this);' onInput='onchangeQuotedCost();' type='text' min='0' id='FinalfinalCost" + ColumnCunt + "' style='min-width:10em;width:10em;text-align:right'/></div><div style='float: left; padding: 0px; width: 100%;background-color:green;border-bottom:1px solid #eee;min-width:10em;width:10em'><input class='finalizeTextBox' type='text' min='0' id='FinalQuotedCost" + ColumnCunt + "' onkeypress='return isNumber(event, this);' style='min-width:10em;width:10em;text-align:right'/></div></td>";
            mergeQty = blankQty + "" + TBLQtyCol;
            mergeFinalCost = finalCostTfooterHeader + "" + finalCostTfooterColumn;

            $('#Bdy_QtyRow').append(mergeQty);
            $('#FinalCostDivFooter').append(mergeFinalCost);

            document.getElementById("lastCol").innerHTML = ColumnCunt + 1;
            BottomTabConQty();
        }
        document.getElementById("txtqty" + ColumnCunt + "").focus();

    } catch (e) {
        alert(e);
    }
});

function createCell(cell, rowno) {             //function createCell(createCell(cell, text, style)  

    var tdIDRow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[rowno].cells[0].id;
    tdIDRow = tdIDRow.replace('p', '');

    var lastColNo = document.getElementById("lastCol").innerHTML;
    var celcont = Number(lastColNo);

    cell.className = "content_div";
    cell.id = "ConRecord" + tdIDRow + celcont;
    cell.style.padding = ".3em";
    //cell.setAttribute("onclick", "allQuantity(this);");
    //cell.setAttribute("onclick", "Qtyshow(this)");
    //cell.setAttribute("onmouseout", "Qtyhide(this)");

    ////var paradiv = document.createElement('div');
    ////paradiv.id = "Para" + tdIDRow + celcont;
    ////paradiv.className = "planWindow";
    ////paradiv.setAttribute("onclick", "allQuantity(this);");
    ////paradiv.style.margin = "5px";
    ////paradiv.style.textAlign = "center";
    ////var parab = document.createElement('b');
    ////parab.innerHTML = "Click Me to Plan";
    ////paradiv.appendChild(parab);

    var Plan = document.createElement('div');
    Plan.id = "Plan" + tdIDRow + celcont;
    Plan.className = "planWindow planme_btn";
    Plan.style.height = "4.5em";
    Plan.style.display = "flex";
    Plan.style.alignItems = "center";
    Plan.style.justifyContent = "center";
    Plan.style.borderRadius = "8px";
    Plan.style.boxShadow = "0px 17px 10px -10px rgba(0,0,0,0.4)";
    Plan.style.border = "1px solid";
    Plan.style.color = "#000";
    Plan.setAttribute("onclick", "allQuantity(this);");
    Plan.innerHTML = "Click Me to plan..";

    cell.appendChild(Plan);
    //cell.appendChild(paradiv);
}

// delete Qty column
function Remove_Column(rem) {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Quantity!",
        type: "warning",
        showCancelButton: true,
        //confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    }, function () {
        var ColumnCunt = 0;//*
        var PlanTable_Name = document.getElementById("PlanTable");//*
        var tds = PlanTable_Name.rows[1].getElementsByTagName("td");//*
        for (var i = 0; i < tds.length; i++) {//*
            if (tds[i].className !== "HideColumn") {//*
                ColumnCunt = ColumnCunt + 1;//*
            }//*
        }//*

        //var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;
        var row = rem.parentNode.parentNode;
        var cellIndex = rem.parentNode.cellIndex;
        var allRows = document.getElementById('Body_Planning').rows;
        var FooterRows = document.getElementById('Footer_Cost').rows;

        var ColID = rem.id.match(/\d+/g);
        var PlanContQty = Number(document.getElementById("txtqty" + ColID[0]).value);
        deleteDataQtyWise(PlanContQty); ///delete data from store qty wise
        var ColHide = "", increaseRow = 0, FooterColHide = "";
        if (ColumnCunt === 2) {
            var tBodyContent = document.getElementById("Body_Planning");//document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
            var BodyLength = tBodyContent.rows.length;
            if (BodyLength > 1) {
                for (var j = 0; j < BodyLength; j++) {

                    if (j > 0) {
                        var Body_Planning_Name = document.getElementById("Body_Planning");//*
                        var trs = Body_Planning_Name.getElementsByTagName("tr");//*                        
                        for (i = 0; i < trs.length; i++) {//*
                            if (trs[i].className !== "HideColumn") {//*                                
                                if (i > 0) { //*
                                    var trID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[i].id;  //*                                  
                                    document.getElementById(trID).className = "HideColumn";//*
                                }
                            }//*
                        }//*

                        //document.getElementById("Body_Planning").deleteRow(1);
                        //document.getElementById("Footer_Cost").deleteRow(0);
                    }
                }

            }
            for (i = 0; i < allRows.length; i++) {
                if (allRows[i].cells.length > 1) {
                    ColHide = "";
                    if (i === 0) {
                        ColHide = "td" + cellIndex;
                        document.getElementById(ColHide).className = "HideColumn";
                    }
                    else {
                        increaseRow = i + 1;
                        ColHide = "ConRecord" + increaseRow + "" + cellIndex;
                        document.getElementById(ColHide).className = "HideColumn";
                    }
                    FooterColHide = "FinalCost_Fix" + cellIndex;
                    document.getElementById(FooterColHide).className = "HideColumn";

                    //allRows[i].deleteCell(cellIndex); //delete the cell  
                    //FooterRows[0].deleteCell(cellIndex);
                }
            }

            //document.getElementById('lastCol').innerHTML = 0;
            //document.getElementById('lastRow').innerHTML = 1;
            //document.getElementById('Bdy_QtyRow').innerHTML = "";
            //document.getElementById('FinalCostDivFooter').innerHTML = "";

            BottomTabConQty();
        }
        else {
            for (i = 0; i < allRows.length; i++) {
                if (allRows[i].cells.length > 1) {
                    ColHide = "";
                    var PalnDivHide = "";

                    if (i === 0) {
                        ColHide = "td" + cellIndex;
                        document.getElementById(ColHide).className = "HideColumn";
                    }
                    else {
                        increaseRow = i + 1;
                        ColHide = "ConRecord" + increaseRow + "" + cellIndex;
                        PalnDivHide = "Plan" + increaseRow + "" + cellIndex;
                        document.getElementById(ColHide).className = "HideColumn";
                        document.getElementById(PalnDivHide).className = "HideColumn";
                    }
                    FooterColHide = "FinalCost_Fix" + cellIndex;

                    //allRows[i].deleteCell(cellIndex); //delete the cell
                }
            }
            if (FooterRows[0].cells.length > 1) {
                document.getElementById(FooterColHide).className = "HideColumn";
                //FooterRows[0].deleteCell(cellIndex);
            }
            BottomTabConQty();
        }
        //        swal("Deleted!", "Your Quantity has been deleted.", "success");
    });

}

//Add Content
var TBLContentCol = "";
var ContentImg = "";
$("#Add_Content_Button").click(function () {
    ContentImg = "";
    var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;

    if (ColumnCunt > 1) {
        document.getElementById("Txt_Content_Name").value = "";
        document.getElementById("PlanContentType").value = "";
        document.getElementById("Txt_ContentImgSrc").value = "";

        document.getElementById("Add_Content_Button").setAttribute("data-toggle", "modal");
        document.getElementById("Add_Content_Button").setAttribute("data-target", "#largeModal");

    }
    else {
        document.getElementById("Add_Content_Button").setAttribute("data-toggle", " ");
        document.getElementById("Add_Content_Button").setAttribute("data-target", " ");
        alert("Please first add Quantity..!");
        return false;
    }
});

//Select Content PopUp
$("#Btn_Select_Content").click(function () {
    var Txt_Content_Name = document.getElementById("Txt_Content_Name").value;
    var PlanContentType = document.getElementById("PlanContentType").value;
    if (Txt_Content_Name === "" || PlanContentType === "") {
        alert("Please choose any content...");
        return false;
    }
    else {
        //if (gblContentImgState === "yes") { //Selected Content name Change
        //    var split_string = gblContentImgStateID.split(/(\d+)/)
        //    var Exitbl = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
        //    var ExistRow = Exitbl.rows.length;
        //    for (var ex = 2; ex <= ExistRow; ex++) { //Content All ready Exist
        //        if (ex != split_string) {
        //            var tdID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[ex - 1].cells[0].id;
        //            tdID = tdID.replace('p', '');
        //            var excn = "contName" + tdID;

        //            if (((document.getElementById(excn).innerHTML).replace(/'/g, '')) === (document.getElementById("Txt_Content_Name").value)) {
        //                alert("This Content Name allready Exist..Please choose another Content Name..");
        //                return false;
        //            }
        //        }
        //    }

        //    var pCN = "contName" + split_string[1];
        //    var pCT = "contType" + split_string[1];
        //    var pCI = "img" + split_string[1];

        //    document.getElementById(pCN).innerHTML = document.getElementById("Txt_Content_Name").value;
        //    document.getElementById(pCT).innerHTML = document.getElementById("PlanContentType").value;
        //    document.getElementById(pCI).src = document.getElementById("Txt_ContentImgSrc").value;

        //    BottomTabConQty();
        //    gblContentImgState = "";
        //    gblContentImgStateID = "";
        //    document.getElementById("Btn_Select_Content").setAttribute("data-dismiss", "modal");
        //}
        //else {   //New Content name Choose

        ContentImg = "";
        var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;

        //var ColumnCunt = 0;//*
        //var PlanTable_Name = document.getElementById("PlanTable");//*
        //var tds = PlanTable_Name.rows[1].getElementsByTagName("td");//*
        //for (var i = 0; i < tds.length; i++) {//*
        //    if (tds[i].className !== "HideColumn") {//*
        //        ColumnCunt = ColumnCunt + 1;//*
        //    }//*
        //}//*
        if (CheckDuplicateContName(document.getElementById("Txt_Content_Name").value)) return false;

        var lastRowNo = document.getElementById("lastRow").innerHTML;
        lastRowNo = Number(lastRowNo) + 1;

        // ContentImg = "<td id='p" + lastRowNo + "'  class='qtydelete' onmouseover = 'show(this)' onmouseout='hide(this)'><input type='image' src='images/delete.png' id='RowRem" + lastRowNo + "' class='delete' style='margin-bottom: .2em' onclick='RemContent(this);' /><div id=CntImgDiv" + lastRowNo + " class='content_div'  data-toggle='modal' style='height:100%;width:100%' onclick='OpenCntentModel(this);'><img id=img" + lastRowNo + " src='" + document.getElementById("Txt_ContentImgSrc").value + "' /><p id=contName" + lastRowNo + " style='display:none'>'" + document.getElementById("Txt_Content_Name").value + "'</p><p id=contType" + lastRowNo + " style='display:none'>'" + document.getElementById("PlanContentType").value + "'</p></div></td>";
        ContentImg = "<td id='p" + lastRowNo + "'  class='qtydelete' onmouseover = 'show(this)' onmouseout='hide(this)' style='z-index: 5'><div id='RowRem" + lastRowNo + "' class='delete' style='background-image: url(images/delete.png);' title='Delete Content' data-type='ajax-loader'  onclick='RemContent(this);' ></div><div id='ContentClone" + lastRowNo + "' title='Clone Content' class='delete' style='background-image:url(images/clone.png); margin-top: 40px;' data-type='ajax-loader' data-toggle='modal' data-target='#ModalCloneContent' onclick='CloneContent(this);'></div><div id=CntImgDiv" + lastRowNo + " class='content_div'  data-toggle='modal' style='height:100%;width:100%;cursor: default;'  style='z-index:5'><img hidden id=img" + lastRowNo + " src='" + document.getElementById("Txt_ContentImgSrc").value + "'/><b id=contName" + lastRowNo + " style='display:block;z-index:5'>" + document.getElementById("Txt_Content_Name").value.replace(/'/g, '') + "</b><p id=contType" + lastRowNo + " style='display:none'>" + document.getElementById("PlanContentType").value + "</p></div></td>";

        TBLContentCol = "";
        var x = 0;
        for (var i = 0; i < ColumnCunt - 1; i++) {
            x = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells[i + 1].id;
            x = x.replace('td', '');

            var tdStatus = "";
            tdStatus = "td" + x;
            if (document.getElementById(tdStatus).className !== "HideColumn") {
                //TBLContentCol += "<td id=ConRecord" + lastRowNo + x + " class='content_div' style='padding: .3em;cursor: default;'   onclick = 'Qtyshow(this)' onmouseout='Qtyhide(this)' > <div id='Plan" + lastRowNo + x + "' class='planWindow planme_btn'  data-toggle='tab'  onclick='allQuantity(this);' style='height:13em;display: flex;align-items: center;justify-content: center;border-radius: 8px;border:1px solid;box-shadow: 0px 17px 10px -10px rgba(0,0,0,0.4)'>Click Me to plan..</div> </td>"; //  <div onclick='allQuantity(this);' class='planWindow' id='Para" + lastRowNo + x + "' style='text-align:center;margin:5px;'><b>Click Me to Plan</b></div> 
                // TBLContentCol += "<td id=ConRecord" + lastRowNo + x + " class='content_div' style='cursor: default'   onclick = 'Qtyshow(this)' onmouseout='Qtyhide(this)' > <div id='Plan" + lastRowNo + x + "' class='planWindow'  data-toggle='tab'  onclick='allQuantity(this);' >Click Me to plan..</div>   <div id='Para" + lastRowNo + x + "' style='text-align:center;margin:5px;'><b>Click Me to Plan</b></div> </td>";
                TBLContentCol += "<td id='ConRecord" + lastRowNo + x + "' class='content_div' style='padding: .3em;cursor: default;'> <div id='Plan" + lastRowNo + x + "' class='planWindow planme_btn'  data-toggle='tab'  onclick='allQuantity(this);' style='height:4.5em;display: flex;align-items: center;justify-content: center;border-radius: 8px;border:1px solid;box-shadow: 0px 17px 10px -10px rgba(0,0,0,0.4)'>Click Me to plan..</div> </td>"; //  <div onclick='allQuantity(this);' class='planWindow' id='Para" + lastRowNo + x + "' style='text-align:center;margin:5px;'><b>Click Me to Plan</b></div> 
            }
        }
        var MergeCol = ContentImg + "" + TBLContentCol;
        $('#Body_Planning').append("<tr id='tr" + lastRowNo + "'>" + MergeCol + "</tr>");
        document.getElementById("lastRow").innerHTML = lastRowNo;

        BottomTabConQty();
        document.getElementById("Btn_Select_Content").setAttribute("data-dismiss", "modal");
        //}
    }

});

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
    //alert(qt.id);
    Gbl_RowID = ""; Gbl_QtyID = "";

    var table = document.getElementById("PlanTable");
    var row_no = qt.parentNode.parentNode.rowIndex;
    var cell_no = qt.parentNode.cellIndex;

    var trid = table.rows[row_no];
    trid = Gbl_RowID = trid.id;
    var trNum = trid.split(/(\d+)/);

    var tdID = table.rows[row_no].cells[cell_no].id;
    var tdIDsplit = tdID.split(/(\d+)/);

    GblPlanID = tdIDsplit[1];

    var mergTRTD = tdIDsplit[0] + "" + trNum[1];
    var lcl_QtyID = tdID.split(mergTRTD);
    var Gbl_QtyID_A = "txtqty" + lcl_QtyID[1];
    Gbl_TDQty = 0;
    if (!numericValidation(document.getElementById(Gbl_QtyID_A))) {
        document.getElementById(Gbl_QtyID_A).value = "";
        Gbl_TDQty = 0;
        return;
    }
    Gbl_TDQty = Number(document.getElementById(Gbl_QtyID_A).value.trim());
    if (Gbl_TDQty === "" || Gbl_TDQty === 0 || Gbl_TDQty === undefined || Gbl_TDQty === null) {
        Gbl_TDQty = 0;
        return;
    }
    else {
        Gbl_TDQty = Gbl_TDQty;
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
            document.getElementById('RightTabBar').style.width = "0px";
            document.getElementById('mySidenav').style.width = "0px";
            Bottompopup.style.height = "92.5%";
            Bottompopup.style.display = "block";
            Bottomoverlay.style.display = 'block';
            //document.getElementById('L' + MergeStringNum).setAttribute("class", "active");

            PlanWindow(row_no);
        }
    };
}

//Delete Content Row
function RemContent(RemRow) {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover this Content!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    }, function () {
        //Determine the reference of the Row using the Button.
        //  var row = RemRow.parentNode.parentNode;
        // var name = row.getElementsByTagName("TD")[0];
        // var Description = name.getElementsByTagName("textarea")[0].value;
        // var person = confirm("Do you want to delete..?");
        //alert(person);
        //if (person === true) {
        //Get the reference of the Table.

        var rowid = RemRow.id.split(/(\d+)/);
        var row_no = "";
        if (rowid[0] === "RowRem") {
            var table = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
            row_no = RemRow.parentNode.parentNode.rowIndex;
            var cell_no = RemRow.parentNode.cellIndex;
            row_no = row_no - 1;
        }
        else {
            row_no = row_no.replace('Hover', '') - 1;
        }

        var ContName = document.getElementById("contName" + rowid[1]).innerHTML;
        var ContentType = document.getElementById("contType" + rowid[1]).innerHTML;
        deleteDataContentsWise(ContName, ContentType); ////Delete data from data store

        var get_TRNO = row_no; //*
        get_TRNO = Number(get_TRNO) + 1; //*
        get_TRNO = "tr" + get_TRNO;         //*
        document.getElementById(get_TRNO).className = "HideColumn"; //*

        //document.getElementById("Body_Planning").deleteRow(row_no);

        document.getElementById('DivZommer').style.display = 'none';
        BottomTabConQty();
        onChangeCalcAmount("FinalDiscPer0");
        //  table.deleteRow(row_no.rowIndex);
        //}
        ///swal("Deleted!", "Your Content has been deleted.", "success");
    });
}

//Clone Contents
function CloneContent(CloneRow) {
    var rowid = CloneRow.id.split(/(\d+)/);

    var ContName = document.getElementById("contName" + rowid[1]).innerHTML;
    var ContentType = document.getElementById("contType" + rowid[1]).innerHTML;

    document.getElementById("rowidCloneContent").value = rowid[1];
    document.getElementById("TxtCloneContentName").value = ContName;
    document.getElementById("TxtCloneContent").value = ContName;
    document.getElementById("PlanContentType").value = ContentType;
    var ContImg = ContentType.replace(/([A-Z])/g, ' $1').trim();
    document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + ContImg + ".jpg";
    document.getElementById("TxtCloneContent").focus();
}

$("#BtnCloneContent").click(function () {
    var ContentName = document.getElementById("TxtCloneContent").value.trim();
    if (ContentName === "") {
        swal("Empty Field!", "Please enter content name", "warning");
        return;
    }

    document.getElementById("Txt_Content_Name").value = ContentName;
    var returnResult = addNewContent();
    if (returnResult === false) {
        return false;
    }
    document.getElementById("BtnCloneContent").setAttribute("data-dismiss", "modal");
    cloneContentAsNew(document.getElementById("TxtCloneContentName").value, ContentName, document.getElementById("PlanContentType").value);

    var row = document.getElementById("rowidCloneContent").value;
    var PTablecrow = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows;
    for (var i = 1; i < PTablecrow[0].cells.length; i++) {
        document.getElementById("Plan" + PTablecrow.length + "" + i).innerHTML = document.getElementById("Plan" + row + "" + i).innerHTML;
        document.getElementById("Plan" + PTablecrow.length + "" + i).innerHTML = document.getElementById("Plan" + PTablecrow.length + "" + i).innerHTML.replace("finalCstSpan" + row + "" + i, "finalCstSpan" + PTablecrow.length + "" + i);
        onChangeCalcAmount("FinalDiscPer0");
    }
});

function addNewContent() {
    var Txt_Content_Name = document.getElementById("Txt_Content_Name").value;
    var PlanContentType = document.getElementById("PlanContentType").value;
    if (Txt_Content_Name === "" || PlanContentType === "") {
        alert("Please choose any content...");
        return false;
    }
    else {
        ContentImg = "";
        var ColumnCunt = document.getElementById('PlanTable').rows[1].cells.length;

        if (CheckDuplicateContName(document.getElementById("Txt_Content_Name").value)) return false;

        var lastRowNo = document.getElementById("lastRow").innerHTML;
        lastRowNo = Number(lastRowNo) + 1;

        ContentImg = "<td id='p" + lastRowNo + "'  class='qtydelete' onmouseover = 'show(this)' onmouseout='hide(this)' style='z-index: 5'><div id='RowRem" + lastRowNo + "' class='delete' style='background-image: url(images/delete.png);' title='Delete Content' data-type='ajax-loader'  onclick='RemContent(this);' ></div><div id='ContentClone" + lastRowNo + "' title='Clone Content' class='delete' style='background-image:url(images/clone.png); margin-top: 40px;' data-type='ajax-loader' data-toggle='modal' data-target='#ModalCloneContent' onclick='CloneContent(this);'></div><div id=CntImgDiv" + lastRowNo + " class='content_div'  data-toggle='modal' style='height:100%;width:100%;cursor: default;'  style='z-index:5'><img hidden id=img" + lastRowNo + " src='" + document.getElementById("Txt_ContentImgSrc").value + "'/><b id=contName" + lastRowNo + " style='display:block;z-index:5'>" + document.getElementById("Txt_Content_Name").value.replace(/'/g, '') + "</b><p id=contType" + lastRowNo + " style='display:none'>" + document.getElementById("PlanContentType").value + "</p></div></td>";

        TBLContentCol = "";
        var x = 0;
        for (var i = 0; i < ColumnCunt - 1; i++) {
            x = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells[i + 1].id;
            x = x.replace('td', '');

            var tdStatus = "";
            tdStatus = "td" + x;
            if (document.getElementById(tdStatus).className !== "HideColumn") {
                TBLContentCol += "<td id='ConRecord" + lastRowNo + x + "' class='content_div' style='padding: .3em;cursor: default;'> <div id='Plan" + lastRowNo + x + "' class='planWindow planme_btn'  data-toggle='tab'  onclick='allQuantity(this);' style='height:4.5em;display: flex;align-items: center;justify-content: center;border-radius: 8px;border:1px solid;box-shadow: 0px 17px 10px -10px rgba(0,0,0,0.4)'>Click Me to plan..</div> </td>"; //  <div onclick='allQuantity(this);' class='planWindow' id='Para" + lastRowNo + x + "' style='text-align:center;margin:5px;'><b>Click Me to Plan</b></div> 
            }
        }
        var MergeCol = ContentImg + "" + TBLContentCol;
        $('#Body_Planning').append("<tr id='tr" + lastRowNo + "'>" + MergeCol + "</tr>");
        document.getElementById("lastRow").innerHTML = lastRowNo;

        BottomTabConQty();
        document.getElementById("Btn_Select_Content").setAttribute("data-dismiss", "modal");
    }
    return true;
}

//Open Content Model
//function OpenCntentModel(OCM) {
//    var DIVID = OCM.id;
//    gblContentImgStateID = DIVID;
//    gblContentImgState = "yes";

//    var split_string = DIVID.split(/(\d+)/)

//    var txtCN = "contName" + split_string[1];
//    var txtCT = "contType" + split_string[1];
//    var txtCI = "img" + split_string[1];

//    document.getElementById("Txt_Content_Name").value = "";
//    document.getElementById("PlanContentType").value = "";
//    document.getElementById("Txt_ContentImgSrc").value = "";

//    document.getElementById("Txt_Content_Name").value = (document.getElementById(txtCN).innerHTML).replace(/'/g, '');
//    document.getElementById("PlanContentType").value = (document.getElementById(txtCT).innerHTML).replace(/'/g, '');
//    document.getElementById("Txt_ContentImgSrc").value = document.getElementById(txtCI).getAttribute("src");

//    ClearDesign();
//    var RepCn = (document.getElementById(txtCN).innerHTML).replace(/'/g, '');
//    RepCn = RepCn.replace(/ /g, '_');
//    document.getElementById(RepCn).style.border = '3px solid #42909A';
//    document.getElementById(DIVID).setAttribute("data-target", "#largeModal");
//}

//Clear Exist Select Content

//Add Bottom tab Content
function BottomTabConQty() {

    var TabContener = "";
    var pContentName = "";
    var tdQty = "";
    //document.getElementById("bottomTabContainer").innerHTML = "";

    var PlanTable = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
    var PlanTableLength = PlanTable.rows.length;
    var ColumnLength = document.getElementById('PlanTable').rows[1].cells.length;

    for (var l = 1; l < ColumnLength; l++) {
        var qtytd = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells[l].id;
        var tabColid = qtytd.split(/(\d+)/);
        var tabColid_string = tabColid[0];
        var tabColid_num = tabColid[1];

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
                if (Number(this.value) === Number(tdQty)) {
                    this.value = "";
                }
            }
        });

        for (var k = 2; k <= PlanTableLength; k++) {
            var Contenttd = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[k - 1].cells[0].id;
            var tabRowid = Contenttd.split(/(\d+)/);
            var tabRowid_string = tabRowid[0];
            var tabRowid_num = tabRowid[1];

            Contenttd = Contenttd.replace('p', '');
            Contenttd = "contName" + Contenttd;
            pContentName = "";
            pContentName = document.getElementById(Contenttd).innerHTML.replace(/'/g, '');

            //TabContener += "<li role='presentation' id=L" + tabRowid_string + tabColid_string + tabRowid_num + tabColid_num + "><a id=" + tabRowid_string + tabColid_string + tabRowid_num + tabColid_num + "   href='#' data-toggle='tab' onclick='Bottombar(this);'>" + pContentName + "/" + tdQty + "</a></li>";

            TabContener += "<li role='presentation' id=L" + tabRowid_string + tabColid_string + tabRowid_num + tabColid_num + "><a id=" + tabRowid_string + tabColid_string + tabRowid_num + tabColid_num + "   href='#' data-toggle='tab'  onclick='Bottombar(this);' style='color:#42909A;font-size:10px;font-weight:600;width: 100%;'>" + pContentName + "/" + tdQty + "</a></li>";


        }
    }
    //  $('#bottomTabContainer').append(TabContener);   
    ///$('#bottomTabContainer').append(TabContener);

}
//$("#bottomTabContainer>li.active").removeClass("active");
//Plan Window
function PlanWindow(RowNo) {
    $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
    try {

        var TabID = document.getElementById("displayStatusBottom").innerHTML;
        var repTabID = TabID.replace('ptd', '');

        //var PlanTable = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
        //var PlanTablelength = PlanTable.rows.length;
        //var totalRow = Number(document.getElementById("lastRow").innerHTML);

        //var res = "";
        ////if (totalRow <= 10) { //get row no from rowcolumn degit
        //res = repTabID.substring(0, 1);
        //}
        //else {
        //    res = repTabID.substring(0, 2);
        //}
        document.getElementById("PlanContImg").src = "";
        document.getElementById("PlanContName").innerHTML = "";
        document.getElementById("PlanContImg").src = document.getElementById('img' + RowNo).getAttribute("src");
        document.getElementById("PlanContName").innerHTML = document.getElementById('contName' + RowNo).innerHTML.replace(/'/g, '');
        //$("#TxtPlanContName").text(document.getElementById("PlanContName").innerHTML);
        document.getElementById("TxtPlanContName").value = document.getElementById("PlanContName").innerHTML;

        //var planwindowtr = "<tr id='boxtr" + TabID + "'>" + planBox + "</tr>";
        //$('#Body_windowPlanning').append(planwindowtr);
        document.getElementById("LblPlanContName").innerHTML = document.getElementById("PlanContName").innerHTML;
        document.getElementById("PlanContentType").value = document.getElementById('contType' + RowNo).innerHTML.replace(/'/g, '');
        readContentsSizes(document.getElementById("PlanContentType").value);
        document.getElementById("ContentOrientation").innerHTML = document.getElementById("PlanContentType").value;
        //find Div Scroll Height
        $("#BottomTabBar").animate({ scrollTop: 0 }, "slow");
    } catch (e) {
        alert(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

//ContentImage MouseHover/Out for Plan Window
function Planhide(PZoo) {
    document.getElementById('PlanWindowDivZommer').style.display = 'none';
}

function Planshow(PZoo) {
    document.getElementById('PlanWindowDivZommer').innerHTML = "";
    var dynaimg = "<img src='" + document.getElementById('PlanContImg').getAttribute("src").replace('.jpg', ' 1.jpg') + "' style='width:98%;height:98%'/>";
    $('#PlanWindowDivZommer').append(dynaimg);
    document.getElementById('PlanWindowDivZommer').style.display = 'block';
}

$('.zoom-in').click(function () {
    var height = document.getElementById("Zoomedimg01").clientHeight;
    height = height + 20;
    if (height >= 1000) return;
    document.getElementById("Zoomedimg01").style.height = height + "px";
});

$('.zoom-out').click(function () {
    var height = document.getElementById("Zoomedimg01").clientHeight;
    height = height - 20;
    if (height <= 500) return;
    document.getElementById("Zoomedimg01").style.height = height + "px";
});

function PlanLayoutHide() {
    //document.getElementById('PlanWindowDivZommer').style.display = 'none';
    //document.getElementById('myModalZoom').style.display = 'none';
}

//function PlanLayoutShow(PZoo) {
//    document.getElementById('PlanWindowDivZommer').innerHTML = "";
//    var xml = (new XMLSerializer).serializeToString(PZoo);
//    var dynaimg = "<img src='data:image/svg+xml;charset=utf-8," + xml + "' style='width:98%;height:98%'/>";
//    $('#PlanWindowDivZommer').append(dynaimg);
//    document.getElementById('PlanWindowDivZommer').style.display = 'block';
//}

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

//Open Bottom popup
function Bottombar(Bottom) {

    Gbl_TDQty = 0;
    var tabQty = document.getElementById(Bottom.id).innerHTML;
    tabQty = tabQty.replace('/', '');
    tabQty = tabQty.split(/(\d+)/);
    Gbl_TDQty = tabQty[1];

    if (Gbl_TDQty === "" || Gbl_TDQty === undefined || Gbl_TDQty === null || Number(Gbl_TDQty) <= 0) {
        Gbl_TDQty = 0;
        document.getElementById("PlanContQty").innerHTML = 0;
        swal({
            title: "Invalid Quantity?",
            text: "Please enter valid quantity..!",
            type: "error",
            showCancelButton: false,
            //confirmButtonColor: "#DD6B55",
            closeOnConfirm: true
        }, function () {
            document.getElementById('L' + Bottom.id).setAttribute("class", "");
            return;
        });
        document.getElementById('L' + Bottom.id).setAttribute("class", "");
        return;
    }
    else {
        document.getElementById("PlanContQty").innerHTML = Gbl_TDQty;
    }

    var Bottompopup = document.getElementById('BottomTabBar');
    var Bottomoverlay = document.getElementById('MYbackgroundOverlay');
    var BottomopenButton = document.getElementById(Bottom.id);
    document.getElementById("displayStatusBottom").innerHTML = Bottom.id;

    document.onclick = function (e) {
        //if (e.target.id !== 'BottomTabBar') {
        //    document.getElementById('RightTabBar').style.width = "0px";
        //    document.getElementById('mySidenav').style.width = "0px";
        //    Bottompopup.style.height = "0px";
        //    Bottomoverlay.style.display = 'none';
        //    document.getElementById('L' + Bottom.id).setAttribute("class", "");
        //}
        if (e.target === BottomopenButton) {
            //document.getElementById('RightTabBar').style.width = "0px";
            //document.getElementById('mySidenav').style.width = "0px";
            Bottompopup.style.height = "92.5%";
            Bottomoverlay.style.display = 'block';
            //document.getElementById('L' + Bottom.id).setAttribute("class", "active");
            document.getElementById('RightSETTINGS_LI').setAttribute("class", "");
            document.getElementById('TabquotationDetails_LI').setAttribute("class", "");

            var totalCols = Number(document.getElementById("lastCol").innerHTML);
            var RowNo = "";
            var tabID = Bottom.id.split(/(\d+)/)[1];
            if (totalCols < 10 && tabID.length < 3) { //get row no from rowcolumn degit
                RowNo = tabID.substring(0, 1);
                //RowNo = tabID.slice(0, -1);
            }
            else {
                RowNo = tabID.substring(0, 2);
            }

            PlanWindow(RowNo);
        }
    };
}

//Close Bottom popup
function closeBottomTabBar() {
    var optabID = document.getElementById('displayStatusBottom').innerHTML;
    document.getElementById("BottomTabBar").style.height = "0";
    document.getElementById("BottomTabBar").style.display = "none";
    if ((document.getElementById('RightTabBar').style.width === "" || document.getElementById('RightTabBar').style.width === "0px") && (document.getElementById('mySidenav').style.width === "" || document.getElementById('mySidenav').style.width === "0px")) {
        document.getElementById('MYbackgroundOverlay').style.display = 'none';
    }
    else {
        document.getElementById('MYbackgroundOverlay').style.display = 'block';
    }
    //document.getElementById('MYbackgroundOverlay').style.display = 'none';
    //document.getElementById('L' + optabID).setAttribute("class", "");
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
        if (contType !== "WiroBookPages" && getid.id === "JobNoOfPages" && contType.includes("Pages")) {
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

$("#Body_windowPlanning").keypress(function (e) {
    if (e.keyCode === 13)
        $("#PlanButton").click();
});

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
    //$('#PlanGripper').keypress(function (event) {
    //    return isNumber(event, this);
    //});

    $('.forTextBox').keypress(function (event) {
        if (this.id !== "TxtProjectName" && this.id !== "JobName" && this.id !== "ArtWorkCode" && this.id !== "Txt_Content_Name" && this.id !== "TxtConsigneeName" && this.id !== "TxtCloneContent" && this.id !== "TxtCommentTitle") {
            if (this.type === "text" && event.which !== 13 && event.which !== 34 && event.which !== 39) {
                return isNumber(event, this);
            }
        }
    });

    $('#TxtPlanContName').keyup(function (event) {
        if (this.value.trim() === "") this.value = document.getElementById("PlanContName").innerHTML;
    });

    $('#TxtPlanContName').focusout(function () {
        try {
            if (this.value.trim() === "") this.value = document.getElementById("PlanContName").innerHTML;
            if (document.getElementById("PlanContName").innerHTML.trim() === this.value.trim()) return;
            if (CheckDuplicateContName(this.value.trim())) {
                this.value = document.getElementById("PlanContName").innerHTML;
                return;
            }
            renameContentsData(this.value.trim(), document.getElementById("PlanContName").innerHTML, document.getElementById("ContentOrientation").innerHTML);
            document.getElementById("PlanContName").innerHTML = this.value.trim();
            document.getElementById("LblPlanContName").innerHTML = this.value.trim();

            var displayStatusBottom = document.getElementById("displayStatusBottom").innerHTML.trim().split(/(\d+)/);
            document.getElementById("contName" + displayStatusBottom[1].charAt(0)).innerHTML = this.value.trim();

        } catch (e) {
            console.log(e);
        }
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
    ////if ((event.target.id === "JobFoldedH") || (event.target.id === "Txt_Fold_In_Height")) {
    ////    var FH = document.getElementById("JobFoldedH").value;
    ////    var FIH = document.getElementById("Txt_Fold_In_Height").value;
    ////    document.getElementById("SizeHeight").value = FIH * FH;
    ////} else if ((event.target.id === "JobFoldedL") || (event.target.id === "Txt_Fold_In_Length")) {
    ////    var FL = document.getElementById("JobFoldedL").value;
    ////    var FIL = document.getElementById("Txt_Fold_In_Length").value;
    ////    document.getElementById("SizeLength").value = FIL * FL;
    ////}
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

$("#largeModal").keypress(function (e) {
    if (e.keyCode === 13)
        $("#Btn_Select_Content").click();
});

function DownloadSvg(e) {
    var a = document.createElement('a');
    a.href = 'data:image/svg+xml;utf8,' + unescape($('#svg_Shape_Container')[0].outerHTML);
    a.download = 'PlanLayout.svg';
    a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

$("#SbClientName").dxSelectBox({
    items: [],
    placeholder: "Select Client Name",
    displayExpr: 'LedgerName',
    valueExpr: 'LedgerId',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        //var previousValue = e.element.context.id; ////Fetch current selectbox ID               
        // Event handling commands go here
        GetConsignee(e.value);
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Client name is required' }]
});

$("#SbCategory").dxSelectBox({
    items: [],
    placeholder: "Select Category",
    displayExpr: 'CategoryName',
    valueExpr: 'CategoryId',
    searchEnabled: true,
    showClearButton: true,
    onValueChanged: function (e) {
        var validate = window.location.href.includes("BookingID");
        if (validate === false) {
            //GetCategorizedProcess(e.value, "Reactangle");
            AddCategoryWiseContents(e.value);
        }
    }
}).dxValidator({
    validationRules: [{ type: 'required', message: 'Category is required' }]
});

$(".reloadcategory").click(function () {
    $.ajax({                //// For Category
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetSbCategory',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#SbCategory").dxSelectBox({ items: RES1 });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
});

$(".reloadclient").click(function () {
    $.ajax({                //// For Client
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetSbClient',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: {},
        crossDomain: true,
        success: function (results) {
            if (results.d === "500") return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.replace(/u0026/g, '&');
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            $("#SbClientName").dxSelectBox({ items: RES1 });
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
});

$(".reloadclient").click();
$(".reloadcategory").click();

$("#dxDateQuotation").dxDateBox({
    type: "date",
    displayFormat: 'dd-MMM-yyyy',
    value: new Date().toISOString().substr(0, 10),
    max: new Date().toISOString().substr(0, 10),
    disabled: true
});

function GetQuoationNo(BKID) {
    $.ajax({                //// New Quotation No
        type: 'post',
        url: 'WebServicePlanWindow.asmx/GetQuoteNo',
        dataType: 'text',
        contentType: "application/json; charset=utf-8",
        data: '{BKID:' + BKID + '}',
        crossDomain: true,
        success: function (results) {
            //var res = results.replace(/\\/g, '');
            //res = res.substr(1);
            //res = res.slice(0, -1);
            var RES1 = JSON.parse(results);
            document.getElementById("QuotationNo").value = RES1.d;
        },
        error: function errorFunc(jqXHR) {
            // alert("not show");
        }
    });
}

function onChangeUpdatePer(objID) {
    var PlanTable = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells;
    var id = objID.split(/(\d+)/); ////split string id and number;
    if (id[0] === "FinalDiscPer") {
        if (Number(document.getElementById(objID).value) > 0) {
            DevExpress.ui.notify("Disount percentage must be in negative number..!", "warning", 1500);
            document.getElementById(objID).value = 0;
        }
    } else {
        if (Number(document.getElementById(objID).value) < 0) {
            DevExpress.ui.notify("Value must be in postive number..!", "warning", 1500);
            document.getElementById(objID).value = 0;
        }
    }
    for (var c = 1; c < PlanTable.length; c++) {
        try {
            document.getElementById(id[0] + c).value = Number(document.getElementById(objID).value);
            onChangeCalcAmount(id[0] + c);
        } catch (e) {
            continue;
        }
    }
}

function onChangeCalcAmount(objID) {
    try {

        var value = Number(document.getElementById(objID).value);
        //num sep  obj.id.match(/\d+/g);
        var PTRows = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows;
        var PlanTable = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells;
        if (objID.includes("FinalDiscPer")) {
            if (Number(value) > 0) {
                DevExpress.ui.notify("Disount percentage must be in negative..!", "error", 1500);
                document.getElementById(objID).value = 0;
            }
        }
        //var parent_ = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].parentNode.parentNode.querySelectorAll("input");
        //for (var i = 0; i < parent_.length; i++) {
        //    alert(parent_[i].getAttribute("id"));
        //}

        for (var c = 1; c < PlanTable.length; c++) {
            var finAmt = 0;
            for (var r = 2; r <= PTRows.length; r++) {
                try {
                    if (Number(document.getElementById("txtqty" + c).value) > 0) {
                        if (document.getElementById("Plan" + r + c).innerHTML.includes("Click Me to plan..") === false && document.getElementById("tr" + r).className !== "HideColumn") {
                            finAmt = finAmt + Number(document.getElementById("finalCstSpan" + r + c).innerHTML);
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            document.getElementById("FinaltotalCost" + c).innerHTML = finAmt.toFixed(3);
        }

        for (var t = 1; t < PlanTable.length; t++) {
            try {
                if (document.getElementById("FinalShipperCost" + t).value === "") {
                    document.getElementById("FinalShipperCost" + t).value = 0;
                }
                var finalCost = Number(document.getElementById("FinaltotalCost" + t).innerHTML);
                var TaxableAmt = Number(finalCost);

                value = Number(document.getElementById("FinalMiscPer" + t).value);
                var amt = finalCost / 100 * value;
                amt = Number(amt).toFixed(3);
                document.getElementById("FinalMiscCost" + t).value = amt;
                TaxableAmt = TaxableAmt + parseFloat(amt) + parseFloat(document.getElementById("FinalShipperCost" + t).value);

                value = Number(document.getElementById("FinalPftPer" + t).value);
                amt = TaxableAmt / 100 * value;
                amt = Number(amt).toFixed(3);
                document.getElementById("FinalProfitCost" + t).value = amt;
                TaxableAmt = TaxableAmt + parseFloat(amt);

                value = Number(document.getElementById("FinalDiscPer" + t).value);
                amt = TaxableAmt / 100 * value;
                amt = Number(amt).toFixed(3);
                document.getElementById("FinalDisCost" + t).value = amt;
                TaxableAmt = TaxableAmt + parseFloat(amt);

                value = Number(document.getElementById("FinalTaxPer" + t).value);
                amt = TaxableAmt / 100 * value;
                amt = Number(amt).toFixed(3);
                document.getElementById("FinalTaxCost" + t).value = amt;
            } catch (e) {
                continue;
            }
            sumAllCost(t);
        }
        setFinalCostType(document.getElementById("lblUnitCost"));

    } catch (e) {
        alert(e);
    }
}

function onchangeQuotedCost() {
    var PlanTable = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells;
    try {
        for (var t = 1; t < PlanTable.length; t++) {
            calQuotedCost(t);
        }
    } catch (e) {
        alert(e);
    }
}

function sumAllCost(colS) {
    try {

        if (Number(document.getElementById("txtqty" + colS).value) <= 0) return;
        document.getElementById("FinalGrandTotalCost" + colS).innerHTML = Number(Number(document.getElementById("FinaltotalCost" + colS).innerHTML) + Number(document.getElementById("FinalMiscCost" + colS).value) + Number(document.getElementById("FinalShipperCost" + colS).value)
            + Number(document.getElementById("FinalProfitCost" + colS).value) + Number(document.getElementById("FinalDisCost" + colS).value) + Number(document.getElementById("FinalTaxCost" + colS).value)).toFixed(3);

        var unitCost = Number(Number(document.getElementById("FinalGrandTotalCost" + colS).innerHTML) / Number(document.getElementById("txtqty" + colS).value)).toFixed(3);

        document.getElementById("FinalUnitCost" + colS).innerHTML = unitCost;
        document.getElementById("FinalfinalCost" + colS).value = unitCost;
        document.getElementById("FinalUnitThCost" + colS).innerHTML = Number(Number(unitCost) * 1000).toFixed(3);

        //calQuotedCost(colS)
    } catch (e) {
        console.log(e);
    }
}

function calQuotedCost(colS) {

    if (Number(document.getElementById("TxtCurrencyValue").value) <= 0) {
        document.getElementById("TxtCurrencyValue").value = 1;
        document.getElementById("FinalQuotedCost" + colS).value = 0;
        return;
    }
    var QuotedCost = Number(Number(document.getElementById("FinalfinalCost" + colS).value) / Number(document.getElementById("TxtCurrencyValue").value)).toFixed(3);

    document.getElementById("FinalQuotedCost" + colS).value = QuotedCost;
    //document.getElementById("HQuotedCost").value = document.getElementById("FinalQuotedCost1").value;
    //document.getElementById("HFinalCost").value = document.getElementById("FinalfinalCost1").value;
    var trID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].id;
    if (document.getElementById(trID).className !== "HideColumn") {
        document.getElementById("HQuotedCost").value = document.getElementById("FinalQuotedCost" + colS).value;
        document.getElementById("HFinalCost").value = document.getElementById("FinalfinalCost" + colS).value;
    }
}

function setFinalCostType(e) {
    $("#lblUnitCost").removeClass("selected-finalize");
    $("#lblGrandTotalCost").removeClass("selected-finalize");
    $("#lblUnitThCost").removeClass("selected-finalize");
    $("#" + e.id).addClass("selected-finalize");

    document.getElementById("HTypeOfCost").value = e.id.replace('lbl', '');
    var PlanTableCell = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[0].cells;
    var id = e.id.replace('lbl', 'Final');
    for (var t = 1; t < PlanTableCell.length; t++) {
        try {
            if (Number(document.getElementById(id + t).innerHTML) > 0 && Number(document.getElementById("txtqty" + t).value) > 0) {
                document.getElementById("FinalfinalCost" + t).value = Number(document.getElementById(id + t).innerHTML);
                document.getElementById("HFinalCost").value = Number(document.getElementById(id + "1").innerHTML);
                document.getElementById("HQuotedCost").value = Number(document.getElementById("FinalQuotedCost1").value);
                calQuotedCost(t);
            }
        } catch (e) {
            continue;
        }
    }
}

$("#ChkPlanInStandardSizePaper").dxCheckBox({
    value: false,
    text: "Plan In Standard Size Paper"
});
$("#ChkPlanInAvailableStock").dxCheckBox({
    value: false,
    text: "Plan In Available stock"
});
$("#ChkPlanInSpecialSizePaper").dxCheckBox({
    value: true,
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

$("#BtnNotification").click(function () {
    var commentData = "";
    var newHtml = '';

    document.getElementById("commentbody").innerHTML = "";
    if (BookingID !== "" && BookingID !== undefined && BookingID !== null && BookingID !== 0) {
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/GetCommentData",
            data: '{PriceApprovalID:0,OrderBookingIDs:0,ProductMasterID:0,JobBookingID:0,BookingID:' + JSON.stringify(BookingID) + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = results.replace(/\\/g, '');
                res = res.replace(/"d":""/g, '');
                res = res.replace(/""/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                commentData = JSON.parse(res);
                if (commentData.length > 0) {
                    console.log(commentData);
                    for (var x = 0; x < commentData.length; x++) {
                        newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                        newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                    }
                }
                $("#commentbody").append(newHtml);
                $(".commentInput").show();
            }
        });
    } else {
        $(".commentInput").hide();
    }

    document.getElementById("BtnNotification").setAttribute("data-toggle", "modal");
    document.getElementById("BtnNotification").setAttribute("data-target", "#CommentModal");
});

$(function () {
    $("#BtnSaveComment").click(function () {
        if (BookingID === "" || BookingID === null || BookingID === undefined || BookingID === 0) {
            alert("Please select valid estimate to save comment details..!");
            return false;
        }

        var commentTitle = document.getElementById("TxtCommentTitle").value.trim();
        var commentDesc = document.getElementById("TxtCommentDetail").value.trim();
        var commentType = $('#selCommentType').dxSelectBox('instance').option('value');
        if (commentTitle === undefined || commentTitle === "" || commentTitle === null || commentType === undefined || commentType === "" || commentType === null || commentDesc === undefined || commentDesc === null || commentDesc === "") {
            alert("Please enter valid comment title and description..!");
            return false;
        }

        var jsonObjectCommentDetail = [];
        var objectCommentDetail = {};

        objectCommentDetail.CommentDate = new Date();
        objectCommentDetail.ModuleID = 0;
        objectCommentDetail.ModuleName = "Estimation";
        objectCommentDetail.CommentTitle = commentTitle;
        objectCommentDetail.CommentDescription = commentDesc;
        objectCommentDetail.CommentType = commentType;
        objectCommentDetail.TransactionID = BookingID;
        objectCommentDetail.BookingID = BookingID;

        jsonObjectCommentDetail.push(objectCommentDetail);
        jsonObjectCommentDetail = JSON.stringify(jsonObjectCommentDetail);
        $.ajax({
            type: "POST",
            url: "WebServicePlanWindow.asmx/SaveCommentData",
            data: '{jsonObjectCommentDetail:' + jsonObjectCommentDetail + '}',
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (results) {
                var res = JSON.stringify(results);
                res = res.replace(/"d":/g, '');
                res = res.replace(/{/g, '');
                res = res.replace(/}/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                //if (res == "Success") {
                // RadioValue = "Pending Requisitions";
                alert("Comment Saved!", "Comment saved successfully.", "success");
                var commentData = "";
                var newHtml = '';
                if (BookingID === "" || BookingID === null || BookingID === undefined || BookingID === 0) {
                    alert("Please select valid estimation to view comment details..!");
                    return false;
                }
                document.getElementById("commentbody").innerHTML = "";
                if (BookingID !== "") {
                    $.ajax({
                        type: "POST",
                        url: "WebServicePlanWindow.asmx/GetCommentData",
                        data: '{PriceApprovalID:0,OrderBookingIDs:0,ProductMasterID:0,JobBookingID:0,BookingID:' + JSON.stringify(BookingID) + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "text",
                        success: function (results) {
                            var res = results.replace(/\\/g, '');
                            res = res.replace(/"d":""/g, '');
                            res = res.replace(/""/g, '');
                            res = res.substr(1);
                            res = res.slice(0, -1);
                            commentData = JSON.parse(res);
                            if (commentData.length > 0) {
                                console.log(commentData);
                                for (var x = 0; x < commentData.length; x++) {
                                    newHtml = newHtml + '<div style="width:100%"><b style="text-align: left; color: red; float: left; margin-top: 5px;width: 100%">' + (x + 1) + '. ' + commentData[x].ModuleName + ', Title : ' + commentData[x].CommentTitle + ', Type : ' + commentData[x].CommentType + '</b>';
                                    newHtml = newHtml + '<p style="text-align: left; margin-top: 2px; float: left; margin-left: 20px">' + commentData[x].CommentDescription + '</p><span style="float: right">Comment By : ' + commentData[x].UserName + '</span></div>';
                                }
                            }
                            $("#commentbody").append(newHtml);
                            $(".commentInput").show();
                        }
                    });
                }
            },
            error: function errorFunc(jqXHR) {
                swal("Error!", "Please try after some time..", "");
                alert(jqXHR);
            }
        });
    });
});

function AddCategoryWiseContents(CID) {
    try {
        $.ajax({
            type: 'POST',
            async: false,
            url: "WebServicePlanWindow.asmx/LoadCategoryWiseContents",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: "{'CID': " + CID + "}",
            success: function (results) {
                if (results.d === "500") return;
                var res = results.d.replace(/\\/g, '');
                res = res.substr(1);
                res = res.slice(0, -1);
                var RES1 = JSON.parse(res.toString());
                if (RES1.length > 0) {

                    var tBodyContent = document.getElementById("Body_Planning");
                    var BodyLength = tBodyContent.rows.length;

                    if (BodyLength > 1) {

                        var FlagWrongCategoryContent = true;
                        var ForID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
                        ForID = ForID.rows.length;

                        for (var ex = 2; ex <= ForID; ex++) {
                            var TblBody = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
                            var EnableTR = TblBody.rows[ex - 1].className;

                            if (EnableTR === "") {
                                var tdID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[ex - 1].cells[0].id;
                                tdID = tdID.replace('p', '');
                                var excn = "contType" + tdID;
                                for (var j = 0; j < RES1.length; j++) {
                                    if (document.getElementById(excn).innerHTML === RES1[j].PlanContentType) {
                                        FlagWrongCategoryContent = false;
                                        continue;
                                    }
                                }
                            }
                        }

                        if (FlagWrongCategoryContent === true) {
                            swal({
                                title: "Wrong Category Selection..",
                                text: "As per your category wise content allocation this category is not suitable,\n please check your category or you want to remove your plans ?",
                                type: "warning",
                                showCancelButton: true,
                                //confirmButtonColor: "#DD6B55",
                                closeOnConfirm: true
                            }, function () {
                                for (var j = 0; j < BodyLength; j++) {
                                    if (j > 0) {
                                        document.getElementById("Body_Planning").deleteRow(1);
                                    }
                                }
                                removeAllContentsData();
                                removeContGrid(RES1);
                                return;
                            });
                        }
                    } else {
                        removeContGrid(RES1);
                    }
                }
            },
            error: function errorFunc(jqXHR) {
                // alert(jqXHR.message);
            }
        });
    } catch (e) {
        alert(e);
    }
}

function removeContGrid(RES1) {
    document.getElementById('lastCol').innerHTML = 0;
    document.getElementById('lastRow').innerHTML = 1;
    document.getElementById('Bdy_QtyRow').innerHTML = "";
    document.getElementById('FinalCostDivFooter').innerHTML = "";
    $("#Add_Quantity_Button").click();
    document.getElementById("txtqty1").value = 1000;

    for (var i = 0; i < RES1.length; i++) {
        document.getElementById("Txt_Content_Name").value = RES1[i].PlanContName;
        document.getElementById("PlanContentType").value = RES1[i].PlanContentType;
        document.getElementById("Txt_ContentImgSrc").value = "images/Contents/" + RES1[i].PlanContName + ".jpg";

        $("#Btn_Select_Content").click();
    }
}
//$("[id*=FinalfinalCost]").keypress(function (event) {
//    return isNumber(event, this);
//});

//$("#TxtCurrencyValue").keypress(function (event) {
//    onchangeQuotedCost();
//});

function CheckDuplicateContName(ContName) {

    var ForID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];
    ForID = ForID.rows.length;

    for (var ex = 2; ex <= ForID; ex++) { //Content All ready Exist
        var TblBody = document.getElementById("PlanTable").getElementsByTagName("tbody")[0];//*            
        var EnableTR = TblBody.rows[ex - 1].className;//*

        if (EnableTR === "") {//*
            var tdID = document.getElementById("PlanTable").getElementsByTagName("tbody")[0].rows[ex - 1].cells[0].id;
            tdID = tdID.replace('p', '');
            var excn = "contName" + tdID;

            if (document.getElementById(excn).innerHTML.replace(/'/g, '') === ContName) {
                alert("This Content Name already Exist..Please choose another Content Name..");
                return true;
            }
        }
    }
    return false;
}

//Advance options selection hide and show using class pKp
$('.advanced').click(function () {
    if ($('.advancedOptions').is(':hidden')) {
        $('.advancedOptions').show();
        $('.advanced').text("X");
    } else {
        $('.advancedOptions').hide();
        $('.advanced').text("Advance Options");
    }
});


$("#BtnKeyLine").click(function () {
    var ObjData = {};

    var JobH = Number(document.getElementById("SizeHeight").value);
    var JobL = Number(document.getElementById("SizeLength").value);
    var JobW = Number(document.getElementById("SizeWidth").value);
    var JobOpenFlap = Number(document.getElementById("SizeOpenflap").value);
    var JobPastingFlap = Number(document.getElementById("SizePastingflap").value);
    var JobBottomFlap = Number(document.getElementById("SizeBottomflap").value);

    var JobTrimmingL = Number(document.getElementById("Trimmingleft").value);
    var JobTrimmingR = Number(document.getElementById("Trimmingright").value);
    var JobTrimmingT = Number(document.getElementById("Trimmingtop").value);
    var JobTrimmingB = Number(document.getElementById("Trimmingbottom").value);
    var StrippingMarginL = Number(document.getElementById("Stripingleft").value);
    var StrippingMarginR = Number(document.getElementById("Stripingright").value);
    var StrippingMarginT = Number(document.getElementById("Stripingtop").value);
    var StrippingMarginB = Number(document.getElementById("Trimmingbottom").value);

    ObjData.Content_Type = document.getElementById("ContentOrientation").innerHTML.trim();
    //ObjData.InterlockStyle = GblPlanValues.InterlockStyle;
    ObjData.Color_Strip = Number(document.getElementById("PlanColorStrip").value);
    ObjData.Gripper = GblPlanValues.Gripper;
    var GripperSide = GblPlanValues.GripperSide;
    if (GripperSide === "H") GripperSide = "T";
    ObjData.Gripper_Side = GripperSide;
    var CutSize = GblPlanValues.CutSize.split("x");

    ObjData.Printing_Sheet_Size_L = CutSize[0];
    ObjData.Printing_Sheet_Size_W = CutSize[1];
    ObjData.Grain_Direction = GblPlanValues.GrainDirection;
    //ObjData.PrintingStyle = GblPlanValues.PrintingStyle;
    ObjData.Job_Trimming_L = JobTrimmingL;
    ObjData.Job_Trimming_R = JobTrimmingR;
    ObjData.Job_Trimming_T = JobTrimmingT;
    ObjData.Job_Trimming_B = JobTrimmingB;
    ObjData.Stripping_L = StrippingMarginL;
    ObjData.Stripping_R = StrippingMarginR;
    ObjData.Stripping_T = StrippingMarginT;
    ObjData.Stripping_B = StrippingMarginB;
    ObjData.Job_L = JobL;
    ObjData.Job_H = JobH;
    ObjData.Job_W = JobW;
    ObjData.Job_Open_Flap = JobOpenFlap;
    ObjData.Job_Pasting_Flap = JobPastingFlap;
    ObjData.Bottom_Flap = JobBottomFlap;
    ObjData.Ups_L = GblPlanValues.UpsL;
    ObjData.Ups_H = GblPlanValues.UpsW;
    var ArrObjData = [];
    ArrObjData.push(ObjData);

    $.ajax({
        type: 'POST',
        url: "WebServicePlanWindow.asmx/LoadKeyline",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{'ObjData': " + JSON.stringify(ArrObjData) + "}",
        success: function (results) {
            if (results.d.includes("Error")) return;
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            if (Number(results.d) > 0) {
                var url = "http://keyline.indusanalytics.co.in/KeyLineInMM.aspx?keylineID=" + results.d;
                window.open(url, "_blank", "height=" + window.innerHeight + ",width=" + window.innerWidth + ",scrollbars=yes,status=no", true);
            }
        }
    });
});
