import { Router } from 'express';
import { db, countReserved } from '../store.js';
import { ApiError } from '../errors.js';
import type { Product } from '../types.js';

const router = Router();

function findProduct(sku: string): Product {
  const p = db.products.get(sku);
  if (!p || p.deleted) throw new ApiError(404, 'NotFound', 'Product not found');
  return p;
}

// GET /products?take=&page=&sort=&filter=&limit=
router.get('/', (req, res) => {
  const { take = '10', page = '1', sort, filter, limit } =
    req.query as Record<string, string>;

  let items = Array.from(db.products.values()).filter(p => !p.deleted);

  if (filter) {
    const f = filter.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(f) ||
      p.category.toLowerCase().includes(f) ||
      p.supplier.toLowerCase().includes(f) ||
      p.sku.toLowerCase().includes(f)
    );
  }

  if (sort) {
    const desc = sort.startsWith('-');
    const field = (desc ? sort.slice(1) : sort) as keyof Product;
    items.sort((a, b) => {
      const av = a[field] as any;
      const bv = b[field] as any;
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
  const { sku, name, category, price, quantity, supplier } = req.body ?? {};
  if (!sku || typeof sku !== 'string')
    throw new ApiError(400, 'ValidationError', 'sku is required');
  if (!name) throw new ApiError(400, 'ValidationError', 'name is required');
  if (!category) throw new ApiError(400, 'ValidationError', 'category is required');
  if (db.products.has(sku))
    throw new ApiError(409, 'Conflict', 'Product with this SKU already exists');

  const product: Product = {
    sku,
    name: String(name),
    category: String(category),
    price: Number(price) || 0,
    quantity: Math.max(0, Number(quantity) || 0),
    supplier: String(supplier ?? ''),
    addedOn: new Date().toISOString(),
    popularity: 0,
    deleted: false,
  };
  db.products.set(sku, product);
  res.status(201).json(product);
});

router.get('/:id', (req, res) => {
  res.json(findProduct(req.params.id));
});

router.patch('/:id', (req, res) => {
  const product = findProduct(req.params.id);
  const { name, category, price, quantity, supplier } = req.body ?? {};
  if (name !== undefined)     product.name = String(name);
  if (category !== undefined) product.category = String(category);
  if (price !== undefined)    product.price = Number(price);
  if (supplier !== undefined) product.supplier = String(supplier);
  if (quantity !== undefined) {
    const n = Math.max(0, Number(quantity));
    if (n < countReserved(product.sku))
      throw new ApiError(409, 'Conflict',
        'Cannot reduce quantity below currently reserved count');
    product.quantity = n;
  }
  res.json(product);
});

// Мягкое удаление
router.delete('/:id', (req, res) => {
  const product = findProduct(req.params.id);
  product.deleted = true;
  res.status(204).send();
});

router.get('/:id/status', (req, res) => {
  const product = findProduct(req.params.id);
  const customers: { id: string }[] = [];
  for (const [cid, skus] of db.customerProducts) {
    if (skus.has(product.sku)) customers.push({ id: cid });
  }
  res.json({
    total: product.quantity,
    available: Math.max(0, product.quantity - customers.length),
    popularity: product.popularity,
    customers,
  });
});

export default router;