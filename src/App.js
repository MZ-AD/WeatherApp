import React, {useState} from "react";
import axios from "axios";


function App() {
  const [data,setData] = useState({});
  const [location, setLocation] = useState("");
  const [forecastData, setForecastData] = useState([]);

const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=ab8622d5f5453c45c9181938f10cdfe5`
const searchLocation =  ( event) => {
 if  (event.key === "Enter") {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=ab8622d5f5453c45c9181938f10cdfe5&units=imperial`;
     axios.get(url).then((response) => {
  setData(response.data)
  console.log(response.data)
})
searchLocation(' ')

axios.get(forecastUrl).then((response) => 
  {
    setForecastData(response.data.list.filter((_, index) => index % 8 === 0));

  });
setLocation("");
  }
}


  return (
    <div className="app">
      <div className="search">
        <input 
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='Enter Location'
        type="text"/>
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
           </div>
           <div className="temp">
           {data.main ? <h1>{data.main.temp}°F</h1> : null}
           </div>
           <div className="description">
            {data.weather ? <p>{data.weather[0].description}</p> : null}           
            </div>
            </div>


            {data.name !== undefined &&
            <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like}</p> : null}
            
            <p>Feels like</p> 
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}</p> : null}
            <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed}MPH</p> : null}
            <p>Wind Speed</p>
            </div>
            </div> 
}

    {forecastData.length > 0 && (
          <div className="forecast">
            <h2>Days Forecast </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                overflowX: "auto",
                marginTop: "20px",
              }}
            >
              {forecastData.map((forecast, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "15px",
                    borderRadius: "8px",
                    
                    textAlign: "center",
                    minWidth: "150px",
                    margin: "0 10px",
                    color: "#000", 
                  }}
                >
                  <h3>{new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                     <p>{forecast.weather[0].description}</p>

                  <p>{forecast.main.temp}°F</p>
                   <p>Humidity: {forecast.main.humidity}%</p>
                  <p>Wind: {forecast.wind.speed} MPH  </p>
                </div>
              ))
            }
            </div>

          </div>
        )}
            </div>
            </div>
  );
}

export default App;
