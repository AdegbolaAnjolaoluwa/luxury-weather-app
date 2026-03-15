import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../hooks/useSearch';

export default function SearchBar({ onSelectLocation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { results, loading } = useSearch(query);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (result) => {
    onSelectLocation({
      lat: result.latitude,
      lon: result.longitude,
      cityName: result.name,
      timezone: result.timezone,
    });
    setQuery('');
    setIsOpen(false);
  };

  const handleClose = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Search Icon Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="search-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-5 right-5 z-50 bg-transparent border-none cursor-pointer p-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="#a08840" strokeWidth="1.2"/>
              <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="#a08840" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Search Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 p-4"
            style={{
              background: 'rgba(10,10,10,0.98)',
              borderBottom: '1px solid rgba(184,148,60,0.2)',
            }}
          >
            <div className="max-w-md mx-auto flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="#6a5830" strokeWidth="1.2"/>
                <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="#6a5830" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any city..."
                className="flex-1 bg-transparent border-none outline-none text-sm tracking-wide"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 300,
                  color: '#e8d8a0',
                }}
              />
              <button
                onClick={handleClose}
                className="bg-transparent border-none cursor-pointer text-xl leading-none px-2"
                style={{ color: '#6a5830' }}
              >
                ✕
              </button>
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
              {results && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-md mx-auto mt-3 pt-3"
                  style={{ borderTop: '1px solid rgba(184,148,60,0.1)' }}
                >
                  {results.map((result, i) => (
                    <div
                      key={`${result.name}-${i}`}
                      onClick={() => handleSelect(result)}
                      className="py-3 px-2 cursor-pointer text-sm transition-all duration-150 border-l-2 border-transparent hover:pl-3"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 300,
                        color: '#a08840',
                        letterSpacing: '0.02em',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(184,148,60,0.06)';
                        e.currentTarget.style.borderLeftColor = '#c9a84c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderLeftColor = 'transparent';
                      }}
                    >
                      {result.name}
                      {result.admin1 ? `, ${result.admin1}` : ''}
                      {result.country ? `, ${result.country}` : ''}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && (
              <div className="max-w-md mx-auto mt-4 text-center text-sm italic" style={{ color: '#6a5830', fontFamily: 'Cormorant Garamond, serif' }}>
                Searching...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
