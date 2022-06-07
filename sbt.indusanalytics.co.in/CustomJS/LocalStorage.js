////********************************************** $$$ Added By pKp $$$ **************************************////

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

var db;
////************For Delete all old Indexeddb database Start 
var DBDeleteRequest = window.indexedDB.deleteDatabase("localstore");
DBDeleteRequest.onerror = function (event) {
    console.log("Error deleting database.");
};
DBDeleteRequest.onsuccess = function (event) {
    //console.log("Database deleted successfully");
    OpenIdb();
};
////************Delete Indexeddb database End

function OpenIdb() {
    ////Not support? Go in the corner and pout.
    var openRequest = window.indexedDB.open("localstore", 1);

    openRequest.onupgradeneeded = function (e) {
        var thisDB = e.target.result;
        //console.log("running onupgradeneeded");
        CreateObjectStore(thisDB);
    };
    openRequest.onsuccess = function (e) {
        console.log("running onsuccess IndexedDB");
        db = e.target.result;
        CreateObjectStore(db);
        //  console.dir(db.objectStoreNames);
        //try {
        //    //removeAllContentsData();
        //} catch (e) {
        //    console.log(e);
        //}
    };
    openRequest.onerror = function (e) {
        console.log("onerror!");
        console.dir(e);
    };
}

