import { useState } from 'react';
import { useShopStore } from '@/store/shopStore';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShopStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [] as string[],
    category: 'photo' as 'photo' | 'souvenir' | 'merchandise',
    stock: 0,
    isActive: true,
    isSigned: false,
    size: '',
    material: '',
    tags: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      images: [],
      category: 'photo',
      stock: 0,
      isActive: true,
      isSigned: false,
      size: '',
      material: '',
      tags: '',
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: typeof products[0]) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      images: product.images,
      category: product.category,
      stock: product.stock,
      isActive: product.isActive,
      isSigned: product.isSigned || false,
      size: product.size || '',
      material: product.material || '',
      tags: product.tags.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const productData = {
      ...formData,
      originalPrice: formData.originalPrice || undefined,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) deleteProduct(id);
  };

  return (
    <AdminLayout title="Products">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage your shop products</p>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Product
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                {product.isSigned && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-medium">
                    Signed
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Inactive</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{product.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                  <Edit2 className="w-4 h-4 mr-1" />Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price (₹)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} /></div>
              <div><Label>Original Price (₹) (optional)</Label><Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as typeof formData.category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Signed Photo</SelectItem>
                    <SelectItem value="souvenir">Souvenir</SelectItem>
                    <SelectItem value="merchandise">Merchandise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Stock</Label><Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Size (optional)</Label><Input value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="e.g., 12x18 inches" /></div>
              <div><Label>Material (optional)</Label><Input value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} placeholder="e.g., Canvas" /></div>
            </div>
            <div><Label>Images (one per line)</Label><Textarea value={formData.images.join('\n')} onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })} rows={3} /></div>
            <div><Label>Tags (comma separated)</Label><Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="travel, landscape, signed" /></div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.isSigned} onCheckedChange={(c) => setFormData({ ...formData, isSigned: c })} />
                <Label>Signed</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingProduct ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
