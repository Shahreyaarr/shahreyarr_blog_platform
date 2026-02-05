import { useState } from 'react';
import { useDestinationStore } from '@/store';
import type { DestinationSection, Place } from '@/types';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, X, PlusCircle } from 'lucide-react';
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

const AdminDestinations = () => {
  const { destinations, addDestination, updateDestination, deleteDestination } = useDestinationStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<typeof destinations[0] | null>(null);
  const [sections, setSections] = useState<DestinationSection[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    state: '',
    type: 'city' as 'country' | 'state' | 'city' | 'region',
    description: '',
    images: [] as string[],
    hero_image: '',
    is_visited: true,
    visit_date: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      country: '',
      state: '',
      type: 'city',
      description: '',
      images: [],
      hero_image: '',
      is_visited: true,
      visit_date: '',
    });
    setSections([]);
    setPlaces([]);
    setEditingDestination(null);
  };

  const handleEdit = (dest: typeof destinations[0]) => {
    setEditingDestination(dest);
    setFormData({
      name: dest.name,
      country: dest.country,
      state: dest.state || '',
      type: dest.type,
      description: dest.description,
      images: dest.images,
      hero_image: dest.hero_image || '',
      is_visited: dest.is_visited,
      visit_date: dest.visit_date || '',
    });
    setSections(dest.sections);
    setPlaces(dest.places_visited);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const destData = {
      ...formData,
      sections,
      places_visited: places,
    };

    if (editingDestination) {
      updateDestination(editingDestination.id, destData);
    } else {
      addDestination(destData as Parameters<typeof addDestination>[0]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this destination?')) {
      deleteDestination(id);
    }
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: '', type: 'custom', description: '', images: [] }]);
  };

  const updateSection = (index: number, updates: Partial<DestinationSection>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addPlace = () => {
    setPlaces([...places, { id: Date.now().toString(), name: '', description: '', images: [] }]);
  };

  const updatePlace = (index: number, updates: Partial<Place>) => {
    const newPlaces = [...places];
    newPlaces[index] = { ...newPlaces[index], ...updates };
    setPlaces(newPlaces);
  };

  const removePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout title="Destinations">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage your travel destinations</p>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Destination
        </Button>
      </div>

      <div className="space-y-4">
        {destinations.map((dest) => (
          <Card key={dest.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={dest.images[0] || dest.hero_image}
                  alt={dest.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{dest.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs capitalize">
                      {dest.type}
                    </span>
                    {!dest.is_visited && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                        Not Visited
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{dest.country}</p>
                  <p className="text-sm text-gray-400 line-clamp-1">{dest.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(dest)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(dest.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDestination ? 'Edit Destination' : 'Add Destination'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Destination name" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>State (optional)</Label>
                <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State/Province" />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as typeof formData.type })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} />
            </div>

            <div>
              <Label>Hero Image URL</Label>
              <Input value={formData.hero_image} onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })} placeholder="https://example.com/hero.jpg" />
            </div>

            <div>
              <Label>Gallery Images (one per line)</Label>
              <Textarea
                value={formData.images.join('\n')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_visited} onCheckedChange={(c) => setFormData({ ...formData, is_visited: c })} />
                <Label>Visited</Label>
              </div>
              {formData.is_visited && (
                <div className="flex-1">
                  <Input type="date" value={formData.visit_date} onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })} />
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <Label>Sections</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSection}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-end mb-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(index)} className="text-red-600">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input value={section.title} onChange={(e) => updateSection(index, { title: e.target.value })} placeholder="Section title" />
                      <Select value={section.type} onValueChange={(v) => updateSection(index, { type: v as DestinationSection['type'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="treks">Treks</SelectItem>
                          <SelectItem value="markets">Markets</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="villages">Villages</SelectItem>
                          <SelectItem value="experiences">Experiences</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea value={section.description} onChange={(e) => updateSection(index, { description: e.target.value })} placeholder="Section description" rows={2} />
                      <Textarea value={section.images.join('\n')} onChange={(e) => updateSection(index, { images: e.target.value.split('\n').filter(Boolean) })} placeholder="Image URLs (one per line)" rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Places */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <Label>Places Visited</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPlace}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Place
                </Button>
              </div>
              <div className="space-y-4">
                {places.map((place, index) => (
                  <div key={place.id} className="border rounded-lg p-4">
                    <div className="flex justify-end mb-2">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removePlace(index)} className="text-red-600">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input value={place.name} onChange={(e) => updatePlace(index, { name: e.target.value })} placeholder="Place name" />
                      <Textarea value={place.description} onChange={(e) => updatePlace(index, { description: e.target.value })} placeholder="Place description" rows={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingDestination ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDestinations;
