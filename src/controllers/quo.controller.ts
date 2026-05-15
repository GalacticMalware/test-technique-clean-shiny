import { Request, Response, NextFunction } from 'express';
import { messageQueue } from '../core/queue/message.queue';
import { IncomingMessagePayload } from '../interfaces/message.interface';

export class QuoController {
  public static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { MessageSid, From, Body } = req.body;

      if (!MessageSid || !From || !Body) {
        res.status(400).json({ error: 'Invalid QUO SMS payload' });
        return;
      }

      const payload: IncomingMessagePayload = {
        messageId: MessageSid,
        sender: From,
        channel: 'QUO',
        body: Body,
        timestamp: new Date().toISOString()
      };

      await messageQueue.add(`quo_${MessageSid}`, payload);

      res.status(202).json({ status: 'ACCEPTED_FOR_ASYNC_PROCESSING' });
    } catch (error) {
      next(error);
    }
  }
}