function CreateObjectStore(thisDB) {
    var Plan_Store;
    try {

        if (!thisDB.objectStoreNames.contains("JobOperation")) {
            Plan_Store = thisDB.createObjectStore("JobOperation", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobContentsForms")) {
            Plan_Store = thisDB.createObjectStore("JobContentsForms", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobContents")) {
            Plan_Store = thisDB.createObjectStore("JobContents", { keyPath: "PlanContentName", autoIncrement: false });
        }
        if (!thisDB.objectStoreNames.contains("ContentsSizeValues")) {
            Plan_Store = thisDB.createObjectStore("ContentsSizeValues", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("ContentsOprations")) {
            Plan_Store = thisDB.createObjectStore("ContentsOprations", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobPlan")) {
            Plan_Store = thisDB.createObjectStore("JobPlan", { keyPath: "id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobContentsSizes")) {  // content type wise sizes 
            Plan_Store = thisDB.createObjectStore("JobContentsSizes", { keyPath: "PlanContentType", autoIncrement: false });
        }
        if (!thisDB.objectStoreNames.contains("TableSelectedPlan")) {
            Plan_Store = thisDB.createObjectStore("TableSelectedPlan", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobContentsMaterialRequired")) {
            Plan_Store = thisDB.createObjectStore("JobContentsMaterialRequired", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobContentsInkShades")) {
            Plan_Store = thisDB.createObjectStore("JobContentsInkShades", { keyPath: "Id", autoIncrement: true });
        }
        if (!thisDB.objectStoreNames.contains("JobContentsFormsDetails")) {
            Plan_Store = thisDB.createObjectStore("JobContentsFormsDetails", { keyPath: "Id", autoIncrement: true });
        }
    } catch (e) {
        console.dir(e);
    }
}
/**
 * //local store job sizes content type wise
 * @param {Array} Save_Sizes as array
 */
function saveContentsSizes(Save_Sizes) {
    //store job size details content name wise
    var transaction = db.transaction(["JobContentsSizes"], "readwrite");
    var store = transaction.objectStore("JobContentsSizes");
    if (store) {
        var request = store.put(Save_Sizes);

        request.onsuccess = function (ev) {
            //console.log("Contents Data added finished..");
        };
        request.onerror = function (ev) {
            //console.log("Failed to add contents record." + "  Error: " + ev.message);
        };
    }
}

function readContentsSizes(ContType) {
    //    var transaction = db.transaction(["JobContentsSizes"]);
    var objectStore = db.transaction(["JobContentsSizes"]).objectStore("JobContentsSizes");
    var request = objectStore.get(ContType);

    request.onsuccess = function (event) {
        // display job sizes content with the request.result!
        if (request.result) {
            try {
                document.getElementById("JobPrePlan").required = false;
                document.getElementById("JobPrePlan").style.display = "none";
                document.getElementById("JobPrePlan").value = "";

                $('#PaperTrim input').each(function () {
                    if (this.type === "text" || this.type === "number") {
                        document.getElementById(this.id).value = "";
                    }
                });

                $('#planJob_Size input').each(function () {
                    if (this.id === "") return;
                    if (this.type === "text" || this.type === "number") {
                        document.getElementById(this.id).required = false;
                        document.getElementById(this.id).style.display = "none";
                        document.getElementById(this.id).value = "";
                        if ((this.id === "JobFoldInL" || this.id === "JobFoldInH") && ContType === "Brochure") {
                            document.getElementById(this.id).value = 1;
                        }
                    }
                });

                for (var key in request.result) {
                    if (request.result.hasOwnProperty(key)) {
                        if (ContType !== request.result[key]) {
                            document.getElementById(key).style.display = "block";
                            var title = key.replace(/([A-Z])/g, ' $1').trim(); // document.getElementById(key).placeholder;

                            document.getElementById(key).required = true;
                            if ((ContType === "WiroPrePlannedSheet" || ContType.includes("Leaves") || ContType.includes("WrintingPad")) && key === "JobNoOfPages") {
                                title = "No of Leaves";
                                document.getElementById(key).name = "Leaves";
                            } else if (key === "JobTongHeight" && ContType === "WebbedSelfLockingTray") {
                                title = "Wall Width";
                                document.getElementById(key).required = false;
                                document.getElementById(key).name = title;
                            } else if (key === "JobNoOfPages" && ContType === "WeddingCardSets") {
                                title = "No of Sets";
                                document.getElementById(key).name = "Sets";
                            }

                            document.getElementById(key).title = title;
                            document.getElementById(key).placeholder = title.replace('Job', '');
                            if (ContType.includes("PrePlannedSheet")) {
                                document.getElementById("JobPrePlan").required = true;
                                document.getElementById("JobPrePlan").style.display = "block";
                            }
                        }
                    }
                }

                readContentsSizeValues(ContType);
            } catch (e) {
                DevExpress.ui.notify(e.message, "error", 500);
            }
        } else {
            try {
                $.ajax({
                    type: 'post',
                    url: 'WebServicePlanWindow.asmx/GetContentSize',
                    data: '{ContName:' + JSON.stringify(ContType) + '}',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    crossDomain: true,
                    success: function (results) {
                        var res = results.d.replace(/\\/g, '');
                        res = res.substr(1);
                        res = res.slice(0, -1);
                        if (res === "[]") {
                            DevExpress.ui.notify("No data founds..!", "warning", 500);
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            return false;
                        }
                        var RES1 = JSON.parse(res);
                        if (RES1.length < 1) {
                            DevExpress.ui.notify("Please select content again..!", "warning", 500);
                            $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        } else {
                            try {
                                var contSize = {};
                                RES1 = RES1[0].ContentSizes.split(',');
                                contSize.PlanContentType = ContType;
                                for (var rs in RES1) {
                                    contSize[RES1[rs]] = RES1[rs];
                                }
                                saveContentsSizes(contSize);
                                readContentsSizes(ContType);
                            } catch (e) {
                                console.log(e);
                                $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                            }
                        }
                    },
                    error: function errorFunc(jqXHR) {
                        DevExpress.ui.notify("" + jqXHR.statusText + "", "error", 500);
                    }
                });
            } catch (e) {
                DevExpress.ui.notify("" + e.message + "", "error", 500);
            }
        }
    };
    request.onerror = function (ev) {
        console.log("Failed to add contents record." + "  Error: " + ev.message);
    };
}

/**
 * //local store job size details content type wise
 * @param {Array} InputValues as array
 */
function saveContentsSizeValues(InputValues) {
    try {
        var flag = false;
        var objectStore = db.transaction("ContentsSizeValues").objectStore("ContentsSizeValues");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContentType === InputValues.PlanContentType && cursor.value.PlanContName === InputValues.PlanContName && Number(cursor.value.PlanContQty) === InputValues.PlanContQty) {
                    var uid = cursor.value.Id;
                    var request = db.transaction(["ContentsSizeValues"], "readwrite").objectStore("ContentsSizeValues");
                    InputValues.Id = uid;
                    var objectStoreRequest = request.put(InputValues);  //delete(uid); //
                    flag = true;
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");                    
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in remove data " + event.message + "");
                    };
                    return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");
                if (flag === false) {
                    var store = db.transaction(["ContentsSizeValues"], "readwrite").objectStore("ContentsSizeValues");
                    if (store) {
                        var requestadd;
                        if (InputValues.Id === 0 || InputValues.Id === undefined && flag === false) {
                            requestadd = store.add(InputValues);
                        } else {
                            requestadd = store.put(InputValues);
                        }
                        requestadd.onsuccess = function (ev) {
                            //console.log("Contents Data added finished.." + ev);
                        };
                        requestadd.onerror = function (ev) {
                            console.log("Failed to add contents record." + "  Error: " + ev.message);
                        };
                    }
                }
            }
        };

    } catch (e) {
        console.log(e);
    }
}

/**
 * //local store Input Content Oprations details
 * @param {Array} InputValues as array
 */
function saveContentsOprations(InputValues) {
    try {
        //var flag = false;
        var PlanContName = document.getElementById("PlanContName").innerHTML;
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML;

        var objectStore = db.transaction("ContentsOprations").objectStore("ContentsOprations");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var uid = cursor.value.Id;
                    var request = db.transaction(["ContentsOprations"], "readwrite").objectStore("ContentsOprations");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in remove input operations data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        if (InputValues.length > 0) {
            InputValues.PlanContQty = PlanContQty;
            InputValues.PlanContentType = PlanContentType;
            InputValues.PlanContName = PlanContName;
            var transaction = db.transaction(["ContentsOprations"], "readwrite");
            var store = transaction.objectStore("ContentsOprations");
            if (store) {
                var request = store.put(InputValues);
                request.onsuccess = function (ev) {
                    //console.log("Input operations Data added finished..");
                };
                request.onerror = function (ev) {
                    console.log("Failed to add input operations record." + "  Error: " + ev.message);
                };
            }
        }

    } catch (e) {
        console.log(e);
    }
}


/**
 * //local store ink shades details content type wise
 * @param {Array} InputValues as array
 */
async function saveInkShadesDetails(InputValues) {
    try {
        //var flag = false;
        var PlanContName = document.getElementById("PlanContName").innerHTML;
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML;

        var objectStore = db.transaction("JobContentsInkShades").objectStore("JobContentsInkShades");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var uid = cursor.value.Id;
                    var request = db.transaction(["JobContentsInkShades"], "readwrite").objectStore("JobContentsInkShades");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in remove ink shades data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        if (InputValues.length > 0) {
            InputValues.PlanContQty = PlanContQty;
            InputValues.PlanContentType = PlanContentType;
            InputValues.PlanContName = PlanContName;
            var transaction = db.transaction(["JobContentsInkShades"], "readwrite");
            var store = transaction.objectStore("JobContentsInkShades");
            if (store) {
                var request = store.put(InputValues);
                request.onsuccess = function (ev) {
                    //console.log("Input operations Data added finished..");
                };
                request.onerror = function (ev) {
                    console.log("Failed to add ink shades record." + "  Error: " + ev.message);
                };
            }
        }

    } catch (e) {
        console.log(e);
    }
}

async function saveMaterialsRequirement(InputValues) {
    try {
        //var flag = false;

        var PlanContName = document.getElementById("PlanContName").innerHTML;
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML;

        var objectStore = db.transaction("JobContentsMaterialRequired").objectStore("JobContentsMaterialRequired");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var uid = cursor.value.Id;
                    for (var i = 0; i < cursor.value.length; i++) {
                        for (var k = 0; k < InputValues.length; k++) {
                            if (Number(InputValues[k].ItemGroupNameID) === cursor.value[i].ItemGroupNameID) {
                                uid = cursor.value.Id;
                                var request = db.transaction(["JobContentsMaterialRequired"], "readwrite").objectStore("JobContentsMaterialRequired");
                                var objectStoreRequest = request.delete(uid);
                                objectStoreRequest.onsuccess = function (event) {
                                    //console.log("Entry has been removed from your database.");
                                };
                                objectStoreRequest.onerror = function (event) {
                                    console.log("error in remove material requirements data " + event.message + "");
                                };
                            }
                        }
                    }
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };
        if (InputValues.length > 0) {
            InputValues.PlanContQty = PlanContQty;
            InputValues.PlanContentType = PlanContentType;
            InputValues.PlanContName = PlanContName;
            var transaction = db.transaction(["JobContentsMaterialRequired"], "readwrite");
            var store = transaction.objectStore("JobContentsMaterialRequired");

            if (store) {
                var request = store.put(InputValues);
                request.onsuccess = function (ev) {
                    //console.log("Input operations Data added finished..");
                };
                request.onerror = function (ev) {
                    console.log("Failed to add material requirements record." + "  Error: " + ev.message);
                };
            }
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * // reload job size values contents type or qty wise with the local store!
 * @param {Text} ContId as contents type Text
 */
function readContentsSizeValues(ContId) {
    try {
        var flagReloaded = false;
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);

        var PlanContName = document.getElementById("PlanContName").innerHTML;
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        //var ChkPlanMaster = $("#ChkUseFirstPlanAsMaster").dxCheckBox('instance').option('value');

        var CategoryId = $("#SbCategory").dxSelectBox("instance").option('value');
        if (CategoryId !== null) GetCategorizedProcess(CategoryId, ContId);

        GblInputValues = {};
        OprIds = []; GblInputOpr = [];
        $("#GridOperationAllocated").dxDataGrid({ dataSource: ObjDefaultProcess });
        for (var i = 0; i < ObjDefaultProcess.length; i++) {
            OprIds.push(ObjDefaultProcess[i].ProcessID);
        }

        $("#ItemPlanQuality").dxSelectBox({ value: null });
        $("#PlanPlateType").dxSelectBox({ value: "CTP Plate" });
        $("#PlanPrintingStyle").dxSelectBox({ value: null });
        $("#ItemPlanGsm").dxSelectBox({ value: null });
        $("#ItemPlanMill").dxSelectBox({ value: null });
        $("#ItemPlanFinish").dxSelectBox({ value: null });
        $("#PlanWastageType").dxSelectBox({ value: null });
        $("#PlanPrintingGrain").dxSelectBox({ value: null });
        $("#ChkPlanInSpecialSizePaper").dxCheckBox({ value: false });
        $("#ChkPlanInStandardSizePaper").dxCheckBox({ value: false });
        $("#ChkPlanInAvailableStock").dxCheckBox({ value: false });
        $("#ChkPaperByClient").dxCheckBox({ value: false });
        $("#MachineIDFiltered").dxTagBox({ value: null });

        var GridOper = $("#GridOperation").dxDataGrid('instance');
        GridOper.clearFilter();

        //var data = [];
        //data.TblPlanning = [];
        //data.TblOperations = [];
        //data.TblBookForms = [];
        //ShowShirinReport(data);
        //var grid = $("#ContentPlansList").dxDataGrid('instance');
        //grid.clearSelection();

        var svgShape = document.getElementById("svg_Sheet_Container");
        while (svgShape.lastChild) {
            svgShape.removeChild(svgShape.lastChild);
        }
        var svgUp = document.getElementById("svg_Shape_Container");
        while (svgUp.lastChild) {
            svgUp.removeChild(svgUp.lastChild);
        }
        drawChartCost([]);

        $('#Body_windowPlanning input').each(function () {
            if (this.id === "") return;
            if (this.type === "text" || this.type === "number") {
                document.getElementById(this.id).value = "";
                if (this.id === "JobFoldInH" && ContId === "Brochure") {
                    document.getElementById(this.id).value = 1;
                } else if (this.id === "JobFoldInL" && ContId === "Brochure") {
                    document.getElementById(this.id).value = 2;
                }
            }
        });
        document.getElementById("PlanColorStrip").value = 0;
        document.getElementById("PlanGripper").value = 0;

        var objectStore = db.transaction(["ContentsSizeValues"]).objectStore("ContentsSizeValues");
        // var request = objectStore.get(ContId);        
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {
                if (flagReloaded === false) {
                    if (PlanContName === cursor.value["PlanContName"] && PlanContQty === Number(cursor.value["PlanContQty"]) && ContId === cursor.value["PlanContentType"]) {
                        GblInputValues = cursor.value;
                        reloadKeyValues();
                        flagReloaded = true;
                        return;
                    } else if (document.getElementById("Plan" + GblPlanID).innerHTML.includes("Click Me to plan..") === true && PlanContName === cursor.value["PlanContName"] && /*ChkPlanMaster === true &&*/ ContId === cursor.value["PlanContentType"]) {
                        //GblInputValues = cursor.value;                        
                        //                        GblInputValues.Id = 0;
                        for (var key in cursor.value) {
                            if (cursor.value.hasOwnProperty(key)) {
                                if (key !== "Id") {
                                    GblInputValues[key] = cursor.value[key];
                                }
                            }
                        }
                        GblInputValues.PlanContQty = PlanContQty;
                        reloadKeyValues();
                        flagReloaded = true;
                        return;
                    }
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");

                //$('#Body_windowPlanning input').each(function () {
                //    if (this.id === "") return;
                //    if (this.type === "text" || this.type === "number") {
                //        if (this.id === "ItemPlanQuality" || this.id === "PlanPlateType" || this.id === "PlanPrintingStyle" || this.id === "ItemPlanGsm" || this.id === "ItemPlanMill" || this.id === "ItemPlanFinish" || this.id === "PlanWastageType" || this.id === "PlanPrintingGrain") {
                //            var Eid = "#" + this.id;
                //            $(Eid).dxSelectBox({
                //                value: null
                //            });
                //        } else
                //            document.getElementById(this.id).value = "";
                //    }
                //});
                if (flagReloaded === false) {
                    var data = [];
                    data.TblPlanning = [];
                    data.TblOperations = [];
                    data.TblBookForms = [];
                    ShowShirinReport(data);

                    $("#PlanButtonHide").removeClass("fa fa-arrow-circle-down");
                    $("#PlanButtonHide").addClass("fa fa-arrow-circle-up");
                    $("#PlanSizeContainer").slideDown(800);
                    $("#PlanContainer").slideUp(800);

                    if (document.getElementById("SizeHeight").style.display === "block") {
                        document.getElementById("SizeHeight").focus();
                    } else if (document.getElementById("SizeLength").style.display === "block") {
                        document.getElementById("SizeLength").focus();
                    } else {
                        document.getElementById("SizeWidth").focus();
                    }
                    $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                }
            }
        };
        objectStore.openCursor().onerror = function (ev) {
            console.log("Failed to reload contents input record. Error: " + ev.message);
        };
    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

function reloadKeyValues() {
    ////if (key === "PlanOnlineCoating" || key === "ItemPlanQuality" || key === "PlanPlateType" || key === "PlanPrintingStyle" || key === "ItemPlanGsm" || key === "ItemPlanMill" || key === "ItemPlanFinish" || key === "PlanWastageType" || key === "PlanPrintingGrain") {
    ////    var Eid = "#" + key;
    ////    $(Eid).dxSelectBox({
    ////        value: null
    ////    });
    ////} else if (key === "ChkPlanInSpecialSizePaper" || key === "ChkPlanInStandardSizePaper" || key === "ChkPlanInAvailableStock" || key === "ChkUseFirstPlanAsMaster") {
    ////    id = "#" + key;
    ////    $(id).dxCheckBox({
    ////        value: false
    ////    });
    ////} else if (key === "MachineIDFiltered") {
    ////    $("#MachineIDFiltered").dxTagBox({
    ////        value: null
    ////    });
    ////} else if (key === "Id") {
    ////    //alert(key);
    ////} else {
    ////    document.getElementById(key).value = "";
    ////}
    var id = "";
    for (var key in GblInputValues) {
        if (GblInputValues.hasOwnProperty(key)) {
            //if (PlanContName === GblInputValues["PlanContName"] && (PlanContQty === GblInputValues["PlanContQty"] || ChkPlanMaster === true) && ContId === GblInputValues["PlanContentType"]) { /*  */
            if (key === "PlanOnlineCoating" || key === "ItemPlanQuality" || key === "PlanPlateType" || key === "PlanPrintingStyle" || key === "ItemPlanGsm" || key === "ItemPlanMill" || key === "ItemPlanFinish" || key === "PlanWastageType" || key === "PlanPrintingGrain") {
                id = "#" + key;
                $(id).dxSelectBox({
                    value: GblInputValues[key]
                });
            } else if (key === "ChkPaperByClient" || key === "ChkPlanInSpecialSizePaper" || key === "ChkPlanInStandardSizePaper" || key === "ChkPlanInAvailableStock" || key === "ChkUseFirstPlanAsMaster") {
                id = "#" + key;
                if (GblInputValues[key] === true || GblInputValues[key] === "true") {
                    $(id).dxCheckBox({ value: true });
                } else {
                    $(id).dxCheckBox({ value: false });
                }
            } else if (key === "MachineIDFiltered" || key === "MachineId") {
                var objmid = [];
                var objkey = GblInputValues[key].split(',');
                for (var x in objkey) {
                    if (objkey[x] !== "")
                        objmid.push(Number(objkey[x]));
                }
                if (objmid.length > 0) {
                    $("#MachineIDFiltered").dxTagBox({
                        value: objmid
                    });
                }
            } else if (key === "Id") {
                //alert(key);
            } else {
                document.getElementById(key).value = GblInputValues[key];
            }
            // } else {
            //}
            ////if ("OperId" === key) {
            ////    //var x = [];
            ////    //x.push(request.result["OperId"]);
            ////    //$("#GridOperation").dxDataGrid("instance").option("selectedRowKeys", x);
            ////    $("#OperId").text(request.result[key]);
            ////}
        }
    }
    reloadInputOperations();
}

function reloadInputOperations() {
    var flagReloaded = false;
    var PlanContName = document.getElementById("PlanContName").innerHTML;
    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;
    var ChkPlanMaster = $("#ChkUseFirstPlanAsMaster").dxCheckBox('instance').option('value');
    try {

        OprIds = []; GblInputOpr = [];
        $("#GridOperationAllocated").dxDataGrid({ dataSource: GblInputOpr });

        var ContentsOprations = db.transaction("ContentsOprations").objectStore("ContentsOprations");
        ContentsOprations.openCursor().onsuccess = function (event) {
            var curOper = event.target.result;
            if (curOper) {
                if (Number(curOper.value.PlanContQty) === PlanContQty && curOper.value.PlanContName === PlanContName && curOper.value.PlanContentType === PlanContentType) {
                    for (var val = 0; val < curOper.value.length; val++) {
                        GblInputOpr.push(curOper.value[val]);
                        OprIds.push(curOper.value[val].ProcessID);
                    }
                    $("#GridOperationAllocated").dxDataGrid({ dataSource: GblInputOpr });
                    flagReloaded = true;
                    readSelectedPlan();
                    return;
                } else if (document.getElementById("Plan" + GblPlanID).innerHTML.includes("Click Me to plan..") === true && PlanContName === curOper.value["PlanContName"] && ChkPlanMaster === true && PlanContentType === curOper.value["PlanContentType"]) {
                    for (var i = 0; i < curOper.value.length; i++) {
                        GblInputOpr.push(curOper.value[i]);
                        OprIds.push(curOper.value[i].ProcessID);
                    }
                    $("#GridOperationAllocated").dxDataGrid({ dataSource: GblInputOpr });
                    flagReloaded = true;
                    readSelectedPlan();
                    return;
                }
                curOper.continue();
            } else {
                if (flagReloaded === false) {
                    readSelectedPlan();
                }
            }
        };

    } catch (e) {
        console.log(e);
    }
}

/**
 * Remove content size values with content type by cont name
 * @param {Text} ContentType as Text
 */
function removeContents(ContentType) {
    var objectStore = db.transaction("JobContents").objectStore("JobContents");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.PlanContentType === ContentType) {
                var uid = cursor.value.PlanContName;
                var request = db.transaction(["JobContents"], "readwrite").objectStore("JobContents");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    // console.log("error in remove data " + event.message + "")
                };
            }
        }
        else {
            //alert("No more entries!");
        }
    };
}

/**
 * Save operations contents and qty wise
 * */
function saveContentsOperations() {

    try {
        var Grid1 = $("#GridOperationDetails").dxDataGrid('instance');  /// in grid costing we find operations.
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML;   //$("#PlanContentType").val();
        var PlanContName = document.getElementById("PlanContName").innerHTML;

        var transaction = db.transaction(["JobOperation"], "readwrite");
        var store = transaction.objectStore("JobOperation");
        if (store) {
            for (var i = 0; i < Grid1.totalCount(); i++) {
                var GDOpr = {};
                GDOpr.PlanContQty = PlanContQty;
                GDOpr.PlanContName = PlanContName;
                GDOpr.PlanContentType = PlanContentType;
                GDOpr.ProcessID = Grid1.cellValue(i, 0);
                GDOpr.ProcessName = Grid1.cellValue(i, 1);
                GDOpr.SizeW = Grid1.cellValue(i, 2);
                GDOpr.SizeL = Grid1.cellValue(i, 3);
                GDOpr.Rate = Grid1.cellValue(i, 4);
                GDOpr.Amount = Grid1.cellValue(i, 5);
                GDOpr.MinimumCharges = Grid1.cellValue(i, 6);
                GDOpr.SetupCharges = Grid1.cellValue(i, 7);
                GDOpr.PlanID = Grid1.cellValue(i, 8);
                GDOpr.Ups = Grid1.cellValue(i, 9);
                GDOpr.SizeToBeConsidered = Grid1.component._controllers.data._dataSource._items[i].SizeToBeConsidered;

                GDOpr.NoOfPass = Grid1.option.dataSource[i].NoOfPass;
                GDOpr.Pieces = curOper.value[val].Pieces;
                GDOpr.NoOfStitch = curOper.value[val].NoOfStitch;
                GDOpr.NoOfLoops = curOper.value[val].NoOfLoops;
                GDOpr.NoOfColors = curOper.value[val].NoOfColors;
                GDOpr.RateFactor = curOper.value[val].RateFactor;

                request = store.put(GDOpr);

                request.onsuccess = function (ev) {
                    //console.log("Operation added in record...");
                };
                request.onerror = function (ev) {
                    //console.log("Failed to add record." + "  Error: " + ev.message);
                };
            }
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Save selected plan grid row with operation details
 * @param {Object} ObjSelectedPlan As Object of selected plan 
 * @param {Object} ObjOperations As Object of selected plan's operations
 *  @param {Object} ObjGridForms As Object of selected plan's forms details
 */
function saveSelectedPlan(ObjSelectedPlan, ObjOperations, ObjGridForms) {
    try {
        var transaction = db.transaction(["TableSelectedPlan"], "readwrite");
        var store = transaction.objectStore("TableSelectedPlan");
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML; // $("#PlanContentType").val();
        var PlanContName = document.getElementById("PlanContName").innerHTML;
        ObjSelectedPlan.PlanContQty = PlanContQty;
        ObjSelectedPlan.PlanContentType = PlanContentType;
        ObjSelectedPlan.PlanContName = PlanContName;

        ObjSelectedPlan.ContentSizeValues = "";
        for (var sz in GblInputValues) {
            if (ObjSelectedPlan.ContentSizeValues === "") {
                ObjSelectedPlan.ContentSizeValues = sz + "=" + GblInputValues[sz];
            } else {
                ObjSelectedPlan.ContentSizeValues = ObjSelectedPlan.ContentSizeValues + "AndOr" + sz + "=" + GblInputValues[sz];
            }
        }

        if (store) {
            var request = store.put(ObjSelectedPlan);

            request.onsuccess = function (ev) {
                //console.log("Contents Data added finished..");
                if (ObjOperations.length > 0) {
                    ObjOperations.PlanContQty = PlanContQty;
                    ObjOperations.PlanContentType = PlanContentType;
                    ObjOperations.PlanContName = PlanContName;
                    var transaction = db.transaction(["JobOperation"], "readwrite");
                    var store = transaction.objectStore("JobOperation");
                    if (store) {
                        var request = store.put(ObjOperations);
                        request.onsuccess = function (ev) {
                            //console.log("Contents Data added finished..");
                        };
                        request.onerror = function (ev) {
                            //console.log("Failed to add contents record." + "  Error: " + ev.message);
                        };
                    }
                }

                if (ObjGridForms.length > 0) {
                    ObjGridForms.PlanContQty = PlanContQty;
                    ObjGridForms.PlanContentType = PlanContentType;
                    ObjGridForms.PlanContName = PlanContName;
                    var tranForms = db.transaction(["JobContentsForms"], "readwrite");
                    var storeForms = tranForms.objectStore("JobContentsForms");
                    if (storeForms) {
                        var requestForms = storeForms.put(ObjGridForms);

                        requestForms.onsuccess = function (ev) {
                            //console.log("Contents Data added finished..");
                        };
                        requestForms.onerror = function (ev) {
                            //console.log("Failed to add contents record." + "  Error: " + ev.message);
                        };
                    }
                }
            };
            request.onerror = function (ev) {
                console.log("Failed to add contents record." + "  Error: " + ev.message);
            };
        }

    } catch (e) {
        console.log(e);
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
    }
}

/**
 * Reload selected plan with operations content name,type and qty wise
 * */
function readSelectedPlan() {
    try {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
        var Save_Contents_Data = [];
        $("#GridHeadsDetails").dxDataGrid({ dataSource: Save_Contents_Data });
        $("#GridOperationDetails").dxDataGrid({ dataSource: Save_Contents_Data });
        $("#ContentPlansList").dxDataGrid('instance').clearSelection();
        $("#GridFormsDetails").dxDataGrid({ dataSource: Save_Contents_Data });

        Save_Contents_Data.TblPlanning = [];
        Save_Contents_Data.TblOperations = [];
        Save_Contents_Data.TblBookForms = [];

        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML;  //$("#PlanContentType").val();
        var PlanContName = document.getElementById("PlanContName").innerHTML;

        var ChkPlanMaster = $("#ChkUseFirstPlanAsMaster").dxCheckBox('instance').option('value');
        //var displayStatusBottom = document.getElementById("displayStatusBottom").innerHTML.trim().split(/(\d+)/)[1];
        var JL = Number(document.getElementById("SizeLength").value);
        var JH = Number(document.getElementById("SizeHeight").value);
        GblTotalPaperWt = 0, GblTotalForms = 0; //reload total

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                /***
                 *In case of Use first plan as master, data load in GblPlanValues variable.
                 * */
                if (document.getElementById("Plan" + GblPlanID).innerHTML.includes("Click Me to plan..") === true && cursor.value.PlanContName === PlanContName && ChkPlanMaster === true && cursor.value.PlanContentType === PlanContentType) {
                    GblPlanValues = cursor.value;
                }
                if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    Save_Contents_Data.TblPlanning.push(cursor.value);
                    GblTotalPaperWt = GblTotalPaperWt - Number(cursor.value.TotalPaperWeightInKg);//minus current contents paper from total paper weight in kg for opern calculation.added on 22-04-19

                    var JobContentsForms = db.transaction("JobContentsForms").objectStore("JobContentsForms");
                    JobContentsForms.openCursor().onsuccess = function (event) {
                        var curForms = event.target.result;
                        if (curForms) {
                            if (Number(curForms.value.PlanContQty) === PlanContQty && curForms.value.PlanContName === PlanContName && curForms.value.PlanContentType === PlanContentType) {
                                for (var val = 0; val < curForms.value.length; val++) {
                                    Save_Contents_Data.TblBookForms.push(curForms.value[val]);
                                    GblTotalForms = GblTotalForms - Number(curForms.value[val].Forms); ///Minus forms form total added on 22-04-19
                                }
                                //return;
                            }
                            if (Number(curForms.value.PlanContQty) === Number(PlanContQty)) {
                                for (val = 0; val < curForms.value.length; val++) {
                                    GblTotalForms = GblTotalForms + Number(curForms.value[val].Forms); ///total of all forms added on 22-04-19
                                }
                            }
                            curForms.continue();
                        }
                    };

                    var objectJobOperation = db.transaction("JobOperation").objectStore("JobOperation");
                    objectJobOperation.openCursor().onsuccess = function (event) {
                        var curOper = event.target.result;
                        if (curOper) {
                            if (Number(curOper.value.PlanContQty) === PlanContQty && curOper.value.PlanContName === PlanContName && curOper.value.PlanContentType === PlanContentType) {
                                for (var val = 0; val < curOper.value.length; val++) {
                                    Save_Contents_Data.TblOperations.push(curOper.value[val]);
                                }
                                ShowShirinReport(Save_Contents_Data);
                                return;
                            }
                            curOper.continue();
                        } else
                            ShowShirinReport(Save_Contents_Data);
                    };
                }
                if (Number(cursor.value.PlanContQty) === Number(PlanContQty)) {
                    GblTotalPaperWt = GblTotalPaperWt + Number(cursor.value.TotalPaperWeightInKg); //total paper weight in kg for opern calculation. added on 22-04-19
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");

                if ((JL > 0 || JH > 0) && Save_Contents_Data.TblPlanning.length <= 0
                    && document.getElementById("Plan" + GblPlanID).innerHTML.includes("Click Me to plan..") === true) {
                    if (ChkPlanMaster === true && GblPlanValues.ContentSizeValues !== undefined) {
                        masterPlan();
                    } else {
                        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
                        $("#PlanButton").click();
                    }
                }
            }
        };
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}

/**
 * Remove all saved data on windows load
 * */
function removeAllContentsData() {
    try {
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var uid = cursor.value.Id;
                var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        var JobOperation = db.transaction("JobOperation").objectStore("JobOperation");
        JobOperation.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var Opid = cursor.value.Id;
                var request = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
                var objectStoreRequest = request.delete(Opid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        /** Remove all JobContentsForms on windows load
         * */
        var JobForms = db.transaction("JobContentsForms").objectStore("JobContentsForms");
        JobForms.openCursor().onsuccess = function (event) {
            var cursorForms = event.target.result;
            if (cursorForms) {
                var FMid = cursorForms.value.Id;
                var requestF = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
                var objectStoreRequestF = requestF.delete(FMid);
                objectStoreRequestF.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequestF.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursorForms.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        /** Remove all Contents plan Values on windows load
         * */
        var PlanV = db.transaction("ContentsSizeValues").objectStore("ContentsSizeValues");
        PlanV.openCursor().onsuccess = function (event) {
            var cursorPV = event.target.result;
            if (cursorPV) {
                var FMid = cursorPV.value.Id;
                var requestPV = db.transaction(["ContentsSizeValues"], "readwrite").objectStore("ContentsSizeValues");
                var PVStoreRequestF = requestPV.delete(FMid);
                PVStoreRequestF.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                PVStoreRequestF.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursorPV.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        /** Remove all JobContentsForms details on windows load
         * */
        var JobFormsD = db.transaction("JobContentsFormsDetails").objectStore("JobContentsFormsDetails");
        JobFormsD.openCursor().onsuccess = function (event) {
            var cursorFormsD = event.target.result;
            if (cursorFormsD) {
                var FMid = cursorFormsD.value.Id;
                var requestF = db.transaction(["JobContentsFormsDetails"], "readwrite").objectStore("JobContentsFormsDetails");
                var objectStoreRequestF = requestF.delete(FMid);
                objectStoreRequestF.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequestF.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursorFormsD.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        ///////Remove data materials
        var JobContentsMaterialRequired = db.transaction("JobContentsMaterialRequired").objectStore("JobContentsMaterialRequired");
        JobContentsMaterialRequired.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var Mid = cursor.value.Id;
                var request = db.transaction(["JobContentsMaterialRequired"], "readwrite").objectStore("JobContentsMaterialRequired");
                var objectStoreRequest = request.delete(Mid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        ///////Remove data ink shades
        var JobContentsInkShades = db.transaction("JobContentsInkShades").objectStore("JobContentsInkShades");
        JobContentsInkShades.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var inkId = cursor.value.Id;
                var request = db.transaction(["JobContentsInkShades"], "readwrite").objectStore("JobContentsInkShades");
                var objectStoreRequest = request.delete(inkId);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

    } catch (e) {
        console.log(e);
    }
}

function removeSelectedOperations() {
    var objectStore = db.transaction("JobOperation").objectStore("JobOperation");
    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    //var PlanContentType = $("#PlanContentType").val();
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;
    var PlanContName = document.getElementById("PlanContName").innerHTML;

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                var uid = cursor.value.Id;
                var request = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    console.log("error in remove operation data " + event.message + "");
                };
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}

function removeSelectedForms() {
    var objectStore = db.transaction("JobContentsForms").objectStore("JobContentsForms");
    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;  // $("#PlanContentType").val();
    var PlanContName = document.getElementById("PlanContName").innerHTML;

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                var uid = cursor.value.Id;
                var request = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                //return;
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}

function removeSelectedFormsDetails(ObPlanValues, ObjGridForms) {
    var objectStore = db.transaction("JobContentsFormsDetails").objectStore("JobContentsFormsDetails");
    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;  // $("#PlanContentType").val();
    var PlanContName = document.getElementById("PlanContName").innerHTML;

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                var uid = cursor.value.Id;
                var request = db.transaction(["JobContentsFormsDetails"], "readwrite").objectStore("JobContentsFormsDetails");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
                //return;
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");
            if (ObjGridForms.length <= 0) return;
            SaveSelectedFormsDetails(ObPlanValues, ObjGridForms);
        }
    };
}

function SaveSelectedFormsDetails(ObPlanValues, ObjGridForms) {
    var ObjPlanValues = [];
    ObjPlanValues.push(ObPlanValues);
    var PlanContName = document.getElementById("PlanContName").innerHTML;
    for (var i = 0; i < ObjGridForms.length; i++) {
        ObjGridForms[i].PlanContName = PlanContName;
    }
    $.ajax({
        type: "POST",
        url: "WebServiceProductionWorkOrder.asmx/RecalculateFormsDetails",
        data: '{ObjContents:' + JSON.stringify(ObjPlanValues) + ',ObjForms:' + JSON.stringify(ObjGridForms) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success: function (results) {
            var res = results.replace(/\\/g, '');
            res = res.replace(/{"d":null/g, '');
            res = res.replace(/{"d":""/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.replace(/{":,/g, '":null,');
            res = res.slice(0, -3);
            var ObjGridFormsD = JSON.parse(res.toString());
            SaveJCFormDetails(ObjGridFormsD);
            return true;
        },
        error: function errorFunc(jqXHR) {
            //alert(jqXHR.message);
            return false;
        }
    });
}

function removeContentQtyWise(LclPlanValues, lclGridOperItems, lclGridForms) {
    var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
    var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
    var PlanContName = document.getElementById("PlanContName").innerHTML;
    var PlanContentType = document.getElementById("ContentOrientation").innerHTML;  // $("#PlanContentType").val();

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                var uid = cursor.value.Id;
                var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                    removeSelectedOperations();
                    removeSelectedForms();
                    //if (GblPlanValues.length > 0) {
                    saveSelectedPlan(LclPlanValues, lclGridOperItems, lclGridForms);
                    //}
                };
                objectStoreRequest.onerror = function (event) {
                    console.log("error in remove data " + event.message + "");
                };
                return;
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");
            if (LclPlanValues) {
                saveSelectedPlan(LclPlanValues, lclGridOperItems, lclGridForms);
            }
        }
    };
}

function removeExistingSelectedPlan() {
    var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
    var PlanContName = document.getElementById("PlanContName").innerHTML;
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.PlanContName === PlanContName) {
                var uid = cursor.value.PlanContName;
                var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}

function removeExistPlanQty() {
    var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.Quantity === Number(Gbl_Quantity)) {
                var uid = cursor.value.Get_Id;
                var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                var objectStoreRequest = request.delete(uid);
                objectStoreRequest.onsuccess = function (event) {
                    //console.log("Entry has been removed from your database.");
                };
                objectStoreRequest.onerror = function (event) {
                    //console.log("error in remove data " + event.message + "")
                };
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}

/**
 * Load all contetnts and it's Operations or forms details for save*/
function readAllSelectedPlans() {
    try {
        //$("#LoadIndicator").dxLoadPanel("instance").option("visible", true);
        var FlgPlan = false, FlgOpr = false, FlgBook = false;
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
        var TblPlanning = [], TblOperations = [], TblContentForms = [];

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                TblPlanning.push(cursor.value);

                cursor.continue();
            } else {
                //alert("No more entries!");
                FlgPlan = true;

                /**
                 * Fetch all Job Contents Forms data **/
                var objectJobForms = db.transaction("JobContentsForms").objectStore("JobContentsForms");
                objectJobForms.openCursor().onsuccess = function (event) {
                    var curForms = event.target.result;
                    var FormsData = {};
                    if (curForms) {
                        for (var val = 0; val < curForms.value.length; val++) {
                            //if (curForms.value.PlanContentType === cursor.value.PlanContentType && Number(curForms.value.PlanContQty) === Number(cursor.value.PlanContQty) && cursor.value.PlanContName === curForms.value.PlanContName) {
                            FormsData = {};
                            FormsData = curForms.value[val];
                            FormsData.PlanContQty = curForms.value.PlanContQty;
                            FormsData.PlanContentType = curForms.value.PlanContentType;
                            FormsData.PlanContName = curForms.value.PlanContName;
                            TblContentForms.push(FormsData);
                            //}
                        }
                        curForms.continue();
                    } else {
                        //alert("No more entries!");
                        FlgBook = true;
                        //Fetch all operations data
                        var objectJobOperation = db.transaction("JobOperation").objectStore("JobOperation");
                        objectJobOperation.openCursor().onsuccess = function (event) {
                            var curOper = event.target.result;
                            var operData = {};
                            if (curOper) {
                                //if (curOper.value.PlanContentType === cursor.value.PlanContentType && Number(curOper.value.PlanContQty) === Number(cursor.value.PlanContQty) && cursor.value.PlanContName === curOper.value.PlanContName) {
                                var TransID = 1;
                                for (var val = 0; val < curOper.value.length; val++) {
                                    operData = {};
                                    //operData = curOper.value[val];
                                    operData.PlanContQty = curOper.value.PlanContQty;
                                    operData.PlanContentType = curOper.value.PlanContentType;
                                    operData.PlanContName = curOper.value.PlanContName;

                                    operData.SequenceNo = TransID;
                                    operData.ProcessID = Number(curOper.value[val].ProcessID);
                                    operData.SizeL = Number(curOper.value[val].SizeL);
                                    operData.SizeW = Number(curOper.value[val].SizeW);
                                    operData.NoOfPass = Number(curOper.value[val].NoOfPass);
                                    operData.Quantity = Number(curOper.value[val].Quantity);
                                    operData.Rate = Number(curOper.value[val].Rate).toFixed(3);
                                    operData.Ups = Number(curOper.value[val].Ups);
                                    operData.Amount = Number(curOper.value[val].Amount);
                                    operData.Remarks = curOper.value[val].Remarks;
                                    operData.PlanID = Number(curOper.value[val].PlanID);

                                    operData.Pieces = Number(curOper.value[val].Pieces);
                                    operData.NoOfStitch = Number(curOper.value[val].NoOfStitch);
                                    operData.NoOfLoops = Number(curOper.value[val].NoOfLoops);
                                    operData.NoOfColors = Number(curOper.value[val].NoOfColors);
                                    operData.RateFactor = curOper.value[val].RateFactor;
                                    operData.IsDisplay = Number(curOper.value[val].IsDisplay); ///added on 16-10-19

                                    TransID = TransID + 1;
                                    TblOperations.push(operData);
                                }
                                // }
                                curOper.continue();
                            } else {
                                //alert("No more entries!");
                                FlgOpr = true;
                                if (FlgPlan === true && FlgOpr === true && FlgBook === true) {
                                    callSaveQuote(TblPlanning, TblOperations, TblContentForms);
                                }
                            }
                        };
                    }
                };
            }
        };
    } catch (e) {
        $("#LoadIndicator").dxLoadPanel("instance").option("visible", false);
        console.log(e);
    }
}


/////// ------------------  End Store data transactions------------------------------

function deleteDataQtyWise(PlanContQty) {
    try {
        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (Number(cursor.value.PlanContQty) === PlanContQty) {
                    var uid = cursor.value.Id;
                    var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");                    
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in remove data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");            
            }
        };

        var objStoreFM = db.transaction("JobContentsForms").objectStore("JobContentsForms");
        objStoreFM.openCursor().onsuccess = function (event) {
            var cursorFM = event.target.result;
            if (cursorFM) {
                if (Number(cursorFM.value.PlanContQty) === PlanContQty) {
                    var uid = cursorFM.value.Id;
                    var request = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        //console.log("error in remove data " + event.message + "")
                    };
                    return;
                }
                cursorFM.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        var objectStoreOp = db.transaction("JobOperation").objectStore("JobOperation");
        objectStoreOp.openCursor().onsuccess = function (event) {
            var cursorOp = event.target.result;
            if (cursorOp) {
                if (Number(cursorOp.value.PlanContQty) === PlanContQty) {
                    var uid = cursorOp.value.Id;
                    var request = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in remove data job operations" + event.message + "");
                    };
                    return;
                }
                cursorOp.continue();
            }
            else {
                //alert("No more entries!");
            }
        };
    } catch (e) {
        consol.log(e);
    }
}

function deleteDataContentsWise(PlanContName, PlanContentType) {
    try {

        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var uid = cursor.value.Id;
                    var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");                    
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in delete data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");            
            }
        };

        var objStoreFM = db.transaction("JobContentsForms").objectStore("JobContentsForms");
        objStoreFM.openCursor().onsuccess = function (event) {
            var cursorFM = event.target.result;
            if (cursorFM) {
                if (cursorFM.value.PlanContName === PlanContName && cursorFM.value.PlanContentType === PlanContentType) {
                    var uid = cursorFM.value.Id;
                    var request = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in delete forms data " + event.message + "");
                    };
                    return;
                }
                cursorFM.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        var objectStoreOp = db.transaction("JobOperation").objectStore("JobOperation");
        objectStoreOp.openCursor().onsuccess = function (event) {
            var cursorOp = event.target.result;
            if (cursorOp) {
                if (cursorOp.value.PlanContName === PlanContName && cursorOp.value.PlanContentType === PlanContentType) {
                    var uid = cursorOp.value.Id;
                    var request = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been removed from your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in delete operation data content wise" + event.message + "");
                    };
                    return;
                }
                cursorOp.continue();
            }
            else {
                //alert("No more entries!");
            }
        };
    } catch (e) {
        console.log(e);
    }
}

/**
 * /Update content delete action in all saved content wise data
 * @param {any} DeleteAction As 0 or 1 values
  * @param {any} OldContName old cont name
 * @param {any} PlanContentType cont type
 */
function updateDeleteContentsData(DeleteAction, OldContName, PlanContentType) {
    try {

        var objectStore = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContName === OldContName && cursor.value.PlanContentType === PlanContentType) {
                    const updateData = cursor.value;

                    updateData.IsDeletedTransaction = DeleteAction;
                    const request = cursor.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");            
            }
        };

        var objStoreFM = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
        objStoreFM.openCursor().onsuccess = function (event) {
            var cursorFM = event.target.result;
            if (cursorFM) {
                if (cursorFM.value.PlanContName === OldContName && cursorFM.value.PlanContentType === PlanContentType) {
                    const updateData = cursorFM.value;

                    updateData.IsDeletedTransaction = DeleteAction;
                    const request = cursorFM.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name in form data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name in forms data " + event.message + "");
                    };
                    //return;
                }
                cursorFM.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        var objectStoreOp = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
        objectStoreOp.openCursor().onsuccess = function (event) {
            var cursorOp = event.target.result;
            if (cursorOp) {
                if (cursorOp.value.PlanContName === OldContName && cursorOp.value.PlanContentType === PlanContentType) {
                    const updateData = cursorOp.value;

                    updateData.IsDeletedTransaction = DeleteAction;
                    const request = cursorOp.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name in process data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name in process data" + event.message + "");
                    };
                    //return;
                }
                cursorOp.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

    } catch (e) {
        console.log(e);
    }
}

/**
 * /rename content name in all saved data on windows load
 * @param {any} NewContName new cont name
  * @param {any} OldContName old cont name
 * @param {any} PlanContentType cont type
 */
function renameContentsData(NewContName, OldContName, PlanContentType) {
    try {

        var objectStore = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContName === OldContName && cursor.value.PlanContentType === PlanContentType) {
                    const updateData = cursor.value;

                    updateData.PlanContName = NewContName;
                    updateData.ContentSizeValues = updateData.ContentSizeValues.replace(OldContName, NewContName);
                    const request = cursor.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");            
            }
        };

        var objStoreFM = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
        objStoreFM.openCursor().onsuccess = function (event) {
            var cursorFM = event.target.result;
            if (cursorFM) {
                if (cursorFM.value.PlanContName === OldContName && cursorFM.value.PlanContentType === PlanContentType) {
                    const updateData = cursorFM.value;

                    updateData.PlanContName = NewContName;
                    const request = cursorFM.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name in form data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name in forms data " + event.message + "");
                    };
                    //return;
                }
                cursorFM.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        var objectStoreOp = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
        objectStoreOp.openCursor().onsuccess = function (event) {
            var cursorOp = event.target.result;
            if (cursorOp) {
                if (cursorOp.value.PlanContName === OldContName && cursorOp.value.PlanContentType === PlanContentType) {
                    const updateData = cursorOp.value;

                    updateData.PlanContName = NewContName;
                    const request = cursorOp.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name in process data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name in process data" + event.message + "");
                    };
                    //return;
                }
                cursorOp.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        /** Rename Contents plan Values on windows load
         * */
        var SizeValues = db.transaction(["ContentsSizeValues"], "readwrite").objectStore("ContentsSizeValues");
        SizeValues.openCursor().onsuccess = function (event) {
            var cursorPV = event.target.result;
            if (cursorPV) {
                if (cursorPV.value.PlanContName === OldContName && cursorPV.value.PlanContentType === PlanContentType) {
                    const updateData = cursorPV.value;

                    updateData.PlanContName = NewContName;
                    const request = cursorPV.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name in process data');
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content name in content size data" + event.message + "");
                    };
                    //return;
                }
                cursorPV.continue();
            }
            else {
                //alert("No more entries!");
            }
        };
    } catch (e) {
        console.log(e);
    }
}

function cloneContentAsNew(PlanContName, NewContName, PlanContentType) {
    try {

        var objectStore = db.transaction("TableSelectedPlan").objectStore("TableSelectedPlan");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var uid = {};
                    for (var key in cursor.value) {
                        if (key !== "Id") {
                            uid[key] = cursor.value[key];
                            if (key === "ContentSizeValues") {
                                uid[key] = uid[key].replace(PlanContName, NewContName);
                            }
                        }
                    }
                    uid.PlanContName = NewContName;
                    var request = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
                    var objectStoreRequest = request.add(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been cloned to your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in cloned data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");            
            }
        };

        var objStoreFM = db.transaction("JobContentsForms").objectStore("JobContentsForms");
        objStoreFM.openCursor().onsuccess = function (event) {
            var cursorFM = event.target.result;
            if (cursorFM) {
                if (cursorFM.value.PlanContName === PlanContName && cursorFM.value.PlanContentType === PlanContentType) {
                    var uid = [];
                    for (var key in cursorFM.value) {
                        if (key !== "Id") {
                            uid[key] = cursorFM.value[key];
                        }
                    }
                    uid.PlanContName = NewContName;
                    var request = db.transaction(["JobContentsForms"], "readwrite").objectStore("JobContentsForms");
                    var objectStoreRequest = request.add(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been cloned to your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in cloned forms data " + event.message + "");
                    };
                }
                cursorFM.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        var objectStoreOp = db.transaction("JobOperation").objectStore("JobOperation");
        objectStoreOp.openCursor().onsuccess = function (event) {
            var cursorOp = event.target.result;
            if (cursorOp) {
                if (cursorOp.value.PlanContName === PlanContName && cursorOp.value.PlanContentType === PlanContentType) {
                    var uid = [];
                    for (var key in cursorOp.value) {
                        if (key !== "Id") {
                            uid[key] = cursorOp.value[key];
                        }
                    }
                    uid.PlanContName = NewContName;
                    var request = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
                    var objectStoreRequest = request.add(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been cloned to your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in cloned operation data content wise" + event.message + "");
                    };
                }
                cursorOp.continue();
            }
            else {
                //alert("No more entries!");
            }
        };

        ///////////////////////////////////////// Input details
        var objectInputStore = db.transaction("ContentsSizeValues").objectStore("ContentsSizeValues");
        objectInputStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContentType === PlanContentType && cursor.value.PlanContName === PlanContName) {
                    var InputValues = {};
                    for (var key in cursor.value) {
                        if (key !== "Id") {
                            InputValues[key] = cursor.value[key];
                        }
                    }
                    InputValues.PlanContName = NewContName;
                    var request = db.transaction(["ContentsSizeValues"], "readwrite").objectStore("ContentsSizeValues");
                    var objectStoreRequest = request.add(InputValues);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been cloned to your database.");                    
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in cloned data " + event.message + "");
                    };
                }
                cursor.continue();
            }
        };

        var objectInOpStore = db.transaction("ContentsOprations").objectStore("ContentsOprations");
        objectInOpStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var InputValues = [];
                    for (var key in cursor.value) {
                        if (key !== "Id") {
                            InputValues[key] = cursor.value[key];
                        }
                    }
                    InputValues.PlanContName = NewContName;
                    var request = db.transaction(["ContentsOprations"], "readwrite").objectStore("ContentsOprations");
                    var objectStoreRequest = request.add(InputValues);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been cloned to your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        console.log("error in clone input operations data " + event.message + "");
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");
            }
        };
        ///End Inputs

    } catch (e) {
        console.log(e);
    }
}


//window.onbeforeunload = function () {
//    ////************For Delete all old Indexeddb database 
//    var DBDeleteRequest = window.indexedDB.deleteDatabase("localstore");
//    DBDeleteRequest.onerror = function (event) {
//        console.log("Error deleting database.");
//    };
//    DBDeleteRequest.onsuccess = function (event) {
//        //console.log("Database deleted successfully");
//    };
//};

function updateAttachedPicture(ContName, ContentType, AttachedPicture, FileName) {
    try {
        //GridProductContentDetails
        var grid = $("#GridProductContentDetails").dxDataGrid("instance");
        var result = $.grep(grid._options.dataSource, function (ex) {
            return ex.PlanContName === ContName && ex.PlanContentType === ContentType;
        });
        if (result.length >= 1) {
            //var ext = FileName.split(';')[0].match(/jpeg|png|gif|jpg/)[0];
            grid._options.dataSource[result.length - 1].UserAttachedPicture = AttachedPicture.replace("data:image/png;base64,", "");
            grid._options.dataSource[result.length - 1].AttachedFileName = FileName;
            //grid.component.refresh();
        }
    } catch (e) {
        console.log(e);
    }
    var objectStore = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            if (cursor.value.PlanContName === ContName && cursor.value.PlanContentType === ContentType) {
                const updateData = cursor.value;

                updateData.UserAttachedPicture = AttachedPicture;
                updateData.AttachedFileName = FileName;
                const request = cursor.update(updateData);
                request.onsuccess = function () {
                    //console.log('Updating content name data');
                };
                request.onerror = function (event) {
                    console.log("error in updating content name data " + event.message + "");
                };
                //return;
            }
            cursor.continue();
        }
        else {
            //alert("No more entries!");            
        }
    };
}

