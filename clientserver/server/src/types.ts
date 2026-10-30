export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  addedOn: string;
  popularity: number;
  deleted: boolean;
}

export interface Customer {
  id: string;
  customerNumber: number;
  name: string;
  birthday: string;
  deleted: boolean;
  rating: number;
}

export interface ProductStatus {
  total: number;
  available: number;
  popularity: number;
  customers: { id: string }[];
}

export interface CustomerStatus {
  rating: number;
  products: { sku: string }[];
}