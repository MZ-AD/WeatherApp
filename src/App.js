import React, {useState} from "react";
import axios from "axios";
import sunnyImage from './sunny.jpg';
import rainyImage from './rainy.jpg';
import cloudyImage from './cloudy.jpg';
import snowyImage from './snowy.jpg';

function App() {
  const [data,setData] = useState({});
  const [location, setLocation] = useState("");
  const [forecastData, setForecastData] = useState([]);

const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=ab8622d5f5453c45c9181938f10cdfe5`

const getBackgroundImage = (description) => {

  if (description.includes("clear")) {
    return { backgroundImage: `url(${sunnyImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
       else if (description.includes("rain"))  {
    return { backgroundImage: `url(${rainyImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
     else if (description.includes("cloud")) {
    return { backgroundImage: `url(${cloudyImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
       else if (description.includes("snow ")) {
    return { backgroundImage: `url(${snowyImage})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }

  else 
  {
    return { backgroundImage: `url(${sunnyImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }; 
  }
};


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
      <header className="header">
        <h1>Weatherify</h1>
        <p>Your weather forecast, anytime, anywhere</p>
      </header>
      <div className="search">
        <input 
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='Enter Location'
        type="text"/>
      </div>

      {data && data.main && data.weather && data.name && (
  <div className="current-weather">
          <div className="location">
            <p>{data.name}</p>
           </div>
           <div className="temp">
           {data.main ? <h1>{data.main.temp}°F</h1> : null}
           </div>
           <div className="description">
            {data.weather ? <p>{data.weather[0].description}</p> : null}           
            </div>

    <div className="bottom2">
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
  </div>
)}



    {forecastData.length > 0 && (
         <div className="forecast">
            <h2>Days Forecast </h2>
          <div className="forecast-cards">

            {
            forecastData.map((forecast,index) => {
              const backgroundStyle = getBackgroundImage(forecast.weather[0].description);
              return (
                <div
                   key={index}
                  className="forecast-card"
                  style={backgroundStyle}
                >
                  <h3>{new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                     <p>{forecast.weather[0].description}</p>
                  <p>{forecast.main.temp}°F</p>
                   <p>Humidity: {forecast.main.humidity}%</p>
                  <p>Wind: {forecast.wind.speed} MPH  </p>
                </div>
              )
            })
            }
          </div>
                   </div>
      )}
    </div>
  );
}

export default App;