function updateSpecialInstructions(ContentName, ContentType, SpecialInst) {
    try {
        var grid = $("#GridProductContentDetails").dxDataGrid("instance");
        var result = $.grep(grid._options.dataSource, function (ex) {
            return ex.PlanContName === ContentName && ex.PlanContentType === ContentType;
        });
        if (result.length >= 1) {
            grid._options.dataSource[result.length - 1].SpecialInstructions = SpecialInst;
        }

        var objectStore = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.PlanContName === ContentName && cursor.value.PlanContentType === ContentType) {
                    const updateData = cursor.value;

                    updateData.SpecialInstructions = SpecialInst;
                    const request = cursor.update(updateData);
                    request.onsuccess = function () {
                        //console.log('Updating content name data');
                        DevExpress.ui.notify("Special Intructions successfully updated on selected content...", "success", 1000);
                    };
                    request.onerror = function (event) {
                        console.log("error in updating content spcial intrns" + event.message + "");
                    };
                    return;
                }
                cursor.continue();
            }
            else {
                //alert("No more entries!");            
            }
        };
    } catch (e) {
        console.log(e);
    }
}

async function SaveJCFormDetails(ObjGridForms) {
    if (ObjGridForms.length > 0) {
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML; // $("#PlanContentType").val();
        var PlanContName = document.getElementById("PlanContName").innerHTML;
        ObjGridForms.PlanContQty = PlanContQty;
        ObjGridForms.PlanContentType = PlanContentType;
        ObjGridForms.PlanContName = PlanContName;
        var tranForms = db.transaction(["JobContentsFormsDetails"], "readwrite");
        var storeForms = tranForms.objectStore("JobContentsFormsDetails");
        if (storeForms) {
            var requestForms = storeForms.put(ObjGridForms);

            requestForms.onsuccess = function (ev) {
                //console.log("Contents Data added finished..");
            };
            requestForms.onerror = function (ev) {
                //console.log("Failed to add contents record." + "  Error: " + ev.message);
            };
        }
    }
}

