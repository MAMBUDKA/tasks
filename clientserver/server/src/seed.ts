import { randomUUID } from 'crypto';
import { db } from './store.js';

export function seed() {
  if (db.products.size) return;

  const products = [
    { sku: 'MILK-3.2-1L',  name: 'Молоко 3.2% 1л',    category: 'Молочные', price: 89.90,  quantity: 40, supplier: 'Молокозавод №1' },
    { sku: 'BREAD-WHT-500', name: 'Хлеб белый 500г',   category: 'Хлеб',     price: 45.00,  quantity: 20, supplier: 'Хлебозавод «Заря»' },
    { sku: 'APPLE-GRN-1KG', name: 'Яблоки зелёные 1кг',category: 'Фрукты',   price: 129.00, quantity: 15, supplier: 'Агроферма «Сад»' },
    { sku: 'CHEESE-RUS-300',name: 'Сыр Российский 300г',category:'Молочные', price: 259.00, quantity: 10, supplier: 'Сыроварня «Луговое»' },
    { sku: 'COFFEE-ARB-250',name: 'Кофе Arabica 250г', category: 'Напитки',  price: 549.00, quantity: 8,  supplier: 'CoffeeImport' },
  ];
  for (const p of products) {
    db.products.set(p.sku, {
      ...p,
      addedOn: new Date().toISOString(),
      popularity: 0,
      deleted: false,
    });
  }

  const customers = [
    { name: 'Иван Иванов',      birthday: '1990-05-14' },
    { name: 'Мария Петрова',    birthday: '1985-11-02' },
    { name: 'Сергей Смирнов',   birthday: '1998-03-21' },
  ];
  for (const c of customers) {
    const id = randomUUID();
    db.customers.set(id, {
      id,
      customerNumber: db.nextCustomerNumber++,
      name: c.name,
      birthday: new Date(c.birthday).toISOString(),
      deleted: false,
      rating: 0,
    });
  }
}