import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Check, User, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useShopStore, useSettingsStore } from '@/store';
import { fsAdd } from '@/lib/firebase';
import { sendOrderConfirmation } from '@/lib/email';

declare global { interface Window { Razorpay: any; } }

export default function CartPage() {
  const { cart, removeFromCart, updateQty, getTotal, clearCart } = useShopStore();
  const { settings } = useSettingsStore();
  const RAZORPAY_KEY = (settings as any).razorpayKey || 'rzp_test_placeholder';
  const [step, setStep]               = useState<'cart'|'details'|'success'>('cart');
  const [orderDetails, setOrderDetails] = useState({ name:'', email:'', phone:'', address:'', city:'', pincode:'' });
  const [processing, setProcessing]   = useState(false);
  const [orderId, setOrderId]         = useState('');

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    const loaded = await loadRazorpay();
    if (!loaded) { alert('Payment gateway failed to load.'); setProcessing(false); return; }

    const newOrderId = 'ORD-' + Date.now();
    const orderData = {
      orderId: newOrderId,
      items: cart.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
      total: getTotal(),
      customer: orderDetails,
      status: 'pending',
      paymentMethod: 'razorpay',
    };
    await fsAdd('orders', orderData);

    const options = {
      key: RAZORPAY_KEY,
      amount: getTotal() * 100,
      currency: 'INR',
      name: settings.siteName,
      description: `Order ${newOrderId}`,
      image: settings.aboutImage,
      handler: async (response: any) => {
        await fsAdd('orders', { ...orderData, status: 'paid', paymentId: response.razorpay_payment_id });

        // ✅ Send confirmation email to customer
        await sendOrderConfirmation({
          orderId:       newOrderId,
          customerName:  orderDetails.name,
          customerEmail: orderDetails.email,
          items:         cart.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
          total:         getTotal(),
          address:       `${orderDetails.address}, ${orderDetails.city} - ${orderDetails.pincode}`,
        });

        setOrderId(newOrderId);
        clearCart();
        setStep('success');
        setProcessing(false);
      },
      prefill: { name: orderDetails.name, email: orderDetails.email, contact: orderDetails.phone },
      theme: { color: '#8B6F47' },
      modal: { ondismiss: () => setProcessing(false) },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setProcessing(false);
  };

  if (step === 'success') return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-28 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6"><Check className="w-8 h-8 text-green-600" /></div>
        <h2 className="font-display text-3xl text-charcoal mb-3">Order Confirmed!</h2>
        <p className="text-muted mb-2">Order ID: <span className="font-medium text-charcoal">{orderId}</span></p>
        <p className="text-muted mb-2 text-sm">A confirmation email has been sent to <strong>{orderDetails.email}</strong></p>
        <p className="text-muted mb-8 text-sm text-center max-w-sm">We'll notify you when your order is dispatched.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-earth text-white font-medium text-sm hover:bg-earth/90 transition-colors">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <Footer />
    </div>
  );

  if (cart.length === 0 && step === 'cart') return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-28 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-muted opacity-40 mb-6" />
        <h2 className="font-display text-3xl text-charcoal mb-3">Your cart is empty</h2>
        <p className="text-muted mb-8">Add some items to get started</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-earth text-white font-medium text-sm hover:bg-earth/90 transition-colors">Browse Shop <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <Footer /><Chat />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            {['Cart','Details','Payment'].map((s,i)=>(
              <div key={s} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-sm font-medium ${i===(step==='cart'?0:1)?'text-earth':'text-charcoal/40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i===(step==='cart'?0:1)?'bg-earth text-white':'bg-sand text-charcoal/40'}`}>{i+1}</div>{s}
                </div>
                {i<2&&<div className="w-8 h-px bg-sand"/>}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step==='cart'&&(
                <div className="space-y-3">
                  <h1 className="font-display text-3xl text-charcoal mb-5">Your Cart</h1>
                  {cart.map(item=>(
                    <div key={item.product.id} className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"><img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-charcoal text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                        {item.product.size&&<p className="text-xs text-muted mb-2">{item.product.size}</p>}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-cream rounded-lg px-3 py-1.5">
                            <button onClick={()=>updateQty(item.product.id,item.quantity-1)} className="text-charcoal/60 hover:text-charcoal text-lg leading-none">−</button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={()=>updateQty(item.product.id,item.quantity+1)} className="text-charcoal/60 hover:text-charcoal text-lg leading-none">+</button>
                          </div>
                          <span className="font-display text-base text-earth">₹{(item.product.price*item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                      <button onClick={()=>removeFromCart(item.product.id)} className="text-muted hover:text-red-500 transition-colors flex-shrink-0 self-start mt-1"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              )}
              {step==='details'&&(
                <form onSubmit={handlePayment} id="details-form">
                  <h1 className="font-display text-3xl text-charcoal mb-5">Delivery Details</h1>
                  <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"/>
                        <input value={orderDetails.name} onChange={e=>setOrderDetails({...orderDetails,name:e.target.value})} required placeholder="Your full name" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"/></div></div>
                      <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Email *</label>
                        <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"/>
                        <input type="email" value={orderDetails.email} onChange={e=>setOrderDetails({...orderDetails,email:e.target.value})} required placeholder="your@email.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"/></div></div>
                    </div>
                    <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Phone *</label>
                      <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"/>
                      <input value={orderDetails.phone} onChange={e=>setOrderDetails({...orderDetails,phone:e.target.value})} required placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"/></div></div>
                    <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Delivery Address *</label>
                      <div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-muted"/>
                      <textarea value={orderDetails.address} onChange={e=>setOrderDetails({...orderDetails,address:e.target.value})} required rows={2} placeholder="House/Flat, Street, Area" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none"/></div></div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">City *</label>
                        <input value={orderDetails.city} onChange={e=>setOrderDetails({...orderDetails,city:e.target.value})} required placeholder="City" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"/></div>
                      <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">PIN Code *</label>
                        <input value={orderDetails.pincode} onChange={e=>setOrderDetails({...orderDetails,pincode:e.target.value})} required placeholder="302001" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"/></div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-28">
              <h3 className="font-display text-xl text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cart.map(item=>(
                  <div key={item.product.id} className="flex justify-between text-sm text-muted gap-2">
                    <span className="line-clamp-1 flex-1">{item.product.name} ×{item.quantity}</span>
                    <span className="flex-shrink-0">₹{(item.product.price*item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-charcoal">Total</span>
                  <span className="font-display text-2xl text-earth">₹{getTotal().toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted mt-1">Free shipping on all orders</p>
              </div>
              {step==='cart'&&<button onClick={()=>setStep('details')} className="w-full py-3.5 rounded-xl bg-earth text-white font-medium text-sm hover:bg-earth/90 transition-colors flex items-center justify-center gap-2">Proceed to Checkout <ArrowRight className="w-4 h-4"/></button>}
              {step==='details'&&<button type="submit" form="details-form" disabled={processing} className="w-full py-3.5 rounded-xl bg-earth text-white font-medium text-sm hover:bg-earth/90 disabled:opacity-60 flex items-center justify-center gap-2">
                {processing?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<>Pay ₹{getTotal().toLocaleString()} <ArrowRight className="w-4 h-4"/></>}
              </button>}
              <div className="flex items-center gap-2 mt-4 justify-center">
                <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-4 h-4"/>
                <p className="text-xs text-muted">Secured by Razorpay</p>
              </div>
              {step==='details'&&<button onClick={()=>setStep('cart')} className="w-full mt-2 py-2 text-xs text-muted hover:text-charcoal transition-colors">← Back to Cart</button>}
            </div>
          </div>
        </div>
      </div>
      <Footer /><Chat />
    </div>
  );
}
