import { motion } from 'framer-motion';

const HeroTemp = ({ weather, cityName }) => {
  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-gold-base text-xs tracking-[0.3em] uppercase mb-2">
        {cityName}
      </h1>
      
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl">{weather.condition.icon}</span>
        <span className="text-gold-mid text-sm italic">{weather.condition.label}</span>
      </div>

      <div className="relative">
        <span className="text-gold-light text-[80px] sm:text-[100px] font-display font-light leading-none">
          {weather.temp}
        </span>
        <span className="text-gold-base text-2xl absolute top-2">°C</span>
      </div>

      <p className="text-gold-mid text-xs tracking-[0.2em] uppercase mt-4">
        Feels like {weather.feelsLike}°
      </p>
    </motion.div>
  );
};

export default HeroTemp;
