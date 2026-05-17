
import React from 'react';
// import { cn } from '../../utils/cn';

interface TextCaptchaProps {
  text: string;
  value: string;
  onChange: (val: string) => void;
  onVerify: () => void;
  noise?: boolean;
}

export const TextCaptcha: React.FC<TextCaptchaProps> = ({
  text,
  value,
  onChange,
  onVerify,
  noise = true
}) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 w-[340px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900 font-bold text-lg tracking-tight">Identity Check</h3>
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] animate-pulse" />
      </div>
      
      <div className="relative h-24 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 mb-6 flex items-center justify-center overflow-hidden group">
        {noise && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="absolute bg-slate-900"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 60}px`,
                  height: '1.5px',
                  transform: `rotate(${Math.random() * 360}deg)`,
                  filter: 'blur(0.5px)'
                }}
              />
            ))}
          </div>
        )}
        <span 
          className="text-4xl font-black tracking-[0.3em] text-slate-800 select-none drop-shadow-sm"
          style={{ 
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            transform: 'skewX(-12deg) rotate(-3deg)',
            filter: 'blur(0.4px)'
          }}
        >
          {text}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type the characters..."
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/30 transition-all text-center font-bold text-slate-700 tracking-[0.4em] placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-300"
          />
        </div>
        <button
          onClick={onVerify}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-slate-100 hover:shadow-indigo-100 active:scale-[0.98]"
        >
          VERIFY_IDENTITY
        </button>
      </div>
    </div>
  );
};
