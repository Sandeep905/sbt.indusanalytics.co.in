"use strict";
var GBLID = 0;
var IsEdit = false;
var LedgerGroupID = 0;
let selectedcategoryID = 0;
var GBLCategoryBarcharData = []

$('#salesChart').dxPieChart({
    palette: 'bright',
    title: 'Sales By Managers',
    legend: {
        orientation: 'horizontal',
        itemTextPosition: 'right',
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
        columnCount: 4,
    },
    export: {
        enabled: true,
    },
    series: [{
        argumentField: 'LedgerName',
        valueField: 'TotalSales',
        hoverEnabled: true,
        label: {
            visible: true,
            font: {
                size: 16,
            },
            position: 'inside',
            customizeText(arg) {
                return ``;
            },
        },
    }],
    tooltip: {
        enabled: true,
        contentTemplate(arg) {
            const { originalArgument, originalValue } = arg.point;
            return `<div><strong>${originalArgument}</strong><br>Total Sales: ${originalValue}</div>`;
        },
    },
});


// Call the function to update the chart with AJAX data
piechart();

function piechart() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/SalesByManager',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ LedgerGroupID: 3 }),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            console.log(RES1);
            $('#salesChart').dxPieChart({
                dataSource: RES1
            });


        },
        error: function (jqXHR) {
            // Handle the error
        }
    });
}


//progressBarFill1
$(() => {
    $('#chart').dxChart({
        series: {
            argumentField: 'ProductName',
            valueField: 'TotalSales',
            type: 'bar',
            color: '#E55253',
        },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                        + `Total Sales: ${arg.valueText} ₹`,
                };
            },
        },
        title: 'Sales By Product',
        legend: {
            visible: false,
        },
        argumentAxis: {
            visible: true,
        },
        scrollBar: {
            visible: true,
        },
        zoomAndPan: {
            argumentAxis: 'both',
        },
        valueAxis: {

            label: {
                customizeText() {
                    return `${this.value} ₹`;
                },
            },
        },
    }).dxChart('instance');

});


SalesByManager();
function SalesByManager() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/piechart',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{CategoryID:' + Number(selectedcategoryID) + '}',

        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);

            // Call the function to update the chart with the received data
            $('#chart').dxChart({
                dataSource: RES1,

            }).dxChart('instance');
        },
        error: function (jqXHR) {
            // Handle error
        }
    });
}


//3 bar
$(() => {
    $('#barchart').dxChart({
        rotated: true,
        pointSelectionMode: 'multiple',
        series: [
            {
                color: '#ffd700',
                argumentField: 'CategoryName',
                valueField: 'TotalSale',
                color: '#ffd700',
                type: 'stackedbar',
            },
        ],
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                        + `Total Sales: ${arg.valueText} ₹`,
                };
            },
        },
        title: {
            text: 'Sales By Category',
        },
        export: {
            enabled: true,
        },
        valueAxis: {

            label: {
                customizeText() {
                    return `${this.value} ₹`;
                },
            },
        },
        scrollBar: {
            visible: true,
        },
        zoomAndPan: {
            argumentAxis: 'both',
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        onPointClick(e) {
            const point = e.target;
            if (point.isSelected()) {
                point.clearSelection();
            } else {
                point.select();
            }
            selectedcategoryID = point.data.CategoryID; // Assuming CategoryID is present in the series data

            SalesByManager(); // Pass the selected category ID to the SalesByManager function
            Lastchart();

        },

    });

});



barchart();
function barchart() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/barchart',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{LedgerGroupID: 3}",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            // Call the function to update the chart with the received data
            $('#barchart').dxChart({
                dataSource: RES1,
            }).dxChart('instance');

            GBLCategoryBarcharData = RES1;
        },
        error: function (jqXHR) {
            // Handle error
        }
    });
}



//4chart


$(() => {
    const chart = $('#barchart2').dxChart({
        dataSource: dataSource4th,
        rotated: true,
        commonSeriesSettings: {
            argumentField: 'breed',
            type: 'bar',
        },
        series: {
            valueField: 'count',
            name: 'breeds',
            color: '#a3d6d2',
            selectionStyle: {
                color: '#ec2e7a',
                hatching: { direction: 'none' },
            },
        },
        title: {
            text: 'Sales By Brands',
        },
        legend: {
            visible: false,
        },
        export: {
            enabled: true,
        },
        scrollBar: {
            visible: true,
        },
        zoomAndPan: {
            argumentAxis: 'both',
        },
        onPointClick(e) {
            const point = e.target;
            if (point.isSelected()) {
                point.clearSelection();
            } else {
                point.select();
            }
        },
    }).dxChart('instance');

    chart.getSeriesByPos(0).getPointsByArg('GrandTotal')[0].select();
});

