
import React from 'react';
import { cn } from '../../utils/cn';

interface ImageGridProps {
  instruction: string;
  images: string[];
  selectedIndices: number[];
  onToggleImage: (index: number) => void;
  gridSize?: number;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ 
  instruction, 
  images, 
  selectedIndices, 
  onToggleImage,
  gridSize = 3
}) => {
  return (
    <div className="bg-white p-6 w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white mb-4 rounded-2xl shadow-lg shadow-indigo-100">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] opacity-60 mb-2">Security Verification</p>
        <p className="text-sm opacity-90 font-medium mb-1">Select all squares with</p>
        <p className="text-3xl font-black leading-tight tracking-tighter">{instruction}</p>
      </div>
      
      <div 
        className="grid gap-2 mb-6 p-1.5 bg-slate-50/50 rounded-2xl border border-slate-100" 
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {images.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => onToggleImage(idx)}
            className={cn(
              "relative aspect-square cursor-pointer transition-all duration-500 group overflow-hidden rounded-xl",
              selectedIndices.includes(idx) ? "scale-90 shadow-inner" : "hover:scale-[0.98] hover:shadow-md"
            )}
          >
            <img 
              src={img} 
              alt={`captcha-img-${idx}`} 
              className={cn(
                "w-full h-full object-cover transition-all duration-700",
                selectedIndices.includes(idx) ? "brightness-75 saturate-[0.2] blur-[2px]" : "group-hover:scale-110"
              )}
            />
            {selectedIndices.includes(idx) && (
              <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-indigo-500">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 transition-colors pointer-events-none rounded-xl" />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
        <div className="flex gap-5">
          <button className="text-slate-300 hover:text-indigo-500 transition-all p-1.5 hover:bg-slate-50 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button className="text-slate-300 hover:text-indigo-500 transition-all p-1.5 hover:bg-slate-50 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </div>
        <button 
          className="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
        >
          VERIFY_NOW
        </button>
      </div>
    </div>
  );
};
