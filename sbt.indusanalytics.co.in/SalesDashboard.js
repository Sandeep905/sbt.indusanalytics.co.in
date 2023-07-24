"use strict";

///////////////////////////////////////////////////////////////////////////////////////PEHLA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(() => {
    const chart = $('#dxchart').dxChart({
        palette: 'Violet',
        commonSeriesSettings: {
            argumentField: 'State',
        },
        series: [
            { valueField: 'TotalAmount', name: 'Total Amount' },
            { valueField: 'SM', name: 'SM' },
        ],
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'bottom',
        },
        title: {
            text: 'Sales Comparison',
            font: {
                size: 14,
            },
        },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                return {
                    text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                        + `Total Amount: ${arg.valueText} ₹`,
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
        argumentAxis: {
            visible: true,
        },
        export: {
            enabled: true,
        },
        tooltip: {
            enabled: true,
        },
        scrollBar: {
            visible: true,
        },
        zoomAndPan: {
            argumentAxis: 'both',
        },
    }).dxChart('instance');

    dxchart(chart);
});

function dxchart(chart) {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/dxchart',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ LedgerGroupID: 3 }),
        crossDomain: true,
        xhrFields: {
            withCredentials: true,
        },
        success: function (results) {
            var res = results.d.replace(/\\/g, '');
            res = res.replace(/"d":/g, '');
            res = res.replace(/u0026/g, '&');
            res = res.substr(1);
            res = res.slice(0, -1);
            var RES1 = convertDataToDesiredFormat(JSON.parse(res));
            console.log(RES1);
            chart.option('dataSource', RES1);
            chart.option('series', createDistinctSeriesArray(JSON.parse(res)))
        },
        error: function (jqXHR) {
            // Handle the error
        },
    });
}

function createDistinctSeriesArray(data) {
    const series = [];
    const salesManagers = {};

    for (const item of data) {
        const { SM } = item;

        if (!salesManagers[SM]) {
            salesManagers[SM] = true;
            series.push({ valueField: SM, name: SM });
        }
    }

    return series;
}
function convertDataToDesiredFormat(data) {
    const result = {};

    for (const item of data) {
        const { State, SM, TotalAmount } = item;

        if (!result[State]) {
            result[State] = { State };
        }

        result[State][SM] = TotalAmount;
    }

    return Object.values(result);
}

////////////////////////////////////////////////////////////////////////////////////////////////DUSRA//////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    PieChart();
});

function PieChart() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/categoryPieChart',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
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
            $('#pie').dxPieChart({
                type: 'doughnut',
                palette: 'Soft Pastel',
                title: {
                    text: 'SALES BY PRODUCT CATEGORY',
                    font: {
                        size: 14 // Specify the desired font size here
                    }
                },
                legend: {
                    horizontalAlignment: 'center',
                    verticalAlignment: 'bottom',
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
                series: [{
                    argumentField: 'CategoryName',
                    valueField: 'TotalSale',
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
                dataSource: RES1
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown);
            // Handle the error
        }
    });
}





///////////////////////////////////////////////////////////////////////////////////////TISRA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(() => {
    $('#chart').dxChart({
        //dataSource: populationData,
        //legend: {
        //    visible: false,
        //},
        //series: {
        //    type: 'bar',
        //},
        //argumentAxis: {
        //    tickInterval: 10,
        //    label: {
        //        format: {
        //            type: 'decimal',
        //        },
        //    },
        //},

        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
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
        series: [{
            argumentField: 'Month',
            valueField: 'TotalSales',
            hoverEnabled: true,
            type: 'bar',
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
        title: {
            text: 'SALES BY MONTH',
            font: {
                size: 14 // Specify the desired font size here
            }
        }
    });
});




MonthDATA();
function MonthDATA() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/MonthDATA',
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
            console.log(RES1);
            $('#chart').dxChart({
                dataSource: RES1,
            }).dxChart('instance');


        },
        error: function (jqXHR) {
            // Handle error
        }
    });
}


/////////////////////////////////////////////////////////////////////////////CHOTHA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(() => {
    $('#treemap').dxTreeMap({
        dataSource: citiesPopulation,
        size: {
            height: 418,
        },
        title: {
            text: 'BRAND PROFITABILITY',
            font: {
                size: 14 // Specify the desired font size here
            }
        },
        colorizer: {
            palette: 'soft',
        },
        interactWithGroup: true,
        maxDepth: 2,
        onClick(e) {
            e.node.drillDown();
        },
        onDrill(e) {
            const markup = $('#drill-down-title').empty();
            let node;
            for (node = e.node.getParent(); node; node = node.getParent()) {
                markup.prepend(' > ').prepend($('<span />')
                    .addClass('link')
                    .text(node.label() || 'All Continents')
                    .data('node', node)
                    .on('dxclick', onLinkClick));
            }
            if (markup.children().length) {
                markup.append(e.node.label());
            }
        },
    });

    function onLinkClick(e) {
        $(e.target).data('node').drillDown();
    }
});


