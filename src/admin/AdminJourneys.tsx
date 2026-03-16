import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Users } from 'lucide-react';
import { useJourneyStore } from '@/store';

const emptyForm = { title: '', destination: '', startDate: '', endDate: '', images: [] as string[], description: '', itinerary: '', availableSeats: 10, price: 0, currency: '₹', status: 'open' as any };

export default function AdminJourneys() {
  const { journeys, addJourney, updateJourney, deleteJourney } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [imgInput, setImgInput] = useState('');

  const reset = () => { setForm({ ...emptyForm }); setEditing(null); setImgInput(''); };

  const handleEdit = (j: any) => {
    setEditing(j);
    setForm({ title: j.title, destination: j.destination, startDate: j.startDate, endDate: j.endDate || '', images: j.images || [], description: j.description, itinerary: j.itinerary || '', availableSeats: j.availableSeats, price: j.price || 0, currency: j.currency || '₹', status: j.status });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editing) { await updateJourney(editing.id, form); }
    else { await addJourney(form as any); }
    setOpen(false); reset();
  };

  const statusColor: Record<string, string> = { open: 'bg-green-50 text-green-700', closed: 'bg-red-50 text-red-700', completed: 'bg-sand text-charcoal/60' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl text-charcoal">Journeys</h1><p className="text-muted text-sm mt-1">{journeys.filter(j => j.status === 'open').length} open</p></div>
        <button onClick={() => { reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors"><Plus className="w-4 h-4" /> New Journey</button>
      </div>

      <div className="space-y-3">
        {journeys.length === 0 ? <div className="text-center py-16 bg-white rounded-xl"><p className="text-muted">No journeys yet</p></div>
        : journeys.map(j => (
          <div key={j.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-sand">
              {j.images[0] && <img src={j.images[0]} alt={j.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-charcoal text-sm">{j.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColor[j.status]}`}>{j.status}</span>
              </div>
              <p className="text-xs text-muted">{j.destination} · {new Date(j.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{j.availableSeats} seats</span>
                {j.price > 0 && <span>{j.currency}{j.price.toLocaleString()}</span>}
                <span>{j.registrations?.length || 0} registered</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(j)} className="p-2 rounded-lg hover:bg-sand/50 text-muted hover:text-charcoal transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm('Delete?')) deleteJourney(j.id); }} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-charcoal">{editing ? 'Edit Journey' : 'New Journey'}</h2>
              <button onClick={() => { setOpen(false); reset(); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[['title','Title *'], ['destination','Destination *']].map(([f,l]) => (
                <div key={f}><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">{l}</label>
                <input value={(form as any)[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={l} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Seats</label><input type="number" value={form.availableSeats} onChange={e => setForm({ ...form, availableSeats: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Price</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm bg-white">
                  <option value="open">Open</option><option value="closed">Closed</option><option value="completed">Completed</option>
                </select></div>
              </div>
              <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Cover Image</label>
                <div className="flex gap-2">
                  <input value={imgInput} onChange={e => setImgInput(e.target.value)} placeholder="https://..." className="flex-1 px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                  <button onClick={() => { if (imgInput.trim()) { setForm({ ...form, images: [...form.images, imgInput.trim()] }); setImgInput(''); }}} className="px-3 rounded-xl bg-earth text-white text-sm"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setOpen(false); reset(); }} className="flex-1 py-2.5 rounded-xl border border-sand text-charcoal/70 text-sm hover:bg-cream transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-earth text-white text-sm hover:bg-earth/90 transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
