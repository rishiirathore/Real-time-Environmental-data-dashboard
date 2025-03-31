const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

// Google Sheet details
const SHEET_ID = "1L2rmaklLE-NFDdGNbQqkiHnJPCe08qguo2tEOX5oaNY";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

/**
 * Fetches data from Google Sheet and processes it
 * @returns {Promise<Object>} Processed data
 */
async function fetchData() {
  try {
    const response = await axios.get(CSV_URL);
    const rows = await parseCSV(response.data);
    
    // Get the most recent entries (last 10 rows)
    const recentData = rows.slice(-10);
    
    // Process data for charts
    const processedData = {
      rawData: recentData,
      timeLabels: recentData.map(row => `${row.Date} ${row.Time}`),
      pm25Data: recentData.map(row => parseFloat(row['PM2.5'])),
      pm10Data: recentData.map(row => parseFloat(row.PM10)),
      temperatureData: recentData.map(row => parseFloat(row.Temperature)),
      humidityData: recentData.map(row => parseFloat(row.Humidity)),
      pressureData: recentData.map(row => parseFloat(row.Pressure)),
      windData: recentData.map(row => parseFloat(row['Wind Speed'])),
      latestReading: recentData[recentData.length - 1],
      locationData: recentData.map(row => ({
        lat: parseFloat(row.Latitude),
        lng: parseFloat(row.Longitude),
        alt: parseFloat(row.Altitude),
        pm25: parseFloat(row['PM2.5']),
        pm10: parseFloat(row.PM10)
      }))
    };
    
    return processedData;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

/**
 * Parses CSV data into array of objects
 * @param {string} csvData - Raw CSV data
 * @returns {Promise<Array>} Parsed rows
 */
function parseCSV(csvData) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const dataStream = Readable.from(csvData);
    
    dataStream
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = { fetchData };