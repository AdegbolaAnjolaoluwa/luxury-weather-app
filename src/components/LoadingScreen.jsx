import { motion } from 'framer-motion';

export default function LoadingScreen({ cityName }) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: '#0a0a0a' }}
    >
      <div className="text-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-4xl mb-4"
          style={{ color: '#c9a84c' }}
        >
          ✦
        </motion.div>
        {cityName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm tracking-widest uppercase"
            style={{ 
              color: '#a08840',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            {cityName}
          </motion.p>
        )}
      </div>
    </div>
  );
}
