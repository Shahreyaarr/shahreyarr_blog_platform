import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useDestStore } from '@/store';
import ImageUpload, { MultiImageUpload } from '@/components/ImageUpload';

const emptyForm = { name:'', country:'', state:'', type:'city' as any, description:'', images:[] as string[], heroImage:'', isVisited:true, visitDate:'', sections:[] as any[], placesVisited:[] as any[] };

export default function AdminDestinations() {
  const { destinations, addDestination, updateDestination, deleteDestination } = useDestStore();
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm]       = useState({ ...emptyForm });

  const reset = () => { setForm({ ...emptyForm }); setEditing(null); };
  const handleEdit = (d: any) => { setEditing(d); setForm({ name:d.name, country:d.country, state:d.state||'', type:d.type, description:d.description, images:d.images||[], heroImage:d.heroImage||'', isVisited:d.isVisited, visitDate:d.visitDate||'', sections:d.sections||[], placesVisited:d.placesVisited||[] }); setOpen(true); };
  const handleSave = async () => { if(editing) await updateDestination(editing.id,form); else await addDestination(form as any); setOpen(false); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl text-charcoal">Destinations</h1><p className="text-muted text-sm mt-1">{destinations.length} destinations</p></div>
        <button onClick={()=>{ reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors"><Plus className="w-4 h-4" /> Add Destination</button>
      </div>

      <div className="space-y-3">
        {destinations.length===0 ? <div className="text-center py-16 bg-white rounded-xl"><p className="text-muted">No destinations yet</p></div>
        : destinations.map(dest=>(
          <div key={dest.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-sand">
              {(dest.images[0]||dest.heroImage)&&<img src={dest.images[0]||dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h3 className="font-medium text-charcoal text-sm">{dest.name}</h3><span className="px-2 py-0.5 rounded-full bg-sand text-xs capitalize">{dest.type}</span></div>
              <p className="text-xs text-muted mt-0.5">{dest.country}{dest.state?`, ${dest.state}`:''}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={()=>handleEdit(dest)} className="p-2 rounded-lg hover:bg-sand/50 text-muted hover:text-charcoal transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={()=>{ if(confirm('Delete?')) deleteDestination(dest.id); }} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-charcoal">{editing?'Edit Destination':'Add Destination'}</h2>
              <button onClick={()=>{ setOpen(false); reset(); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[['name','Name *'],['country','Country *']].map(([f,l])=>(
                  <div key={f}><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">{l}</label>
                  <input value={(form as any)[f]} onChange={e=>setForm({...form,[f]:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">State</label>
                <input value={form.state} onChange={e=>setForm({...form,state:e.target.value})} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Type</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm bg-white">
                  {['country','state','city','region'].map(t=><option key={t} value={t}>{t}</option>)}
                </select></div>
              </div>
              <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>

              <ImageUpload value={form.heroImage} onChange={url=>setForm({...form,heroImage:url})} folder="sahr_destinations" label="Hero Image" previewClass="h-40 w-full" />
              <MultiImageUpload values={form.images} onChange={imgs=>setForm({...form,images:imgs})} folder="sahr_destinations" label="Gallery Images" max={15} />

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isVisited} onChange={e=>setForm({...form,isVisited:e.target.checked})} className="rounded" /><span className="text-sm">Visited</span></label>
                {form.isVisited&&<input type="date" value={form.visitDate} onChange={e=>setForm({...form,visitDate:e.target.value})} className="px-3 py-2 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>{ setOpen(false); reset(); }} className="flex-1 py-2.5 rounded-xl border border-sand text-charcoal/70 text-sm hover:bg-cream transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-earth text-white text-sm hover:bg-earth/90 transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
