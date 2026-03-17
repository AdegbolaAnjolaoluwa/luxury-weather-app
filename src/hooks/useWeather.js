import { useState, useEffect } from 'react';
import { getWeather } from '../utils/weatherCodes';

export const useWeather = (lat, lon, timezone) => {
  const [weatherData, setWeatherData] = useState({
    current: null,
    hourly: [],
    daily: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchWeather = async () => {
    if (!lat || !lon) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,relativehumidity_2m,uv_index,visibility,pressure_msl,dewpoint_2m,cloudcover&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,sunrise,sunset&timezone=${timezone}&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();

      console.log('🌤️ Raw API Response:', data);
      console.log('🌡️ Current weather data:', data.current);

      const current = {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        condition: getWeather(data.current.weathercode),
        windSpeed: Math.round(data.current.windspeed_10m),
        windDir: data.current.winddirection_10m,
        humidity: data.current.relativehumidity_2m,
        uvIndex: Math.round(data.current.uv_index),
        // New fields
        visibility: data.current.visibility,
        pressure: Math.round(data.current.pressure_msl),
        dewPoint: Math.round(data.current.dewpoint_2m),
        cloudCover: data.current.cloudcover,
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
      };

      console.log('✅ Processed current weather:', current);

      const now = new Date();
      const currentHourIndex = data.hourly.time.findIndex((time) => {
        const hourTime = new Date(time);
        return hourTime.getHours() === now.getHours() && hourTime.getDate() === now.getDate();
      });

      const hourly = data.hourly.time
        .slice(currentHourIndex, currentHourIndex + 24)
        .map((time, index) => ({
          time: new Date(time),
          temp: Math.round(data.hourly.temperature_2m[currentHourIndex + index]),
          condition: getWeather(data.hourly.weathercode[currentHourIndex + index]),
        }));

      const daily = data.daily.time.map((day, index) => ({
        day: new Date(day),
        condition: getWeather(data.daily.weathercode[index]),
        hi: Math.round(data.daily.temperature_2m_max[index]),
        lo: Math.round(data.daily.temperature_2m_min[index]),
        precipChance: data.daily.precipitation_probability_max[index] ?? 0,
        maxWind: Math.round(data.daily.windspeed_10m_max[index]),
        sunrise: data.daily.sunrise[index],
        sunset: data.daily.sunset[index],
      }));

      setWeatherData({ current, hourly, daily });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lon, timezone, refreshKey]);

  const refetch = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return { ...weatherData, loading, error, refetch };
};
