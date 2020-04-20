const ctx = document.getElementById('myChart').getContext('2d');

const getColors = async () => {
    let res = await fetch('https://globalcolors.glitch.me/api/v1/all?nbw&set=primary&types=hex&countries=HRV,IRL,ITA,GRC,PRT')
    let data = await res.json()
    return data.Europe.countries
}

getColors()

const buildChart = async () => {

    const countries = await getColors();

    const data = {
        "labels": [
            "Croatia",
            "Ireland",
            "Italy",
            "Greece",
            "Portugal"
        ],
        "datasets": [{
            "backgroundColor": [
                countries.Croatia.primary.hex[0],
                countries.Ireland.primary.hex[0],
                countries.Italy.primary.hex[1],
                countries.Greece.primary.hex[0],
                countries.Portugal.primary.hex[0]
            ],
            "data": [
                "125695",
                "157818",
                "294641",
                "445537",
                "493464"
            ],
        }]
    };

    const options = {
        "title": {
            "display": true,
            "text": "The Best Countries in Europe 2020",
            "position": "bottom",
            "fullWidth": true,
            "fontColor": "#000000",
            "fontSize": 16,
            "fontFamily": "arial"
        },
        "legend": {
            "display": false
        },
        "scales": {
            "yAxes": [{
                "ticks": {
                    "beginAtZero": true,
                    "display": true
                },
                "scaleLabel": {
                    "display": true,
                    "labelString": "Votes"
                }
            }],
            "xAxes": {
                "0": {
                    "ticks": {
                        "display": true,
                        "fontSize": 14,
                        "fontStyle": "italic"
                    },
                    "display": true
                }
            }
        },
        "tooltips": {
            "enabled": false
        }
    };

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

buildChart()
