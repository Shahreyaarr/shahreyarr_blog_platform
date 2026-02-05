// Shop/E-commerce Types

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'photo' | 'souvenir' | 'merchandise';
  stock: number;
  isActive: boolean;
  isSigned?: boolean;
  size?: string;
  material?: string;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'stripe' | 'paypal' | 'cod';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  isEnabled: boolean;
  testMode: boolean;
  apiKey?: string;
  secretKey?: string;
}
