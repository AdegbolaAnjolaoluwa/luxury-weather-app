import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherScene = ({ category, skyTone, theme }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const [opacity, setOpacity] = useState(1);

  const getScene = () => {
    if (skyTone === 'sunny') return 'sunny';
    if (skyTone === 'clearing') return 'clearing';
    if (skyTone === 'partlyCloudy') return 'partlyCloudy';
    if (skyTone === 'overcast') return 'overcast';
    if (skyTone === 'rain') return 'rain';
    if (skyTone === 'storm') return 'storm';
    if (skyTone === 'harmattan') return 'harmattan';
    return 'sunny';
  };

  const scene = getScene();

  // Initialize particles based on scene
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sceneParticles = [];

    if (scene === 'rain') {
      // Raindrops
      const count = 280;
      for (let i = 0; i < count; i++) {
        sceneParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          length: 12 + Math.random() * 10,
          speed: 8 + Math.random() * 6,
          opacity: 0.2 + Math.random() * 0.3,
          thickness: 0.5 + Math.random() * 0.7,
        });
      }
    } else if (scene === 'storm') {
      // More raindrops for storm
      const count = 280;
      for (let i = 0; i < count; i++) {
        sceneParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          length: 12 + Math.random() * 10,
          speed: 14 + Math.random() * 8,
          opacity: 0.2 + Math.random() * 0.3,
          thickness: 0.5 + Math.random() * 0.7,
        });
      }
    } else if (scene === 'harmattan') {
      // Dust particles
      const count = 120;
      for (let i = 0; i < count; i++) {
        sceneParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.random() * 3,
          opacity: 0.03 + Math.random() * 0.12,
          speedX: 0.2 + Math.random() * 0.6,
          drift: (Math.random() - 0.5) * 0.1,
          offset: Math.random() * Math.PI * 2,
        });
      }
    }

    particlesRef.current = sceneParticles;
  };

  const drawSun = (ctx, x, y, radius, scale = 1, rayLength = 55) => {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = theme === 'light' ? '#ffd97a' : '#c9a84c';
    ctx.beginPath();
    ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
    ctx.fill();

    // Draw rays
    ctx.strokeStyle = theme === 'light' ? '#ffd97a' : '#c9a84c';
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + timeRef.current * 0.003;
      const startX = x + Math.cos(angle) * (radius * scale + 10);
      const startY = y + Math.sin(angle) * (radius * scale + 10);
      const endX = x + Math.cos(angle) * (radius * scale + 10 + rayLength);
      const endY = y + Math.sin(angle) * (radius * scale + 10 + rayLength);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Outer halo ring
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = theme === 'light' ? '#ffd97a' : '#c9a84c';
    ctx.lineWidth = 2;
    const haloRadius = radius * scale + 10 + rayLength + Math.sin(timeRef.current * 0.02) * 5;
    ctx.beginPath();
    ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawCloud = (ctx, x, y, scale, alpha) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = theme === 'light' ? '#ffffff' : '#2a2a2a';

    const sizes = [30, 22, 28, 20, 18];
    const offsets = [
      { x: 0, y: 0 },
      { x: -10, y: -8 },
      { x: 20, y: 5 },
      { x: -20, y: -5 },
      { x: 35, y: 8 },
    ];

    sizes.forEach((size, i) => {
      ctx.beginPath();
      ctx.arc(x + offsets[i].x * scale, y + offsets[i].y * scale, size * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    timeRef.current++;

    // Apply scene opacity
    ctx.globalAlpha = opacity;

    if (scene === 'sunny') {
      // Draw sun
      drawSun(ctx, canvas.width / 2, 100, 80, 1, 55);

      // Heat shimmer
      ctx.strokeStyle = '#c9a84c';
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = canvas.height - 100 + i * 20;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const waveY = y + Math.sin(x * 0.02 + timeRef.current * 0.02) * 5;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    } else if (scene === 'partlyCloudy') {
      // Draw smaller sun
      drawSun(ctx, canvas.width - 200, 120, 55, 1, 40);

      // Draw 2 clouds
      const clouds = [
        { x: 200, y: 150, scale: 1.2, alpha: 0.9, speedX: 0.18 },
        { x: canvas.width + 200, y: 200, scale: 0.8, alpha: 0.7, speedX: 0.10 },
      ];

      clouds.forEach((cloud, i) => {
        cloud.x += cloud.speedX;
        if (cloud.x > canvas.width + 200) {
          cloud.x = -200;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.alpha);
      });
    } else if (scene === 'overcast') {
      // Draw 5 clouds
      const clouds = [
        { x: 100, y: 100, scale: 1.8, alpha: 0.95, speedX: 0.06 },
        { x: 300, y: 150, scale: 1.6, alpha: 0.90, speedX: 0.08 },
        { x: 500, y: 120, scale: 1.7, alpha: 0.92, speedX: 0.07 },
        { x: 700, y: 180, scale: 1.5, alpha: 0.88, speedX: 0.09 },
        { x: 900, y: 140, scale: 1.6, alpha: 0.90, speedX: 0.07 },
      ];

      clouds.forEach((cloud) => {
        cloud.x += cloud.speedX;
        if (cloud.x > canvas.width + 200) {
          cloud.x = -200;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.alpha);
      });

      // Breathing dark overlay
      ctx.globalAlpha = 0.03 + Math.sin(timeRef.current * 0.01) * 0.01;
      ctx.fillStyle = theme === 'light' ? '#c0c0c0' : '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (scene === 'rain') {
      // Draw clouds (overcast)
      const clouds = [
        { x: 100, y: 80, scale: 1.8, alpha: 0.95, speedX: 0.08 },
        { x: 400, y: 100, scale: 1.6, alpha: 0.90, speedX: 0.09 },
        { x: 700, y: 90, scale: 1.7, alpha: 0.92, speedX: 0.08 },
      ];

      clouds.forEach((cloud) => {
        cloud.x += cloud.speedX;
        if (cloud.x > canvas.width + 200) {
          cloud.x = -200;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.alpha);
      });

      // Draw raindrops
      ctx.strokeStyle = theme === 'light' ? '#7090b0' : '#4a6680';
      particlesRef.current.forEach((drop) => {
        ctx.lineWidth = drop.thickness;
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.length * 0.27, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += drop.length * 0.1;

        if (drop.y > canvas.height) {
          drop.y = Math.random() * -100;
          drop.x = Math.random() * canvas.width;
        }
      });
    } else if (scene === 'storm') {
      // Draw rain (faster)
      const clouds = [
        { x: 100, y: 80, scale: 1.8, alpha: 0.95, speedX: 0.08 },
        { x: 400, y: 100, scale: 1.6, alpha: 0.90, speedX: 0.09 },
        { x: 700, y: 90, scale: 1.7, alpha: 0.92, speedX: 0.08 },
      ];

      clouds.forEach((cloud) => {
        cloud.x += cloud.speedX;
        if (cloud.x > canvas.width + 200) {
          cloud.x = -200;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.alpha);
      });

      // Draw raindrops (faster, angled)
      ctx.strokeStyle = theme === 'light' ? '#507090' : '#3a5068';
      particlesRef.current.forEach((drop) => {
        ctx.lineWidth = drop.thickness;
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.length * 0.36, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += drop.length * 0.15;

        if (drop.y > canvas.height) {
          drop.y = Math.random() * -100;
          drop.x = Math.random() * canvas.width;
        }
      });

      // Lightning (random)
      if (Math.random() < 0.003) {
        // Draw lightning bolt
        ctx.strokeStyle = theme === 'light' ? '#fff8dc' : '#fffde0';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;

        const startX = canvas.width / 2 + (Math.random() - 0.5) * 160;
        let currentX = startX;
        let currentY = 0;

        ctx.beginPath();
        ctx.moveTo(currentX, currentY);

        while (currentY < canvas.height * 0.7) {
          currentX += (Math.random() - 0.5) * 60;
          currentY += 40 + Math.random() * 40;
          ctx.lineTo(currentX, currentY);
        }
        ctx.stroke();

        // Flash
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = theme === 'light' ? '#ffffff' : '#fffde0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else if (scene === 'harmattan') {
      // Haze overlay
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = theme === 'light' ? 'rgba(210,195,165,0.25)' : 'rgba(60,50,30,0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dust particles
      ctx.globalAlpha = 1;
      ctx.fillStyle = theme === 'light' ? '#c4a86a' : '#a08840';
      particlesRef.current.forEach((particle) => {
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y + Math.sin(timeRef.current * 0.01 + particle.offset) * 0.2,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fill();

        particle.x += particle.speedX + particle.drift;

        if (particle.x > canvas.width) {
          particle.x = -10;
        }
      });

      // Fog bands
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = theme === 'light' ? '#c4a86a' : '#a08840';
      const bands = [
        { y: canvas.height * 0.2 },
        { y: canvas.height * 0.5 },
        { y: canvas.height * 0.75 },
      ];

      bands.forEach((band) => {
        const offset = Math.sin(timeRef.current * 0.005) * 50;
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, band.y, canvas.width, 40, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (scene === 'clearing') {
      // Clouds moving off screen faster
      const clouds = [
        { x: canvas.width - 100, y: 150, scale: 1.5, alpha: 0.85, speedX: 0.5 },
        { x: canvas.width - 300, y: 200, scale: 1.2, alpha: 0.75, speedX: 0.5 },
      ];

      clouds.forEach((cloud) => {
        cloud.x += cloud.speedX;
        if (cloud.x > canvas.width + 200) {
          cloud.x = -200;
        }
        drawCloud(ctx, cloud.x, cloud.y, cloud.scale, cloud.alpha);
      });

      // Sun appearing from behind
      const sunX = Math.max(canvas.width / 2, canvas.width - 100 - (timeRef.current % 480) * 0.5);
      const sunProgress = Math.min(1, (canvas.width - 100 - sunX + canvas.width / 2) / (canvas.width / 2));
      const rayProgress = Math.min(1, sunProgress * 1.5);

      drawSun(ctx, sunX, 150, 80, sunProgress, 55 * rayProgress);

      // Rainbow arc (simple gradient)
      if (sunProgress > 0.5) {
        const rainbowOpacity = (sunProgress - 0.5) * 0.7;
        const colors = ['rgba(255,0,0,0.07)', 'rgba(255,165,0,0.07)', 'rgba(255,255,0,0.07)', 'rgba(0,128,0,0.07)', 'rgba(0,0,255,0.07)'];

        ctx.globalAlpha = rainbowOpacity * opacity;
        colors.forEach((color, i) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height, 200 + i * 15, Math.PI, 0);
          ctx.stroke();
        });
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Fade out and in when scene changes
    setOpacity(0);
    setTimeout(() => {
      initParticles();
      setOpacity(1);
    }, 300);
  }, [scene]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: opacity }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default WeatherScene;
