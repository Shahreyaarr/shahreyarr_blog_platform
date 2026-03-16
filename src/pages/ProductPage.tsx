import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useShopStore } from '@/store';

export default function ProductPage() {
  const { id } = useParams();
  const { products, addToCart } = useShopStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === id);
  if (!product) return <Navigate to="/shop" replace />;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted hover:text-charcoal transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-3">
                <img src={product.images[imgIdx] || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => setImgIdx(i => Math.min(product.images.length - 1, i + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"><ChevronRight className="w-4 h-4" /></button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-earth' : 'border-transparent opacity-60 hover:opacity-80'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:py-4">
              <span className="text-xs text-earth font-medium uppercase tracking-wide">{product.category}</span>
              <h1 className="font-display text-3xl md:text-4xl text-charcoal mt-2 mb-4">{product.name}</h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl text-earth">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-charcoal/70 leading-relaxed mb-6 text-sm">{product.description}</p>
              {product.size && <p className="text-sm text-muted mb-2"><span className="font-medium text-charcoal">Size:</span> {product.size}</p>}
              {product.material && <p className="text-sm text-muted mb-6"><span className="font-medium text-charcoal">Material:</span> {product.material}</p>}
              <p className="text-sm text-muted mb-6"><span className="font-medium text-charcoal">Stock:</span> {product.stock} available</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white border border-sand rounded-xl px-4 py-2.5">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-charcoal/60 hover:text-charcoal text-lg leading-none">−</button>
                  <span className="font-medium w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="text-charcoal/60 hover:text-charcoal text-lg leading-none">+</button>
                </div>
                <button onClick={handleAdd}
                  className={`flex-1 py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500 text-white' : 'bg-earth text-white hover:bg-earth/90'}`}>
                  {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
                </button>
              </div>

              <Link to="/cart" className="block text-center py-3 rounded-xl border border-charcoal text-charcoal text-sm font-medium hover:bg-charcoal hover:text-white transition-colors">
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Chat />
    </div>
  );
}
