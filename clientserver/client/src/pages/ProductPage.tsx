import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { ListResponse, Product } from '../types';
import ProductForm from '../components/ProductForm';

const TAKE = 5;

export default function ProductsPage() {
  const [data, setData] = useState<ListResponse<Product> | null>(null);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const p: Record<string, string> = { take: String(TAKE), page: String(page) };
      if (sort) p.sort = sort;
      if (filter) p.filter = filter;
      setData(await api.listProducts(p));
      setError('');
    } catch (e: any) { setError(e.message); }
  }
  useEffect(() => { load(); }, [filter, sort, page]);

  async function handleCreate(v: any) {
    try { await api.createProduct(v); setShowForm(false); load(); }
    catch (e: any) { setError(e.message); }
  }
  async function handleDelete(sku: string) {
    if (!confirm(`Пометить продукт ${sku} как удалённый?`)) return;
    try { await api.deleteProduct(sku); load(); } catch (e: any) { setError(e.message); }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / TAKE)) : 1;

  return (
    <div>
      <div className="toolbar">
        <input placeholder="Поиск..." value={filter}
               onChange={e => { setPage(1); setFilter(e.target.value); }} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Сортировка…</option>
          <option value="name">Название ↑</option>
          <option value="-name">Название ↓</option>
          <option value="category">Категория ↑</option>
          <option value="price">Цена ↑</option>
          <option value="-price">Цена ↓</option>
          <option value="-quantity">Остаток ↓</option>
        </select>
        <button onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Закрыть' : '+ Добавить продукт'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {showForm && <ProductForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      <table>
        <thead>
          <tr><th>SKU</th><th>Название</th><th>Категория</th><th>Поставщик</th>
              <th>Цена</th><th>Остаток</th><th></th></tr>
        </thead>
        <tbody>
          {data?.items.map(p => (
            <tr key={p.sku}>
              <td>{p.sku}</td>
              <td><Link to={`/products/${encodeURIComponent(p.sku)}`}>{p.name}</Link></td>
              <td>{p.category}</td>
              <td>{p.supplier || '—'}</td>
              <td>{p.price.toFixed(2)} ₽</td>
              <td>{p.quantity}</td>
              <td><button className="danger" onClick={() => handleDelete(p.sku)}>Удалить</button></td>
            </tr>
          ))}
          {data?.items.length === 0 && (
            <tr><td colSpan={7} className="muted">Продукты не найдены</td></tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
        <span>Стр. {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Вперёд →</button>
      </div>
    </div>
  );
}