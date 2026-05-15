import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  TEAMUP_API_KEY: process.env.TEAMUP_API_KEY || '',
  TEAMUP_CALENDAR_ID: process.env.TEAMUP_CALENDAR_ID || '',
  INVOICE_NINJA_URL: process.env.INVOICE_NINJA_URL || '',
  INVOICE_NINJA_TOKEN: process.env.INVOICE_NINJA_TOKEN || '',
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  REDIS: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  }
};