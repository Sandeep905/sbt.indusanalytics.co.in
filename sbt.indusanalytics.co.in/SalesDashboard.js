"use strict";

///////////////////////////////////////////////////////////////////////////////////////PEHLA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(() => {
    const chart = $('#dxchart').dxChart({
        palette: 'Violet',
        dataSource: dataSourceChart,
        commonSeriesSettings: {
            argumentField: 'country',
            type: types[0],
        },
        margin: {
            bottom: 20,
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: 'crossLabels',
            grid: {
                visible: true,
            },
        },
        series: [
            { valueField: 'hydro', name: 'Hydro-electric' },
            { valueField: 'oil', name: 'Oil' },
            { valueField: 'gas', name: 'Natural gas' },
            { valueField: 'coal', name: 'Coal' },
            { valueField: 'nuclear', name: 'Nuclear' },
        ],
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
            itemTextPosition: 'bottom',
        },
        title: {
            text: 'SALES COMPARISON',
            font: {
                size: 14 // Specify the desired font size here
            }
        },
        export: {
            enabled: true,
        },
        tooltip: {
            enabled: true,
        },
    }).dxChart('instance');

    $('#types').dxSelectBox({
        dataSource: types,
        value: types[0],
        onValueChanged(e) {
            chart.option('commonSeriesSettings.type', e.value);
        },
    });
});

const dataSourceChart = [{
    country: 'USA',
    hydro: 71.2,
    oil: 910.4,
    gas: 483.2,
    coal: 564.3,
    nuclear: 216.1,
}, {
    country: 'China',
    hydro: 72.5,
    oil: 223.6,
    gas: 36,
    coal: 956.9,
    nuclear: 11.3,
}, {
    country: 'Russia',
    hydro: 47.7,
    oil: 149.4,
    gas: 432.3,
    coal: 105,
    nuclear: 29.3,
}, {
    country: 'Japan',
    hydro: 17.9,
    oil: 283.6,
    gas: 61.8,
    coal: 120.8,
    nuclear: 52.8,
}, {
    country: 'India',
    hydro: 14.4,
    oil: 86.4,
    gas: 25.1,
    coal: 204.8,
    nuclear: 3.8,
}, {
    country: 'Germany',
    hydro: 6.6,
    oil: 101.7,
    gas: 92.7,
    coal: 85.7,
    nuclear: 30.8,
}];

const types = ['line', 'stackedline', 'fullstackedline'];


////////////////////////////////////////////////////////////////////////////////////////////////DUSRA//////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(() => {
    $('#pie').dxPieChart({
        type: 'doughnut',
        palette: 'Soft Pastel',
        title: {
            text: 'SALES BY PRODUCT CATEGORY',
            font: {
                size: 14 // Specify the desired font size here
            }
        },
        dataSource,
        legend: {
            horizontalAlignment: 'center',
            verticalAlignment: 'bottom',
        },
        export: {
            enabled: true,
        },
        series: [{
            smallValuesGrouping: {
                mode: 'topN',
                topCount: 3,
            },
            argumentField: 'language',
            valueField: 'percent',
            label: {
                visible: true,
                format: 'fixedPoint',
                customizeText(point) {
                    return `${point.argumentText}: ${point.valueText}%`;
                },
                connector: {
                    visible: true,
                    width: 1,
                },
            },
        }],
    });
});

const dataSource = [{
    language: 'English',
    percent: 55.5,
}, {
    language: 'Chinese',
    percent: 4.0,
}, {
    language: 'Spanish',
    percent: 4.3,
}, {
    language: 'Japanese',
    percent: 4.9,
}, {
    language: 'Portuguese',
    percent: 2.3,
}, {
    language: 'German',
    percent: 5.6,
}, {
    language: 'French',
    percent: 3.8,
}, {
    language: 'Russian',
    percent: 6.3,
}, {
    language: 'Italian',
    percent: 1.6,
}, {
    language: 'Polish',
    percent: 1.8,
}];


///////////////////////////////////////////////////////////////////////////////////////TISRA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(() => {
    $('#chart').dxChart({
        dataSource: populationData,
        legend: {
            visible: false,
        },
        series: {
            type: 'bar',
        },
        argumentAxis: {
            tickInterval: 10,
            label: {
                format: {
                    type: 'decimal',
                },
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

const populationData = [{
    arg: 1960,
    val: 3032019978,
}, {
    arg: 1970,
    val: 3683676306,
}, {
    arg: 1980,
    val: 4434021975,
}, {
    arg: 1990,
    val: 5281340078,
}, {
    arg: 2000,
    val: 6115108363,
}, {
    arg: 2010,
    val: 6922947261,
}, {
    arg: 2020,
    val: 7795000000,
}];


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


document.addEventListener('DOMContentLoaded', function () {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    var revenueData = [5000, 8000, 10000, 7500, 12000, 9000];

    var ctx = document.getElementById('revenueChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Revenue',
                data: revenueData,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Monthly Revenue'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Months'
                    }
                }
            }
        }
    });
});















//////////////////////////////////////////////////////////////////////////////////////////////////////////NEW COSTOMER////////////////////////////////////////////////////////////////////////////////////////////


// Data for the customer chart
var customerData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        label: 'New Customers',
        data: [50, 70, 60, 80, 90, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Set the background color
        borderColor: 'rgba(54, 162, 235, 1)', // Set the border color
        borderWidth: 1 // Set the border width
    }]
};

// Chart configuration
var chartConfig = {
    type: 'bar', // Set the chart type (e.g., 'bar', 'line', 'pie')
    data: customerData, // Set the chart data
    options: {
        responsive: true, // Make the chart responsive
        scales: {
            y: {
                beginAtZero: true // Start the y-axis from zero
            }
        }
    }
};

// Create the customer chart
var customerChart = new Chart(document.getElementById('customerChart'), chartConfig);

////////////////////////////////////////////////////////////////////////////////////GROSS PROFIT/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sample data representing gross profit values
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
var grossProfit = [5000, 6000, 4500, 7000, 8000, 6500];

// Creating the chart
var ctx = document.getElementById('grossProfitChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [{
            label: 'Gross Profit',
            data: grossProfit,
            backgroundColor: 'rgba(0, 123, 255, 0.3)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
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
                    text: 'Profit ($)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        }
    }
});


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
