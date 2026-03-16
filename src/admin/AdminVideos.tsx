import { useState } from 'react';
import { Plus, Edit2, Trash2, Play, X, Star } from 'lucide-react';
import { useVideoStore } from '@/store';

const getYtId = (url: string) => url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
const getEmbed = (url: string) => { const id = getYtId(url); return id ? `https://www.youtube.com/embed/${id}` : url; };
const getThumb = (url: string) => { const id = getYtId(url); return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''; };

const emptyForm = { title: '', description: '', youtubeUrl: '', thumbnail: '', category: '', isFeatured: false, order: 0 };

export default function AdminVideos() {
  const { videos, addVideo, updateVideo, deleteVideo } = useVideoStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const reset = () => { setForm({ ...emptyForm }); setEditing(null); };

  const handleEdit = (v: any) => {
    setEditing(v);
    setForm({ title: v.title, description: v.description || '', youtubeUrl: v.youtubeUrl, thumbnail: v.thumbnail || '', category: v.category || '', isFeatured: v.isFeatured, order: v.order || 0 });
    setOpen(true);
  };

  const handleSave = async () => {
    const thumb = form.thumbnail || getThumb(form.youtubeUrl);
    const embedUrl = getEmbed(form.youtubeUrl);
    const data = { ...form, thumbnail: thumb, embedUrl };
    if (editing) { await updateVideo(editing.id, data); }
    else { await addVideo(data as any); }
    setOpen(false); reset();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Videos</h1>
          <p className="text-muted text-sm mt-1">{videos.length} videos · shown on homepage</p>
        </div>
        <button onClick={() => { reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl"><p className="text-muted">No videos yet. Add your first YouTube video!</p></div>
        ) : [...videos].sort((a, b) => (a.order || 0) - (b.order || 0)).map(video => (
          <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-video bg-charcoal/10">
              {video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8 text-muted/50" /></div>}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow"><Play className="w-4 h-4 text-charcoal fill-charcoal ml-0.5" /></div>
              </div>
              {video.isFeatured && <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-yellow-900" />Featured</div>}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm text-charcoal line-clamp-2">{video.title}</p>
              {video.category && <p className="text-xs text-muted mt-0.5">{video.category}</p>}
              <div className="flex gap-1 mt-2">
                <button onClick={() => handleEdit(video)} className="flex-1 py-1.5 rounded-lg bg-cream hover:bg-sand text-charcoal/70 text-xs transition-colors"><Edit2 className="w-3 h-3 inline mr-1" />Edit</button>
                <button onClick={() => { if (confirm('Delete?')) deleteVideo(video.id); }} className="px-3 py-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 text-xs transition-colors"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-charcoal">{editing ? 'Edit Video' : 'Add Video'}</h2>
              <button onClick={() => { setOpen(false); reset(); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">YouTube URL *</label>
                <input value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                {form.youtubeUrl && getYtId(form.youtubeUrl) && <img src={getThumb(form.youtubeUrl)} alt="preview" className="w-full h-28 object-cover rounded-lg mt-2" />}
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Video title"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional description"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Category</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Vlog"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
                <span className="text-sm text-charcoal">Feature on homepage</span>
              </label>
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