const citiesPopulation = [{
    name: 'Africa',
    items: [{
        name: 'Nigeria',
        items: [{
            name: 'Lagos',
            value: 21324000,
        }, {
            name: 'Kano',
            value: 3626068,
        }, {
            name: 'Ibadan',
            value: 3200000,
        }, {
            name: 'Abuja',
            value: 3000000,
        }, {
            name: 'Kaduna',
            value: 1652844,
        }, {
            name: 'Port Harcourt',
            value: 1320214,
        }, {
            name: 'Aba',
            value: 1300000,
        }, {
            name: 'Ogbomosho',
            value: 1200000,
        }, {
            name: 'Maiduguri',
            value: 1197497,
        }],
    }, {
        name: 'Egypt',
        items: [{
            name: 'Cairo',
            value: 9278441,
        }, {
            name: 'Alexandria',
            value: 4546231,
        }, {
            name: 'Giza',
            value: 4239988,
        }, {
            name: 'Shubra El-Kheima',
            value: 3072951,
        }, {
            name: 'Port Said',
            value: 1607353,
        }, {
            name: 'Suez',
            value: 1347352,
        }],
    }, {
        name: 'Congo',
        items: [{
            name: 'Kinshasa',
            value: 9735000,
        }, {
            name: 'Lubumbashi',
            value: 1786397,
        }, {
            name: 'Mbuji-Mayi',
            value: 1680991,
        }, {
            name: 'Kananga',
            value: 1061181,
        }, {
            name: 'Bukavu',
            value: 1012053,
        }, {
            name: 'Kisangani',
            value: 935977,
        }],
    }, {
        name: 'Morocco',
        items: [{
            name: 'Casablanca',
            value: 3359818,
        }, {
            name: 'Fès',
            value: 1112072,
        }, {
            name: 'Tangier',
            value: 947952,
        }, {
            name: 'Marrakech',
            value: 928850,
        }, {
            name: 'Salé',
            value: 920403,
        }],
    }],
}, {
    name: 'Asia',
    items: [{
        name: 'China',
        items: [{
            name: 'Shanghai',
            value: 24256800,
        }, {
            name: 'Beijing',
            value: 21516000,
        }, {
            name: 'Chongqing',
            value: 18384100,
        }, {
            name: 'Chengdu',
            value: 17677122,
        }, {
            name: 'Tianjin',
            value: 15200000,
        }, {
            name: 'Guangzhou',
            value: 13080500,
        }, {
            name: 'Shenzhen',
            value: 10630000,
        }],
    }, {
        name: 'Pakistan',
        items: [{
            name: 'Karachi',
            value: 23500000,
        }, {
            name: 'Faisalabad',
            value: 6418745,
        }, {
            name: 'Lahore',
            value: 6318745,
        }, {
            name: 'Rawalpindi',
            value: 3363911,
        }, {
            name: 'Hyderabad',
            value: 3429471,
        }, {
            name: 'Multan',
            value: 2050000,
        }],
    }, {
        name: 'India',
        items: [{
            name: 'Delhi',
            value: 16787941,
        }, {
            name: 'Mumbai',
            value: 12478447,
        }, {
            name: 'Bengaluru',
            value: 8425970,
        }, {
            name: 'Hyderabad',
            value: 7749334,
        }, {
            name: 'Chennai',
            value: 7088000,
        }, {
            name: 'Ahmedabad',
            value: 5577940,
        }],
    }, {
        name: 'Japan',
        items: [{
            name: 'Tokyo',
            value: 9262046,
        }, {
            name: 'Yokohama',
            value: 3697894,
        }, {
            name: 'Osaka',
            value: 2668586,
        }, {
            name: 'Nagoya',
            value: 2283289,
        }, {
            name: 'Sapporo',
            value: 1918096,
        }],
    }],
}, {
    name: 'Europe',
    items: [{
        name: 'Turkey',
        items: [{
            name: 'Istanbul',
            value: 14160467,
        }, {
            name: 'Ankara',
            value: 4470800,
        }, {
            name: 'İzmir',
            value: 3276815,
        }, {
            name: 'Bursa',
            value: 1957247,
        }, {
            name: 'Adana',
            value: 1717473,
        }],
    }, {
        name: 'Russia',
        items: [{
            name: 'Moscow',
            value: 12197596,
        }, {
            name: 'Saint Petersburg',
            value: 5191690,
        }, {
            name: 'Novosibirsk',
            value: 1473754,
        }, {
            name: 'Yekaterinburg',
            value: 1428042,
        }],
    }, {
        name: 'United Kingdom',
        items: [{
            name: 'London',
            value: 8538689,
        }, {
            name: 'Birmingham',
            value: 1101360,
        }, {
            name: 'Glasgow',
            value: 599650,
        }, {
            name: 'Liverpool',
            value: 473073,
        }],
    }, {
        name: 'Germany',
        items: [{
            name: 'Berlin',
            value: 3517424,
        }, {
            name: 'Hamburg',
            value: 1686100,
        }, {
            name: 'Munich',
            value: 1185400,
        }, {
            name: 'Cologne',
            value: 1046680,
        }, {
            name: 'Frankfurt',
            value: 717624,
        }],
    }, {
        name: 'France',
        items: [{
            name: 'Paris',
            value: 2240621,
        }, {
            name: 'Marseille',
            value: 852516,
        }, {
            name: 'Lyon',
            value: 500715,
        }, {
            name: 'Toulouse',
            value: 461190,
        }],
    }],
}, {
    name: 'North America',
    items: [{
        name: 'Mexico',
        items: [{
            name: 'Mexico City',
            value: 8874724,
        }, {
            name: 'Ecatepec de Morelos',
            value: 1742023,
        }, {
            name: 'Puebla',
            value: 1508707,
        }, {
            name: 'Guadalajara',
            value: 1506359,
        }, {
            name: 'Juárez',
            value: 1409987,
        }, {
            name: 'Tijuana',
            value: 1399282,
        }, {
            name: 'León',
            value: 1281434,
        }],
    }, {
        name: 'United States',
        items: [{
            name: 'New York City',
            value: 8550405,
        }, {
            name: 'Los Angeles',
            value: 3884307,
        }, {
            name: 'Chicago',
            value: 2722389,
        }, {
            name: 'Houston',
            value: 2296224,
        }, {
            name: 'Philadelphia',
            value: 1567442,
        }, {
            name: 'Phoenix',
            value: 1563025,
        }, {
            name: 'San Antonio',
            value: 1469845,
        }, {
            name: 'San Diego',
            value: 1394928,
        }],
    }, {
        name: 'Canada',
        items: [{
            name: 'Toronto',
            value: 2808503,
        }, {
            name: 'Montreal',
            value: 1731245,
        }, {
            name: 'Calgary',
            value: 1096833,
        }, {
            name: 'Ottawa',
            value: 956710,
        }, {
            name: 'Edmonton',
            value: 895000,
        }, {
            name: 'Mississauga',
            value: 713443,
        }],
    }, {
        name: 'Cuba',
        items: [{
            name: 'Havana',
            value: 2135498,
        }, {
            name: 'Santiago de Cuba',
            value: 425851,
        }, {
            name: 'Camagüey',
            value: 305845,
        }],
    }],
}, {
    name: 'South America',
    items: [{
        name: 'Brazil',
        items: [{
            name: 'São Paulo',
            value: 11895893,
        }, {
            name: 'Rio de Janeiro',
            value: 6429923,
        }, {
            name: 'Salvador',
            value: 2902927,
        }, {
            name: 'Brasília',
            value: 2914830,
        }, {
            name: 'Fortaleza',
            value: 2591188,
        }, {
            name: 'Belo Horizonte',
            value: 2513451,
        }, {
            name: 'Manaus',
            value: 2094391,
        }],
    }, {
        name: 'Peru',
        items: [{
            name: 'Lima',
            value: 8693387,
        }, {
            name: 'Callao',
            value: 1010315,
        }, {
            name: 'Arequipa',
            value: 869351,
        }, {
            name: 'Trujillo',
            value: 788236,
        }, {
            name: 'Chiclayo',
            value: 600440,
        }],
    }, {
        name: 'Colombia',
        items: [{
            name: 'Bogotá',
            value: 7776845,
        }, {
            name: 'Medellín',
            value: 2441123,
        }, {
            name: 'Cali',
            value: 2400653,
        }, {
            name: 'Barranquilla',
            value: 1214253,
        }, {
            name: 'Cartagena',
            value: 959594,
        }],
    }, {
        name: 'Chile',
        items: [{
            name: 'Santiago',
            value: 5507282,
        }, {
            name: 'Puente Alto',
            value: 610118,
        }, {
            name: 'Maipú',
            value: 468390,
        }],
    }, {
        name: 'Venezuela',
        items: [{
            name: 'Caracas',
            value: 3289886,
        }, {
            name: 'Maracaibo',
            value: 1653211,
        }, {
            name: 'Barquisimeto',
            value: 1116182,
        }, {
            name: 'Valencia',
            value: 901900,
        }, {
            name: 'Ciudad Guayana',
            value: 877547,
        }],
    }],
}];


