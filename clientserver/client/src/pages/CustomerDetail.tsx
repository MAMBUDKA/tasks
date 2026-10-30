import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import type { Customer, CustomerStatus, Product } from '../types';
import CustomerForm from '../components/CustomerForm';

export default function CustomerDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [status, setStatus] = useState<CustomerStatus | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSku, setSelectedSku] = useState('');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [c, s, list] = await Promise.all([
        api.getCustomer(id),
        api.getCustomerStatus(id),
        api.listProducts({ limit: '1000', take: '1000' }),
      ]);
      setCustomer(c); setStatus(s); setProducts(list.items);
    } catch (e: any) { setError(e.message); }
  }
  useEffect(() => { load(); }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!customer) return <div>Загрузка…</div>;

  const bySku = Object.fromEntries(products.map(p => [p.sku, p]));
  const heldSkus = new Set((status?.products ?? []).map(p => p.sku));

  return (
    <div>
      <h2>{customer.name}</h2>
      <div className="card">
        <p><b>Номер покупателя:</b> {customer.customerNumber}</p>
        <p><b>Дата рождения:</b> {new Date(customer.birthday).toLocaleDateString()}</p>
        <p><b>Рейтинг (всего покупок):</b> {status?.rating ?? 0}</p>
      </div>

      <div className="status">
        <h3>Текущие покупки</h3>
        {status?.products.length === 0 && <p className="muted">—</p>}
        <ul>
          {status?.products.map(({ sku }) => (
            <li key={sku}>
              {bySku[sku]?.name ?? sku} ({sku}){' '}
              <button className="small" onClick={async () => {
                try { await api.returnProduct(customer.id, sku); load(); }
                catch (e: any) { setError(e.message); }
              }}>Вернуть</button>
            </li>
          ))}
        </ul>

        <h3>Купить продукт</h3>
        <div className="toolbar">
          <select value={selectedSku} onChange={e => setSelectedSku(e.target.value)}>
            <option value="">Выберите продукт…</option>
            {products
              .filter(p => !heldSkus.has(p.sku))
              .map(p => (
                <option key={p.sku} value={p.sku}>
                  {p.name} — {p.price.toFixed(2)} ₽ ({p.sku})
                </option>
              ))}
          </select>
          <button disabled={!selectedSku} onClick={async () => {
            try { await api.purchaseProduct(customer.id, selectedSku); setSelectedSku(''); load(); }
            catch (e: any) { setError(e.message); }
          }}>Купить</button>
        </div>
      </div>

      <div className="actions">
        <button onClick={() => setEditing(e => !e)}>{editing ? 'Отмена' : 'Редактировать'}</button>
        <button className="danger" onClick={async () => {
          if (!confirm('Пометить как удалённого?')) return;
          await api.deleteCustomer(customer.id); nav('/customers');
        }}>Удалить</button>
      </div>

      {editing && (
        <CustomerForm
          initial={customer}
          onCancel={() => setEditing(false)}
          onSubmit={async v => {
            try { await api.updateCustomer(customer.id, v); setEditing(false); load(); }
            catch (e: any) { setError(e.message); }
          }}
        />
      )}
    </div>
  );
}