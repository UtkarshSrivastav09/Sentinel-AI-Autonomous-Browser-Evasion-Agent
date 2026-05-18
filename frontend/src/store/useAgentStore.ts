import { create } from 'zustand';
import { AgentStatus, LogEntry, BoundingBox } from '../types';

interface AgentState {
  activeTab: 'solver' | 'biometrics' | 'robustness';
  setActiveTab: (tab: 'solver' | 'biometrics' | 'robustness') => void;
  currentChallengeIdx: number;
  status: AgentStatus;
  logs: LogEntry[];
  boxes: BoundingBox[];
  cursorPos: { x: number; y: number };
  isScanning: boolean;
  
  // Challenge specific state
  selectedImages: number[];
  captchaText: string;
  sliderPos: number;
  foundTargets: number[];

  // Actions
  addLog: (message: string, type?: LogEntry['type']) => void;
  setStatus: (status: AgentStatus) => void;
  setCursorPos: (pos: { x: number; y: number }) => void;
  setScanning: (isScanning: boolean) => void;
  setBoxes: (boxes: BoundingBox[]) => void;
  
  setSelectedImages: (indices: number[] | ((prev: number[]) => number[])) => void;
  setCaptchaText: (text: string | ((prev: string) => string)) => void;
  setSliderPos: (pos: number) => void;
  setFoundTargets: (targets: number[] | ((prev: number[]) => number[])) => void;
  
  nextChallenge: (totalChallenges: number) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activeTab: 'solver',
  setActiveTab: (activeTab) => set({ activeTab }),
  currentChallengeIdx: 0,
  status: 'idle',
  logs: [],
  boxes: [],
  cursorPos: { x: 100, y: 100 },
  isScanning: false,
  
  selectedImages: [],
  captchaText: '',
  sliderPos: 0,
  foundTargets: [],

  addLog: (message, type = 'info') => set((state) => ({
    logs: [...state.logs, {
      id: Math.random().toString(36).slice(2, 11),
      timestamp: new Date(),
      type,
      message
    }]
  })),

  setStatus: (status) => set({ status }),
  setCursorPos: (cursorPos) => set({ cursorPos }),
  setScanning: (isScanning) => set({ isScanning }),
  setBoxes: (boxes) => set({ boxes }),

  setSelectedImages: (indices) => set((state) => ({
    selectedImages: typeof indices === 'function' ? indices(state.selectedImages) : indices
  })),
  setCaptchaText: (text) => set((state) => ({
    captchaText: typeof text === 'function' ? text(state.captchaText) : text
  })),
  setSliderPos: (sliderPos) => set({ sliderPos }),
  setFoundTargets: (targets) => set((state) => ({
    foundTargets: typeof targets === 'function' ? targets(state.foundTargets) : targets
  })),

  nextChallenge: (totalChallenges) => set((state) => {
    if (state.currentChallengeIdx < totalChallenges - 1) {
      return {
        currentChallengeIdx: state.currentChallengeIdx + 1,
        status: 'idle',
        selectedImages: [],
        captchaText: '',
        sliderPos: 0,
        foundTargets: []
      };
    }
    return state;
  }),

  reset: () => set({
    activeTab: 'solver',
    currentChallengeIdx: 0,
    status: 'idle',
    logs: [],
    boxes: [],
    selectedImages: [],
    captchaText: '',
    sliderPos: 0,
    foundTargets: []
  })
}));