async function UpdateJCFormDetails(ObjGridForms) {
    if (ObjGridForms.length > 0) {
        var PlanContQty = Number(document.getElementById("PlanContQty").innerHTML);
        var PlanContentType = document.getElementById("ContentOrientation").innerHTML; // $("#PlanContentType").val();
        var PlanContName = document.getElementById("PlanContName").innerHTML;
        ObjGridForms.PlanContQty = PlanContQty;
        ObjGridForms.PlanContentType = PlanContentType;
        ObjGridForms.PlanContName = PlanContName;

        var objectStore = db.transaction("JobContentsFormsDetails").objectStore("JobContentsFormsDetails");
        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (Number(cursor.value.PlanContQty) === PlanContQty && cursor.value.PlanContName === PlanContName && cursor.value.PlanContentType === PlanContentType) {
                    var uid = cursor.value.Id;
                    var request = db.transaction(["JobContentsFormsDetails"], "readwrite").objectStore("JobContentsFormsDetails");
                    var objectStoreRequest = request.delete(uid);
                    objectStoreRequest.onsuccess = function (event) {
                        //console.log("Entry has been updated in your database.");
                    };
                    objectStoreRequest.onerror = function (event) {
                        //console.log("error in remove data " + event.message + "")
                    };
                    //return;
                }
                cursor.continue();
            }
            else {
                if (ObjGridForms.length <= 0) return;
                SaveJCFormDetails(ObjGridForms);
            }
        };
    }
}

