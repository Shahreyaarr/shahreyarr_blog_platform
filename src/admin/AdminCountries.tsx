import { useState } from 'react';
import { useCountryStore, useBlogStore, useDestinationStore } from '@/store';
import AdminLayout from './AdminLayout';
import { Check, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const AdminCountries = () => {
  const { countries, updateCountry, markAsVisited } = useCountryStore();
  const { getBlogsByCountry } = useBlogStore();
  const { getDestinationsByCountry } = useDestinationStore();
  const [editingCountry, setEditingCountry] = useState<typeof countries[0] | null>(null);
  const [formData, setFormData] = useState({ description: '', images: [] as string[] });

  const handleEdit = (country: typeof countries[0]) => {
    setEditingCountry(country);
    setFormData({ description: country.description || '', images: country.images });
  };

  const handleSave = () => {
    if (editingCountry) {
      updateCountry(editingCountry.id, { ...formData, images: formData.images.filter(Boolean) });
      setEditingCountry(null);
    }
  };

  const handleToggleVisited = (country: typeof countries[0]) => {
    if (country.is_visited) {
      updateCountry(country.id, { is_visited: false, visit_date: undefined });
    } else {
      markAsVisited(country.id);
    }
  };

  return (
    <AdminLayout title="Countries">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => {
          const blogs = getBlogsByCountry(country.name);
          const destinations = getDestinationsByCountry(country.name);

          return (
            <Card key={country.id} className={country.is_visited ? 'ring-2 ring-yellow-400' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold">{country.code}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{country.name}</h3>
                      <p className="text-sm text-gray-500">{country.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {country.is_visited ? (
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Check className="w-5 h-5 text-yellow-900" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <X className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>{blogs.length} stories</span>
                  <span>{destinations.length} destinations</span>
                </div>

                {country.visit_date && (
                  <p className="text-sm text-gray-400 mb-4">
                    Visited: {new Date(country.visit_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}

                <div className="flex gap-2">
                  <Switch checked={country.is_visited} onCheckedChange={() => handleToggleVisited(country)} />
                  <Label>Mark as visited</Label>
                </div>

                <Button variant="outline" className="w-full mt-4" onClick={() => handleEdit(country)}>
                  <Edit2 className="w-4 h-4 mr-2" />Edit Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!editingCountry} onOpenChange={() => setEditingCountry(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit {editingCountry?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Country description" rows={3} /></div>
            <div><Label>Images (one per line)</Label><Textarea value={formData.images.join('\n')} onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })} placeholder="Image URLs" rows={3} /></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditingCountry(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCountries;
