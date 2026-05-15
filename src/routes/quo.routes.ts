import { Router } from 'express';
import { QuoController } from '../controllers/quo.controller';

const router = Router();

router.post('/', QuoController.handleWebhook);

export default router;
