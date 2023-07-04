import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

const WeatherApp = () => {
  const [location, setLocation] = useState('');
  const [currentForecast, setCurrentForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);

  const API_KEY = 'dfe3518509msha641d453af9105cp1ceb99jsn243c62d5e1da';
  const API_HOST = 'weatherapi-com.p.rapidapi.com';

  const fetchData = async () => {
    try {
      const currentForecastResponse = await axios.get(
        `https://${API_HOST}/current.json?q=${location}`,
        {
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
          },
        }
      );

      const hourlyForecastResponse = await axios.get(
        `https://${API_HOST}/forecast.json?q=${location}&days=1&hourly=6`,
        {
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
          },
        }
      );

      const weeklyForecastResponse = await axios.get(
        `https://${API_HOST}/forecast.json?q=${location}&days=7`,
        {
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
          },
        }
      );

      setCurrentForecast(currentForecastResponse.data.current);
      setHourlyForecast(hourlyForecastResponse.data.forecast.forecastday[0].hour);
      setWeeklyForecast(weeklyForecastResponse.data.forecast.forecastday);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const renderCurrentForecast = () => {
    if (currentForecast) {
      return (
        <div className="current-forecast">
          <h2>Current Weather</h2>
          <div className="weather-details">
            <div className="weather-info">
              <p className="location">{location}</p>
              <p className="temperature">{Math.round(currentForecast.temp_c)}°C</p>
              <p className="condition">{currentForecast.condition.text}</p>
            </div>
            <div className="weather-icon">
              <img src={currentForecast.condition.icon} alt="Weather icon" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderHourlyForecast = () => {
    if (hourlyForecast) {
      const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
      };

      const forecastItems = hourlyForecast.map((hour) => (
        <div key={hour.time} className="hourly-item">
          <p className="hour">{hour.time.slice(11, 16)}</p>
          <img src={hour.condition.icon} alt="Weather icon" className="weather-icon" />
          <p className="temperature">{hour.temp_c}°C</p>
        </div>
      ));

      return (
        <div className="hourly-forecast">
          <h2>Hourly Forecast</h2>
          <Slider {...settings}>{forecastItems}</Slider>
        </div>
      );
    }

    return null;
  };

  const renderWeeklyForecast = () => {
    if (weeklyForecast) {
      const forecastItems = weeklyForecast.map((day) => {
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

        return (
          <div className="weekly-item" key={day.date}>
            <div className="weekly-weather-details">
              <h3 className="weekday">{weekday}</h3>
              <p className="temperature-range">
                {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
              </p>
              <p className="condition">{day.day.condition.text}</p>
            </div>
            <img className="weekly-icon" src={day.day.condition.icon} alt="Weather icon" />
          </div>
        );
      });

      return (
        <div className="weekly-forecast">
          <h2>Three-day Forecast</h2>
          {forecastItems}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Enter location"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="forecast">
          <div className="current-forecast">{renderCurrentForecast()}</div>
          <div className="hourly-forecast">{renderHourlyForecast()}</div>
        </div>
      </div>
      <div className="right-section">
        <div className="weekly-forecast">{renderWeeklyForecast()}</div>
      </div>
    </div>
  );
};

export default WeatherApp;
