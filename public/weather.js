// Make a request to the weather API
fetch('https://api.weather.gov/points/39.7456,-97.0892')
    .then(response => response.json())
    .then(data => {
        // Extract relevant data from the API response
        const forecastUrl = data.properties.forecast;

        // Make a request to the forecast URL
        return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(data => {
        // Extract the temperature data for the chart
        const temperatureData = data.properties.periods.map(period => period.temperature);

        // chart with the weather API
        new Chart("weatherChart", {
            type: 'line',
            data: {
                labels: data.properties.periods.map(period => period.name),
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatureData,
                    borderColor: 'rgba(0, 0, 153, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

const apiKey = "d78fa387d2a76febe985741c1ed360dc";
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Now you can use data.list safely
        const timestamps = data.list.map(entry => entry.dt_txt);
        const temperatures = data.list.map(entry => entry.main.temp);
        const cloudiness = data.list.map(entry => entry.clouds.all);
        const windSpeed = data.list.map(entry => entry.wind.speed);
        const weatherConditions = data.list.map(entry => entry.weather[0].main);
        const uniqueConditions = [...new Set(weatherConditions)];
        const conditionCounts = uniqueConditions.map(condition => {
            return weatherConditions.filter(c => c === condition).length;
        });
        const secondChart = new Chart("secondChart", {
            type: "bar",
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Cloudiness (%)',
                        data: cloudiness,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust color as needed
                        borderColor: 'rgba(75, 192, 192, 1)', // Adjust color as needed
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'MMM D h:mm A',
                            },
                        },
                        title: {
                            display: true,
                            text: 'Time',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cloudiness (%)',
                        },
                    },
                },
            }
        });

        const thirdChart = new Chart("thirdChart", {
            type: "line",
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Temperature (K)',
                        data: temperatures,
                        borderColor: 'rgba(75, 192, 192, 1)', // change color
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                hour: 'MMM D h:mm A',
                            },
                        },
                        title: {
                            display: true,
                            text: 'Time',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Temperature (K)',
                        },
                    },
                },
            },
        });

        const fourthChart = new Chart("fourthChart", {
            type: "doughnut",
            data: {
                labels: uniqueConditions,
                datasets: [
                    {
                        data: conditionCounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 205, 86, 0.5)',
                            // Add more colors as needed
                        ],
                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: 'Weather Conditions Distribution',
                },
            },
        });

        // Call getWeather function after fetching weather data
        getWeather();
    })
    .catch(err => {
        console.error("Error fetching data:", err);
    });

// Define the getWeather function
async function getWeather() {
  console.log('Fetching Weather Data');
  var host = window.location.origin;

  try {
      var response = await fetch(`${host}/weather`, {
          method: 'GET',
          headers: {
              'Content-type': 'application/json'
          }
      });

      console.log(response);
      const element = document.getElementById('errorBox');
      if (element) {
          element.remove();
      }

      console.log('Status:', response.status);
      if (response.ok) {
          var weatherData = await response.json();

          // Clear existing weather table
          const weatherTable = document.getElementById('weatherInfo');
          if (weatherTable) {
              weatherTable.remove();
          }

          // Create a new table for weather data
          var table = document.createElement('table');
          table.setAttribute('id', 'weatherInfo');

          // Create table headers
          var tableRow = document.createElement('tr');

          var timestampHeading = document.createElement('th');
          timestampHeading.innerHTML = 'Timestamp';
          tableRow.appendChild(timestampHeading);

          var temperatureHeading = document.createElement('th');
          temperatureHeading.innerHTML = 'Temperature (K)';
          tableRow.appendChild(temperatureHeading);

          var cloudinessHeading = document.createElement('th');
          cloudinessHeading.innerHTML = 'Cloudiness (%)';
          tableRow.appendChild(cloudinessHeading);

          table.appendChild(tableRow);

          // Populate the table with weather data
          for (var i = 0; i < weatherData.length; i++) {
              var weatherRow = document.createElement('tr');

              var timestampCell = document.createElement('td');
              timestampCell.innerHTML = weatherData[i].timestamp;
              weatherRow.appendChild(timestampCell);

              var temperatureCell = document.createElement('td');
              temperatureCell.innerHTML = weatherData[i].temperature;
              weatherRow.appendChild(temperatureCell);

              var cloudinessCell = document.createElement('td');
              cloudinessCell.innerHTML = weatherData[i].cloudiness;
              weatherRow.appendChild(cloudinessCell);

              table.appendChild(weatherRow);
          }

          // Append the table to the body
          document.body.appendChild(table);
      } else {
          throw Error(JSON.stringify(await response.json()));
      }
  } catch (error) {
      console.error('Error:', JSON.parse(error.message));
      var errorDiv = document.createElement('div');
      errorDiv.setAttribute('class', 'errorBox');
      errorDiv.setAttribute('id', 'errorBox');

      var h1 = document.createElement('h1');
      h1.innerHTML = `Error Occurred:`;

      var p = document.createElement('p');
      p.innerHTML = `${JSON.parse(error.message).message}`;

      errorDiv.appendChild(h1);
      errorDiv.appendChild(p);
      document.body.appendChild(errorDiv);
  }
}


