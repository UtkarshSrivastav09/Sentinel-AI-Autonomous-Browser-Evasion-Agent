
import React from 'react';
import { cn } from '../../utils/cn';

interface VisualChallengeProps {
  instruction: string;
  image: string;
  targets: { id: number; x: number; y: number; found: boolean }[];
  onTargetClick: (id: number) => void;
  isAgentSolving?: boolean;
}

export const VisualChallenge: React.FC<VisualChallengeProps> = ({
  instruction,
  image,
  targets,
  onTargetClick,
  isAgentSolving = false
}) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h3 className="text-slate-900 font-black text-xl tracking-tighter leading-tight mb-1">{instruction}</h3>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Contextual_Detection_Module</p>
      </div>

      <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden cursor-crosshair border-4 border-white shadow-xl ring-1 ring-slate-100">
        <img src={image} alt="challenge" className="w-full h-full object-cover" />
        
        {targets.map((target) => (
          <div
            key={target.id}
            onClick={() => onTargetClick(target.id)}
            className={cn(
              "absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-2 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]",
              target.found 
                ? "bg-emerald-500/20 border-emerald-500 scale-100 rotate-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                : "border-white/40 scale-125 hover:border-indigo-500/50 hover:bg-indigo-500/10"
            )}
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
          >
            {target.found && (
               <div className="relative">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="absolute -inset-2 bg-emerald-500/20 rounded-full animate-ping" />
               </div>
            )}
            {!target.found && (
               <div className="w-1 h-1 bg-white/60 rounded-full" />
            )}
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
      </div>

      <div className="mt-8 flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Targets_Left: <span className="text-indigo-600">{targets.filter(t => !t.found).length}</span>
        </div>
        <button 
          disabled={targets.some(t => !t.found)}
          className={cn(
            "px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] transition-all duration-300",
            targets.every(t => t.found) 
              ? "bg-slate-900 text-white shadow-lg hover:bg-indigo-600" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          BYPASS_SECURE
        </button>
      </div>
    </div>
  );
};
