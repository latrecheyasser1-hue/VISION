export type WhatsAppConnectionStatus = 'disconnected' | 'connecting' | 'qr_ready' | 'connected';

export interface WhatsAppAgentSettings {
  executionEnabled: boolean;
  testPhone: string;
  dailyLimit: number;
  workHoursStart: number;
  workHoursEnd: number;
  minDelayProspectSeconds: number;
  maxDelayProspectSeconds: number;
}

export interface ChunkedMessage {
  partIndex: number;
  totalParts: number;
  partName: string; // e.g. 'Tahya', 'Pain Point', 'VISION Solution', 'Link & Contact'
  text: string;
  typingDelayMs: number;
  pauseAfterMs: number;
}

export interface GeneratedOutreachContent {
  chunks: ChunkedMessage[];
  fullText: string;
}
