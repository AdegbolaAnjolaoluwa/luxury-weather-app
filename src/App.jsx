import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from './hooks/useLocation';
import { useWeather } from './hooks/useWeather';

// Simple loading screen
const LoadingScreen = ({ cityName }) => (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div className="text-center">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-4xl text-amber-500 mb-4"
      >
        ✦
      </motion.div>
      {cityName && (
        <p className="text-amber-400 text-sm tracking-widest uppercase">{cityName}</p>
      )}
    </div>
  </div>
);

// Simple error screen
const ErrorScreen = ({ onRetry }) => (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div className="text-center px-4">
      <p className="text-amber-400 text-lg italic mb-6">Unable to load weather data</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 border border-amber-600 text-amber-400 text-xs tracking-widest uppercase hover:border-amber-400 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Search component
const SearchBar = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result) => {
    onSelect({
      lat: result.latitude,
      lon: result.longitude,
      cityName: result.name,
      timezone: result.timezone,
    });
    setQuery('');
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-5 right-5 z-50 p-2 text-amber-500 hover:text-amber-300 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <line x1="12.5" y1="12.5" x2="17" y2="17" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-amber-900/30 p-4"
          >
            <div className="max-w-md mx-auto flex items-center gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city..."
                className="flex-1 bg-transparent border-none outline-none text-amber-100 text-sm placeholder-amber-700"
                autoFocus
              />
              <button onClick={() => { setQuery(''); setIsOpen(false); }} className="text-amber-600 hover:text-amber-400">
                ✕
              </button>
            </div>
            {results.length > 0 && (
              <div className="max-w-md mx-auto mt-2 border-t border-amber-900/20">
                {results.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelect(r)}
                    className="py-3 px-1 text-amber-400 text-sm cursor-pointer hover:bg-amber-900/20 hover:pl-3 transition-all border-l-2 border-transparent hover:border-amber-500"
                  >
                    {r.name}{r.admin1 ? `, ${r.admin1}` : ''}{r.country ? `, ${r.country}` : ''}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main weather display
const WeatherDisplay = ({ weather, cityName }) => {
  if (!weather) return null;
  
  return (
    <div className="text-center py-12">
      <h1 className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-2">{cityName}</h1>
      <p className="text-amber-700 text-xs mb-6">{weather.condition.label}</p>
      
      <div className="text-7xl sm:text-8xl text-amber-100 font-light mb-4">
        {weather.temp}°
      </div>
      
      <p className="text-amber-600 text-xs tracking-widest uppercase">
        Feels like {weather.feelsLike}°
      </p>
    </div>
  );
};

// Stats grid
const StatsGrid = ({ weather }) => {
  if (!weather) return null;
  
  const getWindDir = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="grid grid-cols-3 gap-px bg-amber-900/20 border-y border-amber-900/30">
      <div className="py-6 text-center">
        <p className="text-amber-700 text-[10px] tracking-widest uppercase mb-1">Wind</p>
        <p className="text-amber-300 text-lg">{weather.windSpeed} <span className="text-xs text-amber-600">km/h</span></p>
        <p className="text-amber-700 text-[10px]">{getWindDir(weather.windDir)}</p>
      </div>
      <div className="py-6 text-center border-x border-amber-900/30">
        <p className="text-amber-700 text-[10px] tracking-widest uppercase mb-1">Humidity</p>
        <p className="text-amber-300 text-lg">{weather.humidity}<span className="text-xs text-amber-600">%</span></p>
      </div>
      <div className="py-6 text-center">
        <p className="text-amber-700 text-[10px] tracking-widest uppercase mb-1">UV Index</p>
        <p className="text-amber-300 text-lg">{weather.uvIndex}</p>
      </div>
    </div>
  );
};

// Hourly forecast
const HourlyForecast = ({ hourly, timezone }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="py-8">
      <h3 className="text-amber-700 text-[10px] tracking-widest uppercase mb-4 text-center">Next Hours</h3>
      <div className="flex justify-center gap-4 overflow-x-auto px-4">
        {hourly.slice(0, 6).map((h, i) => (
          <div key={i} className="text-center min-w-[60px]">
            <p className="text-amber-700 text-[10px] mb-1">
              {new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', timeZone: timezone })}
            </p>
            <p className="text-2xl mb-1">{h.condition.icon}</p>
            <p className="text-amber-300 text-sm">{h.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Weekly forecast
const WeeklyForecast = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  const formatDay = (date) => {
    const today = new Date();
    const d = new Date(date);
    if (d.toDateString() === today.toDateString()) return 'Today';
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="py-8 border-t border-amber-900/30">
      <h3 className="text-amber-700 text-[10px] tracking-widest uppercase mb-4 text-center">7-Day Forecast</h3>
      <div className="max-w-md mx-auto px-4">
        {daily.map((d, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-amber-900/10">
            <span className="text-amber-500 text-sm w-16">{formatDay(d.day)}</span>
            <span className="text-2xl">{d.condition.icon}</span>
            <div className="flex-1 mx-4 h-1 bg-amber-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-800 to-amber-500"
                style={{ width: `${Math.max(5, Math.min(95, ((d.hi + 10) / 50) * 100))}%` }}
              />
            </div>
            <span className="text-amber-300 text-sm">{d.hi}° <span className="text-amber-700">{d.lo}°</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Permission toast
const PermissionToast = ({ state, onAllow, onSkip }) => {
  if (state !== 'prompt') return null;
  
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-amber-900/30 p-4 z-50"
    >
      <p className="text-amber-400 text-sm italic mb-3 text-center">Allow location for local weather?</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onAllow} className="px-4 py-2 border border-amber-700 text-amber-400 text-xs uppercase tracking-wider hover:border-amber-500">Allow</button>
        <button onClick={onSkip} className="px-4 py-2 border border-amber-900 text-amber-600 text-xs uppercase tracking-wider hover:border-amber-700">Skip</button>
      </div>
    </motion.div>
  );
};

// Main App
const App = () => {
  const { lat, lon, cityName, timezone, permissionState, loading: locLoading, setLocation, getCurrentPosition } = useLocation();
  const { current, hourly, daily, loading: wxLoading, error, refetch } = useWeather(lat, lon, timezone);

  const isLoading = locLoading || wxLoading;

  return (
    <div className="min-h-screen bg-black text-amber-100">
      <AnimatePresence>
        {isLoading && <LoadingScreen cityName={cityName} />}
      </AnimatePresence>

      <AnimatePresence>
        {error && !isLoading && <ErrorScreen onRetry={refetch} />}
      </AnimatePresence>

      {!isLoading && !error && current && (
        <>
          {/* Background gradient */}
          <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-amber-950/20 via-black to-black" />

          <SearchBar onSelect={setLocation} />
          
          <PermissionToast 
            state={permissionState} 
            onAllow={getCurrentPosition} 
            onSkip={() => {}} 
          />

          <main className="relative z-10 max-w-lg mx-auto">
            <WeatherDisplay weather={current} cityName={cityName} />
            <StatsGrid weather={current} />
            <HourlyForecast hourly={hourly} timezone={timezone} />
            <WeeklyForecast daily={daily} />
            
            <footer className="py-8 text-center">
              <p className="text-amber-800 text-lg">✦</p>
              <p className="text-amber-900 text-[10px] tracking-widest uppercase mt-2">
                Weather by Open-Meteo
              </p>
            </footer>
          </main>
        </>
      )}
    </div>
  );
};

export default App;