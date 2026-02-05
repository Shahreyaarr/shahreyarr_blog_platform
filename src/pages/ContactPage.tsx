import { useState } from 'react';
import { useMessageStore, useSettingsStore } from '@/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Mail, MapPin, Instagram, Twitter, Youtube, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactPage = () => {
  const { settings, user } = useSettingsStore();
  const addMessage = useMessageStore((state) => state.addMessage);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMessage({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
            <Mail className="w-4 h-4 inline mr-2" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Let&apos;s Connect
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Feel free to reach out for collaborations, photography projects, or just to share
                your travel stories. I&apos;m always excited to connect with fellow travelers and
                creators.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">{settings.location}</p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Social Media</h3>
                    <div className="flex gap-3 mt-2">
                      {user.social_links.instagram && (
                        <a
                          href={user.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {user.social_links.twitter && (
                        <a
                          href={user.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {user.social_links.youtube && (
                        <a
                          href={user.social_links.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Youtube className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project or just say hello..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full py-6 text-lg">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default ContactPage;
