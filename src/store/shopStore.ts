import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Order, PaymentGateway } from '@/types/shop';

interface ShopStore {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getActiveProducts: () => Product[];
  getProductsByCategory: (category: Product['category']) => Product[];
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updatePaymentStatus: (id: string, status: Order['paymentStatus'], paymentId?: string) => void;
  getOrdersByStatus: (status: Order['status']) => Order[];

  // Payment Gateways
  paymentGateways: PaymentGateway[];
  updatePaymentGateway: (id: string, updates: Partial<PaymentGateway>) => void;
  getEnabledGateways: () => PaymentGateway[];
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Himalayan Sunrise - Signed Print',
    description: 'A stunning capture of the sunrise over the Himalayan peaks. Printed on premium archival paper.',
    price: 2999,
    originalPrice: 3999,
    images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop'],
    category: 'photo',
    stock: 10,
    isActive: true,
    isSigned: true,
    size: '12x18 inches',
    material: 'Archival Matte Paper',
    tags: ['himalayas', 'sunrise', 'signed', 'landscape'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Desert Dunes - Limited Edition',
    description: 'Golden hour in the Thar Desert. Limited edition of 50 prints.',
    price: 4999,
    images: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=800&fit=crop'],
    category: 'photo',
    stock: 5,
    isActive: true,
    isSigned: true,
    size: '16x24 inches',
    material: 'Canvas',
    tags: ['desert', 'rajasthan', 'limited', 'signed'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Travel Journal',
    description: 'Handcrafted leather-bound journal for your travel memories.',
    price: 899,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop'],
    category: 'souvenir',
    stock: 50,
    isActive: true,
    material: 'Genuine Leather',
    tags: ['journal', 'stationery', 'gift'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sahr E Yaar T-Shirt',
    description: 'Premium cotton t-shirt with exclusive travel-inspired design.',
    price: 799,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'],
    category: 'merchandise',
    stock: 100,
    isActive: true,
    size: 'S, M, L, XL, XXL',
    material: '100% Organic Cotton',
    tags: ['apparel', 'tshirt', 'merchandise'],
    createdAt: new Date().toISOString(),
  },
];

const defaultPaymentGateways: PaymentGateway[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    isEnabled: true,
    testMode: true,
    apiKey: '',
    secretKey: '',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    isEnabled: false,
    testMode: true,
    apiKey: '',
    secretKey: '',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    isEnabled: false,
    testMode: true,
    apiKey: '',
  },
];

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      // Products
      products: defaultProducts,
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },
      getActiveProducts: () => {
        return get().products.filter((p) => p.isActive && p.stock > 0);
      },
      getProductsByCategory: (category) => {
        return get().products.filter((p) => p.category === category && p.isActive);
      },
      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity }] };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Orders
      orders: [],
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: 'ORD' + Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        // Reduce stock
        order.items.forEach((item) => {
          const product = get().products.find((p) => p.id === item.product.id);
          if (product) {
            get().updateProduct(product.id, { stock: product.stock - item.quantity });
          }
        });
      },
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },
      updatePaymentStatus: (id, paymentStatus, paymentId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? { ...o, paymentStatus, paymentId, updatedAt: new Date().toISOString() }
              : o
          ),
        }));
      },
      getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
      },

      // Payment Gateways
      paymentGateways: defaultPaymentGateways,
      updatePaymentGateway: (id, updates) => {
        set((state) => ({
          paymentGateways: state.paymentGateways.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }));
      },
      getEnabledGateways: () => {
        return get().paymentGateways.filter((g) => g.isEnabled);
      },
    }),
    {
      name: 'shop-store',
    }
  )
);
