import { describe, expect, it } from 'vitest';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema } from './src/lib/checkout-schema';

const base = {
  orderType: 'delivery' as const,
  timing: 'asap' as const,
  scheduledFor: '',
  customerName: 'Test User',
  customerPhone: '0332 2396608',
  customerEmail: '',
  address: 'Shop 1 DHA Phase 6',
  areaLandmark: 'Near Nishat',
  mapPinUrl: '',
  deliveryInstructions: '',
  tableNumber: '',
  partySize: '' as unknown as undefined,
  note: '',
  paymentMethod: 'cash',
  acceptTerms: true,
  voucherCode: null,
  company: '',
  lines: [{
    key: 'a',
    itemId: 'tea',
    quantity: 1,
    name: 'Tea',
    unitPrice: 310,
    imageSrc: '/images/menu/tea.webp',
  }],
};

describe('checkout resolver', () => {
  it('parses delivery with spaced phone + imageSrc + empty partySize', () => {
    const r = checkoutFormSchema.safeParse(base);
    expect(r.success, JSON.stringify(r)).toBe(true);
  });

  it('resolver accepts same values', async () => {
    const resolver = zodResolver(checkoutFormSchema);
    const result = await resolver(base, undefined, { criteriaMode: 'all', fields: {}, shouldUseNativeValidation: false });
    expect(result.errors, JSON.stringify(result.errors)).toEqual({});
    expect(result.values.customerPhone).toBe('+923322396608');
  });
});
