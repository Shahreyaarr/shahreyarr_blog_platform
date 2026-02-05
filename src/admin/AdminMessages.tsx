import { useState } from 'react';
import { useMessageStore } from '@/store';
import AdminLayout from './AdminLayout';
import { Trash2, Reply, Mail, MailOpen, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const AdminMessages = () => {
  const { messages, markAsRead, replyToMessage, deleteMessage } = useMessageStore();
  const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (selectedMessage && replyText.trim()) {
      replyToMessage(selectedMessage.id, replyText.trim());
      setReplyText('');
      setSelectedMessage(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this message?')) deleteMessage(id);
  };

  return (
    <AdminLayout title="Messages">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet</p>
          </CardContent></Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className={!msg.is_read ? 'border-blue-500 border-2' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                    {msg.is_read ? <MailOpen className="w-5 h-5 text-gray-500" /> : <Mail className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{msg.name}</h3>
                        <p className="text-sm text-gray-500">{msg.email}</p>
                      </div>
                      <span className="text-sm text-gray-400">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{msg.message}</p>
                    {msg.image_url && (
                      <div className="mt-3">
                        <a href={msg.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 text-sm">
                          <ImageIcon className="w-4 h-4" />View Attached Image
                        </a>
                      </div>
                    )}
                    {msg.reply && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700"><span className="font-medium">Your reply:</span> {msg.reply}</p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      {!msg.is_read && (
                        <Button variant="outline" size="sm" onClick={() => markAsRead(msg.id)}>
                          <MailOpen className="w-4 h-4 mr-2" />Mark as Read
                        </Button>
                      )}
                      {!msg.reply && (
                        <Button variant="outline" size="sm" onClick={() => { setSelectedMessage(msg); markAsRead(msg.id); }}>
                          <Reply className="w-4 h-4 mr-2" />Reply
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(msg.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to {selectedMessage?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{selectedMessage?.message}</p>
            </div>
            <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your reply..." rows={4} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedMessage(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleReply}>Send Reply</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMessages;
