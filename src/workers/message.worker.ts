import { Worker, Job } from 'bullmq';
import { env } from '../config/env.config';
import { IncomingMessagePayload } from '../interfaces/message.interface';
import { SupabaseService } from '../services/supabase.service';
import { AIService } from '../services/ia.service';
import { TeamupService } from '../services/teamup.service';
import { InvoiceNinjaService } from '../services/invoice.service';
import { SlackService } from '../services/slack.service';

const messageWorker = new Worker<IncomingMessagePayload>(
  'IncomingMessages',
  async (job: Job<IncomingMessagePayload>) => {
    const { messageId, sender, body } = job.data;

    console.log(`[Worker] Executing Job ${job.id} for message: ${messageId}`);

    // Step 1: Control estricto de Idempotencia
    const isDuplicated = await SupabaseService.checkIdempotency(messageId);
    if (isDuplicated) {
      console.warn(`[Idempotency Warning] Message ${messageId} already handled. Discarding job.`);
      return;
    }

    // Step 2: Identificación Automatizada del Cliente
    const customer = await SupabaseService.findCustomerByContact(sender);
    if (!customer) {
      // Escalación Inmediata de Negocio (Cliente no registrado)
      await SlackService.createHumanTicket('Unknown Sender / Prospect Client', { sender }, body);
      await SupabaseService.logMessageProcessed(messageId, { status: 'ESCALATED_UNKNOWN_CUSTOMER' });
      return;
    }

    // Step 3: Análisis Semántico & Extracción de Intención
    // Optimizamos tokens inyectando solo metadatos mínimos indispensables
    const extraction = await AIService.analyzeIntentAndExtractData(body, "Prev Resumen: Sin reclamos vigentes");

    // Step 4: Orquestador de Lógica Operacional Basado en la Intención Extraída
    switch (extraction.intent) {
      case 'REAGENDAMIENTO':
        const appointments = await TeamupService.getCustomerAppointments(customer.id);
        if (appointments.length === 1 && extraction.entityDate) {
          await TeamupService.rescheduleAppointment(appointments[0].id, extraction.entityDate);
          console.log(`[Automated Success] Appointment automatically adjusted for ${customer.name}`);
        } else {
          // Si hay ambigüedad (múltiples citas asignadas), se delega a un Humano vía Slack sin cometer errores operacionales
          await SlackService.createHumanTicket('Ambigüedad en Reagendamiento (Múltiples citas vigentes)', customer, body);
        }
        break;

      case 'CANCELACION':
        // Regla de Negocio Crítica: Las cancelaciones se notifican a operaciones para control de penalizaciones
        await SlackService.createHumanTicket('Solicitud Urgente de Cancelación de Servicio', customer, body);
        break;

      case 'FACTURACION':
        const financialStatus = await InvoiceNinjaService.getCustomerFinancialState(customer.id);
        console.log(`[Financial Automated Check] Status resolved cleanly: ${JSON.stringify(financialStatus)}`);
        break;

      default:
        // Caso de Control de Fallos (QA de Automatización Activa)
        await SlackService.createHumanTicket('Fallo en Enrutamiento Automático / Consulta Compleja', customer, body);
        break;
    }

    // Registrar procesamiento exitoso para blindar la idempotencia del sistema
    await SupabaseService.logMessageProcessed(messageId, { status: 'SUCCESSFULLY_PROCESSED', intent: extraction.intent });
  },
  {
    connection: {
      host: env.REDIS.host,
      port: env.REDIS.port
    }
  }
);

messageWorker.on('failed', (job, err) => {
  console.error(`[Critical Error Queue] Job ${job?.id} failed irreversibly with error: ${err.message}`);
});
