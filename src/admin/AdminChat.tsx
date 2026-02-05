import { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, Check, CheckCheck, Search, User, MessageCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import {
  subscribeToAllSessions,
  sendMessage,
  markMessagesAsRead,
  type ChatSession,
  type ChatMessage,
} from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const AdminChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to all sessions
  useEffect(() => {
    const unsubscribe = subscribeToAllSessions((data) => {
      setSessions(data);
    });
    return () => unsubscribe();
  }, []);

  // Update messages when session changes
  useEffect(() => {
    if (selectedSession) {
      setMessages(selectedSession.messages);
      markMessagesAsRead(selectedSession.id);
    }
  }, [selectedSession]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedSession || (!newMessage.trim() && !imageUrl)) return;

    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      text: newMessage.trim() || undefined,
      imageUrl: imageUrl || undefined,
      sender: 'admin',
      read: true,
    };

    await sendMessage(selectedSession.id, message);
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

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = sessions.reduce((acc, s) => acc + (s.unreadCount || 0), 0);

  return (
    <AdminLayout title="Live Chat Inbox">
      <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Sidebar - Session List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Conversations</h3>
              {totalUnread > 0 && (
                <Badge variant="destructive" className="rounded-full">
                  {totalUnread} new
                </Badge>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b ${
                    selectedSession?.id === session.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                  }`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {session.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{session.userName}</h4>
                      <span className="text-xs text-gray-400">
                        {formatTime(session.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{session.userEmail}</p>
                    {session.unreadCount > 0 && (
                      <Badge variant="destructive" className="mt-1 rounded-full text-xs">
                        {session.unreadCount} new
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-green-500 text-white">
                    {selectedSession.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedSession.userName}</h4>
                  <p className="text-sm text-gray-500">{selectedSession.userEmail}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                <div className="text-center mb-4">
                  <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                    {formatDate(selectedSession.lastMessageAt)}
                  </span>
                </div>

                <div className="space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'admin'
                            ? 'bg-green-500 text-white rounded-br-md'
                            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        }`}
                      >
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="Shared"
                            className="rounded-lg mb-2 max-w-full max-h-48 object-cover"
                          />
                        )}
                        {msg.text && <p className="text-sm">{msg.text}</p>}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            msg.sender === 'admin' ? 'text-white/70' : 'text-gray-400'
                          }`}
                        >
                          <span className="text-xs">{formatTime(msg.timestamp)}</span>
                          {msg.sender === 'admin' && (
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
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t">
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
                    className="bg-green-500 hover:bg-green-600"
                    disabled={!newMessage.trim() && !imageUrl}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
