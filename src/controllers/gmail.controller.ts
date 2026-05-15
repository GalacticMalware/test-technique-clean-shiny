import { Request, Response, NextFunction } from 'express';
import { messageQueue } from '../core/queue/message.queue';
import { IncomingMessagePayload } from '../interfaces/message.interface';

export class GmailController {
  public static async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, from, snippet, internalDate } = req.body;

      if (!id || !from || !snippet) {
        res.status(400).json({ error: 'Missing standard Gmail properties' });
        return;
      }

      const payload: IncomingMessagePayload = {
        messageId: id,
        sender: from,
        channel: 'GMAIL',
        body: snippet,
        timestamp: internalDate || new Date().toISOString()
      };

      // Se empuja inmediatamente a la cola (Tiempo de respuesta del Webhook < 50ms)
      await messageQueue.add(`gmail_${id}`, payload);

      res.status(202).json({ status: 'ACCEPTED_FOR_ASYNC_PROCESSING' });
    } catch (error) {
      next(error);
    }
  }
}
