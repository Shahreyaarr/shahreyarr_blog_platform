import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '@/store/shopStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import { ArrowLeft, CreditCard, Truck, Shield, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, addOrder, clearCart, getEnabledGateways } = useShopStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const enabledGateways = getEnabledGateways();
  const subtotal = getCartTotal();
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>
        </section>
        <Footer />
        <RealtimeChat />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create order
    const order = {
      items: cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      customer: formData,
      total,
      status: 'pending' as const,
      paymentStatus: 'completed' as const,
      paymentMethod: paymentMethod as 'razorpay' | 'stripe' | 'paypal' | 'cod',
      paymentId: 'PAY' + Date.now(),
    };

    addOrder(order);
    setOrderId(order.paymentId);
    clearCart();
    setIsProcessing(false);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Full Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>Address</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>City</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>PIN Code</Label>
                          <Input
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Country</Label>
                        <Input value={formData.country} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                {enabledGateways.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-3">
                          {enabledGateways.map((gateway) => (
                            <div
                              key={gateway.id}
                              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                                paymentMethod === gateway.id ? 'border-blue-500 bg-blue-50' : ''
                              }`}
                              onClick={() => setPaymentMethod(gateway.id)}
                            >
                              <RadioGroupItem value={gateway.id} id={gateway.id} />
                              <Label htmlFor={gateway.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <CreditCard className="w-5 h-5" />
                                  <span className="font-medium">{gateway.name}</span>
                                  {gateway.testMode && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                      Test Mode
                                    </span>
                                  )}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${total.toLocaleString()}`
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Truck className="w-4 h-4" />
                      Free shipping on orders above ₹2,000
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      Secure payment processing
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={() => navigate('/shop')}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Placed Successfully!</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
            <p className="text-lg font-semibold">Order ID: {orderId}</p>
            <p className="text-sm text-gray-500 mt-2">
              You will receive a confirmation email shortly.
            </p>
          </div>
          <Button onClick={() => navigate('/shop')} className="w-full">
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default CheckoutPage;
