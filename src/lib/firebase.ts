import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, getDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getDatabase, ref, push, onValue, off, set, update, serverTimestamp as rtdbTimestamp, query as rtdbQuery, orderByChild } from 'firebase/database';

// Firebase config — set these in your .env file
// Copy .env.example to .env and fill in your values from Firebase Console
const config = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            as string,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        as string,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         as string,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             as string,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL       as string,
};

const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export const tsToIso = (ts: any): string => {
  if (!ts) return new Date().toISOString();
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
};

const col = (name: string) => collection(db, name);

export const fsAdd = async (colName: string, data: any) => {
  const r = await addDoc(col(colName), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return r.id;
};
export const fsUpdate = async (colName: string, id: string, data: any) =>
  updateDoc(doc(db, colName, id), { ...data, updatedAt: serverTimestamp() });
export const fsDelete = async (colName: string, id: string) =>
  deleteDoc(doc(db, colName, id));
export const fsSet = async (colName: string, id: string, data: any) =>
  setDoc(doc(db, colName, id), data, { merge: true });
export const fsSubscribe = (colName: string, cb: (data: any[]) => void, orderField = 'createdAt') => {
  return onSnapshot(query(col(colName), orderBy(orderField, 'desc')), (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: tsToIso((d.data() as any).createdAt), updatedAt: tsToIso((d.data() as any).updatedAt) })));
  });
};
export const fsSubscribeDoc = (colName: string, id: string, cb: (data: any) => void) => {
  return onSnapshot(doc(db, colName, id), (snap) => {
    if (snap.exists()) cb({ id: snap.id, ...snap.data() });
  });
};

export interface ChatMessage {
  id: string; text?: string; imageUrl?: string;
  sender: 'user' | 'admin'; timestamp: number; read: boolean;
}
export interface ChatSession {
  id: string; userName: string; userEmail: string;
  messages: ChatMessage[]; lastMessageAt: number; unreadCount: number;
}

export const getSessionId = () => {
  let id = localStorage.getItem('sey_chat_id');
  if (!id) { id = 'sess_' + Math.random().toString(36).slice(2) + Date.now(); localStorage.setItem('sey_chat_id', id); }
  return id;
};

export const initSession = async (sessionId: string, name: string, email: string) => {
  await update(ref(rtdb, `chats/${sessionId}`), { userName: name, userEmail: email, createdAt: Date.now(), lastMessageAt: Date.now() });
};

export const sendChatMessage = async (sessionId: string, msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  const ts = Date.now();
  const msgRef = push(ref(rtdb, `chats/${sessionId}/messages`));
  await set(msgRef, { ...msg, timestamp: ts });
  update(ref(rtdb, `chats/${sessionId}`), { lastMessageAt: ts, unreadCount: msg.sender === 'user' ? 1 : 0 }).catch(() => {});
};

export const subscribeToChat = (sessionId: string, cb: (msgs: ChatMessage[]) => void) => {
  const q = rtdbQuery(ref(rtdb, `chats/${sessionId}/messages`), orderByChild('timestamp'));
  onValue(q, snap => { const msgs: ChatMessage[] = []; snap.forEach(c => { msgs.push({ id: c.key!, ...c.val() }); }); cb(msgs); });
  return () => off(q);
};

export const subscribeToAllChats = (cb: (sessions: ChatSession[]) => void) => {
  const chatsRef = ref(rtdb, 'chats');
  onValue(chatsRef, snap => {
    const sessions: ChatSession[] = [];
    snap.forEach(child => {
      const data = child.val();
      const msgs: ChatMessage[] = Object.entries(data.messages || {}).map(([k, v]: any) => ({ id: k, ...v }));
      msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      sessions.push({ id: child.key!, userName: data.userName || 'Guest', userEmail: data.userEmail || '', messages: msgs, lastMessageAt: data.lastMessageAt || 0, unreadCount: data.unreadCount || 0 });
    });
    sessions.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    cb(sessions);
  });
  return () => off(chatsRef);
};

export const markChatRead = (sessionId: string) =>
  update(ref(rtdb, `chats/${sessionId}`), { unreadCount: 0 });
