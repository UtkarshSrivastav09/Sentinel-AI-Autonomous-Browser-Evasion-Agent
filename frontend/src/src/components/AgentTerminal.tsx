
import React from 'react';
import { Terminal } from 'lucide-react';
import { LogEntry, AgentStatus } from '../types';
import { cn } from '../utils/cn';

interface AgentTerminalProps {
  logs: LogEntry[];
  status: AgentStatus;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs, status }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'observing': return 'text-blue-400';
      case 'thinking': return 'text-indigo-400';
      case 'acting': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121214] text-slate-300 font-mono text-[11px] border-l border-[#2a2a2e] w-[420px] shadow-2xl relative overflow-hidden">
      {/* Mac Terminal Header */}
      <div className="h-10 bg-[#1c1c1e] flex items-center px-4 border-b border-[#2a2a2e] shrink-0 sticky top-0 z-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
        <div className="flex-1 flex justify-center items-center gap-2 pr-10">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-bold tracking-tight text-[10px]">bash — 80×24</span>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-2.5 scrollbar-hide bg-[#121214]"
      >
        <div className="text-slate-500 mb-4 opacity-50 text-[10px]">
          Last login: {new Date().toLocaleDateString()} on ttys001
        </div>
        
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-10">
             <div className="w-20 h-20 border-4 border-slate-700 rounded-full animate-pulse flex items-center justify-center">
                <Terminal className="w-10 h-10" />
             </div>
          </div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="group flex flex-col gap-1 hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 text-[9px] min-w-[60px]">
                [{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
              </span>
              <span className={cn(
                "uppercase text-[8px] font-bold tracking-widest",
                getStatusColor(log.type as any)
              )}>
                {log.type}
              </span>
            </div>
            <div className="flex gap-2 items-start">
               <span className="text-indigo-500 font-bold shrink-0">❯</span>
               <p className={cn(
                 "leading-relaxed break-words",
                 log.type === 'error' ? "text-red-400" : 
                 log.type === 'success' ? "text-emerald-400" : 
                 "text-slate-200"
               )}>
                 {log.message}
               </p>
            </div>
          </div>
        ))}

        <div className="flex gap-2 items-center p-2">
          <span className="text-indigo-500 font-bold animate-pulse">❯</span>
          <span className="w-2 h-4 bg-indigo-500/50 animate-pulse" />
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="p-3 bg-[#1c1c1e] border-t border-[#2a2a2e] flex items-center justify-between text-[9px] text-slate-500 font-bold px-5">
         <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               CONNECTION_SECURE
            </span>
            <span>UTF-8</span>
         </div>
         <span className={cn(getStatusColor(status), "animate-pulse")}>
           {status.toUpperCase()}
         </span>
      </div>
    </div>
  );
};
