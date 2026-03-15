import { motion } from 'framer-motion';

const ErrorScreen = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: '#0a0a0a' }}>
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display italic text-lg mb-6"
          style={{ color: '#a08840' }}
        >
          The sky is unreadable right now.
        </motion.div>
        <motion.button
          onClick={onRetry}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="font-sans text-xs tracking-widest uppercase px-6 py-2 border cursor-pointer"
          style={{ 
            color: '#c9a84c', 
            borderColor: 'rgba(201, 168, 76, 0.4)',
            background: 'transparent'
          }}
        >
          Retry
        </motion.button>
      </div>
    </div>
  );
};

export default ErrorScreen;
