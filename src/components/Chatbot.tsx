import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon } from 'lucide-react';
import { useMessageStore } from '@/store';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addMessage = useMessageStore((state) => state.addMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    addMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      image_url: imageUrl.trim() || undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      setImageUrl('');
      setShowImageInput(false);
    }, 3000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 rotate-90'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Chat with us</h3>
              <p className="text-white/70 text-xs">We typically reply within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h4>
              <p className="text-gray-500 text-sm">Thank you for reaching out. We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
                  required
                />
              </div>

              {showImageInput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  {showImageInput ? 'Remove' : 'Add Image'}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
