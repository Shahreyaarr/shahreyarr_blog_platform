import { useState, useRef } from 'react';
import { Upload, X, Link, Image as ImgIcon } from 'lucide-react';

const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD   as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET as string;

export async function uploadToCloudinary(file: File, folder = 'sahr_general'): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: 'POST', body: fd,
  });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  preview?: boolean;
  previewClass?: string;
  accept?: string;
}

export default function ImageUpload({
  value, onChange, folder = 'sahr_general',
  label = 'Image', preview = true,
  previewClass = 'h-32 w-full',
  accept = 'image/*',
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode]           = useState<'upload' | 'url'>('upload');
  const [progress, setProgress]   = useState(0);
  const [urlInput, setUrlInput]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 20 * 1024 * 1024) { alert('Max file size is 20MB'); return; }
    setUploading(true); setProgress(10);
    try {
      // Fake progress animation
      const prog = setInterval(() => setProgress(p => Math.min(p + 10, 85)), 300);
      const url = await uploadToCloudinary(file, folder);
      clearInterval(prog); setProgress(100);
      onChange(url);
      setTimeout(() => setProgress(0), 800);
    } catch {
      alert('Upload failed. Check your internet connection.');
      setProgress(0);
    }
    setUploading(false);
    e.target.value = '';
  }

  function applyUrl() {
    const u = urlInput.trim();
    if (!u) return;
    onChange(u); setUrlInput(''); setMode('upload');
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider">{label}</label>
        <div className="flex gap-1 text-xs">
          <button type="button" onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded-lg transition-colors ${mode==='upload' ? 'bg-earth text-white' : 'bg-sand/50 text-muted hover:bg-sand'}`}>
            <Upload className="w-3 h-3 inline mr-1" />Upload
          </button>
          <button type="button" onClick={() => setMode('url')}
            className={`px-2 py-1 rounded-lg transition-colors ${mode==='url' ? 'bg-earth text-white' : 'bg-sand/50 text-muted hover:bg-sand'}`}>
            <Link className="w-3 h-3 inline mr-1" />URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
          {uploading ? (
            <div className="w-full px-4 py-3 rounded-xl border border-earth/30 bg-earth/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-earth/30 border-t-earth rounded-full animate-spin flex-shrink-0" />
                <span className="text-xs text-earth font-medium">Uploading… {progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-earth/10 overflow-hidden">
                <div className="h-full rounded-full bg-earth transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-sand hover:border-earth/40 bg-cream/40 hover:bg-earth/5 transition-all flex items-center justify-center gap-2 text-sm text-muted hover:text-earth">
              <Upload className="w-4 h-4" />
              <span>Click to upload photo</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyUrl(); } }}
          />
          <button type="button" onClick={applyUrl}
            className="px-4 py-2.5 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 flex-shrink-0">
            Add
          </button>
        </div>
      )}

      {/* Preview + clear */}
      {preview && value && (
        <div className="relative group mt-1">
          <img src={value} alt="preview"
            className={`${previewClass} object-cover rounded-xl`}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Multi-image upload ──────────────────────────────────────────────── */
interface MultiProps {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  max?: number;
}

export function MultiImageUpload({ values, onChange, folder = 'sahr_general', label = 'Images', max = 10 }: MultiProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (values.length + files.length > max) { alert(`Max ${max} images allowed`); return; }
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadToCloudinary(f, folder)));
      onChange([...values, ...urls]);
    } catch { alert('Some uploads failed.'); }
    setUploading(false);
    e.target.value = '';
  }

  function addUrl() {
    const u = urlInput.trim(); if (!u) return;
    onChange([...values, u]); setUrlInput('');
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider">{label}</label>

      {/* Upload button */}
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      <div className="flex gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading || values.length >= max}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-dashed border-sand hover:border-earth/40 bg-cream/40 hover:bg-earth/5 transition-all flex items-center justify-center gap-2 text-sm text-muted hover:text-earth disabled:opacity-50">
          {uploading
            ? <><div className="w-4 h-4 border-2 border-earth/30 border-t-earth rounded-full animate-spin" /><span>Uploading…</span></>
            : <><Upload className="w-4 h-4" /><span>Upload Photos</span></>
          }
        </button>
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Or paste image URL…"
          className="flex-1 px-4 py-2 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }} />
        <button type="button" onClick={addUrl} className="px-3 py-2 rounded-xl bg-earth text-white text-sm hover:bg-earth/90">Add</button>
      </div>

      {/* Preview grid */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {values.map((img, i) => (
            <div key={i} className="relative group w-16 h-16">
              <img src={img} alt="" className="w-full h-full rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted/60">{values.length}/{max} images</p>
    </div>
  );
}