/////////////////////////////////////////////////////////////PACHVA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Revenue() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/Revenue',
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

            var months = RES1.map(data => data.Month);
            var revenueData = RES1.map(data => data.MonthlyRevenue);

            var ctx = document.getElementById('revenueChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: revenueData,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        borderWidth: 1
                    }]
                },
                tooltip: {
                    enabled: true,
                    contentTemplate(arg) {
                        const { originalArgument, originalValue } = arg.point;
                        return `<div><strong>${originalArgument}</strong><br>Total Sales: ${originalValue}</div>`;
                    },
                },
                legend: {
                    horizontalAlignment: 'center',
                    verticalAlignment: 'bottom',
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
                //options: {
                //    responsive: true,
                //    //title: {
                //    //    display: true,
                //    //    text: 'Monthly Revenue'
                //    //},
                //    scales: {
                //        y: {
                //            beginAtZero: true,
                //            title: {
                //                display: true,
                //                text: 'Revenue (₹)'
                //            }
                //        },
                //        x: {
                //            title: {
                //                display: true,
                //                text: 'Months'
                //            }
                //        }
                //    }
                //}
            });
        },
        error: function (jqXHR) {
            // Handle error
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    Revenue();
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////NEW COSTOMER////////////////////////////////////////////////////////////////////////////////////////////

var chartConfig = {
    type: 'bar',
    data: {},
    tooltip: {
        enabled: true,
        contentTemplate(arg) {
            const { originalArgument, originalValue } = arg.point;
            return `<div><strong>${originalArgument}</strong><br>Total Sales: ${originalValue}</div>`;
        },
    },
    legend: {
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
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
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

};

// Create the customer chart
var customerChart = new Chart(document.getElementById('customerChart'), chartConfig);

// Function to fetch data and update the chart
function fetchDataAndUpdateChart() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/NewCustomer',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ LedgerGroupID: 1 }),
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
            var customerData = JSON.parse(res); // Parse the received data

            // Prepare the chart data
            var labels = customerData.map(item => item.Month);
            var newCustomers = customerData.map(item => item.NewCustomers);
            console.log(newCustomers);
            // Update the chart data
            customerChart.data = {
                labels: labels,
                datasets: [{
                    label: 'New Customers',
                    data: newCustomers,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            };

            // Update the chart
            customerChart.update();
        },
        error: function (jqXHR) {
            // Handle the error
        }
    });
}

