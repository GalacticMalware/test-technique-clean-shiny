import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.config';

export class SupabaseService {
  private static client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  public static async findCustomerByContact(contact: string) {
    // Busca robusta unificada por email o número telefónico
    const { data, error } = await this.client
      .from('customers')
      .select('id, name, address, recurrence, rates, business_rules')
      .or(`email.eq.${contact},phone.eq.${contact}`)
      .maybeSingle();

    if (error) throw new Error(`Supabase query failed: ${error.message}`);
    return data;
  }

  public static async checkIdempotency(messageId: string): Promise<boolean> {
    const { data } = await this.client
      .from('processed_messages')
      .select('message_id')
      .eq('message_id', messageId)
      .maybeSingle();
    return !!data;
  }

  public static async logMessageProcessed(messageId: string, payload: any) {
    await this.client.from('processed_messages').insert([{ message_id: messageId, payload }]);
  }
}
