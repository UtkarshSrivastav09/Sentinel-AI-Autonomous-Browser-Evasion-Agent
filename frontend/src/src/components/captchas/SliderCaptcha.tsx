
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SliderCaptchaProps {
  puzzleImage: string;
  pieceImage: string;
  targetX: number;
  onSuccess: () => void;
  onFailure: () => void;
  isAgentSolving?: boolean;
  agentProgress?: number;
}

export const SliderCaptcha: React.FC<SliderCaptchaProps> = ({
  puzzleImage,
  pieceImage,
  targetX,
  onSuccess,
  onFailure,
  isAgentSolving = false,
  agentProgress = 0
}) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isAgentSolving) {
      setPosition(agentProgress);
    }
  }, [isAgentSolving, agentProgress]);

  const handleMouseDown = () => {
    if (!isAgentSolving) setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      const x = Math.max(0, Math.min(e.clientX - rect.left - 20, rect.width - 60));
      setPosition(x);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    verify();
  };

  const verify = () => {
    const threshold = 10;
    if (Math.abs(position - targetX) < threshold) {
      setIsVerified(true);
      onSuccess();
    } else {
      setPosition(0);
      onFailure();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 w-80 select-none">
      <h3 className="text-slate-800 font-semibold mb-4 text-center">Slide to complete the puzzle</h3>

      <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden mb-6">
        <img src={puzzleImage} alt="puzzle" className="w-full h-full object-cover" />

        {/* Target Slot (Shadow) */}
        <div
          className="absolute w-12 h-12 bg-black/40 rounded-md"
          style={{ top: '40%', left: `${targetX}px` }}
        />

        {/* Puzzle Piece */}
        <div
          className={cn(
            "absolute w-12 h-12 shadow-lg rounded-md border-2 border-white/50 overflow-hidden transition-shadow",
            isDragging ? "shadow-2xl" : "shadow-md"
          )}
          style={{
            top: '40%',
            left: `${position}px`,
          }}
        >
          <img src={pieceImage} alt="piece" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative h-10 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-100 transition-all duration-75"
          style={{ width: `${position + 40}px` }}
        />

        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            "absolute top-0 w-12 h-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow z-10",
            isVerified ? "bg-emerald-500" : "bg-white border border-slate-300 shadow-sm"
          )}
          style={{ left: `${position}px` }}
        >
          {isVerified ? (
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          ) : (
            <ChevronRight className="w-6 h-6 text-slate-400" />
          )}
        </div>

        {!isVerified && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
            Slide to complete
          </div>
        )}
      </div>
    </div>
  );
};
