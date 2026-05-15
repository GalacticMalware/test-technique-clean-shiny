import { Queue } from 'bullmq';
import { env } from '../../config/env.config';
import { IncomingMessagePayload } from '../../interfaces/message.interface';

// Desacoplamiento de la ingesta de datos frente al procesamiento pesado
export const messageQueue = new Queue<IncomingMessagePayload>('IncomingMessages', {
  connection: {
    host: env.REDIS.host,
    port: env.REDIS.port
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000 // 5 segundos de espera exponencial ante fallos de APIs externas
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});
