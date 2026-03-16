import { useState } from 'react';
import { Mail, MapPin, Instagram, Youtube, Send, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useSettingsStore, useMessageStore } from '@/store';

export default function ContactPage() {
  const { settings } = useSettingsStore();
  const { addMessage } = useMessageStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addMessage(form);
    setSubmitted(true);
    setLoading(false);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }, 4000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-12 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 max-w-2xl">
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Contact</span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-4">Let's Connect</h1>
          <p className="text-muted">Have a project, collaboration, or just want to say hello? I'd love to hear from you.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-earth/10 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-earth" /></div>
              <div><p className="text-xs text-muted uppercase tracking-wide mb-0.5">Email</p><a href={`mailto:${settings.email}`} className="text-charcoal font-medium text-sm hover:text-earth transition-colors">{settings.email}</a></div>
            </div>
            <div className="bg-white rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-earth/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-earth" /></div>
              <div><p className="text-xs text-muted uppercase tracking-wide mb-0.5">Based in</p><p className="text-charcoal font-medium text-sm">{settings.location}</p></div>
            </div>
            <div className="bg-white rounded-xl p-5">
              <p className="text-xs text-muted uppercase tracking-wide mb-3">Follow Along</p>
              <div className="flex gap-3">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {settings.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </div>
            <div className="bg-earth/5 rounded-xl p-5 border border-earth/10">
              <p className="text-sm text-charcoal font-medium mb-1">Prefer chatting?</p>
              <p className="text-xs text-muted">Use the chat button in the bottom right for instant messaging.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-14">
                <div className="w-14 h-14 rounded-full bg-earth/10 flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-earth" /></div>
                <h3 className="font-display text-2xl text-charcoal mb-2">Message Sent!</h3>
                <p className="text-muted text-sm">Thank you for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl text-charcoal mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[['name', 'Your Name', 'text', 'John Doe'], ['email', 'Email Address', 'email', 'john@example.com']].map(([field, label, type, ph]) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">{label}</label>
                        <input type={type} value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={ph} required
                          className="w-full px-4 py-3 rounded-xl border border-sand focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/10 text-sm transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Subject</label>
                    <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Collaboration, Photography, Travel..." required
                      className="w-full px-4 py-3 rounded-xl border border-sand focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/10 text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Tell me about your project..." required
                      className="w-full px-4 py-3 rounded-xl border border-sand focus:outline-none focus:border-earth focus:ring-2 focus:ring-earth/10 text-sm transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-charcoal text-white font-medium text-sm hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Chat />
    </div>
  );
}
