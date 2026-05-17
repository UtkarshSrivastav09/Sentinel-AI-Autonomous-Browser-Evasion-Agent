
export type AgentStatus = 'idle' | 'observing' | 'thinking' | 'acting' | 'success' | 'failed';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'observation' | 'action' | 'error' | 'success';
  message: string;
}

export interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
}

export type ChallengeType = 'text' | 'image-grid' | 'slider' | 'visual-click';

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  instruction: string;
  status: 'pending' | 'solving' | 'completed' | 'failed';
}
