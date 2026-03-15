import { motion } from 'framer-motion';

export default function HourlyForecast({ hourly, timezone }) {
  if (!hourly || hourly.length === 0) return null;

  const formatHour = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', timeZone: timezone });
  };

  const now = new Date();
  const currentHour = now.getHours();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{ marginTop: '32px' }}
    >
      <h2 style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#a08840',
        marginBottom: '16px',
        fontWeight: 300,
      }}>
        Next 7 Hours
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
      }}>
        {hourly.slice(0, 7).map((hour, index) => {
          const hourNum = hour?.time?.getHours() || 0;
          const isActive = hourNum === currentHour;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              style={{
                textAlign: 'center',
                padding: '12px 4px',
                borderRadius: '8px',
                border: isActive ? '1px solid rgba(184,148,60,0.4)' : '1px solid transparent',
                background: isActive ? 'rgba(184,148,60,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '9px',
                color: '#6a5830',
                marginBottom: '6px',
              }}>
                {hour.time ? formatHour(hour.time) : '--'}
              </div>
              <div style={{
                fontSize: '18px',
                marginBottom: '6px',
              }}>
                {hour?.condition?.icon || '🌡️'}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '16px',
                color: '#c9a84c',
                fontWeight: 400,
              }}>
                {hour?.temp ?? '--'}°
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
