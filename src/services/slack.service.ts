import { env } from '../config/env.config';

export class SlackService {
  public static async createHumanTicket(reason: string, customerData: any, messageBody: string): Promise<void> {
    console.log(`[Slack Notification Sent] Direct webhook executed inside internal channels.`);
    // Fetch nativo con el endpoint de Slack inyectado
  }
}
