import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useShopStore } from '@/store';

export default function ShopPage() {
  const { getActive, addToCart } = useShopStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [added, setAdded] = useState<string | null>(null);
  const products = getActive();
  const categories = ['all', 'photo', 'print', 'merch'];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  const handleAdd = (product: any) => {
    addToCart(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-10 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Store</span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-4">Travel Store</h1>
          <p className="text-muted">Signed prints, souvenirs and exclusive merchandise from my journeys.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-start sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-sand bg-cream/50 focus:outline-none focus:border-earth text-sm" />
            </div>
            <div className="flex gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-colors ${category === c ? 'bg-charcoal text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>
                  {c === 'all' ? 'All' : c === 'photo' ? 'Photos' : c === 'print' ? 'Prints' : 'Merch'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-4 opacity-40" />
            <p className="font-display text-2xl text-charcoal/30">No products yet</p>
            <p className="text-muted text-sm mt-2">Check back soon for exclusive merchandise!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-earth text-white text-xs font-medium">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-xs capitalize">{product.category}</span>
                </Link>
                <div className="p-4">
                  <Link to={`/shop/${product.id}`}>
                    <h3 className="font-medium text-charcoal text-sm group-hover:text-earth transition-colors line-clamp-2 mb-2">{product.name}</h3>
                  </Link>
                  {product.size && <p className="text-xs text-muted mb-2">{product.size}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-lg text-earth">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-muted line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button onClick={() => handleAdd(product)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${added === product.id ? 'bg-green-500 text-white' : 'bg-earth text-white hover:bg-earth/90'}`}>
                      {added === product.id ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <Chat />
    </div>
  );
}
