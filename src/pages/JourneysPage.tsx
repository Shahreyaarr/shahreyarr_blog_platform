import { useState } from 'react';
import { Calendar, Users, MapPin, ArrowRight, Check, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chat from '@/components/Chat';
import { useJourneyStore } from '@/store';

export default function JourneysPage() {
  const { journeys, getOpen, registerForJourney } = useJourneyStore();
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const open = getOpen();
  const completed = journeys.filter(j => j.status === 'completed');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await registerForJourney(selected.id, form);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setSelected(null); setForm({ name: '', email: '', phone: '', message: '' }); }, 3000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="pt-28 pb-10 bg-white border-b border-sand/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-medium text-earth uppercase tracking-widest">Adventures</span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal mt-2 mb-4">Upcoming Journeys</h1>
          <p className="text-muted max-w-xl">Join me on carefully curated travel experiences. Limited spots for an intimate, authentic adventure.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {open.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-muted mx-auto mb-4 opacity-40" />
            <p className="font-display text-2xl text-charcoal/30">No upcoming journeys</p>
            <p className="text-muted text-sm mt-2">Check back soon for new adventures!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {open.map(journey => (
              <div key={journey.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-52 overflow-hidden">
                  <img src={journey.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'} alt={journey.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1"><MapPin className="w-3 h-3" />{journey.destination}</div>
                    <h3 className="text-white font-display text-xl">{journey.title}</h3>
                  </div>
                  {journey.availableSeats <= 5 && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                      {journey.availableSeats} spots left!
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-muted mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(journey.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{journey.availableSeats} seats</span>
                  </div>
                  <p className="text-sm text-muted line-clamp-3 mb-4">{journey.description}</p>
                  {journey.price && (
                    <p className="text-earth font-medium text-lg mb-4">
                      {journey.currency || '₹'}{journey.price.toLocaleString()}<span className="text-muted text-xs font-normal"> /person</span>
                    </p>
                  )}
                  <button onClick={() => setSelected(journey)}
                    className="w-full py-3 rounded-xl bg-earth text-white text-sm font-medium hover:bg-earth/90 transition-colors flex items-center justify-center gap-2">
                    Join This Journey <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-charcoal mb-6">Past Journeys</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {completed.map(j => (
                <div key={j.id} className="bg-white/60 rounded-xl p-4 flex items-center gap-3">
                  <Check className="w-4 h-4 text-earth flex-shrink-0" />
                  <div><p className="font-medium text-charcoal text-sm">{j.title}</p><p className="text-xs text-muted">{j.destination}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-earth/10 flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-earth" /></div>
                <h3 className="font-display text-2xl text-charcoal">Registered!</h3>
                <p className="text-muted text-sm mt-2">We'll be in touch soon with details.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-display text-xl text-charcoal">Join — {selected.title}</h3>
                    <p className="text-xs text-muted mt-1">{selected.destination}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted hover:text-charcoal"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleRegister} className="space-y-3">
                  {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel']].map(([field, label, type]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">{label}</label>
                      <input type={type} value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required
                        className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1">Message (optional)</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-earth text-white font-medium text-sm hover:bg-earth/90 transition-colors">Register Now</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
      <Chat />
    </div>
  );
}
