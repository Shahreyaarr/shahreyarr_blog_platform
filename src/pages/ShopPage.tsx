import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShopStore } from '@/store/shopStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import { ShoppingBag, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ShopPage = () => {
  const { products, getActiveProducts, addToCart } = useShopStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const activeProducts = getActiveProducts();

  const filteredProducts = activeProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingBag },
    { id: 'photo', name: 'Signed Photos', icon: Star },
    { id: 'souvenir', name: 'Souvenirs', icon: ShoppingBag },
    { id: 'merchandise', name: 'Merchandise', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Shop
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Travel Store
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Signed photographs, souvenirs, and exclusive merchandise from my journeys
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-12"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <Link to={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isSigned && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-medium">
                        Signed
                      </div>
                    )}
                    {product.originalPrice && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                        Sale
                      </div>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium">
                        Only {product.stock} left
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {product.category}
                      </Badge>
                      {product.size && (
                        <span className="text-xs text-gray-500">{product.size}</span>
                      )}
                    </div>

                    <Link to={`/shop/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart === product.id}
                        className={addedToCart === product.id ? 'bg-green-500' : ''}
                      >
                        {addedToCart === product.id ? 'Added!' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default ShopPage;
