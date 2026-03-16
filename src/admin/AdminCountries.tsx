import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useCountryStore } from '@/store';
import { MultiImageUpload } from '@/components/ImageUpload';

const emptyForm = { name:'', code:'', description:'', images:[] as string[], isVisited:false, visitDate:'' };

export default function AdminCountries() {
  const { countries, addCountry, updateCountry, deleteCountry } = useCountryStore();
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm]       = useState({ ...emptyForm });

  const reset = () => { setForm({ ...emptyForm }); setEditing(null); };
  const handleEdit = (c: any) => { setEditing(c); setForm({ name:c.name, code:c.code, description:c.description||'', images:c.images||[], isVisited:c.isVisited, visitDate:c.visitDate||'' }); setOpen(true); };
  const handleSave = async () => { if(editing) await updateCountry(editing.id,form); else await addCountry({...form,blogs:[],destinations:[]} as any); setOpen(false); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl text-charcoal">Countries</h1><p className="text-muted text-sm mt-1">{countries.filter(c=>c.isVisited).length} visited of {countries.length}</p></div>
        <button onClick={()=>{ reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors"><Plus className="w-4 h-4" /> Add Country</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {countries.map(c=>(
          <div key={c.id} className={`bg-white rounded-xl overflow-hidden shadow-sm ${c.isVisited?'ring-1 ring-earth/30':'opacity-70'}`}>
            <div className="relative h-28">
              {c.images?.[0] ? <img src={c.images[0]} alt={c.name} className="w-full h-full object-cover" />
              : <div className={`w-full h-full flex items-center justify-center ${c.isVisited?'bg-earth/10':'bg-sand/50'}`}><span className="font-display text-4xl text-charcoal/10">{c.code}</span></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {c.isVisited&&<div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-earth flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
              <div className="absolute bottom-2 left-3"><p className="text-white font-medium text-sm">{c.name}</p><p className="text-white/60 text-xs">{c.code}</p></div>
            </div>
            <div className="p-3 flex gap-1">
              <button onClick={()=>handleEdit(c)} className="flex-1 py-1.5 rounded-lg bg-cream hover:bg-sand text-xs text-charcoal/70 transition-colors"><Edit2 className="w-3 h-3 inline mr-1" />Edit</button>
              <button onClick={()=>{ if(confirm('Delete?')) deleteCountry(c.id); }} className="px-3 py-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-charcoal">{editing?'Edit Country':'Add Country'}</h2>
              <button onClick={()=>{ setOpen(false); reset(); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="India" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Code</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="IN" maxLength={3} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              </div>
              <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>

              <MultiImageUpload values={form.images} onChange={imgs=>setForm({...form,images:imgs})} folder="sahr_countries" label="Country Photos" max={6} />

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
