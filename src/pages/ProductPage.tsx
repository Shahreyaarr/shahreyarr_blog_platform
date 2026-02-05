import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useShopStore } from '@/store/shopStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealtimeChat from '@/components/RealtimeChat';
import { ArrowLeft, ShoppingCart, Check, Star, Truck, Shield, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, addToCart } = useShopStore();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
                {product.isSigned && (
                  <Badge className="bg-yellow-400 text-yellow-900">
                    <Star className="w-3 h-3 mr-1" />
                    Signed
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.size && (
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-500">Size</span>
                    <p className="font-medium">{product.size}</p>
                  </div>
                )}
                {product.material && (
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-500">Material</span>
                    <p className="font-medium">{product.material}</p>
                  </div>
                )}
                <div className="p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-500">Stock</span>
                  <p className={`font-medium ${product.stock <= 5 ? 'text-orange-600' : ''}`}>
                    {product.stock} available
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <p className="font-medium">Free delivery</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={addedToCart || product.stock === 0}
                  className={`flex-1 ${addedToCart ? 'bg-green-500' : ''}`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : product.stock === 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium">Free Shipping</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">Secure Payment</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <Package className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm font-medium">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 bg-white rounded-xl mt-4">
                <p className="text-gray-600">{product.description}</p>
              </TabsContent>
              <TabsContent value="shipping" className="p-6 bg-white rounded-xl mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping</h4>
                    <p className="text-gray-600">Free shipping on all orders within India. International shipping available at additional cost.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Returns</h4>
                    <p className="text-gray-600">30-day return policy. Items must be in original condition.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tags" className="p-6 bg-white rounded-xl mt-4">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
      <RealtimeChat />
    </div>
  );
};

export default ProductPage;
