export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Fruit {
  id: number;
  name: string;
  imgs: string;
  average: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  fruitId: string;
  quantity: number;
  price: number;
}
