import { useState, useEffect } from 'react';

const DEFAULT_LOCATION = {
  lat: 9.0765,
  lon: 7.4983,
  cityName: 'Abuja',
  timezone: 'Africa/Lagos',
};

export const useLocation = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [permissionState, setPermissionState] = useState('prompt');
  const [loading, setLoading] = useState(true);

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: {
            'User-Agent': 'LuxuryWeatherApp/1.0',
          },
        }
      );
      const data = await response.json();
      const cityName =
        data.address?.city ??
        data.address?.town ??
        data.address?.village ??
        data.address?.county ??
        'Unknown';

      return cityName;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown';
    }
  };

  const getCurrentPosition = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const cityName = await reverseGeocode(latitude, longitude);

        setLocation({
          lat: latitude,
          lon: longitude,
          cityName,
          timezone: DEFAULT_LOCATION.timezone,
        });
        setPermissionState('granted');
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocation(DEFAULT_LOCATION);
        setPermissionState('denied');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if ('permissions' in navigator) {
          const result = await navigator.permissions.query({ name: 'geolocation' });

          if (result.state === 'granted') {
            getCurrentPosition();
          } else if (result.state === 'prompt') {
            setLoading(false);
          } else if (result.state === 'denied') {
            setLocation(DEFAULT_LOCATION);
            setPermissionState('denied');
            setLoading(false);
          }

          result.addEventListener('change', () => {
            setPermissionState(result.state);
          });
        } else {
          getCurrentPosition();
        }
      } catch (error) {
        console.error('Permission query error:', error);
        getCurrentPosition();
      }
    };

    checkPermissions();
  }, []);

  return {
    ...location,
    permissionState,
    loading,
    setLocation,
    getCurrentPosition,
  };
};
