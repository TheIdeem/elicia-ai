'use client';

import { useEffect, useRef } from 'react';

const HeroAnimation = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const animate = () => {
      if (!svgRef.current) return;

      // Animate pulse gradients
      const pulseGradients = svgRef.current.querySelectorAll('linearGradient');
      pulseGradients.forEach(gradient => {
        const stops = gradient.querySelectorAll('stop');
        stops.forEach(stop => {
          const offset = stop.getAttribute('data-animate-offset');
          if (offset) {
            const [start, end] = offset.split(',').map(Number);
            const current = parseFloat(stop.getAttribute('offset') || '0');
            const next = current >= end ? start : current + 0.1;
            stop.setAttribute('offset', `${next}%`);
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <svg
      ref={svgRef}
      width="1497"
      height="1498"
      viewBox="0 0 1497 1498"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            stopColor="rgba(255,255,255,0)"
            data-animate-offset="-150,100"
            offset="93.64%"
          />
          <stop
            stopColor="rgba(255,255,255,0.4)"
            data-animate-offset="-20,100"
            offset="96.95%"
          />
          <stop
            stopColor="rgba(255,255,255,0.95)"
            data-animate-offset="-12,108"
            offset="104.95%"
          />
          <stop
            stopColor="rgba(255,255,255,0)"
            data-animate-offset="-11,109"
            offset="105.95%"
          />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      <path
        d="M1301.78 1379.2L1008.9 1086.32C868.275 945.701 640.28 945.701 499.657 1086.32L206.777 1379.2"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      {/* Add more grid lines here */}

      {/* Animated Pulse Lines */}
      <path
        d="M1099.07 1408.34L914.627 1223.9C826.068 1135.34 682.486 1135.34 593.927 1223.9L409.482 1408.34"
        stroke="url(#pulse)"
        strokeOpacity="1"
        strokeWidth="1"
        className="transition-all duration-500"
      />
      {/* Add more pulse lines here */}
    </svg>
  );
};

export default HeroAnimation; 