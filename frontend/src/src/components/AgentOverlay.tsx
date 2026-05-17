
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoundingBox } from '../types';

interface AgentOverlayProps {
  boxes: BoundingBox[];
  cursorPosition: { x: number; y: number };
  isScanning: boolean;
}

export const AgentOverlay: React.FC<AgentOverlayProps> = ({ boxes, cursorPosition, isScanning }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Scanning Line */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
          />
        )}
      </AnimatePresence>

      {/* Detected Elements */}
      {boxes.map((box, idx) => (
        <motion.div
          key={`${box.label}-${idx}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute border border-emerald-400/50 bg-emerald-400/5 flex flex-col shadow-[0_0_15px_rgba(52,211,153,0.1)]"
          style={{
            top: `${box.top}%`,
            left: `${box.left}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
          }}
        >
          {/* Corner accents */}
          <div className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-emerald-400" />

          <div className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 absolute -top-4 left-0 whitespace-nowrap flex items-center gap-1 shadow-lg rounded-sm">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
            {box.label.toUpperCase()} :: {(0.92 + (idx * 0.021)).toFixed(3)}
          </div>
        </motion.div>
      ))}

      {/* Virtual Cursor */}
      <motion.div
        animate={{ 
          x: cursorPosition.x, 
          y: cursorPosition.y 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-[100]"
      >
        <svg 
          viewBox="0 0 32 32" 
          className="w-full h-full drop-shadow-lg"
          style={{ transform: 'translate(-25%, -25%)' }}
        >
          <path 
            fill="white" 
            stroke="black" 
            strokeWidth="1" 
            d="M8.2,2.2c0,0,0,21.6,0,21.6l6.4-6.4l4.4,10.1l3.7-1.6l-4.4-10.1l8.3,0L8.2,2.2z" 
          />
        </svg>
        <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-blue-500/20 animate-ping" />
      </motion.div>
    </div>
  );
};
