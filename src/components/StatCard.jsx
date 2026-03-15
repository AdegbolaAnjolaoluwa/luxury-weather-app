import { useState } from 'react';
import { motion } from 'framer-motion';

function StatCard({ label, value, unit, sub, delay = 0 }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getTip = () => {
    if (label === 'WIND') return `Breeze from ${sub || 'N'}. Expect mild gusts.`;
    if (label === 'HUMIDITY') return 'Moderate moisture. Heat feels heavier.';
    if (label === 'UV INDEX') {
      const uv = value || 0;
      if (uv <= 2) return 'Low risk. No protection needed.';
      if (uv <= 5) return 'Moderate. Wear sunscreen.';
      if (uv <= 7) return 'High. SPF 30+ recommended.';
      return 'Very high. SPF 50+ and cover up.';
    }
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative h-24 cursor-pointer"
      style={{ perspective: '800px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-2"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-gold-mid mb-1">
            {label}
          </span>
          <span className="text-[22px] text-gold-bright font-display">
            {value ?? '--'}
            {unit && <span className="text-[12px] text-gold-mid ml-1">{unit}</span>}
          </span>
          {sub && <span className="text-[9px] text-gold-deep mt-0.5">{sub}</span>}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center p-3"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-[12px] text-gold-base font-display italic text-center leading-relaxed">
            {getTip()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StatsRow({ weather }) {
  if (!weather) return null;

  const getWindDir = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="grid grid-cols-3 gap-0 mb-8 border-y border-gold-deep/20">
      <StatCard
        label="WIND"
        value={weather.windSpeed || 0}
        unit="km/h"
        sub={getWindDir(weather.windDir || 0)}
        delay={0.5}
      />
      <div className="border-x border-gold-deep/20">
        <StatCard
          label="HUMIDITY"
          value={weather.humidity || 0}
          unit="%"
          delay={0.6}
        />
      </div>
      <StatCard
        label="UV INDEX"
        value={weather.uvIndex || 0}
        delay={0.7}
      />
    </div>
  );
}
