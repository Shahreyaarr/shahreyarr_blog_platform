import { useState } from 'react';
import { useGalleryStore } from '@/store';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const AdminGallery = () => {
  const { images, categories, addImage, updateImage, deleteImage, addCategory } = useGalleryStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<typeof images[0] | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    caption: '',
    category: '',
    location: '',
    is_featured: false,
  });

  const resetForm = () => {
    setFormData({ title: '', url: '', caption: '', category: '', location: '', is_featured: false });
    setEditingImage(null);
  };

  const handleEdit = (img: typeof images[0]) => {
    setEditingImage(img);
    setFormData({
      title: img.title,
      url: img.url,
      caption: img.caption || '',
      category: img.category,
      location: img.location || '',
      is_featured: img.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingImage) {
      updateImage(editingImage.id, formData);
    } else {
      addImage(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image?')) deleteImage(id);
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory({ name: newCategory.name.trim(), description: newCategory.description });
      setNewCategory({ name: '', description: '' });
      setIsCategoryDialogOpen(false);
    }
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage your photo gallery</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>Add Category</Button>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Image
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden">
            <div className="relative h-48">
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              {img.is_featured && (
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-900 fill-current" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{img.title}</h3>
                  <p className="text-sm text-gray-500">{img.category}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(img)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(img.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Image' : 'Add Image'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Image title" /></div>
            <div><Label>Image URL</Label><Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://example.com/image.jpg" /></div>
            <div><Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Caption (optional)</Label><Input value={formData.caption} onChange={(e) => setFormData({ ...formData, caption: e.target.value })} placeholder="Image caption" /></div>
            <div><Label>Location (optional)</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Paris, France" /></div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_featured} onCheckedChange={(c) => setFormData({ ...formData, is_featured: c })} />
              <Label>Feature on homepage</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingImage ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Category name" /></div>
            <div><Label>Description (optional)</Label><Input value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Description" /></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAddCategory}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminGallery;
