import React from 'react';

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive: boolean;
  scale: number;
}

export default function ConnectionLine({ from, to, isActive, scale }: ConnectionLineProps) {
  // Calculate control points for smooth curve
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const controlPoint1X = from.x + distance * 0.3;
  const controlPoint1Y = from.y;
  const controlPoint2X = to.x - distance * 0.3;
  const controlPoint2Y = to.y;

  const pathData = `M ${from.x} ${from.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${to.x} ${to.y}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ 
        width: '100%', 
        height: '100%',
        zIndex: 1
      }}
    >
      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <path
        d={pathData}
        stroke="url(#connectionGradient)"
        strokeWidth={isActive ? 3 : 2}
        fill="none"
        filter={isActive ? "url(#glow)" : "none"}
        className={`transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}
        opacity={isActive ? 1 : 0.6}
      />
      
      {/* Connection flow animation */}
      {isActive && (
        <circle r="4" fill="#00d9ff" opacity="0.8">
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#${pathData}`} />
          </animateMotion>
        </circle>
      )}
    </svg>
  );
}