import { motion } from 'framer-motion';

const TempArcGauge = ({ current, min = -10, max = 40 }) => {
  const ratio = Math.max(0, Math.min(1, (current - min) / (max - min)));
  const startAngle = 160;
  const totalAngle = 220;
  const endAngle = startAngle + totalAngle;

  const centerX = 100;
  const centerY = 85;
  const radius = 60;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  const currentAngle = startAngle + totalAngle * ratio;
  const endPos = polarToCartesian(centerX, centerY, radius, currentAngle);

  return (
    <div className="mt-3 sm:mt-4">
      <svg viewBox="0 0 200 110" className="w-full h-auto max-w-[280px] sm:max-w-[320px] md:max-w-[350px]">
        <path
          d={describeArc(centerX, centerY, radius, startAngle, endAngle)}
          fill="none"
          stroke="#3a2e14"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <motion.path
          d={describeArc(centerX, centerY, radius, startAngle, currentAngle)}
          fill="none"
          stroke="#c9a84c"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <motion.circle
          cx={endPos.x}
          cy={endPos.y}
          r="3"
          fill="#c9a84c"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <text
          x="30"
          y="105"
          className="font-sans text-[9px] fill-[#3a2e14]"
          textAnchor="middle"
        >
          {min}°
        </text>
        <text
          x="170"
          y="105"
          className="font-sans text-[9px] fill-[#3a2e14]"
          textAnchor="middle"
        >
          {max}°
        </text>
        <text
          x="100"
          y="90"
          className="font-display text-[14px] fill-[#a08840]"
          textAnchor="middle"
        >
          {current}°
        </text>
      </svg>
    </div>
  );
};

export default TempArcGauge;
