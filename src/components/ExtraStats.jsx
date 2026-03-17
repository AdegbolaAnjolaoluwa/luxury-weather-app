const ExtraStats = ({ extra }) => {
  if (!extra) return null;

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="py-6 border-t border-amber-900/30">
      <h3 className="text-amber-500 text-xs tracking-widest uppercase mb-4 text-center">
        Additional Info
      </h3>
      
      <div className="grid grid-cols-2 gap-3 px-4">
        {/* Sunrise/Sunset */}
        <div className="bg-amber-950/30 rounded-lg p-3 text-center border border-amber-900/20">
          <div className="text-2xl mb-1">🌅</div>
          <p className="text-amber-400 text-xs uppercase">Sunrise</p>
          <p className="text-amber-200 text-lg font-medium">{formatTime(extra.sunrise)}</p>
          <p className="text-amber-600 text-xs">Sunset: {formatTime(extra.sunset)}</p>
        </div>

        {/* Visibility */}
        <div className="bg-amber-950/30 rounded-lg p-3 text-center border border-amber-900/20">
          <div className="text-2xl mb-1">�️</div>
          <p className="text-amber-400 text-xs uppercase">Visibility</p>
          <p className="text-amber-200 text-lg font-medium">
            {extra.visibility ? `${(extra.visibility / 1000).toFixed(1)} km` : '--'}
          </p>
          <p className="text-amber-600 text-xs">Clear view</p>
        </div>

        {/* Pressure */}
        <div className="bg-amber-950/30 rounded-lg p-3 text-center border border-amber-900/20">
          <div className="text-2xl mb-1">📊</div>
          <p className="text-amber-400 text-xs uppercase">Pressure</p>
          <p className="text-amber-200 text-lg font-medium">
            {extra.pressure ? `${extra.pressure} hPa` : '--'}
          </p>
          <p className="text-amber-600 text-xs">
            {extra.pressure > 1013 ? 'High' : extra.pressure < 1013 ? 'Low' : 'Normal'}
          </p>
        </div>

        {/* Dew Point */}
        <div className="bg-amber-950/30 rounded-lg p-3 text-center border border-amber-900/20">
          <div className="text-2xl mb-1">💧</div>
          <p className="text-amber-400 text-xs uppercase">Dew Point</p>
          <p className="text-amber-200 text-lg font-medium">
            {extra.dewPoint !== undefined ? `${extra.dewPoint}°` : '--'}
          </p>
          <p className="text-amber-600 text-xs">Humidity factor</p>
        </div>

        {/* Cloud Cover */}
        <div className="bg-amber-950/30 rounded-lg p-3 text-center border border-amber-900/20 col-span-2">
          <div className="text-2xl mb-1">☁️</div>
          <p className="text-amber-400 text-xs uppercase">Cloud Cover</p>
          <p className="text-amber-200 text-lg font-medium">
            {extra.cloudCover !== undefined ? `${extra.cloudCover}%` : '--'}
          </p>
          <div className="w-full bg-amber-900/30 rounded-full h-2 mt-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${extra.cloudCover || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraStats;
