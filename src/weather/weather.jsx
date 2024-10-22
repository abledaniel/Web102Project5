// import React, { useEffect, useState } from 'react';
// import './weather.css'; // CSS file

// const WeatherDashboard = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWeatherApi = async () => {
//       const params = {
//         latitude: 34.0522,
//         longitude: -118.2437,
//         hourly: ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "uv_index"]
//       };
//       const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,uv_index`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setWeatherData(data);
//       setLoading(false);
//     };

//     fetchWeatherApi();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   const hourlyData = weatherData.hourly;
//   return (
//     <div className="weather-dashboard">
//       <div className="top-section">
//         <div className="info-box">
//           <h2>{hourlyData.temperature_2m[0]}°F</h2>
//           <p>Current Temperature</p>
//         </div>
//         <div className="info-box">
//           <h2>{hourlyData.relative_humidity_2m[0]}%</h2>
//           <p>Humidity</p>
//         </div>
//         <div className="info-box">
//           <h2>{hourlyData.precipitation_probability[0]}%</h2>
//           <p>Precipitation Probability</p>
//         </div>
//         <div className="info-box">
//           <h2>{hourlyData.uv_index[0]}</h2>
//           <p>UV Index</p>
//         </div>
//       </div>

//       <div className="table-section">
//         <input type="text" placeholder="Enter Date" className="date-input" />
//         <button className="search-btn">Search</button>
//         <table>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Temperature</th>
//               <th>Humidity</th>
//               <th>Precipitation</th>
//               <th>UV Index</th>
//             </tr>
//           </thead>
//           <tbody>
//             {hourlyData.time.map((time, index) => (
//               <tr key={index}>
//                 <td>{new Date(time).toLocaleString()}</td>
//                 <td>{hourlyData.temperature_2m[index]}°F</td>
//                 <td>{hourlyData.relative_humidity_2m[index]}%</td>
//                 <td>{hourlyData.precipitation_probability[index]}%</td>
//                 <td>{hourlyData.uv_index[index]}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default WeatherDashboard;


import React, { useEffect, useState } from 'react';
import './weather.css'; // CSS file

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [temperatureRange, setTemperatureRange] = useState({ min: null });

  useEffect(() => {
    const fetchWeatherApi = async () => {
      const params = {
        latitude: 34.0522,
        longitude: -118.2437,
        hourly: ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "uv_index"]
      };
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,uv_index`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);

      // Initialize temperature range to min after data is fetched
      const temperatureMin = Math.min(...data.hourly.temperature_2m);
      setTemperatureRange({ min: temperatureMin });
    };

    fetchWeatherApi();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hourlyData = weatherData.hourly;

  // Calculate summary statistics
  const totalItems = hourlyData.temperature_2m.length;
  const meanTemperature = hourlyData.temperature_2m.reduce((sum, temp) => sum + temp, 0) / totalItems;
  const temperatureMin = Math.min(...hourlyData.temperature_2m);
  const temperatureMax = Math.max(...hourlyData.temperature_2m);

  const filteredData = hourlyData.time.map((time, index) => {
    const currentTemperature = hourlyData.temperature_2m[index];

    // Ensure only temperatures greater than or equal to the min range are included
    const withinTemperatureRange =
      (temperatureRange.min === null || currentTemperature >= temperatureRange.min);

    // Format the date and check for matches
    const formattedDate = new Date(time).toLocaleDateString(); // Format as MM/DD/YYYY
    const matchesSearch = formattedDate.includes(searchTerm); // Check if the formatted date contains the search term
    
    // Only return the item if it matches both criteria
    if (matchesSearch && withinTemperatureRange) {
      return {
        time: time,
        temperature: currentTemperature,
        humidity: hourlyData.relative_humidity_2m[index],
        precipitation: hourlyData.precipitation_probability[index],
        uvIndex: hourlyData.uv_index[index]
      };
    }

    return null; // Return null for entries that don't match the filter
  }).filter(item => item !== null); // Filter out null entries

  return (
    <div className="weather-dashboard">
        <h2>LOS ANGELES</h2>
      <div className="top-section">
        <div className="info-box">
          <h2>{hourlyData.temperature_2m[0]}°F</h2>
          <p>Current Temperature</p>
        </div>
        <div className="info-box">
          <h2>{hourlyData.relative_humidity_2m[0]}%</h2>
          <p>Humidity</p>
        </div>
        <div className="info-box">
          <h2>{hourlyData.precipitation_probability[0]}%</h2>
          <p>Precipitation Probability</p>
        </div>
        <div className="info-box">
          <h2>{hourlyData.uv_index[0]}</h2>
          <p>UV Index</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>SUMMARY STATISTICS</h3>
        <p>Total Items: {totalItems}</p>
        <p>Mean Temperature: {meanTemperature.toFixed(2)}°F</p>
        <p>Temperature Range: {temperatureMin}°F - {temperatureMax}°F</p>
      </div>

      <div className="table-section">
        <input 
          type="text" 
          placeholder="Search by Date (MM/DD)" 
          className="date-input" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        <div className="slider-container">
          <label>Minimum Temperature: {temperatureRange.min}°F</label>
          <input 
            type="range" 
            min={temperatureMin} 
            max={temperatureMax} 
            value={temperatureRange.min || temperatureMin} // Default to temperatureMin if no value is set
            onChange={(e) => {
              const newMin = parseFloat(e.target.value);
              setTemperatureRange({ min: newMin });
            }} 
          />
        </div>
        
        <button className="search-btn" onClick={() => setSearchTerm(searchTerm)}>
          Search
        </button>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Precipitation</th>
              <th>UV Index</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.time).toLocaleString()}</td>
                <td>{entry.temperature}°F</td>
                <td>{entry.humidity}%</td>
                <td>{entry.precipitation}%</td>
                <td>{entry.uvIndex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherDashboard;
