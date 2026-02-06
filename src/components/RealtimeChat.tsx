import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon, Loader2, Check, CheckCheck } from 'lucide-react';
import {
  getSessionId,
  initializeSession,
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead,
  type ChatMessage,
} from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RealtimeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(getSessionId());

  // Subscribe to messages
  useEffect(() => {
    if (!isRegistered) return;

    const unsubscribe = subscribeToMessages(sessionId.current, (msgs) => {
      setMessages(msgs);
      // Mark messages as read when chat is open
      if (isOpen) {
        markMessagesAsRead(sessionId.current);
      }
    });

    return () => unsubscribe();
  }, [isRegistered, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate admin typing indicator
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    await initializeSession(sessionId.current, userName.trim(), userEmail.trim());
    setIsRegistered(true);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() && !imageUrl) return;

    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      text: newMessage.trim() || undefined,
      imageUrl: imageUrl || undefined,
      sender: 'user',
      read: false,
    };

    await sendMessage(sessionId.current, message);
    setNewMessage('');
    setImageUrl('');
    setShowImageInput(false);
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Count unread messages
  const unreadCount = messages.filter((m) => m.sender === 'admin' && !m.read).length;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && isRegistered) {
            markMessagesAsRead(sessionId.current);
          }
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
          {/* Header - WhatsApp Style */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Sahr E Yaar</h3>
              <p className="text-white/70 text-xs flex items-center gap-1">
                {isTyping ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    typing...
                  </>
                ) : (
                  'Online'
                )}
              </p>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/70 hover:text-white"
            >
              {isMinimized ? '□' : '−'}
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gray-100 p-4 min-h-[300px] max-h-[400px]">
                {!isRegistered ? (
                  <form onSubmit={handleRegister} className="space-y-4 bg-white p-4 rounded-2xl">
                    <div className="text-center mb-4">
                      <h4 className="font-semibold text-gray-900">Start Chat</h4>
                      <p className="text-gray-500 text-sm">Enter your details to begin</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                      Start Chat
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
                      </div>
                    )}
                    {messages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.sender === 'user'
                              ? 'bg-green-500 text-white rounded-br-md'
                              : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                          }`}
                        >
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Shared"
                              className="rounded-lg mb-2 max-w-full"
                            />
                          )}
                          {msg.text && <p className="text-sm">{msg.text}</p>}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                            }`}
                          >
                            <span className="text-xs">{formatTime(msg.timestamp)}</span>
                            {msg.sender === 'user' && (
                              msg.read ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              {isRegistered && (
                <div className="bg-white p-3 border-t">
                  {showImageInput && (
                    <div className="mb-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="text-sm"
                      />
                    </div>
                  )}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-green-500 hover:bg-green-600 rounded-full"
                      disabled={!newMessage.trim() && !imageUrl}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default RealtimeChat;
