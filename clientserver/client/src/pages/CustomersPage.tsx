import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Customer, ListResponse } from '../types';
import CustomerForm from '../components/CustomerForm';

const TAKE = 5;

export default function CustomersPage() {
  const [data, setData] = useState<ListResponse<Customer> | null>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      const p: Record<string, string> = { take: String(TAKE), page: String(page) };
      if (filter) p.filter = filter;
      setData(await api.listCustomers(p)); setError('');
    } catch (e: any) { setError(e.message); }
  }
  useEffect(() => { load(); }, [filter, page]);

  async function handleCreate(v: any) {
    try { await api.createCustomer(v); setShowForm(false); load(); }
    catch (e: any) { setError(e.message); }
  }
  async function handleDelete(id: string) {
    if (!confirm('Пометить покупателя как удалённого?')) return;
    try { await api.deleteCustomer(id); load(); } catch (e: any) { setError(e.message); }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / TAKE)) : 1;

  return (
    <div>
      <div className="toolbar">
        <input placeholder="Поиск по имени..." value={filter}
               onChange={e => { setPage(1); setFilter(e.target.value); }} />
        <button onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Закрыть' : '+ Добавить покупателя'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {showForm && <CustomerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      <table>
        <thead><tr><th>#</th><th>Имя</th><th>Дата рождения</th><th></th></tr></thead>
        <tbody>
          {data?.items.map(c => (
            <tr key={c.id}>
              <td>{c.customerNumber}</td>
              <td><Link to={`/customers/${c.id}`}>{c.name}</Link></td>
              <td>{new Date(c.birthday).toLocaleDateString()}</td>
              <td><button className="danger" onClick={() => handleDelete(c.id)}>Удалить</button></td>
            </tr>
          ))}
          {data?.items.length === 0 && (
            <tr><td colSpan={4} className="muted">Покупатели не найдены</td></tr>
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