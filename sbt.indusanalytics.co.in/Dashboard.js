"use strict";
// Data for the pie chart
var salesData = {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [{
        data: [3000, 4500, 2000, 3500],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#33FF8E"]
    }]
};

// Create the pie chart
var ctx = document.getElementById("salesChart").getContext("2d");
var salesChart = new Chart(ctx, {
    type: 'pie',
    data: salesData
});
//progressBarFill1
$(() => {
    const chartInstance = $('#chart').dxChart({
        dataSource: dataSource2,
        series: {
            argumentField: 'name',
            valueField: 'height',
            type: 'bar',
            color: '#E55253',
        },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                        + `System: ${arg.point.data.system}<br />Height: ${arg.valueText} m`,
                };
            },
        },
        title: 'Sales By Manager',
        legend: {
            visible: false,
        },
        argumentAxis: {
            visible: true,
        },
        valueAxis: {
            visualRange: {
                startValue: 8000,
            },
            label: {
                customizeText() {
                    return `${this.value} m`;
                },
            },
        },
    }).dxChart('instance');

});

const dataSource2 = [{
    name: 'Everest',
    height: 8848,
    system: 'Mahalangur Himalaya',
}, {
    name: 'Godwin Austen',
    height: 8611,
    system: 'Baltoro Karakoram',
}, {
    name: 'Kangchenjunga',
    height: 8586,
    system: 'Kangchenjunga Himalaya',
}, {
    name: 'Lhotse',
    height: 8516,
    system: 'Mahalangur Himalaya',
}, {
    name: 'Makalu',
    height: 8485,
    system: 'Mahalangur Himalaya',
}, {

    name: 'Makalu',
    height: 8485,
    system: 'Mahalangur Himalaya',
}, {

    name: 'Makalu',
    height: 8485,
    system: 'Mahalangur Himalaya',
}, {
    name: 'Cho Oyu',
    height: 8188,
    system: 'Mahalangur Himalaya',
}];


//3 bar
$(() => {
    $('#barchart').dxChart({
        rotated: true,
        pointSelectionMode: 'multiple',
        dataSource: dataSource3d,
        commonSeriesSettings: {
            argumentField: 'country',
            type: 'stackedbar',
            selectionStyle: {
                hatching: {
                    direction: 'left',
                },
            },
        },
        series: [
            { valueField: 'gold', name: 'Gold Medals', color: '#ffd700' },
            //    { valueField: 'silver', name: 'Silver Medals', color: '#c0c0c0' },
            //    { valueField: 'bronze', name: 'Bronze Medals', color: '#cd7f32' },
        ],
        title: {
            text: 'Sales By Sactore',
        },
        export: {
            enabled: true,
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
        },
    });
});
const dataSource3d = [{
    country: 'Banking',

    gold: 25000,
    //silver: 38,
    //bronze: 36,
}, {
    country: 'Electronics',
    gold: 50000,
    //silver: 21,
    //bronze: 28,
}, {
    country: 'Healthcare',
    gold: 25000,
    //silver: 38,
    //bronze: 36,
}, {
    country: 'Retail',
    gold: 50000,
    //silver: 21,
    //bronze: 28,
}, {
    country: 'Telecom',
    gold: 75000,
    //silver: 21,
    //bronze: 28,
}, {
    country: 'GrandTotal',

    gold: 100000,
    //silver: 13,
    //bronze: 15,
}];

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
        dataSource: dataSource5th,
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
                color: '#2e61ec',
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
        onPointClick(e) {
            const point = e.target;
            if (point.isSelected()) {
                point.clearSelection();
            } else {
                point.select();
            }
        },
    }).dxChart('instance');

    chart.getSeriesByPos(0).getPointsByArg('MP')[0].select();
});

const dataSource5th = [{
    breed: 'Brands',
    count: 62942,
}, {
    breed: 'Panjab',
    count: 38287,
}, {
    breed: 'HP',
    count: 15652,
}, {
    breed: 'Goa',
    count: 13670,
}, {
    breed: 'MP',
    count: 13377,
}];


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
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature',
                    },
                }],
            },
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
