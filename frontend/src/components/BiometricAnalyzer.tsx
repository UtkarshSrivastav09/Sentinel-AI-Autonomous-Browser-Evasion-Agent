import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, RotateCcw, ShieldCheck, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import { useAgentStore } from '../store/useAgentStore';

interface PathPoint {
  x: number;
  y: number;
  t: number;
  v: number; // velocity
  e: number; // entropy/jitter
}

export const BiometricAnalyzer: React.FC = () => {
  const store = useAgentStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState<PathPoint[]>([]);
  const [metrics, setMetrics] = useState({
    avgSpeed: 0,
    peakSpeed: 0,
    entropy: 0,
    classification: 'Awaiting Input...',
    classificationColor: 'text-slate-400',
    totalSamples: 0,
  });

  const lastPointRef = useRef<{ x: number; y: number; t: number } | null>(null);

  // Set up canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#6366f1'; // Indigo-500
      ctx.lineWidth = 3;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    
    const { x, y } = getCoordinates(e);
    const now = performance.now();
    lastPointRef.current = { x, y, t: now };
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    
    setPath([{ x, y, t: now, v: 0, e: 0 }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const now = performance.now();
    const last = lastPointRef.current;
    
    // Calculate distance and time delta
    const dx = x - last.x;
    const dy = y - last.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const dt = now - last.t;
    
    // Calculate velocity (pixels per millisecond)
    const velocity = dt > 0 ? distance / dt : 0;
    
    // Draw stroke
    ctx.lineTo(x, y);
    ctx.stroke();

    // Calculate micro-jitter/entropy
    let entropyVal = 0;
    if (path.length > 1) {
      const prev = path[path.length - 1];
      const prevDx = last.x - prev.x;
      const prevDy = last.y - prev.y;
      
      // Calculate angle change
      const angle1 = Math.atan2(dy, dx);
      const angle2 = Math.atan2(prevDy, prevDx);
      let angleDiff = Math.abs(angle1 - angle2);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
      
      // High speed + micro angle changes indicate natural human tremor
      entropyVal = velocity > 0.05 ? angleDiff * 50 : 0;
    }

    const newPoint: PathPoint = { x, y, t: now, v: velocity, e: entropyVal };
    setPath((prev) => [...prev, newPoint]);
    
    lastPointRef.current = { x, y, t: now };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;
    calculateFinalMetrics(path);
  };

  const calculateFinalMetrics = (currentPath: PathPoint[]) => {
    if (currentPath.length < 5) {
      setMetrics({
        avgSpeed: 0,
        peakSpeed: 0,
        entropy: 0,
        classification: 'Drawing too short!',
        classificationColor: 'text-rose-400',
        totalSamples: currentPath.length,
      });
      return;
    }

    // Skip the first sample (0 velocity)
    const velocities = currentPath.slice(1).map(p => p.v).filter(v => v > 0);
    const avgV = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const peakV = Math.max(...velocities, 0);
    
    const entropies = currentPath.map(p => p.e).filter(e => e > 0);
    const avgE = entropies.length > 0 ? entropies.reduce((sum, e) => sum + e, 0) / entropies.length : 0;

    // Classification Heuristics
    let classification = 'Biological (Human)';
    let classificationColor = 'text-emerald-400';

    // If extremely low variations in angle change & perfectly consistent speed -> Automated
    const velocityStdev = Math.sqrt(
      velocities.reduce((sum, v) => sum + Math.pow(v - avgV, 2), 0) / velocities.length
    );

    if (avgE < 0.8 && velocityStdev < 0.08) {
      classification = 'Automated (Linear Bot)';
      classificationColor = 'text-rose-400';
    } else if (avgE < 2.5 && velocityStdev < 0.25) {
      classification = 'AI Agent (Stealth Eased)';
      classificationColor = 'text-indigo-400';
    }

    setMetrics({
      avgSpeed: avgV,
      peakSpeed: peakV,
      entropy: avgE,
      classification,
      classificationColor,
      totalSamples: currentPath.length,
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPath([]);
    setMetrics({
      avgSpeed: 0,
      peakSpeed: 0,
      entropy: 0,
      classification: 'Awaiting Input...',
      classificationColor: 'text-slate-400',
      totalSamples: 0,
    });
  };

  const simulateBot = () => {
    clearCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const startX = w * 0.15;
    const startY = h * 0.5;
    const endX = w * 0.85;
    const endY = h * 0.5;

    ctx.strokeStyle = '#ef4444'; // Rose-500
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.strokeStyle = '#6366f1'; // Reset stroke color

    // Generate linear path points
    const points: PathPoint[] = [];
    const steps = 30;
    const now = performance.now();
    
    for (let i = 0; i <= steps; i++) {
      const tRatio = i / steps;
      const x = startX + (endX - startX) * tRatio;
      const y = startY + (endY - startY) * tRatio;
      const t = now + i * 16; // 60fps increments
      
      // Bots teleport or have static linear velocity
      const v = 0.95; // perfectly flat speed
      const e = 0.01; // virtually zero hand tremor/entropy
      
      points.push({ x, y, t, v, e });
    }

    setPath(points);
    setMetrics({
      avgSpeed: 0.95,
      peakSpeed: 0.95,
      entropy: 0.01,
      classification: 'Automated (Linear Bot)',
      classificationColor: 'text-rose-400',
      totalSamples: points.length,
    });
    
    store.addLog("SYSTEM: Running biometric simulation for standard automated Selenium/Puppeteer mouse movement.", "info");
    store.addLog("ANALYSIS: Perfect straight line detected. Velocity variance = 0. Jitter entropy = 0. Signature: BOT.", "error");
  };

  // Safe SVG rendering helpers
  const getVelocityPoints = () => {
    if (path.length < 2) return '';
    const maxVal = Math.max(...path.map(p => p.v), 1);
    const points = path.map((p, i) => {
      const x = (i / (path.length - 1)) * 300;
      const y = 90 - (p.v / maxVal) * 80;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const getEntropyPoints = () => {
    if (path.length < 2) return '';
    const maxVal = Math.max(...path.map(p => p.e), 1);
    const points = path.map((p, i) => {
      const x = (i / (path.length - 1)) * 300;
      const y = 90 - (p.e / maxVal) * 80;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full p-2 h-full overflow-y-auto">
      {/* Drawing Pad Area */}
      <div className="flex-1 flex flex-col gap-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-slate-900 font-black text-xl tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
            Biometric Kinematics Drawing Pad
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Draw, trace, or scribble inside the pad below to analyze human hand dynamics.
          </p>
        </div>

        <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 rounded-2xl overflow-hidden aspect-video h-[320px] transition-colors duration-300">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          />

          {path.length === 0 && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 text-center text-slate-400/80 gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100">
                <HelpCircle className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">Awaiting Biometric Trace...</span>
                <span className="text-[10px] text-slate-400/70 mt-1 max-w-[280px]">
                  Click and drag inside this canvas box using your mouse or touchscreen to log biological tremors.
                </span>
              </div>
            </div>
          )}

          {/* Glowing scanner line animation */}
          {isDrawing && (
            <div className="absolute left-0 right-0 h-px bg-indigo-500/30 shadow-[0_0_10px_#6366f1] animate-[pulse_1.5s_infinite]" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearCanvas}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs text-slate-500 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            CLEAR CANVAS
          </button>
          <button
            onClick={simulateBot}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs text-white bg-slate-900 hover:bg-rose-600 transition-all shadow-lg shadow-slate-200"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            RUN BOT SIMULATOR
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Dashboard */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6">
        
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric Analysis Readout</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 block mb-1">AVG SPEED</span>
              <span className="text-lg font-black tracking-tight text-slate-800 font-mono">
                {metrics.avgSpeed > 0 ? `${metrics.avgSpeed.toFixed(3)} px/ms` : '0.000'}
              </span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-[9px] font-black text-slate-400 block mb-1">JITTER ENTROPY</span>
              <span className="text-lg font-black tracking-tight text-slate-800 font-mono">
                {metrics.entropy > 0 ? metrics.entropy.toFixed(3) : '0.000'}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-indigo-400/80 uppercase tracking-wider mb-0.5">SIGNATURE STATUS</span>
              <span className={`text-sm font-black tracking-tight ${metrics.classificationColor}`}>
                {metrics.classification}
              </span>
            </div>
            {metrics.classification.includes('Human') ? (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            ) : metrics.classification.includes('Bot') ? (
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Real-time SVG Charts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-6">
          
          {/* Velocity Profile Graph */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Velocity Profile (px/ms)</span>
            <div className="h-28 bg-slate-950 border border-slate-900 rounded-2xl relative overflow-hidden flex items-end p-1">
              {path.length >= 2 ? (
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,100 ${getVelocityPoints()} 300,100`}
                    fill="url(#velGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    points={getVelocityPoints()}
                  />
                </svg>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-600 font-bold font-mono uppercase tracking-widest">
                  NO LIVE VELOCITY DATA
                </div>
              )}
            </div>
          </div>

          {/* Entropy / Jitter Profile Graph */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Entropy & Micro-Jitter Spectrum</span>
            <div className="h-28 bg-slate-950 border border-slate-900 rounded-2xl relative overflow-hidden flex items-end p-1">
              {path.length >= 2 ? (
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,100 ${getEntropyPoints()} 300,100`}
                    fill="url(#entGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    points={getEntropyPoints()}
                  />
                </svg>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-600 font-bold font-mono uppercase tracking-widest">
                  NO LIVE JITTER DATA
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
