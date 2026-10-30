import { Link, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import CustomersPage from './pages/CustomersPage';
import CustomerDetail from './pages/CustomerDetail';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>🛒 Учёт продуктов</h1>
        <nav>
          <Link to="/products">Продукты</Link>
          <Link to="/customers">Покупатели</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
        </Routes>
      </main>
    </div>
  );
}