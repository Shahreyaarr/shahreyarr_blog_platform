import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, GripVertical, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import GalleryPicker from '@/components/GalleryPicker';
import ImageUpload from '@/components/ImageUpload';
import { useBlogStore } from '@/store';

const CATEGORIES = ['Trekking', 'Hills', 'City', 'Country', 'Adventure', 'Food', 'Culture', 'Spiritual', 'Wildlife', 'Vlog', 'Street', 'Nature'];

const emptyForm = {
  title: '', excerpt: '', author: 'Shahreyarr', featuredImage: '',
  readTime: '5 min read', isPublished: true, category: '', country: '',
  state: '', tags: '', youtubeUrl: '', isVlog: false,
};

export default function AdminBlogs() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [blocks, setBlocks] = useState<any[]>([]);
  const [showGallery, setShowGallery] = useState<string|null>(null); // 'featured' | 'block-N'

  const reset = () => { setForm({ ...emptyForm }); setBlocks([]); setEditing(null); };

  const handleEdit = (blog: any) => {
    setEditing(blog);
    setForm({ title: blog.title, excerpt: blog.excerpt, author: blog.author, featuredImage: blog.featuredImage, readTime: blog.readTime, isPublished: blog.isPublished, category: blog.category, country: blog.country || '', state: blog.state || '', tags: (blog.tags || []).join(', '), youtubeUrl: blog.youtubeUrl || '', isVlog: blog.isVlog || false });
    setBlocks(blog.content || []);
    setOpen(true);
  };

  const handleSave = async () => {
    const data = { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean), content: blocks };
    if (editing) { await updateBlog(editing.id, data); }
    else { await addBlog(data as any); }
    setOpen(false); reset();
  };

  const addBlock = (type: string) => {
    const defaults: Record<string, any> = { heading: { type: 'heading', content: 'New Heading', level: 2 }, paragraph: { type: 'paragraph', content: '' }, image: { type: 'image', url: '', caption: '' }, quote: { type: 'quote', content: '' }, video: { type: 'video', url: '' }, list: { type: 'list', items: [''] } };
    setBlocks([...blocks, defaults[type]]);
  };

  const updateBlock = (i: number, data: any) => setBlocks(blocks.map((b, idx) => idx === i ? { ...b, ...data } : b));
  const removeBlock = (i: number) => setBlocks(blocks.filter((_, idx) => idx !== i));
  const moveBlock = (i: number, dir: 'up' | 'down') => {
    if (dir === 'up' && i === 0) return;
    if (dir === 'down' && i === blocks.length - 1) return;
    const nb = [...blocks]; const j = dir === 'up' ? i - 1 : i + 1;
    [nb[i], nb[j]] = [nb[j], nb[i]]; setBlocks(nb);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Blog & Vlogs</h1>
          <p className="text-muted text-sm mt-1">{blogs.length} posts total, {blogs.filter(b => b.isPublished).length} published</p>
        </div>
        <button onClick={() => { reset(); setOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="space-y-3">
        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-muted">No posts yet. Create your first blog post!</p>
          </div>
        ) : blogs.map(blog => (
          <div key={blog.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <img src={blog.featuredImage} alt={blog.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as any).style.display = 'none'; }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-charcoal text-sm truncate">{blog.title}</h3>
                {!blog.isPublished && <span className="px-2 py-0.5 rounded-full bg-sand text-charcoal/60 text-xs">Draft</span>}
                {blog.isVlog && <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs">Vlog</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{blog.category}</span><span>·</span>
                <span>{blog.country || 'No country'}</span><span>·</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => updateBlog(blog.id, { isPublished: !blog.isPublished })} className="p-2 rounded-lg hover:bg-sand/50 text-muted hover:text-charcoal transition-colors">
                {blog.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => handleEdit(blog)} className="p-2 rounded-lg hover:bg-sand/50 text-muted hover:text-charcoal transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if (confirm('Delete this post?')) deleteBlog(blog.id); }} className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-display text-xl text-charcoal">{editing ? 'Edit Post' : 'New Post'}</h2>
              <div className="flex gap-3">
                <button onClick={() => { setOpen(false); reset(); }} className="text-muted hover:text-charcoal transition-colors"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic fields */}
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Brief summary"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <ImageUpload
                    value={form.featuredImage}
                    onChange={url => setForm({ ...form, featuredImage: url })}
                    folder="sahr_blog"
                    label="Featured Image"
                    previewClass="h-24 w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm bg-white">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Country</label>
                  <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="e.g. India"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">State</label>
                  <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Optional"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Read Time</label>
                  <input value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} placeholder="5 min read"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="travel, india, mountains"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
              </div>

              {/* Vlog toggle */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div onClick={() => setForm({ ...form, isVlog: !form.isVlog })}
                    className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${form.isVlog ? 'bg-earth' : 'bg-sand'}`} style={{ height: '22px' }}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isVlog ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-charcoal">This is a Vlog</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                    className={`w-10 rounded-full relative transition-colors cursor-pointer ${form.isPublished ? 'bg-earth' : 'bg-sand'}`} style={{ height: '22px' }}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isPublished ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-charcoal">Published</span>
                </label>
              </div>

              {form.isVlog && (
                <div>
                  <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">YouTube URL</label>
                  <input value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                </div>
              )}

              {/* Content Blocks */}
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-3">Content</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['heading', 'paragraph', 'image', 'quote', 'video', 'list'].map(type => (
                    <button key={type} type="button" onClick={() => addBlock(type)}
                      className="px-3 py-1.5 rounded-lg bg-cream hover:bg-sand text-charcoal/70 text-xs font-medium capitalize transition-colors">
                      + {type}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {blocks.map((block, i) => (
                    <div key={i} className="border border-sand rounded-xl p-3 bg-cream/30">
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="w-4 h-4 text-muted/50" />
                        <span className="text-xs text-muted capitalize font-medium flex-1">{block.type}</span>
                        <button onClick={() => moveBlock(i, 'up')} className="p-1 text-muted hover:text-charcoal"><ChevronUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => moveBlock(i, 'down')} className="p-1 text-muted hover:text-charcoal"><ChevronDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => removeBlock(i)} className="p-1 text-muted hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                      </div>
                      {block.type === 'heading' && (
                        <div className="flex gap-2">
                          <select value={block.level} onChange={e => updateBlock(i, { level: parseInt(e.target.value) })} className="px-2 py-1.5 rounded-lg border border-sand text-xs bg-white w-16">
                            {[1,2,3,4].map(l => <option key={l} value={l}>H{l}</option>)}
                          </select>
                          <input value={block.content} onChange={e => updateBlock(i, { content: e.target.value })} placeholder="Heading text" className="flex-1 px-3 py-1.5 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth" />
                        </div>
                      )}
                      {block.type === 'paragraph' && (
                        <textarea value={block.content} onChange={e => updateBlock(i, { content: e.target.value })} rows={4} placeholder="Write your paragraph..."
                          className="w-full px-3 py-2 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth resize-none" />
                      )}
                      {block.type === 'image' && (
                        <div className="space-y-2">
                          <input value={block.url} onChange={e => updateBlock(i, { url: e.target.value })} placeholder="Image URL"
                            className="w-full px-3 py-1.5 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth" />
                          <input value={block.caption || ''} onChange={e => updateBlock(i, { caption: e.target.value })} placeholder="Caption (optional)"
                            className="w-full px-3 py-1.5 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth" />
                          {block.url && <img src={block.url} alt="" className="h-24 rounded-lg object-cover" onError={e => { (e.target as any).style.display = 'none'; }} />}
                        </div>
                      )}
                      {block.type === 'quote' && (
                        <textarea value={block.content} onChange={e => updateBlock(i, { content: e.target.value })} rows={3} placeholder="Quote text"
                          className="w-full px-3 py-2 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth resize-none" />
                      )}
                      {block.type === 'video' && (
                        <input value={block.url} onChange={e => updateBlock(i, { url: e.target.value })} placeholder="YouTube embed URL"
                          className="w-full px-3 py-1.5 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth" />
                      )}
                      {block.type === 'list' && (
                        <textarea value={(block.items || []).join('\n')} onChange={e => updateBlock(i, { items: e.target.value.split('\n') })} rows={4} placeholder="One item per line"
                          className="w-full px-3 py-2 rounded-lg border border-sand text-sm focus:outline-none focus:border-earth resize-none" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setOpen(false); reset(); }} className="flex-1 py-3 rounded-xl border border-sand text-charcoal/70 text-sm font-medium hover:bg-cream transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors">{editing ? 'Update Post' : 'Publish Post'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showGallery && (
        <GalleryPicker
          onSelect={(url) => {
            if (showGallery === 'featured') setForm({ ...form, featuredImage: url });
            else {
              const idx = parseInt(showGallery.replace('block-',''));
              updateBlock(idx, { url });
            }
            setShowGallery(null);
          }}
          onClose={() => setShowGallery(null)}
        />
      )}
    </div>
  );
}
