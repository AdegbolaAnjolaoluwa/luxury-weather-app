import { motion } from 'framer-motion';

const DynamicBackground = ({ category, theme }) => {
  const backgrounds = {
    dark: {
      clear: 'radial-gradient(ellipse at top, #1a1200 0%, #0a0a0a 60%)',
      cloudy: 'radial-gradient(ellipse at top, #111118 0%, #0a0a0a 60%)',
      rain: 'radial-gradient(ellipse at top, #080d14 0%, #0a0a0a 60%)',
      storm: 'radial-gradient(ellipse at top, #07060f 0%, #0a0a0a 60%)',
      harmattan: 'radial-gradient(ellipse at top, #140e04 0%, #0a0a0a 60%)',
    },
    light: {
      clear: 'radial-gradient(ellipse at top, #fff4cc 0%, #faf7f0 60%)',
      cloudy: 'radial-gradient(ellipse at top, #dcd8d0 0%, #f0ece4 60%)',
      rain: 'radial-gradient(ellipse at top, #c8d4e0 0%, #e8eef4 60%)',
      storm: 'radial-gradient(ellipse at top, #b0b8c8 0%, #dde0e8 60%)',
      harmattan: 'radial-gradient(ellipse at top, #e8d8a8 0%, #f5efe0 60%)',
    },
  };

  const themeBackgrounds = backgrounds[theme] || backgrounds.dark;
  const gradient = themeBackgrounds[category] || themeBackgrounds.clear;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      initial={{ background: gradient }}
      animate={{ background: gradient }}
      transition={{ duration: 1.8, ease: 'easeInOut' }}
    />
  );
};

export default DynamicBackground;
