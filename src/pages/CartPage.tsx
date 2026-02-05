import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShopStore } from '@/store/shopStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useShopStore();
  const [promoCode, setPromoCode] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <Link to="/shop">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
        <RealtimeChat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link
                        to={`/shop/${item.product.id}`}
                        className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <Link to={`/shop/${item.product.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                              {item.product.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">{item.product.category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-bold text-lg">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between">
                <Link to="/shop">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button variant="ghost" onClick={clearCart} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    {shipping === 0 && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Truck className="w-4 h-4" />
                        You got free shipping!
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-gray-600">Promo Code</label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                      />
                      <Button variant="outline">Apply</Button>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Shipping & taxes calculated at checkout
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default CartPage;
