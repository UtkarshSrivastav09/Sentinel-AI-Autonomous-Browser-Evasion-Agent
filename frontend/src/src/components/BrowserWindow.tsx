
import React from 'react';
import { RotateCcw, ShieldCheck, Lock, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface BrowserWindowProps {
  children: React.ReactNode;
  url: string;
}

export const BrowserWindow: React.FC<BrowserWindowProps> = ({ children, url }) => {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl border border-slate-100 group/browser">
      {/* Browser Toolbar */}
      <div className="bg-slate-50/50 backdrop-blur-md p-4 flex items-center gap-5 border-b border-slate-100">
        <div className="flex gap-2 ml-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm hover:brightness-90 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm hover:brightness-90 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm hover:brightness-90 transition-all cursor-pointer" />
        </div>
        
        <div className="flex items-center gap-4 ml-2 text-slate-300">
          <ChevronLeft className="w-5 h-5 hover:text-slate-600 cursor-pointer transition-colors" />
          <ChevronRight className="w-5 h-5 hover:text-slate-600 cursor-pointer transition-colors" />
          <RotateCcw className="w-4 h-4 hover:text-indigo-600 cursor-pointer transition-all active:rotate-180 ml-1" />
        </div>

        <div className="flex-1 bg-white rounded-2xl py-2 px-5 border border-slate-200/60 flex items-center gap-3 text-xs text-slate-500 font-medium shadow-sm ring-4 ring-slate-50/50">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span className="truncate opacity-70 tracking-tight">{url}</span>
        </div>

        <div className="flex items-center gap-5 pr-2">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest">TLS_v1.3</span>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-300 hover:text-slate-600 cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-[#fcfdfe] overflow-auto flex flex-col min-h-0">
         <div className="flex-1 w-full flex flex-col items-center justify-center p-8 relative min-h-fit">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.2] pointer-events-none" />
            <div className="relative z-10 w-full flex flex-col items-center justify-center">
              {children}
            </div>
         </div>
      </div>
    </div>
  );
};
