import { useState } from 'react';
import { useJourneyStore } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Calendar, Users, MapPin, ArrowRight, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const JourneysPage = () => {
  const { journeys, getOpenJourneys, registerForJourney } = useJourneyStore();
  const [selectedJourney, setSelectedJourney] = useState<typeof journeys[0] | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openJourneys = getOpenJourneys();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJourney) {
      registerForJourney(selectedJourney.id, registrationData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsRegisterDialogOpen(false);
        setRegistrationData({ name: '', email: '', phone: '', message: '' });
        setSelectedJourney(null);
      }, 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 inline mr-2" />
            Join the Adventure
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Upcoming Journeys
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join me on my next adventure. Limited spots available for exclusive travel experiences.
          </p>
        </div>
      </section>

      {/* Journeys List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {openJourneys.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming journeys</h3>
              <p className="text-gray-500">Check back soon for new adventures!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {openJourneys.map((journey) => (
                <div
                  key={journey.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={journey.images[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'}
                      alt={journey.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        {journey.destination}
                      </div>
                      <h3 className="text-xl font-bold text-white">{journey.title}</h3>
                    </div>
                    {journey.available_seats <= 3 && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                        Only {journey.available_seats} spots left!
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(journey.start_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {journey.available_seats} seats
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                      {journey.description}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedJourney(journey);
                        setIsRegisterDialogOpen(true);
                      }}
                      className="w-full px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Join This Journey
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Journeys */}
      {journeys.filter((j) => j.status === 'completed').length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Past Journeys</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {journeys
                .filter((j) => j.status === 'completed')
                .map((journey) => (
                  <div
                    key={journey.id}
                    className="bg-gray-50 rounded-2xl p-6 opacity-75"
                  >
                    <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                      <Check className="w-4 h-4" />
                      Completed
                    </div>
                    <h3 className="font-semibold text-gray-900">{journey.title}</h3>
                    <p className="text-gray-500 text-sm">{journey.destination}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isSubmitted ? 'Registration Successful!' : `Join ${selectedJourney?.title}`}
            </DialogTitle>
          </DialogHeader>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-600">
                Thank you for registering! We&apos;ll contact you soon with more details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={registrationData.name}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, name: e.target.value })
                  }
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, phone: e.target.value })
                  }
                  placeholder="Your phone number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={registrationData.message}
                  onChange={(e) =>
                    setRegistrationData({ ...registrationData, message: e.target.value })
                  }
                  placeholder="Any questions or special requests?"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsRegisterDialogOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default JourneysPage;
