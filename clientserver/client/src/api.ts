import type { Customer, CustomerStatus, ListResponse, Product, ProductStatus } from './types';

async function request<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const q = (p: Record<string, string>) => new URLSearchParams(p).toString();

export const api = {
  listProducts: (p: Record<string, string>) =>
    request<ListResponse<Product>>(`/products?${q(p)}`),
  getProduct: (sku: string) => request<Product>(`/products/${encodeURIComponent(sku)}`),
  createProduct: (b: Partial<Product>) =>
    request<Product>('/products', { method: 'POST', body: JSON.stringify(b) }),
  updateProduct: (sku: string, b: Partial<Product>) =>
    request<Product>(`/products/${encodeURIComponent(sku)}`,
      { method: 'PATCH', body: JSON.stringify(b) }),
  deleteProduct: (sku: string) =>
    request<void>(`/products/${encodeURIComponent(sku)}`, { method: 'DELETE' }),
  getProductStatus: (sku: string) =>
    request<ProductStatus>(`/products/${encodeURIComponent(sku)}/status`),

  listCustomers: (p: Record<string, string>) =>
    request<ListResponse<Customer>>(`/customers?${q(p)}`),
  getCustomer: (id: string) => request<Customer>(`/customers/${id}`),
  createCustomer: (c: Partial<Customer>) =>
    request<Customer>('/customers', { method: 'POST', body: JSON.stringify(c) }),
  updateCustomer: (id: string, c: Partial<Customer>) =>
    request<Customer>(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(c) }),
  deleteCustomer: (id: string) =>
    request<void>(`/customers/${id}`, { method: 'DELETE' }),
  getCustomerStatus: (id: string) => request<CustomerStatus>(`/customers/${id}/status`),
  purchaseProduct: (cid: string, sku: string) =>
    request<void>(`/customers/${cid}/products/${encodeURIComponent(sku)}`, { method: 'POST' }),
  returnProduct: (cid: string, sku: string) =>
    request<void>(`/customers/${cid}/products/${encodeURIComponent(sku)}`, { method: 'DELETE' }),
};