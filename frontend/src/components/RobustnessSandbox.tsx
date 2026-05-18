import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sliders, ShieldAlert, Award, Zap, RefreshCw } from 'lucide-react';
import { useAgentStore } from '../store/useAgentStore';

export const RobustnessSandbox: React.FC = () => {
  const store = useAgentStore();
  const [blur, setBlur] = useState(0);
  const [noise, setNoise] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [isAuditing, setIsAuditing] = useState(false);
  const [confidence, setConfidence] = useState(96.4);
  const [decayPoints, setDecayPoints] = useState<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sampleImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80'; // A premium black Porsche 911

  // Handle rendering of noisy image on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sampleImage;
    img.onload = () => {
      canvas.width = 380;
      canvas.height = 240;
      ctx.drawImage(img, 0, 0, 380, 240);

      // Apply Canvas filters for blur and contrast
      ctx.filter = `blur(${blur}px) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, 380, 240);
      ctx.filter = 'none'; // reset

      // Apply manual pixel noise
      if (noise > 0) {
        const imgData = ctx.getImageData(0, 0, 380, 240);
        const data = imgData.data;
        const noiseAmount = noise * 2.55; // convert percentage to 0-255 scale
        
        for (let i = 0; i < data.length; i += 4) {
          const rand = (Math.random() - 0.5) * noiseAmount;
          // Apply additive noise to RGB channels
          data[i] = Math.min(255, Math.max(0, data[i] + rand));
          data[i+1] = Math.min(255, Math.max(0, data[i+1] + rand));
          data[i+2] = Math.min(255, Math.max(0, data[i+2] + rand));
        }
        ctx.putImageData(imgData, 0, 0);
      }
    };
  }, [blur, noise, contrast]);

  // Dynamically calculate model confidence decay
  useEffect(() => {
    // Math to model how Vision models degrade under perturbations:
    // Blur reduces high-frequency spatial details.
    // Noise corrupts local textures.
    // Contrast deviance drops edge recognition.
    const blurImpact = blur * 8.5;
    const noiseImpact = noise * 0.95;
    const contrastImpact = Math.abs(100 - contrast) * 0.35;
    const totalImpact = blurImpact + noiseImpact + contrastImpact;

    const newConfidence = Math.max(0, Math.min(98.8, 96.4 - totalImpact + Math.random() * 0.8));
    setConfidence(newConfidence);
  }, [blur, noise, contrast]);

  const triggerAudit = () => {
    setIsAuditing(true);
    store.addLog("SYSTEM: Commencing Vision Model Robustness Audit.", "info");
    
    // Simulate auditing data points across noise gradient
    setTimeout(() => {
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i <= 10; i++) {
        const stepNoise = i * 10;
        const blurFactor = blur * 4.5;
        const cFactor = Math.abs(100 - contrast) * 0.2;
        const stepConfidence = Math.max(
          5, 
          Math.min(98.8, 96.4 - (stepNoise * 0.6 + blurFactor + cFactor))
        );
        points.push({ x: stepNoise, y: stepConfidence });
      }
      setDecayPoints(points);
      setIsAuditing(false);
      
      if (confidence < 50) {
        store.addLog(`AUDIT THREAT: Model classification confidence dropped to ${confidence.toFixed(1)}%. Bounding-box edge detection failed completely.`, "error");
      } else {
        store.addLog(`AUDIT SECURE: Model resolved targets with ${confidence.toFixed(1)}% confidence despite active environmental noise.`, "success");
      }
    }, 1200);
  };

  const resetAudit = () => {
    setBlur(0);
    setNoise(0);
    setContrast(100);
    setDecayPoints([]);
    store.addLog("SYSTEM: Reset Robustness sandbox to baseline values.", "info");
  };

  // Convert audit points into SVG coordinates
  const getDecayChartPoints = () => {
    if (decayPoints.length === 0) return '';
    return decayPoints.map(p => {
      const x = (p.x / 100) * 300;
      const y = 90 - (p.y / 100) * 80;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full p-2 h-full overflow-y-auto">
      {/* Configuration & Sliders */}
      <div className="w-full lg:w-96 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        <div>
          <h2 className="text-slate-900 font-black text-xl tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            Distortion Workshop
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Apply physical distortions to benchmark CNN classification durability.
          </p>
        </div>

        {/* Sliders Container */}
        <div className="flex flex-col gap-5">
          {/* Slider 1: Blur */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gaussian Blur</span>
              <span className="text-xs font-bold text-indigo-600 font-mono">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={blur}
              onChange={(e) => setBlur(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[9px] text-slate-400 font-medium">Simulates rainfall, fog, or lens focusing failures.</span>
          </div>

          {/* Slider 2: Gaussian Noise */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gaussian Noise</span>
              <span className="text-xs font-bold text-indigo-600 font-mono">{noise}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={noise}
              onChange={(e) => setNoise(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[9px] text-slate-400 font-medium">Simulates camera static, dark sensor noise, or packet drops.</span>
          </div>

          {/* Slider 3: Contrast */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contrast Deviancy</span>
              <span className="text-xs font-bold text-indigo-600 font-mono">{contrast}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="180"
              step="10"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[9px] text-slate-400 font-medium">Simulates severe sunlight glare or night-time shadow offsets.</span>
          </div>
        </div>

        {/* Trigger Controls */}
        <div className="mt-auto space-y-3">
          <button
            onClick={triggerAudit}
            disabled={isAuditing}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs text-white bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 transition-all shadow-lg shadow-slate-200"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            {isAuditing ? 'CALCULATING GRAPHS...' : 'RUN ROBUSTNESS AUDIT'}
          </button>
          <button
            onClick={resetAudit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs text-slate-500 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            RESET FACTORY SETTINGS
          </button>
        </div>
      </div>

      {/* Main Sandbox & Real-time Graphs */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Dual Canvas Layout */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Audit Visuals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Original Image */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500 block">Baseline Classification Target (Car)</span>
              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-100 shadow-inner relative group h-[240px]">
                <img
                  src={sampleImage}
                  alt="Original classification target"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 uppercase rounded-md tracking-wider flex items-center gap-1 shadow-lg">
                  <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                  CONFIDENCE: 96.4%
                </div>
              </div>
            </div>

            {/* Distorted Canvas */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500 block">Audited Signal (Real-time Canvas Rendering)</span>
              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-100 shadow-inner relative h-[240px]">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                <div className={`absolute top-4 left-4 text-white text-[8px] font-black px-2 py-1 uppercase rounded-md tracking-wider flex items-center gap-1 shadow-lg ${confidence > 60 ? 'bg-indigo-600' : 'bg-rose-500'}`}>
                  CONFIDENCE: {confidence.toFixed(1)}%
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Decay Curves SVG Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Degradation & Decay Curve</h3>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* The SVG Decay Graph */}
            <div className="w-full md:w-[320px] h-32 bg-slate-950 border border-slate-900 rounded-2xl relative overflow-hidden flex items-end p-1 shrink-0">
              {decayPoints.length > 0 ? (
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="decayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,100 ${getDecayChartPoints()} 300,100`}
                    fill="url(#decayGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    points={getDecayChartPoints()}
                  />
                  {decayPoints.map((p, i) => {
                    const cx = (p.x / 100) * 300;
                    const cy = 90 - (p.y / 100) * 80;
                    return (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="3"
                        fill="#fff"
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[9px] text-slate-600 font-bold font-mono uppercase tracking-widest gap-1">
                  <span>AWAITING SIGNAL AUDIT...</span>
                  <span className="text-[8px] opacity-70">Click "RUN ROBUSTNESS AUDIT" to plot decay curve.</span>
                </div>
              )}
            </div>

            {/* Explanation Analysis */}
            <div className="flex-1 flex flex-col gap-2.5">
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block">Neural Diagnosis Report</span>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] text-slate-600 font-medium leading-relaxed">
                {confidence > 80 ? (
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>OPTIMAL STABILITY:</strong> Bounding vectors are intact. The high-frequency visual kernels in the model are matching feature segments effectively despite current micro-distortions.
                    </span>
                  </div>
                ) : confidence > 50 ? (
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>SIGMA CONVERGENCE DROP:</strong> Edge features are becoming blurred. The convolutional filters are experiencing moderate confusion, leading to lower probability scores across localized spatial grids.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>FEATURE EXTRACTOR CRASH:</strong> Contrast distortion and sensor noise have completely overwhelmed the structural boundaries. The image is now categorized as chaotic noise, dropping localization confidence below the safe operational threshold.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
