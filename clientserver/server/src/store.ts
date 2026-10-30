import type { Product, Customer } from './types.js';

export const db = {
  products: new Map<string, Product>(),
  customers: new Map<string, Customer>(),
  // customerId -> set of SKUs, которые у него сейчас "куплены"
  customerProducts: new Map<string, Set<string>>(),
  nextCustomerNumber: 1,
};

export function countReserved(sku: string): number {
  let n = 0;
  for (const set of db.customerProducts.values()) if (set.has(sku)) n++;
  return n;
}