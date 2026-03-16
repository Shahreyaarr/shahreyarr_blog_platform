import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useShopStore } from '@/store';
import { MultiImageUpload } from '@/components/ImageUpload';

const emptyForm = { name:'', description:'', price:0, originalPrice:0, images:[] as string[], category:'photo' as any, stock:10, isActive:true, size:'', material:'', tags:'' };

export default function AdminShop() {
  const { products, addProduct, updateProduct, deleteProduct } = useShopStore();
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm]       = useState({ ...emptyForm });

  const reset = () => { setForm({ ...emptyForm }); setEditing(null); };
  const handleEdit = (p: any) => { setEditing(p); setForm({ name:p.name, description:p.description, price:p.price, originalPrice:p.originalPrice||0, images:p.images||[], category:p.category, stock:p.stock, isActive:p.isActive, size:p.size||'', material:p.material||'', tags:(p.tags||[]).join(', ') }); setOpen(true); };
  const handleSave = async () => { const data = { ...form, tags:form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean) }; if(editing) await updateProduct(editing.id,data); else await addProduct(data as any); setOpen(false); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl text-charcoal">Shop</h1><p className="text-muted text-sm mt-1">{products.length} products</p></div>
        <button onClick={()=>{ reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors"><Plus className="w-4 h-4" /> Add Product</button>
      </div>
      <div className="space-y-3">
        {products.length===0 ? <div className="text-center py-16 bg-white rounded-xl"><p className="text-muted">No products yet</p></div>
        : products.map(p=>(
          <div key={p.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-sand">{p.images[0]&&<img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h3 className="font-medium text-charcoal text-sm truncate">{p.name}</h3>{!p.isActive&&<span className="px-2 py-0.5 rounded-full bg-sand text-xs text-charcoal/60">Inactive</span>}</div>
              <p className="text-xs text-muted mt-0.5">{p.category} · Stock: {p.stock}</p>
              <p className="text-sm text-earth font-medium mt-1">₹{p.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={()=>handleEdit(p)} className="p-2 rounded-lg hover:bg-sand/50 text-muted hover:text-charcoal transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={()=>{ if(confirm('Delete?')) deleteProduct(p.id); }} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-charcoal">{editing?'Edit Product':'Add Product'}</h2>
              <button onClick={()=>{ setOpen(false); reset(); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Price (₹)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:parseInt(e.target.value)||0})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Original Price</label><input type="number" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:parseInt(e.target.value)||0})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value as any})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm bg-white">
                  <option value="photo">Photo</option><option value="print">Print</option><option value="merch">Merch</option>
                </select></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value)||0})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              </div>

              <MultiImageUpload values={form.images} onChange={imgs=>setForm({...form,images:imgs})} folder="sahr_shop" label="Product Images" max={8} />

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Size</label><input value={form.size} onChange={e=>setForm({...form,size:e.target.value})} placeholder="e.g. 12x18 inches" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Material</label><input value={form.material} onChange={e=>setForm({...form,material:e.target.value})} placeholder="e.g. Canvas" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              </div>
              <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="travel, india, mountains" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="rounded" /><span className="text-sm">Active / Visible in shop</span></label>
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
