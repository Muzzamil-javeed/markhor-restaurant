import { describe, expect, it } from 'vitest';
import { checkoutFormSchema } from './src/lib/checkout-schema';

const base = {
  orderType: 'delivery' as const,
  timing: 'asap' as const,
  scheduledFor: '',
  customerName: 'Test User',
  customerPhone: '03322396608',
  customerEmail: '',
  address: 'Shop 1 DHA Phase 6',
  areaLandmark: 'Near Nishat',
  mapPinUrl: '',
  deliveryInstructions: '',
  tableNumber: '',
  note: '',
  paymentMethod: 'cash',
  acceptTerms: true,
  voucherCode: null,
  company: '',
  lines: [{ key: 'a', itemId: 'tea', quantity: 1, name: 'Tea', unitPrice: 310 }],
};

describe('checkoutFormSchema e2e values', () => {
  it('accepts filled delivery order', () => {
    const r = checkoutFormSchema.safeParse(base);
    expect(r.success, JSON.stringify(r)).toBe(true);
  });

  it('fails online payment', () => {
    const r = checkoutFormSchema.safeParse({ ...base, paymentMethod: 'online' });
    expect(r.success).toBe(false);
  });

  it('fails empty acceptTerms', () => {
    const r = checkoutFormSchema.safeParse({ ...base, acceptTerms: false });
    expect(r.success).toBe(false);
  });

  it('handles partySize empty string', () => {
    const r = checkoutFormSchema.safeParse({ ...base, partySize: '' as unknown as number });
    expect(r.success, JSON.stringify(r)).toBe(true);
  });

  it('handles partySize string number', () => {
    const r = checkoutFormSchema.safeParse({
      ...base,
      orderType: 'dinein',
      paymentMethod: 'counter',
      partySize: '2' as unknown as number,
    });
    expect(r.success, JSON.stringify(r)).toBe(true);
  });

  it('rejects bad phone', () => {
    const r = checkoutFormSchema.safeParse({ ...base, customerPhone: '123' });
    expect(r.success).toBe(false);
  });
});