const dataSource4th = [{
    breed: 'Brands',
    count: 62942,
}, {
    breed: 'Brands2',
    count: 38287,
}, {
    breed: 'Brands3',
    count: 15652,
}, {
    breed: 'Brands4',
    count: 13670,
}, {
    breed: 'GrandTotal',
    count: 13377,
}];

//LastChart

$(() => {
    const chart = $('#Lastchart').dxChart({

        rotated: true,
        commonSeriesSettings: {
            argumentField: 'State',
            type: 'bar',
        },
        series: {
            valueField: 'TotalSales',
            color: '#a3d6d2',
            selectionStyle: {
                color: '#ec2e7a',
                hatching: { direction: 'none' },
            },
        },
        

        title: {
            text: 'Sales By States',
        },
        legend: {
            visible: false,
        },
        export: {
            enabled: true,
        },
        scrollBar: {
            visible: true,
        },
        zoomAndPan: {
            argumentAxis: 'both',
        },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                        + `Total Sales: ${arg.valueText} ₹`,
                };
            },
        },
        valueAxis: {

            label: {
                customizeText() {
                    return `${this.value} ₹`;
                },
            },
        },
        onPointClick(e) {
            const point = e.target;
            if (point.isSelected()) {
                point.clearSelection();
            } else {
                point.select();
            }
        },
    }).dxChart('instance');


});

Lastchart();
function Lastchart() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/Lastchart',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: '{CategoryID:' + Number(selectedcategoryID) + '}',

        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = JSON.parse(res);
            console.log(RES1);

            $('#Lastchart').dxChart({
                dataSource: RES1,
            }).dxChart('instance');


        },
        error: function (jqXHR) {
            // Handle error
        }
    });
}



//Calendar chart

// Sample data for the month box chart
const data = [
    { month: 'January', min: 10, max: 30 },
    { month: 'February', min: 20, max: 40 },
    { month: 'March', min: 15, max: 35 },
    // Add more data for other months
];

// Function to create the month box chart
function createMonthBoxChart() {
    const chart = new Chart('#boxChart', {
        type: 'boxplot',
        data: {
            labels: data.map(item => item.month),
            datasets: [{
                data: data.map(item => [item.min, item.max]),
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Month Box Chart',
            },
            //scales: {
            //    yAxes: [{
            //        scaleLabel: {
            //            display: true,
            //            labelString: 'Temperature',
            //        },
            //    }],
            //},
        },
    });
}

// Call the function to create the month box chart
createMonthBoxChart();



$('#Year').dxSelectBox({
    items: ["2021", "2022", "2023"],
    placeholder: 'Select Year',

});



//month drop down
// Populate the array with month names
var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// Create a drop-down list using DevExpress
$("#dropdown").dxSelectBox({
    showClearButton: true,
    searchEnabled: true,
    dataSource: months,
    placeholder: "Select a month"
});




//year drop down
var currentYear = new Date().getFullYear();

// Generate an array of years
var years = [];
for (var i = currentYear; i >= currentYear - 10; i--) {
    years.push(i.toString());
}

// Create a drop-down list using DevExpress
$("#Yeardropdown").dxSelectBox({
    showClearButton: true,
    searchEnabled: true,
    dataSource: years,
    placeholder: "Select a year"
});



//sates drop down


// Array of Indian states
var states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry"
];

// Create a drop-down list using DevExpress
$("#Statedropdown").dxSelectBox({
    showClearButton: true,
    searchEnabled: true,
    dataSource: states,
    placeholder: "Select a state"
});



$('#SalesManager').dxSelectBox({
    items: [],
    displayExpr: "LedgerName",
    valueExpr: "LedgergroupID",
    searchEnabled: true,
    placeholder: 'Select Your Sales Manager ',
    showClearButton: true,
});


SalesManager();
function SalesManager() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/SalesManager',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: "{LedgerGroupID: 3}",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.substr(1);
            res = res.slice(0, -1);
            //alert(res);
            var RES1 = JSON.parse(res);
            $('#SalesManager').dxSelectBox({
                items: RES1,
                displayExpr: "LedgerName",
                valueExpr: "LedgerGroupID"
            });
        },
        error: function (jqXHR) {
            // alert("not show");
        }
    });
}
