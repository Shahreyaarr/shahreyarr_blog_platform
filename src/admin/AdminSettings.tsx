import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useSettingsStore } from '@/store';
import ImageUpload, { MultiImageUpload } from '@/components/ImageUpload';

export default function AdminSettings() {
  const { settings, updateSettings } = useSettingsStore();
  const [form, setForm]   = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [tab, setTab]     = useState<'site'|'profile'|'social'|'stats'>('site');

  const handleSave = async () => {
    await updateSettings(form);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl text-charcoal">Settings</h1><p className="text-muted text-sm mt-1">Manage your site settings</p></div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved?'bg-green-500 text-white':'bg-earth text-white hover:bg-earth/90'}`}>
          <Save className="w-4 h-4" /> {saved?'Saved!':'Save Changes'}
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(['site','profile','social','stats'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab===t?'bg-charcoal text-white':'bg-white text-charcoal/60 hover:bg-sand/50'}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">

        {tab==='site' && <>
          <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Site Name</label>
            <input value={form.siteName} onChange={e=>setForm({...form,siteName:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
          <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Tagline</label>
            <input value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
          <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Hero Title (use \n for new line)</label>
            <textarea value={form.heroTitle} onChange={e=>setForm({...form,heroTitle:e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>
          <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Hero Subtitle</label>
            <textarea value={form.heroSubtitle} onChange={e=>setForm({...form,heroSubtitle:e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>

          {/* HERO IMAGES — direct upload */}
          <MultiImageUpload
            values={form.heroImages}
            onChange={urls => setForm({...form, heroImages: urls})}
            folder="sahr_hero"
            label="Hero Background Images"
            max={10}
          />
        </>}

        {tab==='profile' && <>
          <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">About Text</label>
            <textarea value={form.aboutText} onChange={e=>setForm({...form,aboutText:e.target.value})} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" /></div>

          {/* ABOUT PHOTO — direct upload */}
          <ImageUpload
            value={form.aboutImage}
            onChange={url => setForm({...form, aboutImage: url})}
            folder="sahr_profile"
            label="About / Profile Photo"
            previewClass="h-36 w-full"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Email</label>
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
            <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Location</label>
              <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
          </div>
        </>}

        {tab==='social' && <>
          <div>
            <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Razorpay Live Key (for payments)</label>
            <input value={(form as any).razorpayKey||''} onChange={e=>setForm({...form,razorpayKey:e.target.value} as any)} placeholder="rzp_live_xxxxxxxxxxxx" className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm font-mono" />
            <p className="text-xs text-muted mt-1">Get from razorpay.com/dashboard → Settings → API Keys</p>
          </div>
          {[['instagram','Instagram URL'],['youtube','YouTube URL'],['twitter','Twitter URL']].map(([f,l])=>(
            <div key={f}><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">{l}</label>
              <input value={(form as any)[f]} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
          ))}
        </>}

        {tab==='stats' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[['statsKm','Km Traveled'],['statsCountries','Countries Visited'],['statsPhotos','Photos Captured'],['statsStories','Stories Shared']].map(([f,l])=>(
              <div key={f}><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">{l}</label>
                <input type="number" value={(form as any)[f]} onChange={e=>setForm({...form,[f]:parseInt(e.target.value)||0})} className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" /></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
