import { motion, AnimatePresence } from 'framer-motion';

const PermissionToast = ({ permissionState, onAllow, onSkip }) => {
  if (permissionState !== 'prompt') return null;

  return (
    <AnimatePresence>
      {permissionState === 'prompt' && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-60 px-5 py-4"
          style={{
            background: 'rgba(20, 18, 10, 0.98)',
            borderTop: '0.5px solid rgba(184, 148, 60, 0.2)',
          }}
        >
          <div className="max-w-md mx-auto">
            <p className="font-display italic text-[15px] text-[#a08840] mb-4">
              Allow location access for live local weather
            </p>
            <div className="flex gap-3">
              <button
                onClick={onAllow}
                className="px-4 py-2 text-[9px] tracking-[0.3em] uppercase text-[#a08840] border border-[rgba(184,148,60,0.3)] hover:border-[#c9a84c] transition-colors"
              >
                Allow
              </button>
              <button
                onClick={onSkip}
                className="px-4 py-2 text-[9px] tracking-[0.3em] uppercase text-[#a08840] border border-[rgba(184,148,60,0.3)] hover:border-[#c9a84c] transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PermissionToast;
