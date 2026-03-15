import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeeklyForecast({ daily, timezone }) {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!daily || daily.length === 0) return null;

  const formatDay = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: timezone });
  };

  const getWarmthPercent = (min, max) => {
    const range = 50; // -10 to 40
    const position = (max - (-10)) / range;
    return Math.max(5, Math.min(95, position * 100));
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <h2
        style={{
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#a08840',
          marginBottom: '16px',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
        }}
      >
        7-Day Forecast
      </h2>

      <div>
        {daily.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div
              onClick={() => setExpandedDay(expandedDay === index ? null : index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                borderBottom: '0.5px solid rgba(184,148,60,0.08)',
                cursor: 'pointer',
              }}
            >
              {/* Day */}
              <div
                style={{
                  width: '50px',
                  fontSize: '12px',
                  color: '#a08840',
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {formatDay(day?.day || new Date())}
              </div>

              {/* Icon */}
              <div style={{ fontSize: '18px' }}>{day?.condition?.icon || '🌡️'}</div>

              {/* Condition (hidden on mobile) */}
              <div
                style={{
                  flex: 1,
                  fontSize: '13px',
                  color: '#6a5830',
                  fontStyle: 'italic',
                  fontFamily: "'Cormorant Garamond', serif",
                  display: 'none',
                }}
                className="condition-text"
              >
                {day?.condition?.label || 'Unknown'}
              </div>

              {/* Warmth bar */}
              <div style={{ flex: 1, maxWidth: '120px' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getWarmthPercent(day?.lo ?? 0, day?.hi ?? 0)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, #6a5830, #c9a84c)',
                    borderRadius: '2px',
                  }}
                />
              </div>

              {/* Temps */}
              <div
                style={{
                  width: '70px',
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#c9a84c',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {day?.hi ?? '--'}°{' '}
                <span style={{ color: '#6a5830' }}>{day?.lo ?? '--'}°</span>
              </div>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {expandedDay === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(184,148,60,0.04)',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#6a5830',
                        fontStyle: 'italic',
                        fontFamily: "'Cormorant Garamond', serif',
                        lineHeight: 1.6,
                      }}
                    >
                      {day?.precipChance > 0 && (
                        <span>Precipitation: {day.precipChance}%}%<br /></span>
                      )}
                      Max wind: {day?.maxWind ?? '--'} km/h<br />
                      {day?.condition?.label}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .condition-text {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
