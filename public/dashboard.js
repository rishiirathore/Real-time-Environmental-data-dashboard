// Chart instances
let pmChart, tempHumidityChart, pressureChart, windChart;

// Initialize charts with data
function initCharts(data) {
  // Set up PM2.5 & PM10 chart
  const pmCtx = document.getElementById('pmChart').getContext('2d');
  pmChart = new Chart(pmCtx, {
    type: 'line',
    data: {
      labels: data.timeLabels,
      datasets: [
        {
          label: 'PM2.5',
          data: data.pm25Data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true
        },
        {
          label: 'PM10',
          data: data.pm10Data,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'μg/m³'
          }
        }
      }
    }
  });

  // Set up Temperature & Humidity chart
  const tempHumidityCtx = document.getElementById('tempHumidityChart').getContext('2d');
  tempHumidityChart = new Chart(tempHumidityCtx, {
    type: 'line',
    data: {
      labels: data.timeLabels,
      datasets: [
        {
          label: 'Temperature',
          data: data.temperatureData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Humidity',
          data: data.humidityData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: '°C'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: '%'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });

  // Set up Pressure chart
  const pressureCtx = document.getElementById('pressureChart').getContext('2d');
  pressureChart = new Chart(pressureCtx, {
    type: 'line',
    data: {
      labels: data.timeLabels,
      datasets: [
        {
          label: 'Pressure',
          data: data.pressureData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'hPa'
          }
        }
      }
    }
  });

  // Set up Wind Speed chart
  const windCtx = document.getElementById('windChart').getContext('2d');
  windChart = new Chart(windCtx, {
    type: 'line',
    data: {
      labels: data.timeLabels,
      datasets: [
        {
          label: 'Wind Speed',
          data: data.windData,
          borderColor: 'rgba(40, 167, 69, 1)',
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          tension: 0.1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'm/s'
          }
        }
      }
    }
  });
}

// Update charts with new data
function updateCharts(data) {
  // Add subtle animation when updating charts
  const updateOptions = {
    duration: 800,
    easing: 'easeOutQuad'
  };
  
  if (pmChart) {
    pmChart.data.labels = data.timeLabels;
    pmChart.data.datasets[0].data = data.pm25Data;
    pmChart.data.datasets[1].data = data.pm10Data;
    pmChart.update(updateOptions);
  }

  if (tempHumidityChart) {
    tempHumidityChart.data.labels = data.timeLabels;
    tempHumidityChart.data.datasets[0].data = data.temperatureData;
    tempHumidityChart.data.datasets[1].data = data.humidityData;
    tempHumidityChart.update(updateOptions);
  }

  if (pressureChart) {
    pressureChart.data.labels = data.timeLabels;
    pressureChart.data.datasets[0].data = data.pressureData;
    pressureChart.update(updateOptions);
  }

  if (windChart) {
    windChart.data.labels = data.timeLabels;
    windChart.data.datasets[0].data = data.windData;
    windChart.update(updateOptions);
  }
}

// Update the latest readings with fade-in effect
function updateLatestReadings(data) {
  const elements = [
    { id: 'latestPM25', value: `${data.latestReading['PM2.5']} μg/m³` },
    { id: 'latestPM10', value: `${data.latestReading.PM10} μg/m³` },
    { id: 'latestTemp', value: `${data.latestReading.Temperature} °C` },
    { id: 'latestHumidity', value: `${data.latestReading.Humidity} %` }
  ];
  
  elements.forEach(item => {
    const element = document.getElementById(item.id);
    if (element && element.textContent !== item.value) {
      // Apply a subtle highlight effect for changed values
      element.textContent = item.value;
      element.classList.add('bg-yellow-50');
      setTimeout(() => {
        element.classList.remove('bg-yellow-50');
      }, 1000);
    }
  });
}

// Update the data table
function updateDataTable(data) {
  const tableBody = document.getElementById('dataTableBody');
  let tableHTML = '';
  
  data.rawData.forEach(row => {
    tableHTML += `
      <tr>
        <td class="px-4 py-2 border-b border-gray-200">${row.Date}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row.Time}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row['PM2.5']}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row.PM10}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row.Temperature}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row.Humidity}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row.Pressure}</td>
        <td class="px-4 py-2 border-b border-gray-200">${row['Wind Speed']}</td>
      </tr>
    `;
  });
  
  // Apply a fade-in effect
  tableBody.style.opacity = '0.5';
  tableBody.innerHTML = tableHTML;
  setTimeout(() => {
    tableBody.style.opacity = '1';
  }, 100);
}

// Update last updated timestamp
function updateLastUpdated() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  document.getElementById('lastUpdated').textContent = `Last updated: ${formattedTime}`;
}