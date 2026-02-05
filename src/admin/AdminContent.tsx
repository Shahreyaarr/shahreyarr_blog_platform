import { useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
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

const AdminContent = () => {
  const { sections, addSection, updateSection, deleteSection } = useContentStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<typeof sections[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    link: '',
    linkText: '',
    type: 'custom' as 'custom' | 'planning' | 'inspiration' | 'tips' | 'solo' | 'family' | 'articles',
    isActive: true,
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      link: '',
      linkText: '',
      type: 'custom',
      isActive: true,
      order: sections.length + 1,
    });
    setEditingSection(null);
  };

  const handleEdit = (section: typeof sections[0]) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      subtitle: section.subtitle || '',
      description: section.description || '',
      image: section.image,
      link: section.link || '',
      linkText: section.linkText || '',
      type: section.type,
      isActive: section.isActive,
      order: section.order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSection) {
      updateSection(editingSection.id, formData);
    } else {
      addSection(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this section?')) deleteSection(id);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <AdminLayout title="Content Sections">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage homepage content sections</p>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Section
        </Button>
      </div>

      <div className="space-y-4">
        {sortedSections.map((section) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="cursor-move text-gray-400">
                  <GripVertical className="w-5 h-5" />
                </div>
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{section.title}</h3>
                    {!section.isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{section.type}</p>
                  <p className="text-sm text-gray-400 line-clamp-1">{section.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateSection(section.id, { isActive: !section.isActive })}
                  >
                    {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(section)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingSection ? 'Edit Section' : 'Add Section'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Section title" /></div>
            <div><Label>Subtitle (optional)</Label><Input value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="e.g., Stories that move you" /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description" rows={2} /></div>
            <div><Label>Image URL</Label><Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Link URL (optional)</Label><Input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="/blog" /></div>
              <div><Label>Link Text (optional)</Label><Input value={formData.linkText} onChange={(e) => setFormData({ ...formData, linkText: e.target.value })} placeholder="Learn More" /></div>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as typeof formData.type })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="inspiration">Inspiration</SelectItem>
                  <SelectItem value="tips">Tips</SelectItem>
                  <SelectItem value="solo">Solo Travel</SelectItem>
                  <SelectItem value="family">Family Travel</SelectItem>
                  <SelectItem value="articles">Articles</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
              <Label>Visible on homepage</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingSection ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContent;
