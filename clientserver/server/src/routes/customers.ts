import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db, countReserved } from '../store.js';
import { ApiError } from '../errors.js';
import type { Customer } from '../types.js';

const router = Router();

function findCustomer(id: string): Customer {
  const c = db.customers.get(id);
  if (!c || c.deleted) throw new ApiError(404, 'NotFound', 'Customer not found');
  return c;
}

router.get('/', (req, res) => {
  const { take = '10', page = '1', sort, filter, limit } =
    req.query as Record<string, string>;

  let items = Array.from(db.customers.values()).filter(c => !c.deleted);

  if (filter) {
    const f = filter.toLowerCase();
    items = items.filter(c => c.name.toLowerCase().includes(f));
  }

  if (sort) {
    const desc = sort.startsWith('-');
    const field = (desc ? sort.slice(1) : sort) as keyof Customer;
    items.sort((a, b) => {
      const av = a[field] as any, bv = b[field] as any;
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return 0;
    });
  }

  if (limit) items = items.slice(0, Number(limit));
  const total = items.length;
  const pageNum = Math.max(1, Number(page) || 1);
  const takeNum = Math.max(1, Number(take) || 10);
  const start = (pageNum - 1) * takeNum;

  res.setHeader('X-Total-Count', String(total));
  res.json({ items: items.slice(start, start + takeNum), total, page: pageNum, take: takeNum });
});

router.post('/', (req, res) => {
  const { customerNumber, name, birthday } = req.body ?? {};
  if (!name)     throw new ApiError(400, 'ValidationError', 'name is required');
  if (!birthday) throw new ApiError(400, 'ValidationError', 'birthday is required');

  const id = randomUUID();
  const customer: Customer = {
    id,
    customerNumber: Number(customerNumber) || db.nextCustomerNumber++,
    name: String(name),
    birthday: new Date(birthday).toISOString(),
    deleted: false,
    rating: 0,
  };
  db.customers.set(id, customer);
  res.status(201).json(customer);
});

router.get('/:id', (req, res) => res.json(findCustomer(req.params.id)));

router.patch('/:id', (req, res) => {
  const c = findCustomer(req.params.id);
  const { name, birthday, customerNumber } = req.body ?? {};
  if (name !== undefined)           c.name = String(name);
  if (birthday !== undefined)       c.birthday = new Date(birthday).toISOString();
  if (customerNumber !== undefined) c.customerNumber = Number(customerNumber);
  res.json(c);
});

router.delete('/:id', (req, res) => {
  const c = findCustomer(req.params.id);
  c.deleted = true;
  res.status(204).send();
});

router.get('/:id/status', (req, res) => {
  const customer = findCustomer(req.params.id);
  const skus = Array.from(db.customerProducts.get(customer.id) ?? []);
  res.json({
    rating: customer.rating,
    products: skus.map(sku => ({ sku })),
  });
});

// Купить / зарезервировать продукт
router.post('/:cid/products/:sku', (req, res) => {
  const customer = findCustomer(req.params.cid);
  const product = db.products.get(req.params.sku);
  if (!product || product.deleted) throw new ApiError(404, 'NotFound', 'Product not found');

  const reserved = countReserved(product.sku);
  if (reserved >= product.quantity)
    throw new ApiError(409, 'NotAvailable', 'Product is out of stock');

  const set = db.customerProducts.get(customer.id) ?? new Set<string>();
  if (set.has(product.sku))
    throw new ApiError(409, 'AlreadyPurchased', 'Customer already has this product');
  set.add(product.sku);
  db.customerProducts.set(customer.id, set);

  product.popularity += 1;
  customer.rating += 1;
  res.status(204).send();
});

// Вернуть продукт
router.delete('/:cid/products/:sku', (req, res) => {
  findCustomer(req.params.cid);
  const set = db.customerProducts.get(req.params.cid);
  if (!set || !set.has(req.params.sku))
    throw new ApiError(404, 'NotFound', 'This customer does not have this product');
  set.delete(req.params.sku);
  if (set.size === 0) db.customerProducts.delete(req.params.cid);
  res.status(204).send();
});

export default router;