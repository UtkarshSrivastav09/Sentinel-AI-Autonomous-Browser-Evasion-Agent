import { useEffect } from 'react';
import { cn } from './utils/cn';
import { generateHumanPath } from './utils/bezierMouse';
import { AgentTerminal } from './components/AgentTerminal';
import { BrowserWindow } from './components/BrowserWindow';
import { AgentOverlay } from './components/AgentOverlay';
import { ImageGrid } from './components/captchas/ImageGrid';
import { TextCaptcha } from './components/captchas/TextCaptcha';
import { SliderCaptcha } from './components/captchas/SliderCaptcha';
import { VisualChallenge } from './components/captchas/VisualChallenge';
import { ChallengeType } from './types';
import { Play, RotateCcw, ShieldCheck, Activity, Sliders } from 'lucide-react';
import { useAgentStore } from './store/useAgentStore';
import { BiometricAnalyzer } from './components/BiometricAnalyzer';
import { RobustnessSandbox } from './components/RobustnessSandbox';

const CHALLENGES: { type: ChallengeType; title: string }[] = [
  { type: 'image-grid', title: 'Image Grid Recognition' },
  { type: 'text', title: 'Alphanumeric Distortion' },
  { type: 'slider', title: 'Kinetic Alignment' },
  { type: 'visual-click', title: 'Contextual Object Detection' },
];

const IMAGES = {
  cars: [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=300&q=80',
  ],
  landscape: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
};

// Extracted menu items outside component to avoid recreation
type MenuItem = {
  label: string;
  active: boolean;
  onClick?: () => void;
};

