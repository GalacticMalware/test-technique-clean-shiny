export interface IncomingMessagePayload {
  messageId: string;
  sender: string; // Email o Número telefónico
  channel: 'GMAIL' | 'QUO';
  body: string;
  timestamp: string;
}

export interface AutomationResult {
  intent: string;
  actionTaken: 'AUTOMATED' | 'ESCALATED_TO_HUMAN';
  ticketCreated: boolean;
  replySent: boolean;
}
