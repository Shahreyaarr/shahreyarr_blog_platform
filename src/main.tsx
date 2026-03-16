import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { useFirestoreSync } from '@/store';

const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  useFirestoreSync();
  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SyncProvider>
      <App />
    </SyncProvider>
  </StrictMode>
);