function App() {
  const store = useAgentStore();
  
  // Auto-solve trigger for Extension mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autosolve') === 'true' && store.status === 'idle') {
      setTimeout(() => solveChallenge(), 1000);
    }
  }, []);

  const moveCursor = async (x: number, y: number) => {
    const start = store.cursorPos;
    const end = { x, y };
    const path = generateHumanPath(start, end, 20); // 20 steps

    for (const point of path) {
      store.setCursorPos(point);
      // Wait roughly 16ms per step (approx 60fps)
      await new Promise(r => setTimeout(r, 16 + Math.random() * 10));
    }
  };

  const solveChallenge = async () => {
    if (store.status !== 'idle') return;
    
    const challenge = CHALLENGES[store.currentChallengeIdx];
    store.setStatus('observing');
    store.addLog(`Initiating sequence for: ${challenge.title}`, 'info');
    
    // 1. Observe
    store.setScanning(true);
    store.addLog('Scanning viewport for interactive elements...', 'observation');
    await new Promise(r => setTimeout(r, 2000));
    store.setScanning(false);
    
    // 2. Understand & Identify
    store.setStatus('thinking');
    if (challenge.type === 'image-grid') {
      store.setBoxes([
        { top: 32, left: 6, width: 88, height: 48, label: 'NEURAL_MATRIX' },
        { top: 88, left: 68, width: 26, height: 7, label: 'CMD_VERIFY' }
      ]);
      store.addLog('Neural Net analyzing image segments...', 'info');
      await new Promise(r => setTimeout(r, 600));
      store.addLog('Identified image grid. Target: "Cars". Confidence: 0.94', 'observation');
      store.addLog('XAI DIAGNOSIS: Segment indices [0, 2, 4, 7] resolved with high structural similarity. Circular edge curves (wheels) and reflective metallic outlines (chassis) mapped to target category with p-val < 0.001.', 'success');
    } else if (challenge.type === 'text') {
      store.setBoxes([
        { top: 24, left: 8, width: 84, height: 32, label: 'OCR_SOURCE' },
        { top: 72, left: 8, width: 84, height: 14, label: 'INPUT_BUFFER' }
      ]);
      store.addLog('De-noising source image...', 'info');
      await new Promise(r => setTimeout(r, 600));
      store.addLog('Detected distorted text. Running OCR...', 'observation');
      store.addLog('XAI DIAGNOSIS: Segmented alphanumeric symbols: [X, 8, R, 2, P]. Neural OCR layers resolved glyph outlines successfully despite 35% spatial shear distortion.', 'success');
    } else if (challenge.type === 'slider') {
      store.setBoxes([
        { top: 21, left: 6, width: 88, height: 48, label: 'SPATIAL_SYNC' },
        { top: 78, left: 6, width: 88, height: 12, label: 'MOTION_TRACK' }
      ]);
      store.addLog('Extracting feature maps for puzzle matching...', 'info');
      await new Promise(r => setTimeout(r, 600));
      store.addLog('Identified slider mechanics. Calculating offset...', 'observation');
      store.addLog('XAI DIAGNOSIS: Pixel-wise correlation matched target shape puzzle slot at x-offset = 180px (Standard deviation overlap = 98.4%).', 'success');
    } else if (challenge.type === 'visual-click') {
      store.setBoxes([
        { top: 22, left: 8, width: 84, height: 62, label: 'CONTEXT_FIELD' },
        { top: 86, left: 68, width: 28, height: 8, label: 'CMD_BYPASS' }
      ]);
      store.addLog('Scanning contextual environment...', 'info');
      await new Promise(r => setTimeout(r, 600));
      store.addLog('Detected interactive objects in field.', 'observation');
      store.addLog('XAI DIAGNOSIS: Object identification maps: peak 1 (x:20, y:40) classification score: 0.941; peak 2 (x:65, y:55) score: 0.923; peak 3 (x:45, y:35) score: 0.957.', 'success');
    }

    await new Promise(r => setTimeout(r, 1500));
    store.setStatus('acting');

    // 3. Decide & Action
    if (challenge.type === 'image-grid') {
      const targets = [0, 2, 4, 7]; // Simulated "car" indices
      for (const idx of targets) {
        store.addLog(`Selecting image segment #${idx}`, 'action');
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        await moveCursor(400 + col * 50, 300 + row * 50);
        store.setSelectedImages(prev => [...prev, idx]);
        await new Promise(r => setTimeout(r, 400));
      }
      store.addLog('All targets identified. Clicking verify.', 'action');
      await moveCursor(550, 520);
    } else if (challenge.type === 'text') {
      const solution = 'X8R2P';
      store.addLog('OCR result: "X8R2P". Inputting characters...', 'action');
      await moveCursor(450, 420);
      for (let i = 0; i < solution.length; i++) {
        store.setCaptchaText(prev => prev + solution[i]);
        await new Promise(r => setTimeout(r, 200));
      }
      await moveCursor(450, 480);
    } else if (challenge.type === 'slider') {
      const target = 180;
      store.addLog('Synchronizing slider offset...', 'action');
      await moveCursor(380, 540);
      for (let p = 0; p <= target; p += 5) {
        store.setSliderPos(p);
        await new Promise(r => setTimeout(r, 20));
      }
      store.addLog('Alignment complete. Releasing...', 'action');
    } else if (challenge.type === 'visual-click') {
      const targets = [1, 2, 3];
      for (const id of targets) {
        store.addLog(`Target lock acquired: Object ID-${id}`, 'action');
        const pos = id === 1 ? { x: 420, y: 350 } : id === 2 ? { x: 550, y: 380 } : { x: 480, y: 420 };
        await moveCursor(pos.x, pos.y);
        store.setFoundTargets(prev => [...prev, id]);
        await new Promise(r => setTimeout(r, 600));
      }
    }

    await new Promise(r => setTimeout(r, 1000));
    store.setStatus('success');
    store.addLog(`Challenge ${store.currentChallengeIdx + 1} solved successfully!`, 'success');
    store.setBoxes([]);
    
    setTimeout(() => {
      if (store.currentChallengeIdx < CHALLENGES.length - 1) {
        store.nextChallenge(CHALLENGES.length);
      } else {
        store.addLog('All challenges completed. Agent task finished.', 'success');
      }
    }, 2000);
  };

  const handleReset = () => {
    store.reset();
    store.addLog('System reset. Waiting for instructions.', 'info');
  };

  const menuItems = [
    { label: 'Live Solver Simulation', active: store.activeTab === 'solver', onClick: () => store.setActiveTab('solver') },
    { label: 'Biometric Analyzer', active: store.activeTab === 'biometrics', onClick: () => store.setActiveTab('biometrics') },
    { label: 'AI Robustness Sandbox', active: store.activeTab === 'robustness', onClick: () => store.setActiveTab('robustness') },
    { label: 'Simulate Threat Audits', active: false, onClick: () => {
      store.addLog('SYSTEM: Initialized diagnostic threat sweeps across active frameworks.', 'info');
      store.addLog('AUDIT: No automation vulnerabilities flagged in current container context.', 'success');
    }}
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-700">
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-100 shadow-[20px_0_40px_rgba(0,0,0,0.01)] z-30">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter leading-none">CAPTCHA_AGENT</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.3em] mt-0.5">BY_UTKARSH_V2</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 ml-1">Mission Control</p>
            {menuItems.map((item, i) => (
              <button 
                key={i}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                  item.active ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", item.active ? "bg-indigo-500 animate-pulse" : "bg-slate-200")} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50/30">
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[10px] font-black text-slate-400">CORE_TEMP</span>
                 <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full w-[42%] bg-indigo-500 rounded-full" />
              </div>
           </div>
           <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-300"
          >
            <RotateCcw className="w-3 h-3" /> System Refresh
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative bg-white overflow-hidden">
        <header className="px-6 lg:px-10 py-4 lg:py-5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="lg:hidden w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
               <ShieldCheck className="text-white w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-0.5">Active_Phase</span>
              <span className="text-slate-900 font-black text-sm lg:text-lg tracking-tight truncate max-w-[150px] lg:max-w-none">
                {store.activeTab === 'solver' ? CHALLENGES[store.currentChallengeIdx]?.title : 
                 store.activeTab === 'biometrics' ? 'Biometric Kinematics Analyzer' : 
                 'AI Robustness Sandbox'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-6 text-[10px] font-bold text-slate-400 border-r border-slate-100 pr-6 mr-2">
               <div className="flex flex-col items-end">
                  <span className="text-slate-300">LATENCY</span>
                  <span className="text-slate-600 tracking-tighter font-mono">
                    {store.activeTab === 'solver' ? '0.004s' : 
                     store.activeTab === 'biometrics' ? 'REALTIME' : 
                     'GRADIENT'}
                  </span>
               </div>
            </div>

            {store.activeTab === 'solver' ? (
              <button 
                onClick={solveChallenge}
                disabled={store.status !== 'idle'}
                className="group relative flex items-center gap-2 lg:gap-3 bg-slate-900 text-white px-5 lg:px-8 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs tracking-[0.1em] hover:bg-indigo-600 disabled:opacity-40 transition-all shadow-xl shadow-slate-200"
              >
                <Play className="w-3 h-3 lg:w-4 lg:h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
                SOLVE_NOW
              </button>
            ) : (
              <div className="px-5 py-2.5 lg:py-3 rounded-xl border border-slate-100 text-[10px] font-black tracking-widest text-indigo-500 font-mono uppercase bg-indigo-50/50">
                {store.activeTab === 'biometrics' ? 'BIOMETRICS_MODE' : 'AUDITING_MODE'}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-10 flex flex-col overflow-y-auto lg:overflow-hidden bg-slate-50/50 pb-24 lg:pb-10">
          {store.activeTab === 'solver' && (
            <>
              <BrowserWindow url={`https://secure-gate.auth.internal/challenge/${CHALLENGES[store.currentChallengeIdx]?.type || 'unknown'}`}>
                <div className="h-full w-full flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden">
                   <div className="relative shadow-[0_30px_70px_rgba(0,0,0,0.1)] rounded-3xl">
                      <div className="relative z-10">
                        {store.currentChallengeIdx === 0 && (
                          <ImageGrid 
                            instruction="Cars"
                            images={IMAGES.cars}
                            selectedIndices={store.selectedImages}
                            onToggleImage={(i) => store.setSelectedImages(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                          />
                        )}

                        {store.currentChallengeIdx === 1 && (
                          <TextCaptcha 
                            text="X8R2P"
                            value={store.captchaText}
                            onChange={store.setCaptchaText}
                            onVerify={() => {}}
                          />
                        )}

                        {store.currentChallengeIdx === 2 && (
                          <SliderCaptcha 
                            puzzleImage={IMAGES.landscape}
                            pieceImage={IMAGES.mountain}
                            targetX={180}
                            onSuccess={() => {}}
                            onFailure={() => {}}
                            isAgentSolving={store.status === 'acting'}
                            agentProgress={store.sliderPos}
                          />
                        )}

                        {store.currentChallengeIdx === 3 && (
                          <VisualChallenge 
                            instruction="Identify the prominent peaks"
                            image={IMAGES.landscape}
                            targets={[
                              { id: 1, x: 20, y: 40, found: store.foundTargets.includes(1) },
                              { id: 2, x: 65, y: 55, found: store.foundTargets.includes(2) },
                              { id: 3, x: 45, y: 35, found: store.foundTargets.includes(3) },
                            ]}
                            onTargetClick={(id) => store.setFoundTargets(p => [...p, id])}
                          />
                        )}
                      </div>

                      <AgentOverlay 
                        boxes={store.boxes} 
                        cursorPosition={store.cursorPos}
                        isScanning={store.isScanning}
                      />
                   </div>
                </div>
              </BrowserWindow>

              <footer className="mt-8 flex items-center justify-between text-[10px] font-black text-slate-400 bg-white/50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ENTERPRISE_EDITION</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-indigo-500">
                    <ShieldCheck className="w-3 h-3" />
                    <span>KERNEL_SYNC_STABLE</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="font-mono">ID: {Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
                   <div className="h-4 w-px bg-slate-100" />
                   <span className="text-slate-900 font-bold">AUTO_SOLVE::READY</span>
                </div>
              </footer>
            </>
          )}

          {store.activeTab === 'biometrics' && <BiometricAnalyzer />}
          {store.activeTab === 'robustness' && <RobustnessSandbox />}
        </div>
      </main>

      {/* Floating Bottom Nav for Mobile / Tablet */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-slate-100 p-2.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-50 flex justify-around items-center">
        {menuItems.slice(0, 3).map((item, i) => {
          const Icon = i === 0 ? ShieldCheck : i === 1 ? Activity : Sliders;
          return (
            <button
              key={i}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center gap-1 p-1 rounded-xl transition-all duration-300",
                item.active ? "text-indigo-600 scale-105" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-wider">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Responsive Hidden wrapper for AgentTerminal to prevent layout breakage on small mobile viewports */}
      <div className="hidden xl:flex shrink-0">
        <AgentTerminal logs={store.logs} status={store.status} />
      </div>
    </div>
  );
}

export default App;
