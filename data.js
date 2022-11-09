const deg = String.fromCharCode(176);

async function getData() {
    const xTemp = [];
    const yMass = [];

    const response = await fetch('data.csv');
    const data = await response.text();

    const table = data.split('\n').slice(1);

    table.forEach(row => {
        const columns = row.split(',');
        const temp = parseFloat(columns[0]);
        xTemp.push(temp);
        const mass = parseFloat(columns[3]);
        yMass.push(mass);
    })

    return{xTemp, yMass}
}

async function createChart() {
    const data = await getData();

    const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['27/22℃', '12/8℃', '4/0℃'],
        datasets: [{
            label: '',
            data: data.yMass,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,                   // Re-size based on screen size
        scales: {                           // x & y axes display options
            x: {
                title: {
                    display: true,
                    text: 'Temperature (℃)',
                    font: {
                        size: 20
                    },
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Mass (mg)',
                    font: {
                        size: 20
                    },
                }
            }
        },
        plugins: {                          // title and legend display options
            title: {
                display: true,
                text: 'Mean Masses of Simple Sugar Content',
                font: {
                    size: 24
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    }
});
}

createChart();