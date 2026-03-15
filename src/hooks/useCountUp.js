import { useState, useEffect, useRef } from 'react';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const useCountUp = (targetValue, duration = 1200, startOnMount = true) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const prevTargetValueRef = useRef(null);

  console.log(`useCountUp called with targetValue: ${targetValue}, duration: ${duration}`);

  const animate = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const value = Math.round(targetValue * easedProgress);

    setCurrentValue(value);

    console.log(`Animation: ${value}/${targetValue} (${(progress * 100).toFixed(1)}%)`);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      console.log(`Animation complete: ${value}`);
    }
  };

  const start = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    setCurrentValue(0);
    console.log(`Starting animation to ${targetValue}`);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Only animate if target value has changed and is different from previous
    if (prevTargetValueRef.current !== null && prevTargetValueRef.current !== targetValue) {
      console.log(`Target value changed from ${prevTargetValueRef.current} to ${targetValue}`);
      start();
    } else if (startOnMount && prevTargetValueRef.current === null) {
      console.log(`Initial mount, starting animation`);
      start();
    }

    prevTargetValueRef.current = targetValue;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, startOnMount]);

  return currentValue;
};
