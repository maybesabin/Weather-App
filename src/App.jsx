import React, { useState } from 'react';
import cloudy from './assets/cloudy.png';
import cold from './assets/cold.png';
import hot from './assets/hot.png';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [icon, setIcon] = useState(cloudy);
  const [feelingToday, setFeelingToday] = useState('');

  const updateIcon = (temp) => {
    if (temp <= 0) setIcon(cold);
    else if (temp > 0 && temp <= 15) setIcon(cold);
    else if (temp > 15 && temp <= 20) setIcon(cloudy);
    else if (temp > 20 && temp <= 30) setIcon(cloudy);
    else if (temp > 30) setIcon(hot);
  };

  const searchCity = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);

      setWeather({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: data.main.temp,
        countryCode: data.sys.country,
        visibility: data.visibility,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        location: data.name,
      });

      const temp = data.main.temp;
      updateIcon(temp);
      setFeelingToday(todayFeeling(temp));
    } catch (error) {
      handleClick();
    }
  };

  const handleSearch = () => {
    searchCity(city);
  };

  const [stateOfPopup, setStateOfPopup] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = stateOfPopup;

  const handleClick = () => {
    setStateOfPopup({ ...stateOfPopup, open: true });
  };

  const handleClose = () => {
    setStateOfPopup({ ...stateOfPopup, open: false });
  };

  // Function to give feedback on temperature
  const todayFeeling = (temp) => {
    if (temp <= 0) return 'Very Cold';
    if (temp > 0 && temp <= 10) return 'Cold';
    if (temp > 10 && temp <= 25) return 'Mild';
    if (temp > 25 && temp <= 35) return 'Hot';
    if (temp > 35 && temp <= 40) return 'Very Hot';
    if (temp > 40) return 'Extremely Hot';
    else return 'Not available';
  };

  // Function to format the date to "HH:MM AM/PM" format
  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Convert to 12-hour format and determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12

    return `${hours}:${minutes} ${ampm}`;
  }

  //Get Date
  const getCurrentDate = () => {
    const today = new Date();
    const dayName = today.toLocaleString('en-US', { weekday: 'long' });
    const day = today.getDate();
    const monthName = today.toLocaleString('en-US', { month: 'long' });
    return `${dayName} ${day}, ${monthName}`
  }

  return (
    <div className="flex flex-col gap-6 items-center text-white justify-center h-[100vh]">
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="City not found!"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />

      <div className="w-[350px] md:w-[450px] text-white flex items-center gap-4 justify-start px-6 bg-[#1c1c1e] rounded-full h-[55px]">
        <i onClick={handleSearch} className="cursor-pointer text-white fa-solid fa-magnifying-glass"></i>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search your city or country..."
          className="bg-[#1c1c1e] outline-none w-[350px] md:w-[400px]"
          type="text"
        />
      </div>

      {
        weather &&

        <div className={`flex flex-col items-center justify-evenly gap-7 w-[350px] md:w-[450px]`}>
          <div className="flex items-start py-6 md:px-0 px-6 justify-around gap-12 w-[100%] rounded-[25px] bg-[#1c1c1e] h-[280px] md:h-[300px]">
            <div className="flex flex-col items-center justify-center">
              {weather && (
                <div className="flex gap-3 flex-col items-start justify-center">
                  <h2 className="font-light">Now</h2>
                  <h1 className="font-semibold text-3xl md:text-5xl">
                    {weather.temperature} <sup>o</sup> <span className="font-extralight">C</span>
                  </h1>
                  <h3 className="text-md">{weather.location}</h3>
                  <p className="text-xs font-extralight text-gray-300">{feelingToday}</p>
                  <div className="w-[180%] h-[1px] opacity-40 bg-gray-300"></div>
                  <div className="flex flex-col items-start justify-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-regular fa-calendar"></i>
                      <h3 className="text-sm font-extralight text-gray-300">{getCurrentDate()}</h3>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-location-dot"></i>
                      <h3 className="text-sm font-extralight text-gray-300">{weather.location}, {weather.countryCode}</h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <img src={icon} width={'100px'} alt="weather-icon" />
          </div>

          {/* Weather Info */}
          <div className="flex items-center flex-wrap justify-around gap-4 w-[350px] md:w-[450px] p-4 bg-[#1c1c1e] h-[250px] rounded-[25px]">
            <div className="bg-[#1a191c] p-4 rounded-[15px] w-[150px] md:w-[200px] h-[100px] flex flex-col items-start justify-start gap-4">
              <h1 className="text-xs text-gray-300">Humidity</h1>
              <div className="flex text-2xl items-center justify-between w-[100%]">
                <i className="fa-solid fa-droplet"></i>
                {weather && <h3 className='text-[1rem] md:text-2xl'>{weather.humidity}%</h3>}
              </div>
            </div>
            <div className="bg-[#1a191c] p-4 rounded-[15px] w-[150px] md:w-[200px] h-[100px] flex flex-col items-start justify-start gap-4">
              <h1 className="text-xs text-gray-300">Wind Speed</h1>
              <div className="flex text-2xl items-center justify-between w-[100%]">
                <i className="fa-solid fa-wind"></i>
                {weather && <h3 className='text-[1rem] md:text-2xl'>{weather.windSpeed} <span className="text-[0.6rem]">Km/h</span></h3>}
              </div>
            </div>
            <div className="bg-[#1a191c] p-4 rounded-[15px] w-[150px] md:w-[200px] h-[100px] flex flex-col items-start justify-start gap-4">
              <h1 className="text-xs text-gray-300">Sunrise</h1>
              <div className="flex text-2xl items-center justify-between w-[100%]">
                <i className="fa-solid fa-sun"></i>
                {weather && <h3 className='text-[1rem] md:text-2xl'>{formatTime(weather.sunrise)}</h3>}
              </div>
            </div>
            <div className="bg-[#1a191c] p-4 rounded-[15px] w-[150px] md:w-[200px] h-[100px] flex flex-col items-start justify-start gap-4">
              <h1 className="text-xs text-gray-300">Sunset</h1>
              <div className="flex text-2xl items-center justify-between w-[100%]">
                <i className="fa-solid fa-cloud-sun"></i>
                {weather && <h3 className='text-[1rem] md:text-2xl'>{formatTime(weather.sunset)}</h3>}
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default App;
