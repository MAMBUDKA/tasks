import { useState } from 'react';
import type { Product } from '../types';

interface Props {
  initial?: Partial<Product>;
  skuReadonly?: boolean;
  onSubmit: (v: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ initial = {}, skuReadonly, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    sku: initial.sku ?? '',
    name: initial.name ?? '',
    category: initial.category ?? '',
    price: initial.price ?? 0,
    quantity: initial.quantity ?? 0,
    supplier: initial.supplier ?? '',
  });
  return (
    <form className="form-card" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <label>SKU
        <input value={form.sku} disabled={skuReadonly} required
               onChange={e => setForm({ ...form, sku: e.target.value })} />
      </label>
      <label>Название
        <input value={form.name} required
               onChange={e => setForm({ ...form, name: e.target.value })} />
      </label>
      <label>Категория
        <input value={form.category} required
               onChange={e => setForm({ ...form, category: e.target.value })} />
      </label>
      <label>Поставщик
        <input value={form.supplier}
               onChange={e => setForm({ ...form, supplier: e.target.value })} />
      </label>
      <label>Цена (₽)
        <input type="number" step="0.01" min={0} value={form.price}
               onChange={e => setForm({ ...form, price: +e.target.value })} />
      </label>
      <label>Количество на складе
        <input type="number" min={0} value={form.quantity}
               onChange={e => setForm({ ...form, quantity: +e.target.value })} />
      </label>
      <div className="actions">
        <button type="submit">Сохранить</button>
        <button type="button" className="secondary" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
}