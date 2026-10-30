export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplier: string;
  addedOn: string;
  popularity: number;    // сколько раз покупали/резервировали
  deleted: boolean;
}

export interface Customer {
  id: string;            // UUID
  customerNumber: number;
  name: string;
  birthday: string;
  deleted: boolean;
  rating: number;        // всего покупок за всё время
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