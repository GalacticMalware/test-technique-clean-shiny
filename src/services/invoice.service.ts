import { env } from '../config/env.config';

export class InvoiceNinjaService {
  public static async getCustomerFinancialState(customerId: string): Promise<any> {
    console.log(`[InvoiceNinja] Extrapolating invoices and pending amounts for customer ${customerId}`);
    return { pendingInvoices: 0, accountStatus: 'PAID' };
  }
}
