import React, {useState} from "react";
import axios from "axios";
import { FaSearch } from 'react-icons/fa';
import './App.css';
import { WiDaySunny, WiRain, WiCloud, WiSnow, WiSunrise, WiSunset } from 'react-icons/wi';
import { WiHumidity } from 'react-icons/wi';

function App() {
  const [data,setData] = useState({});
  const [location, setLocation] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); 

const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=ab8622d5f5453c45c9181938f10cdfe5&units=metric`;
const getWeatherIcon = (description) => {
  if (description.includes("clear")) {
    return <WiDaySunny size={100} />;
  }       else if (description.includes("rain")) {
    return <WiRain size={100} />;
  } else if (description.includes("cloud")) {
    return <WiCloud size={100} />;
  } else if (description.includes("snow")) {
    return <WiSnow size={100} />;
  }
  return <WiDaySunny size={200} />;
};

const searchLocation =(event, city = location) => {
 if (event && event.key !== "Enter") return;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=ab8622d5f5453c45c9181938f10cdfe5&units=imperial`;
    axios.get(url.replace(location, city)).then((response) => {
  setData(response.data)
  console.log(response.data)
})
searchLocation(' ')

axios.get(forecastUrl).then((response) => 
  {
    setForecastData(response.data.list.filter((_, index) => index % 8 === 0));

  });
setLocation(city);
    setSuggestions([]);
  }

  const handleInputChange = (event) => {
    const query = event.target.value;
    setLocation(query);


    if (query) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=ab8622d5f5453c45c9181938f10cdfe5`)
        .then((response) => {
          setSuggestions(response.data.list); 
        });
    } else {
      setSuggestions([]); 
    }
  };

  const handleSuggestionClick = (city) => {
    setLocation(city.name);
    setSuggestions([]); 
    searchLocation(null, city.name);
  };

 

  const formatDate = (date) => {

    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const SunriseSunsetSection = ({ sunriseTime, sunsetTime }) => {
    return (
      <div className="sunrise-sunset-section">

        <div className="sunrise">
                  <WiSunrise size={100} />

          <p><strong>Sunrise:</strong> {new Date(sunriseTime * 1000).toLocaleTimeString()}</p>
        </div>

        <div className="sunset">

              <WiSunset size={100} />
          <p><strong>Sunset:</strong> {new Date(sunsetTime * 1000).toLocaleTimeString()}</p>
        </div>
      </div>
    );
  };
  const handleUnitToggle = () => {
    setIsCelsius(!isCelsius); };
  

  const convertToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;

  };

  const handleAddToFavorites = () => {
    console.log(`Added ${data.name} to favourites!`);};

  return (
    <div className="app">
      <header className="weather-header">
        <h1 className="weather-title">Weatherify</h1>
        <p className="weather-slogan">Your weather forecast, anytime, anywhere</p>
      </header>
      <div className="search">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            value={location}
            onChange={handleInputChange}
            onKeyPress={searchLocation}
            placeholder="Enter Location"
            type="text"
            className="search-input"
          />
          <button onClick={handleAddToFavorites} className="add-to-fav-btn">+ Favorite</button>
        </div>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((city, index) => (
              <div 
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(city)}
              >
                {city.name}, {city.sys.country}
              </div>
            ))}
          </div>
        )}
      </div>

     
      {data.sys && (
        <SunriseSunsetSection 
          sunriseTime={data.sys.sunrise} 
          sunsetTime={data.sys.sunset} 
        />
      )}

      {data.main && data.weather && (
  <div className="current-weather">
          <div className="location-one">
            <p>{data.name}</p>
           </div>
          <div className="weather-info">
           <div className="temp">
          <h1>
                {isCelsius
                  ? `${data.main.temp}°C`
                  : `${convertToFahrenheit(data.main.temp).toFixed(1)}°F`}
              </h1>
            </div>
            <button onClick={handleUnitToggle} className="unit-toggle-btn">
                     {isCelsius ? 'Convert to °F' : 'Convert to °C'}
            </button>

            <div className="weather-description">
             
              {getWeatherIcon(data.weather[0].description)}
              <p> {data.weather[0].description
                  .split(' ')
                     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </p>
            </div>

    <div className="bottom-info">
    <div className="feels-like">
               <p><strong>Feels:</strong> {data.main.feels_like}°C</p>
            </div>
            <div className="humid-23">
                <WiHumidity size={30} />
                <p><strong>{data.main.humidity}%</strong></p>
</div>
                <div className="rain-chance">
                <p><strong>Rain:</strong> {data.rain ? `${data.rain['1h']} mm` : 'None'}</p>
            </div>
            </div>
          </div>
  </div>
)}



    {forecastData.length > 0 && (
         <div className="forecast">
          <div className="forecast-cards">
            {forecastData.map((forecast,index) => {
              return (
                <div 
                   key={index}
                  className="forecast-card">
                  <h3>{formatDate(forecast.dt_txt)}</h3>
                  <div className="forecast-icon-temp">
                  {getWeatherIcon(forecast.weather[0].description)}
                    <p className="temperature">{forecast.main.temp}°C</p>
                  </div>
                  <p className="weather-description2">
                    {forecast.weather[0].description
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </p>

                  <p className="humidity-2">Humidity: {forecast.main.humidity}%</p>
                  <p>Rain Chance: {forecast.rain ? `${forecast.rain['3h']} mm` : 'None'}</p>
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
