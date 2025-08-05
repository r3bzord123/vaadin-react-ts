// Common interfaces for the application

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentCategoryId?: number;
  active: boolean;
  createdDate: string;
  updatedDate?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stockQuantity: number;
  categoryId?: number;
  imageUrl?: string;
  active: boolean;
  createdDate: string;
  updatedDate?: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  active: boolean;
  createdDate: string;
  updatedDate?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName?: string;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  createdDate: string;
  lastLoginDate?: string;
}

export interface Task {
  id: number;
  description: string;
  dueDate?: string;
  creationDate: string;
}

// Event types
export interface ValueChangedEvent {
  detail: {
    value: string | number | boolean;
  };
}

export interface CheckedChangedEvent {
  detail: {
    value: boolean;
  };
}

export interface DialogOpenedChangedEvent {
  detail: {
    value: boolean;
  };
}

export interface GridItem {
  id: number;
  [key: string]: any;
}