async function SortContentSequence(ContName, ContentType, OldSeqNo, SeqNo) {
    var objectStore = db.transaction(["TableSelectedPlan"], "readwrite").objectStore("TableSelectedPlan");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        var i = 0;
        if (cursor) {
            const updateData = cursor.value;
            if (cursor.value.PlanContName === ContName && cursor.value.PlanContentType === ContentType) {
                updateData.SequenceNo = SeqNo;
                i = 1;
            } else if (updateData.SequenceNo === SeqNo) {
                updateData.SequenceNo = OldSeqNo;
                i = 1;
            }
            if (i === 1) {// only in case of any change in sequence no update required else nn
                const request = cursor.update(updateData);
                request.onsuccess = function () {
                    //console.log('Updating content name data');
                };
                request.onerror = function (event) {
                    console.log("error in updating content name data " + event.message + "");
                };
            }
            //return;
            cursor.continue();
        }
        else {
            //alert("No more entries!");            
        }
    };

}

async function SortContentProcessSequence(ContName, ContentType, old_index, new_index) {
    var objectStoreOp = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
    objectStoreOp.openCursor().onsuccess = function (event) {
        var cursorOp = event.target.result;
        if (cursorOp) {
            if (cursorOp.value.PlanContName === ContName && cursorOp.value.PlanContentType === ContentType) {
                var updateData = cursorOp.value;
                updateData = array_move(updateData, old_index, new_index);
                const request = cursorOp.update(updateData);
                request.onsuccess = function () {
                    //console.log('Updating content name in process data');
                };
                request.onerror = function (event) {
                    console.log("error in updating content name in process data" + event.message + "");
                };
                return;
            }
            cursorOp.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}

async function UpdateContentWiseProcessRowData(ContName, ContentType, newProcessData) {
    var objectStoreOp = db.transaction(["JobOperation"], "readwrite").objectStore("JobOperation");
    objectStoreOp.openCursor().onsuccess = function (event) {
        var cursorOp = event.target.result;
        if (cursorOp) {
            if (cursorOp.value.PlanContName === ContName && cursorOp.value.PlanContentType === ContentType) {
                var updateData = cursorOp.value;
                for (var i = 0; i < updateData.length; i++) {
                    if (newProcessData.ProcessID === updateData[i].ProcessID && newProcessData.RateFactor === updateData[i].RateFactor) {
                        updateData[i] = newProcessData;
                    }
                }
                const request = cursorOp.update(updateData);
                request.onsuccess = function () {
                    //console.log('Updating content name in process data');
                };
                request.onerror = function (event) {
                    console.log("error in updating content name in process data" + event.message + "");
                };
                return;
            }
            cursorOp.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}
