import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon, Loader2, Check, CheckCheck, Smile } from 'lucide-react';
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

const Chatbot = () => {
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    if (!isRegistered) return;
    const unsubscribe = subscribeToMessages(sessionId.current, (msgs) => {
      setMessages(msgs);
      if (isOpen) markMessagesAsRead(sessionId.current);
    });
    return () => unsubscribe();
  }, [isRegistered, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    
    try {
      await initializeSession(sessionId.current, userName.trim(), userEmail.trim());
      setIsRegistered(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() && !imageUrl) return;
    
    try {
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
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '👏'];
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
            ? 'bg-red-500 hover:bg-red-600 rotate-90'
            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Sahr E Yaar</h3>
              <p className="text-white/80 text-xs flex items-center gap-1">
                {isTyping ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    typing...
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </>
                )}
              </p>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isMinimized ? '□' : '−'}
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4 min-h-[300px] max-h-[400px]">
                {!isRegistered ? (
                  <form onSubmit={handleRegister} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Start Chat</h4>
                      <p className="text-gray-500 text-sm">Enter your details to begin</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name"
                        className="mt-1 rounded-xl"
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
                        className="mt-1 rounded-xl"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 rounded-xl py-6"
                    >
                      Start Chat
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
                      </div>
                    )}
                    {messages.map((msg, index) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[85%]">
                            <div className={`rounded-2xl px-4 py-2.5 ${
                              isUser
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                            }`}>
                              {msg.imageUrl && (
                                <img
                                  src={msg.imageUrl}
                                  alt="Shared"
                                  className="rounded-lg mb-2 max-w-full"
                                />
                              )}
                              {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                              
                              <div className={`flex items-center justify-end gap-1 mt-1.5 ${
                                isUser ? 'text-white/70' : 'text-gray-400'
                              }`}>
                                <span className="text-[10px]">{formatTime(msg.timestamp)}</span>
                                {isUser && (
                                  msg.read ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
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
                <div className="bg-white p-3 border-t border-gray-100">
                  {showImageInput && (
                    <div className="mb-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="text-sm rounded-xl"
                      />
                    </div>
                  )}

                  {showEmojiPicker && (
                    <div className="mb-2 flex gap-2 flex-wrap bg-gray-50 p-2 rounded-xl">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setNewMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-xl hover:bg-gray-200 rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 rounded-full w-10 h-10"
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

export default Chatbot;
