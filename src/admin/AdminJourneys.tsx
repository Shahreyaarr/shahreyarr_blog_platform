import { useState } from 'react';
import { useJourneyStore } from '@/store';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
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

const AdminJourneys = () => {
  const { journeys, addJourney, updateJourney, deleteJourney } = useJourneyStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewRegistrations, setViewRegistrations] = useState<typeof journeys[0] | null>(null);
  const [editingJourney, setEditingJourney] = useState<typeof journeys[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    itinerary: '',
    available_seats: 10,
    price: 0,
    status: 'open' as 'open' | 'closed' | 'completed',
    images: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      destination: '',
      start_date: '',
      end_date: '',
      description: '',
      itinerary: '',
      available_seats: 10,
      price: 0,
      status: 'open',
      images: [],
    });
    setEditingJourney(null);
  };

  const handleEdit = (j: typeof journeys[0]) => {
    setEditingJourney(j);
    setFormData({
      title: j.title,
      destination: j.destination,
      start_date: j.start_date.split('T')[0],
      end_date: j.end_date ? j.end_date.split('T')[0] : '',
      description: j.description,
      itinerary: j.itinerary,
      available_seats: j.available_seats,
      price: j.price || 0,
      status: j.status,
      images: j.images,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const data = { ...formData, images: formData.images.filter(Boolean) };
    if (editingJourney) {
      updateJourney(editingJourney.id, data);
    } else {
      addJourney(data);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this journey?')) deleteJourney(id);
  };

  return (
    <AdminLayout title="Upcoming Journeys">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">Manage upcoming travel journeys</p>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Journey
        </Button>
      </div>

      <div className="space-y-4">
        {journeys.map((j) => (
          <Card key={j.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img src={j.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop'} alt={j.title} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{j.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${j.status === 'open' ? 'bg-green-100 text-green-700' : j.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {j.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{j.destination}</p>
                  <p className="text-sm text-gray-400">{new Date(j.start_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setViewRegistrations(j)} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <Users className="w-4 h-4" />{j.registrations.length}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(j)}><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(j.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingJourney ? 'Edit Journey' : 'Add Journey'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Journey title" /></div>
            <div><Label>Destination</Label><Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder="e.g., Himachal Pradesh" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Date</Label><Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} /></div>
              <div><Label>End Date (optional)</Label><Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Available Seats</Label><Input type="number" value={formData.available_seats} onChange={(e) => setFormData({ ...formData, available_seats: parseInt(e.target.value) })} /></div>
              <div><Label>Price (optional)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} placeholder="0" /></div>
            </div>
            <div><Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as typeof formData.status })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Journey description" rows={3} /></div>
            <div><Label>Itinerary</Label><Textarea value={formData.itinerary} onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })} placeholder="Day-by-day itinerary" rows={4} /></div>
            <div><Label>Images (one per line)</Label><Textarea value={formData.images.join('\n')} onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })} placeholder="Image URLs" rows={3} /></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingJourney ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewRegistrations} onOpenChange={() => setViewRegistrations(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Registrations for {viewRegistrations?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {viewRegistrations?.registrations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No registrations yet</p>
            ) : (
              viewRegistrations?.registrations.map((reg) => (
                <div key={reg.id} className="border rounded-lg p-4">
                  <p className="font-semibold">{reg.name}</p>
                  <p className="text-sm text-gray-500">{reg.email}</p>
                  <p className="text-sm text-gray-500">{reg.phone}</p>
                  {reg.message && <p className="text-sm text-gray-600 mt-2">{reg.message}</p>}
                  <p className="text-xs text-gray-400 mt-2">{new Date(reg.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminJourneys;
