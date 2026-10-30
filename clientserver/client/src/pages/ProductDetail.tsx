import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import type { Product, ProductStatus } from '../types';
import ProductForm from '../components/ProductForm';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<ProductStatus | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [p, s] = await Promise.all([api.getProduct(id), api.getProductStatus(id)]);
      setProduct(p); setStatus(s);
    } catch (e: any) { setError(e.message); }
  }
  useEffect(() => { load(); }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!product) return <div>Загрузка…</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <div className="card">
        <p><b>SKU:</b> {product.sku}</p>
        <p><b>Категория:</b> {product.category}</p>
        <p><b>Поставщик:</b> {product.supplier || '—'}</p>
        <p><b>Цена:</b> {product.price.toFixed(2)} ₽</p>
        <p><b>Добавлен:</b> {new Date(product.addedOn).toLocaleString()}</p>
      </div>

      {status && (
        <div className="status">
          <h3>Состояние склада</h3>
          <p>Всего на складе: {status.total}</p>
          <p>Доступно: {status.available}</p>
          <p>Куплено всего раз: {status.popularity}</p>
          <p>У текущих покупателей: {status.customers.length === 0 ? '—' : ''}</p>
          <ul>{status.customers.map(c => <li key={c.id}>{c.id}</li>)}</ul>
        </div>
      )}

      <div className="actions">
        <button onClick={() => setEditing(e => !e)}>{editing ? 'Отмена' : 'Редактировать'}</button>
        <button className="danger" onClick={async () => {
          if (!confirm('Пометить как удалённый?')) return;
          await api.deleteProduct(product.sku); nav('/products');
        }}>Удалить</button>
      </div>

      {editing && (
        <ProductForm
          initial={product}
          skuReadonly
          onCancel={() => setEditing(false)}
          onSubmit={async v => {
            try { await api.updateProduct(product.sku, v); setEditing(false); load(); }
            catch (e: any) { setError(e.message); }
          }}
        />
      )}
    </div>
  );
}