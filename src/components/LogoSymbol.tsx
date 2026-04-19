import React from 'react';
import { motion } from 'framer-motion';

interface LogoSymbolProps {
  className?: string;
  size?: number;
  color?: string;
  isWhite?: boolean;
}

export default function LogoSymbol({ className = "", size = 40, color = "#2563eb", isWhite = false }: LogoSymbolProps) {
  const primaryColor = isWhite ? "#FFFFFF" : color;
  
  return (
    <motion.svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? "#FFFFFF" : "#2563eb"} />
          <stop offset="100%" stopColor={isWhite ? "#E2E8F0" : "#3b82f6"} />
        </linearGradient>
      </defs>
      
      {/* Stylized 'D' / Road Path */}
      <motion.path 
        d="M30 20 C 60 20, 85 35, 85 50 C 85 65, 60 80, 30 80 L 30 20 Z" 
        stroke="url(#logoGradient)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
        variants={{
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
        }}
      />
      
      {/* Inner Speed Lines / Road Markings */}
      <motion.path 
        d="M30 50 L 65 50" 
        stroke={primaryColor} 
        strokeWidth="6" 
        strokeLinecap="round"
        strokeDasharray="10 10"
        variants={{
          animate: { 
            strokeDashoffset: [0, -40],
            transition: { duration: 0.5, repeat: Infinity, ease: "linear" }
          }
        }}
      />

      {/* Speed sparks for 3D feel */}
      <motion.circle
        cx="75"
        cy="50"
        r="2"
        fill={primaryColor}
        variants={{
          animate: {
            x: [0, 20],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            transition: { duration: 0.8, repeat: Infinity, ease: "easeOut" }
          }
        }}
      />

      {/* Dynamic Arrow / Movement Indicator */}
      <motion.path 
        d="M70 40 L 80 50 L 70 60" 
        stroke={primaryColor} 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        variants={{
          hover: { x: 5, transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" } }
        }}
      />
      
      {/* Bottom Accent */}
      <rect x="30" y="76" width="20" height="4" rx="2" fill={primaryColor} opacity="0.6" />
    </motion.svg>
  );
}
