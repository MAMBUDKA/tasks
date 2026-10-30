import { useState } from 'react';
import type { Customer } from '../types';

interface Props {
  initial?: Partial<Customer>;
  onSubmit: (v: { name: string; birthday: string }) => void;
  onCancel: () => void;
}

export default function CustomerForm({ initial = {}, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    birthday: initial.birthday ? initial.birthday.slice(0, 10) : '',
  });
  return (
    <form className="form-card" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <label>Имя
        <input value={form.name} required
               onChange={e => setForm({ ...form, name: e.target.value })} />
      </label>
      <label>Дата рождения
        <input type="date" value={form.birthday} required
               onChange={e => setForm({ ...form, birthday: e.target.value })} />
      </label>
      <div className="actions">
        <button type="submit">Сохранить</button>
        <button type="button" className="secondary" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
}