// Call the function to fetch data and update the chart
fetchDataAndUpdateChart();


////////////////////////////////////////////////////////////////////////////////////GROSS PROFIT/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var grossProfitChart = new Chart(document.getElementById('grossProfitChart'), chartConfig);


// Function to fetch data and update the chart
function fetchGrossProfitData() {
    $.ajax({
        type: 'post',
        url: 'WebServiceDashboard.asmx/GrossProfit',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ LedgerGroupID: 1 }),
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
            var grossProfitData = JSON.parse(res); // Parse the received data

            // Prepare the chart data
            var Month = grossProfitData.map(item => item.Month);
            var GrossProfit = grossProfitData.map(item => item.GrossProfit);
         
            // Update the chart data
            grossProfitChart.data = {
                labels: Month,
                datasets: [{
                    label: 'Gross Profit',
                    data: GrossProfit,
                    backgroundColor: 'rgba(0, 123, 255, 0.3)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            };

            // Update the chart
            grossProfitChart.update();
        },
        error: function (jqXHR) {
            // Handle the error
        }
    });
}

// Call the function to fetch data and update the chart
fetchGrossProfitData();



var chart = {
    type: 'bar',
    data: {},
    tooltip: {
        enabled: true,
        contentTemplate(arg) {
            const { originalArgument, originalValue } = arg.point;
            return `<div><strong>${originalArgument}</strong><br>Total Sales: ${originalValue}</div>`;
        },
    },
    legend: {
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
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
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Gross Profit'
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Profit (₹)'
                }
            },
        },
         x: {
            title: {
                display: true,
                text: 'Months'
            }
        }
    }

};



/////////////////////////////////////////////////////////////////////////////////////Customer satisfaction////////////////////////////////////////////////////////////////////////////////////////////////////////



// Sample data for customer satisfaction (percentage)
var satisfactionData = [80, 75, 90, 85, 70];

// Create the chart
var ctx = document.getElementById('customerSatisfactionChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
            label: 'Customer Satisfaction',
            data: satisfactionData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Adjust the color as desired
            borderColor: 'rgba(54, 162, 235, 1)', // Adjust the color as desired
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100, // Adjust the maximum value as needed
                title: {
                    display: true,
                    text: 'Satisfaction Percentage'
                }
            }
        }
    }
});
