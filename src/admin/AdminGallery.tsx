import { useState } from 'react';
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react';
import { useGalleryStore } from '@/store';
import ImageUpload, { MultiImageUpload } from '@/components/ImageUpload';

export default function AdminGallery() {
  const { images, categories, addImage, updateImage, deleteImage, addCategory, deleteCategory } = useGalleryStore();
  const [tab, setTab] = useState<'images'|'categories'>('images');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title:'', url:'', caption:'', category:'', location:'', isFeatured:false });
  const [catForm, setCatForm] = useState({ name:'', description:'', coverImage:'' });
  const [catOpen, setCatOpen] = useState(false);

  const reset = () => { setForm({ title:'', url:'', caption:'', category:'', location:'', isFeatured:false }); setEditing(null); };

  const handleSave = async () => {
    if(!form.title || !form.url) { alert('Title and image required'); return; }
    if(editing) await updateImage(editing.id, form);
    else await addImage(form as any);
    setOpen(false); reset();
  };

  const handleEdit = (img: any) => {
    setEditing(img);
    setForm({ title:img.title, url:img.url, caption:img.caption||'', category:img.category, location:img.location||'', isFeatured:img.isFeatured });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Gallery</h1>
          <p className="text-muted text-sm mt-1">{images.length} photos across {categories.length} collections</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setCatOpen(true)} className="px-4 py-2.5 rounded-xl border border-sand text-charcoal/70 text-sm font-medium hover:bg-cream transition-colors">+ Category</button>
          <button onClick={()=>{ reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(['images','categories'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab===t?'bg-charcoal text-white':'bg-white text-charcoal/60 hover:bg-sand/50'}`}>{t}</button>
        ))}
      </div>

      {tab==='images' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.length===0
            ? <div className="col-span-full text-center py-16 bg-white rounded-xl"><p className="text-muted">No photos yet</p></div>
            : images.map(img=>(
              <div key={img.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  {img.isFeatured && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center"><Star className="w-3 h-3 text-yellow-900 fill-yellow-900" /></div>}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm text-charcoal truncate">{img.title}</p>
                  <p className="text-xs text-muted mt-0.5">{img.category}</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={()=>handleEdit(img)} className="flex-1 py-1.5 rounded-lg bg-cream hover:bg-sand text-charcoal/70 text-xs transition-colors"><Edit2 className="w-3 h-3 inline mr-1" />Edit</button>
                    <button onClick={()=>{ if(confirm('Delete?')) deleteImage(img.id); }} className="px-3 py-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 text-xs transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.length===0
            ? <div className="col-span-full text-center py-16 bg-white rounded-xl"><p className="text-muted">No categories yet</p></div>
            : categories.map(cat=>(
              <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal">{cat.name}</p>
                  <p className="text-xs text-muted mt-0.5">{cat.description||'No description'}</p>
                  <p className="text-xs text-earth mt-1">{images.filter(i=>i.category===cat.name).length} photos</p>
                </div>
                <button onClick={()=>{ if(confirm('Delete category?')) deleteCategory(cat.id); }} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))
          }
        </div>
      )}

      {/* Add Photo Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-charcoal">{editing?'Edit Photo':'Add Photo'}</h2>
              <button onClick={()=>{ setOpen(false); reset(); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Title</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Photo title"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>

              {/* DIRECT UPLOAD */}
              <ImageUpload
                value={form.url}
                onChange={url => setForm({...form, url})}
                folder="sahr_gallery"
                label="Photo"
                previewClass="h-40 w-full"
              />

              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Caption (optional)</label>
                <input value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} placeholder="Caption"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Location (optional)</label>
                <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Rajasthan, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm bg-white">
                  <option value="">Select category</option>
                  {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} className="rounded" />
                <span className="text-sm text-charcoal">Feature on homepage</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>{ setOpen(false); reset(); }} className="flex-1 py-2.5 rounded-xl border border-sand text-charcoal/70 text-sm hover:bg-cream transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-earth text-white text-sm hover:bg-earth/90 transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {catOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-charcoal">Add Category</h2>
              <button onClick={()=>setCatOpen(false)}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Name</label>
                <input value={catForm.name} onChange={e=>setCatForm({...catForm,name:e.target.value})} placeholder="e.g. Mountains"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label>
                <input value={catForm.description} onChange={e=>setCatForm({...catForm,description:e.target.value})} placeholder="Optional"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>
              <ImageUpload value={catForm.coverImage} onChange={url=>setCatForm({...catForm,coverImage:url})} folder="sahr_gallery" label="Cover Image (optional)" previewClass="h-24 w-full" />
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setCatOpen(false)} className="flex-1 py-2.5 rounded-xl border border-sand text-charcoal/70 text-sm hover:bg-cream transition-colors">Cancel</button>
                <button onClick={async()=>{ await addCategory(catForm); setCatForm({name:'',description:'',coverImage:''}); setCatOpen(false); }} className="flex-1 py-2.5 rounded-xl bg-earth text-white text-sm hover:bg-earth/90 transition-colors">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
