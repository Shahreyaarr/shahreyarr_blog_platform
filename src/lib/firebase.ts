// Firebase configuration for real-time chat
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, off, set, update, serverTimestamp, query, orderByChild } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyC-WvOhauJ0uWuqQduULSZIOs3zRiDltfs",
  authDomain: "shahreyarchat.firebaseapp.com",
  databaseURL: "https://shahreyarchat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shahreyarchat",
  storageBucket: "shahreyarchat.firebasestorage.app",
  messagingSenderId: "535731252720",
  appId: "1:535731252720:web:0ff0d5cfc2b8b98cc5c135",
  measurementId: "G-F2GEDKNVL8"
};
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Chat types
export interface ChatMessage {
  id: string;
  text?: string;
  imageUrl?: string;
  sender: 'user' | 'admin';
  timestamp: number;
  read: boolean;
  replyTo?: ChatMessage; // YEH ADD KARO
}

export interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  lastMessageAt: number;
  unreadCount: number;
}

// Generate unique session ID for users
export const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Get or create session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
};

// Send message
export const sendMessage = async (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  const messagesRef = ref(database, `chats/${sessionId}/messages`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
  
  // Update session info
  const sessionRef = ref(database, `chats/${sessionId}`);
  await update(sessionRef, {
    lastMessageAt: serverTimestamp(),
    [`unreadCount`]: message.sender === 'user' ? (await getUnreadCount(sessionId)) + 1 : 0,
  });
};

// Get unread count
const getUnreadCount = async (sessionId: string): Promise<number> => {
  return new Promise((resolve) => {
    const sessionRef = ref(database, `chats/${sessionId}/unreadCount`);
    onValue(sessionRef, (snapshot) => {
      resolve(snapshot.val() || 0);
    }, { onlyOnce: true });
  });
};

// Subscribe to messages
export const subscribeToMessages = (sessionId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = query(ref(database, `chats/${sessionId}/messages`), orderByChild('timestamp'));
  onValue(messagesRef, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key!,
        ...childSnapshot.val(),
      });
    });
    callback(messages);
  });
  return () => off(messagesRef);
};

// Subscribe to all chat sessions (for admin)
export const subscribeToAllSessions = (callback: (sessions: ChatSession[]) => void) => {
  const chatsRef = ref(database, 'chats');
  onValue(chatsRef, (snapshot) => {
    const sessions: ChatSession[] = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      sessions.push({
        id: childSnapshot.key!,
        userName: data.userName || 'Anonymous',
        userEmail: data.userEmail || '',
        messages: data.messages ? Object.values(data.messages) : [],
        lastMessageAt: data.lastMessageAt || 0,
        unreadCount: data.unreadCount || 0,
      });
    });
    // Sort by last message time
    sessions.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    callback(sessions);
  });
  return () => off(chatsRef);
};

// Mark messages as read
export const markMessagesAsRead = async (sessionId: string) => {
  const sessionRef = ref(database, `chats/${sessionId}`);
  await update(sessionRef, { unreadCount: 0 });
};

// Initialize session
export const initializeSession = async (sessionId: string, userName: string, userEmail: string) => {
  const sessionRef = ref(database, `chats/${sessionId}`);
  await set(sessionRef, {
    userName,
    userEmail,
    createdAt: serverTimestamp(),
    unreadCount: 0,
  });
};
