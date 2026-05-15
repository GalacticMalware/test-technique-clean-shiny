import { env } from '../config/env.config';

export class AIService {
  public static async analyzeIntentAndExtractData(messageBody: string, historySummary: string): Promise<any> {
    // Simulación de llamada optimizada. Reducción de tokens inyectando solo el sumario analítico.
    const lower = messageBody.toLowerCase();
    
    // Regla dura pre-compilada rápida (Token cost = 0)
    if (lower.includes('cancel')) {
      return { intent: 'CANCELACION', confidence: 1.0 };
    }
    if (lower.includes('move') || lower.includes('reschedule') || lower.includes('friday')) {
      return { intent: 'REAGENDAMIENTO', confidence: 0.95, entityDate: '2026-05-15' };
    }

    return { intent: 'PREGUNTA_OPERATIVA', confidence: 0.85 };
  }
}
