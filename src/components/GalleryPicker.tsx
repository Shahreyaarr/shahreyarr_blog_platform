import { useState, useRef } from 'react';
import { X, Search, Image as ImageIcon, Upload, ExternalLink } from 'lucide-react';
import { useGalleryStore } from '@/store';

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD as string;
const CLOUDINARY_PRESET = 'sahr_uploads';

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('folder', 'sahr_uploads');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST', body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

interface GalleryPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function GalleryPicker({ onSelect, onClose }: GalleryPickerProps) {
  const { images, categories } = useGalleryStore();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = images.filter(img => {
    const matchSearch = img.title.toLowerCase().includes(search.toLowerCase()) ||
      (img.location || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || img.category === cat;
    return matchSearch && matchCat;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { setUploadError('Max file size: 15MB'); return; }
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadToCloudinary(file);
      onSelect(url);
      onClose();
    } catch (err) {
      setUploadError('Upload failed. Check internet connection.');
    }
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand/50">
          <h3 className="font-display text-xl text-charcoal">Choose Image</h3>
          <button onClick={onClose} className="text-muted hover:text-charcoal transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Upload from device */}
        <div className="px-5 py-3 border-b border-sand/30 bg-cream/30">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 disabled:opacity-60 transition-colors shadow-sm">
              {uploading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" />Upload from Device</>
              )}
            </button>
            <div className="flex-1 min-w-48">
              <div className="flex gap-2">
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="Or paste image URL..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm bg-white"
                  onKeyDown={e => { if (e.key === 'Enter' && urlInput.trim()) { onSelect(urlInput.trim()); onClose(); } }} />
                <button onClick={() => { if (urlInput.trim()) { onSelect(urlInput.trim()); onClose(); } }}
                  className="px-3 py-2.5 rounded-xl bg-charcoal text-white text-sm hover:bg-charcoal/90 transition-colors">Use</button>
              </div>
            </div>
          </div>
          {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
          <p className="text-[11px] text-muted mt-1.5">
            Free upload: <a href="https://imgur.com/upload" target="_blank" rel="noopener" className="text-earth underline">imgur.com/upload <ExternalLink className="w-2.5 h-2.5 inline" /></a>
          </p>
        </div>

        {/* Gallery section */}
        <div className="px-5 py-3 border-b border-sand/30">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Or pick from your gallery</p>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gallery..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCat('All')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${cat === 'All' ? 'bg-earth text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>All</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setCat(c.name)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${cat === c.name ? 'bg-earth text-white' : 'bg-sand/50 text-charcoal/60 hover:bg-sand'}`}>{c.name}</button>
            ))}
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-10 h-10 text-muted/40 mx-auto mb-3" />
              <p className="text-muted text-sm">No photos in gallery</p>
              <p className="text-xs text-muted mt-1">Upload from device above, or add photos in Admin → Gallery</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filtered.map(img => (
                <button key={img.id} onClick={() => { onSelect(img.url); onClose(); }}
                  className="group relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-earth transition-all">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
