import { motion } from 'framer-motion';

const ExtraStats = ({ extra, daily }) => {
  if (!extra || !daily || daily.length === 0) return null;

  const today = daily[0];

  // Format time from ISO string
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format visibility (convert meters to km)
  const formatVisibility = (meters) => {
    if (!meters) return '--';
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  // Format pressure (add unit)
  const formatPressure = (hpa) => {
    if (!hpa) return '--';
    return `${Math.round(hpa)} hPa`;
  };

  // Format dew point
  const formatDewPoint = (temp) => {
    if (!temp && temp !== 0) return '--°';
    return `${Math.round(temp)}°`;
  };

  // Format cloud cover (add percentage)
  const formatCloudCover = (percent) => {
    if (!percent && percent !== 0) return '--%';
    return `${Math.round(percent)}%`;
  };

  const stats = [
    {
      icon: '🌅',
      label: 'Sunrise',
      value: formatTime(today.sunrise),
      sublabel: 'Sunset ' + formatTime(today.sunset),
    },
    {
      icon: '👁️',
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      sublabel: 'Clear view',
    },
    {
      icon: '📊',
      label: 'Pressure',
      value: formatPressure(current.pressure),
      sublabel: current.pressure > 1013 ? 'High' : current.pressure < 1013 ? 'Low' : 'Normal',
    },
    {
      icon: '💧',
      label: 'Dew Point',
      value: formatDewPoint(current.dewPoint),
      sublabel: 'Humidity factor',
    },
    {
      icon: '☁️',
      label: 'Cloud Cover',
      value: formatCloudCover(current.cloudCover),
      sublabel: current.cloudCover > 80 ? 'Overcast' : current.cloudCover > 50 ? 'Partly' : 'Clear',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="py-6"
    >
      <h3 className="text-amber-700 text-[10px] tracking-widest uppercase mb-4 text-center">
        Additional Info
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="bg-amber-950/30 rounded-lg p-3 text-center border border-amber-900/20 hover:border-amber-700/40 transition-colors"
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <p className="text-amber-700 text-[9px] tracking-wider uppercase mb-1">{stat.label}</p>
            <p className="text-amber-300 text-sm font-medium">{stat.value}</p>
            <p className="text-amber-800 text-[9px] mt-1">{stat.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Daylight duration */}
      {today.daylightDuration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="mt-4 text-center"
        >
          <p className="text-amber-800 text-[10px] tracking-wider">
            ☀️ Daylight: {Math.round(today.daylightDuration / 3600)}h {Math.round((today.daylightDuration % 3600) / 60)}m
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExtraStats;
