import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  const [isAuto, setIsAuto] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);

  const detectThemeFromTime = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  };

  useEffect(() => {
    // Check for manual override in localStorage
    const savedManualOverride = localStorage.getItem('weatherApp_manualOverride');
    const savedTheme = localStorage.getItem('weatherApp_theme');

    if (savedManualOverride === 'true' && savedTheme) {
      setTheme(savedTheme);
      setIsAuto(false);
      setManualOverride(true);
    } else {
      // Auto-detect from time
      const autoTheme = detectThemeFromTime();
      setTheme(autoTheme);
      setIsAuto(true);
    }
  }, []);

  useEffect(() => {
    // Check every minute for dawn/dusk transitions if not overridden
    if (!manualOverride) {
      const interval = setInterval(() => {
        const newTheme = detectThemeFromTime();
        if (newTheme !== theme) {
          setTheme(newTheme);
          setIsAuto(true);
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [theme, manualOverride]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsAuto(false);
    setManualOverride(true);
    localStorage.setItem('weatherApp_theme', newTheme);
    localStorage.setItem('weatherApp_manualOverride', 'true');
  };

  const resetToAuto = () => {
    const autoTheme = detectThemeFromTime();
    setTheme(autoTheme);
    setIsAuto(true);
    setManualOverride(false);
    localStorage.removeItem('weatherApp_manualOverride');
    localStorage.setItem('weatherApp_theme', autoTheme);
  };

  return { theme, isAuto, toggleTheme, resetToAuto };
};
