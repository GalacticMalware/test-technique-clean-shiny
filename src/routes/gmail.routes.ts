import { Router } from 'express';
import { GmailController } from '../controllers/gmail.controller';

const router = Router();

router.post('/', GmailController.handleWebhook);

export default router;
