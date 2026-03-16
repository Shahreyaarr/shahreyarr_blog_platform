import { useState } from 'react';
import { Mail, Trash2, Check, Reply, X } from 'lucide-react';
import { useMessageStore } from '@/store';

export default function AdminMessages() {
  const { messages, markRead, replyMessage, deleteMessage, getUnread } = useMessageStore();
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState('');

  const handleReply = async () => {
    if (!selected || !reply.trim()) return;
    await replyMessage(selected.id, reply);
    await markRead(selected.id);
    setReply('');
    setSelected(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-3xl text-charcoal">Messages</h1>
        <p className="text-muted text-sm mt-1">{getUnread()} unread · {messages.length} total</p></div>
      </div>

      <div className="space-y-2">
        {messages.length === 0 ? <div className="text-center py-16 bg-white rounded-xl"><Mail className="w-10 h-10 text-muted mx-auto mb-3 opacity-40" /><p className="text-muted">No messages yet</p></div>
        : messages.map(msg => (
          <div key={msg.id} onClick={async () => { setSelected(msg); if (!msg.isRead) await markRead(msg.id); }}
            className={`bg-white rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow ${!msg.isRead ? 'ring-1 ring-earth/30' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center text-charcoal font-medium text-sm flex-shrink-0">{msg.name.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-charcoal text-sm">{msg.name}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-xs text-muted">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  {!msg.isRead && <div className="w-2 h-2 rounded-full bg-earth" />}
                </div>
              </div>
              <p className="text-xs text-muted">{msg.email}</p>
              {msg.subject && <p className="text-xs text-charcoal/70 font-medium mt-0.5">{msg.subject}</p>}
              <p className="text-xs text-muted mt-1 line-clamp-2">{msg.message}</p>
              {msg.reply && <p className="text-xs text-earth mt-1 flex items-center gap-1"><Reply className="w-3 h-3" /> Replied</p>}
            </div>
            <button onClick={e => { e.stopPropagation(); if (confirm('Delete?')) deleteMessage(msg.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-charcoal">Message from {selected.name}</h2>
              <button onClick={() => { setSelected(null); setReply(''); }}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-6">
              <div className="bg-cream rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center font-medium">{selected.name.charAt(0)}</div>
                  <div><p className="font-medium text-charcoal text-sm">{selected.name}</p><p className="text-xs text-muted">{selected.email}</p></div>
                  <p className="text-xs text-muted ml-auto">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                {selected.subject && <p className="text-sm font-medium text-charcoal mb-2">{selected.subject}</p>}
                <p className="text-sm text-charcoal/80 leading-relaxed">{selected.message}</p>
              </div>
              {selected.reply && (
                <div className="bg-earth/5 rounded-xl p-4 mb-5 border border-earth/20">
                  <p className="text-xs text-earth font-medium mb-2 flex items-center gap-1"><Reply className="w-3 h-3" />Your Reply</p>
                  <p className="text-sm text-charcoal/80">{selected.reply}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-2">Reply</label>
                <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4} placeholder="Type your reply..."
                  className="w-full px-4 py-3 rounded-xl border border-sand focus:outline-none focus:border-earth text-sm resize-none" />
                <div className="flex gap-3 mt-3">
                  <button onClick={() => { setSelected(null); setReply(''); }} className="flex-1 py-2.5 rounded-xl border border-sand text-charcoal/70 text-sm hover:bg-cream transition-colors">Close</button>
                  <button onClick={handleReply} className="flex-1 py-2.5 rounded-xl bg-earth text-white text-sm hover:bg-earth/90 transition-colors">Send Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
