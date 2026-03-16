import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, X, Send, Image as ImgIcon,
  Check, CheckCheck, Smile, Video, Mic, MicOff, Play, Pause
} from 'lucide-react';
import {
  getDatabase, ref, push, set, update, onValue, off,
  query as dbQ, orderByChild
} from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';

const FB_CFG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID as string,
  databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL as string,
};
const fbApp = getApps().length > 0 ? getApps()[0] : initializeApp(FB_CFG);
const rtdb = getDatabase(fbApp);

async function cloudUpload(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET as string);
  fd.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

function playNotif() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
  } catch { /* ignore */ }
}
function vibrate() { if (navigator.vibrate) navigator.vibrate([100, 50, 100]); }

const SID_KEY = '_sey_sid', INFO_KEY = '_sey_info';
function getSid(): string {
  let id = localStorage.getItem(SID_KEY);
  if (!id) { id = 'u' + Date.now() + Math.random().toString(36).slice(2,6); localStorage.setItem(SID_KEY, id); }
  return id;
}
function getInfo(): { name: string; email: string } | null {
  try { return JSON.parse(localStorage.getItem(INFO_KEY) || 'null'); } catch { return null; }
}
function saveInfo(n: string, em: string) { localStorage.setItem(INFO_KEY, JSON.stringify({ name: n, email: em })); }

interface Msg { id: string; type: 'text'|'image'|'audio'|'video_call'; text?: string; url?: string; by: 'u'|'a'; ts: number; read: boolean; }
const EMOJIS = ['😊','😂','🥰','😎','🙏','👍','❤️','🔥','✈️','📸','🌍','🏔️','🎉','💯','👏','🤲','🌙','⭐'];

function VoicePlayer({ url, isMe }: { url: string; isMe: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const [dur, setDur] = useState(0);
  const aRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const a = aRef.current; if (!a) return;
    a.onloadedmetadata = () => setDur(a.duration);
    a.ontimeupdate = () => setProg(a.currentTime / (a.duration || 1) * 100);
    a.onended = () => { setPlaying(false); setProg(0); };
  }, []);
  const toggle = () => { const a = aRef.current; if (!a) return; playing ? (a.pause(), setPlaying(false)) : (a.play(), setPlaying(true)); };
  const fmt = (s: number) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <audio ref={aRef} src={url} preload="metadata" />
      <button onClick={toggle} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe?'bg-white/20':'bg-earth/20'}`}>
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex-1">
        <div className={`h-1 rounded-full ${isMe?'bg-white/20':'bg-sand'}`}>
          <div className={`h-1 rounded-full transition-all ${isMe?'bg-white':'bg-earth'}`} style={{width:`${prog}%`}} />
        </div>
        <p className={`text-[10px] mt-0.5 ${isMe?'text-white/60':'text-muted'}`}>{fmt(dur)}</p>
      </div>
    </div>
  );
}

export default function Chat() {
  const sidRef = useRef(getSid());
  const PATH = `chat/${sidRef.current}`;
  const savedInfo = getInfo();

  const [open,       setOpen]       = useState(false);
  const [registered, setRegistered] = useState(!!savedInfo);
  const [name,       setName]       = useState(savedInfo?.name  || '');
  const [email,      setEmail]      = useState(savedInfo?.email || '');
  const [msgs,       setMsgs]       = useState<Msg[]>([]);
  const [text,       setText]       = useState('');
  const [pendImg,    setPendImg]    = useState('');
  const [emoji,      setEmoji]      = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [unread,     setUnread]     = useState(0);
  const [vcUrl,      setVcUrl]      = useState('');
  const [recording,  setRecording]  = useState(false);
  const [recDur,     setRecDur]     = useState(0);

  const endRef    = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);
  const mrRef     = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval>|null>(null);
  const openRef   = useRef(false);   openRef.current   = open;
  const nameRef   = useRef(name);    nameRef.current   = name;
  const emailRef  = useRef(email);   emailRef.current  = email;
  const prevAdminRef = useRef(0);

  const scrollBottom = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

  /* ── ONE subscription, always active once registered ───────────────── */
  useEffect(() => {
    if (!registered) return;
    const q = dbQ(ref(rtdb, `${PATH}/msgs`), orderByChild('ts'));
    const handler = (snap: any) => {
      const list: Msg[] = [];
      snap.forEach((c: any) => { const v = c.val(); if (v && typeof v.ts === 'number') list.push({ id: c.key!, ...v }); });
      list.sort((a, b) => a.ts - b.ts);
      setMsgs(list);
      const adminMsgs = list.filter(m => m.by === 'a');
      if (openRef.current) {
        adminMsgs.filter(m => !m.read).forEach(m => {
          update(ref(rtdb, `${PATH}/msgs/${m.id}`), { read: true }).catch(() => {});
        });
        update(ref(rtdb, PATH), { unread: 0 }).catch(() => {});
        setUnread(0);
        scrollBottom();
      } else {
        if (adminMsgs.length > prevAdminRef.current) { playNotif(); vibrate(); }
        prevAdminRef.current = adminMsgs.length;
        setUnread(adminMsgs.filter(m => !m.read).length);
      }
      const last = list[list.length - 1];
      if (last?.by === 'a' && last?.type === 'video_call' && last?.url) setVcUrl(last.url);
    };
    onValue(q, handler);
    return () => off(q, handler);
  }, [registered]);

  useEffect(() => {
    if (open && registered) {
      update(ref(rtdb, PATH), { unread: 0 }).catch(() => {});
      setUnread(0); scrollBottom();
    }
  }, [open]);

  async function register(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim(), em = email.trim();
    if (!n || !em) return;
    setRegLoading(true);
    try {
      await update(ref(rtdb, PATH), { name: n, email: em, unread: 0, lastTs: Date.now(), createdAt: Date.now() });
      saveInfo(n, em);
      setRegistered(true);
    } catch { alert('Connection error. Please check your internet.'); }
    setRegLoading(false);
  }

  async function pushMsg(payload: Omit<Msg,'id'>) {
    try {
      const r = push(ref(rtdb, `${PATH}/msgs`));
      await set(r, payload);
      const preview = payload.type === 'text' ? (payload.text || '') : `[${payload.type}]`;
      update(ref(rtdb, PATH), { lastMsg: preview, lastTs: payload.ts, unread: 1, name: nameRef.current, email: emailRef.current }).catch(() => {});
      scrollBottom();
    } catch { alert('Failed to send. Please try again.'); }
  }

  async function sendMsg(e?: React.FormEvent) {
    e?.preventDefault();
    const t = text.trim(), img = pendImg;
    if (!t && !img) return;
    setText(''); setPendImg(''); setEmoji(false);
    const ts = Date.now();
    if (img) await pushMsg({ type: 'image', url: img, by: 'u', ts, read: false });
    if (t)   await pushMsg({ type: 'text', text: t, by: 'u', ts: img ? ts+1 : ts, read: false });
  }

  async function handleImg(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 15*1024*1024) { alert('Max 15 MB'); return; }
    setUploading(true);
    try { const url = await cloudUpload(f, 'sahr_chat'); setPendImg(url); }
    catch { alert('Image upload failed.'); }
    setUploading(false); e.target.value = '';
  }

  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = ev => chunksRef.current.push(ev.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 500) return;
        setUploading(true);
        try {
          const url = await cloudUpload(new File([blob], `v${Date.now()}.webm`, { type: 'audio/webm' }), 'sahr_voice');
          await pushMsg({ type: 'audio', url, by: 'u', ts: Date.now(), read: false });
        } catch { alert('Voice upload failed.'); }
        setUploading(false); setRecDur(0);
      };
      mr.start(); mrRef.current = mr; setRecording(true);
      timerRef.current = setInterval(() => setRecDur(p => p+1), 1000);
    } catch { alert('Microphone access denied.'); }
  }
  function stopRec() { mrRef.current?.stop(); setRecording(false); if (timerRef.current) clearInterval(timerRef.current); }
  function cancelRec() {
    if (mrRef.current && mrRef.current.state !== 'inactive') { mrRef.current.ondataavailable=null; mrRef.current.onstop=null; mrRef.current.stop(); }
    setRecording(false); if (timerRef.current) clearInterval(timerRef.current); setRecDur(0);
  }

  async function startVC() {
    const url = `https://meet.jit.si/sahr-${sidRef.current.slice(-8)}-${Date.now()}`;
    await pushMsg({ type: 'video_call', url, by: 'u', ts: Date.now(), read: false });
    window.open(url, '_blank');
  }

  const fmtTime = (ts: number) => ts ? new Date(ts).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) : '';
  const fmtDate = (ts: number) => {
    if (!ts) return 'Today';
    const d=new Date(ts), now=new Date(), yest=new Date(now); yest.setDate(now.getDate()-1);
    return d.toDateString()===now.toDateString()?'Today':d.toDateString()===yest.toDateString()?'Yesterday':d.toLocaleDateString('en-US',{day:'numeric',month:'short'});
  };
  const fmtRec = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const groups: Record<string,Msg[]> = {};
  msgs.forEach(m => { const k=fmtDate(m.ts); (groups[k]??=[]).push(m); });

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
      <button onClick={()=>setOpen(p=>!p)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${open?'bg-charcoal rotate-90 scale-90':'bg-earth hover:bg-earth/90 hover:scale-105'}`}
        style={{boxShadow:open?'':'0 8px 24px rgba(139,111,71,0.4)'}}>
        {open ? <X className="w-6 h-6 text-white" /> : (
          <>{<MessageCircle className="w-6 h-6 text-white" />}
          {unread>0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">{unread>9?'9+':unread}</span>}</>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{width:370,maxWidth:'calc(100vw - 1.5rem)',height:580,boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}}>

          <div className="bg-cream border-b border-sand px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-earth flex items-center justify-center text-white font-bold text-lg">S</div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-cream" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal text-sm">Sahr E Yaar</p>
              <p className="text-xs text-muted">Online · Usually replies quickly</p>
            </div>
            {registered && <button onClick={startVC} className="p-2 rounded-lg hover:bg-sand/50 text-earth" title="Video call"><Video className="w-4 h-4" /></button>}
            <button onClick={()=>setOpen(false)} className="p-1.5 rounded-lg hover:bg-sand/50 text-muted"><X className="w-4 h-4" /></button>
          </div>

          {vcUrl && (
            <div className="bg-earth/5 border-b border-earth/20 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
              <Video className="w-4 h-4 text-earth animate-pulse" />
              <p className="text-xs font-medium text-charcoal flex-1">Admin is calling you!</p>
              <button onClick={()=>{window.open(vcUrl,'_blank');setVcUrl('');}} className="px-3 py-1.5 rounded-full bg-earth text-white text-xs font-medium">Join</button>
              <button onClick={()=>setVcUrl('')}><X className="w-3.5 h-3.5 text-muted" /></button>
            </div>
          )}

          {!registered ? (
            <div className="flex-1 overflow-y-auto p-5 bg-cream/40">
              <div className="text-center mb-6 pt-2">
                <div className="w-14 h-14 rounded-full bg-earth/10 flex items-center justify-center mx-auto mb-3"><MessageCircle className="w-7 h-7 text-earth" /></div>
                <h3 className="font-display text-xl text-charcoal">Start a Conversation</h3>
                <p className="text-sm text-muted mt-1">Enter your details to chat</p>
              </div>
              <form onSubmit={register} className="space-y-3">
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Your Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name" required className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white focus:outline-none focus:border-earth text-sm" /></div>
                <div><label className="block text-xs font-medium text-charcoal/60 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-4 py-2.5 rounded-xl border border-sand bg-white focus:outline-none focus:border-earth text-sm" /></div>
                <button type="submit" disabled={regLoading} className="w-full py-3 rounded-xl bg-earth text-white font-medium text-sm hover:bg-earth/90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                  {regLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><MessageCircle className="w-4 h-4" /> Start Chat</>}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-3 py-2" style={{background:'#FAFAF8'}}>
                {msgs.length===0 && <div className="text-center py-10"><p className="text-sm text-muted">Hi {name}! 👋</p><p className="text-xs text-muted/60 mt-1">Send a message to start</p></div>}
                {Object.entries(groups).map(([date,list])=>(
                  <div key={date}>
                    <div className="flex justify-center my-3"><span className="px-3 py-1 rounded-full bg-sand/60 text-muted text-xs">{date}</span></div>
                    {list.map((m,i)=>{
                      const isMe=m.by==='u';
                      return (
                        <div key={m.id||i} className={`flex ${isMe?'justify-end':'justify-start'} mb-1.5`}>
                          {!isMe && <div className="w-7 h-7 rounded-full bg-earth flex items-center justify-center text-white text-xs font-bold mr-1.5 mt-1 flex-shrink-0">S</div>}
                          <div className={`max-w-[76%] rounded-2xl px-3.5 py-2.5 shadow-sm ${isMe?'bg-earth text-white rounded-br-sm':'bg-white text-charcoal rounded-bl-sm border border-sand/50'}`}>
                            {m.type==='image'&&m.url && <img src={m.url} alt="img" className="rounded-xl mb-2 max-w-full max-h-48 object-cover cursor-pointer w-full" onClick={()=>window.open(m.url,'_blank')} onError={e=>{(e.target as HTMLImageElement).style.display='none';}} />}
                            {m.type==='audio'&&m.url && <VoicePlayer url={m.url} isMe={isMe} />}
                            {m.type==='video_call'&&m.url && (
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe?'bg-white/20':'bg-earth/10'}`}><Video className="w-4 h-4" /></div>
                                <div><p className="text-xs font-medium">Video Call</p><button onClick={()=>window.open(m.url,'_blank')} className="text-[11px] underline opacity-70">Join →</button></div>
                              </div>
                            )}
                            {m.type==='text'&&m.text && <p className="text-sm leading-relaxed break-words">{m.text}</p>}
                            <div className={`flex items-center justify-end gap-0.5 mt-1 ${isMe?'text-white/50':'text-muted'}`}>
                              <span className="text-[10px]">{fmtTime(m.ts)}</span>
                              {isMe&&(m.read?<CheckCheck className="w-3.5 h-3.5 text-blue-300"/>:<Check className="w-3.5 h-3.5 text-white/60"/>)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {(pendImg||uploading) && (
                <div className="px-3 py-2 bg-white border-t border-sand/50 flex items-center gap-2 flex-shrink-0">
                  {uploading ? <><div className="w-4 h-4 border-2 border-earth/30 border-t-earth rounded-full animate-spin" /><span className="text-xs text-muted">Uploading…</span></>
                  : <><img src={pendImg} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" /><span className="text-xs text-muted flex-1">Ready to send</span><button onClick={()=>setPendImg('')}><X className="w-4 h-4 text-muted" /></button></>}
                </div>
              )}

              {recording && (
                <div className="px-3 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  <span className="text-xs text-red-600 font-medium flex-1">Recording… {fmtRec(recDur)}</span>
                  <button onClick={stopRec} className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium">Send</button>
                  <button onClick={cancelRec}><X className="w-4 h-4 text-red-400" /></button>
                </div>
              )}

              {emoji && (
                <div className="px-3 pt-2 bg-white border-t border-sand/50 flex-shrink-0">
                  <div className="flex flex-wrap gap-1 bg-cream p-2 rounded-xl max-h-20 overflow-y-auto">
                    {EMOJIS.map(em=><button key={em} onClick={()=>{setText(p=>p+em);setEmoji(false);}} className="text-xl hover:bg-sand rounded-lg p-1">{em}</button>)}
                  </div>
                </div>
              )}

              <div className="bg-white border-t border-sand/50 px-3 py-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button onClick={()=>setEmoji(p=>!p)} className={`p-2 rounded-full transition-colors ${emoji?'text-earth bg-earth/10':'text-muted hover:text-charcoal hover:bg-cream'}`}><Smile className="w-5 h-5" /></button>
                  <button onClick={()=>fileRef.current?.click()} disabled={uploading} className={`p-2 rounded-full transition-colors ${pendImg?'text-earth bg-earth/10':'text-muted hover:text-charcoal hover:bg-cream'}`}><ImgIcon className="w-5 h-5" /></button>
                  <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message…"
                    className="flex-1 px-4 py-2.5 rounded-full bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-earth/20"
                    onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}} />
                  {(text.trim()||pendImg)
                    ? <button onClick={()=>sendMsg()} disabled={uploading} className="w-9 h-9 rounded-full bg-earth flex items-center justify-center disabled:opacity-40 hover:bg-earth/90 flex-shrink-0 shadow-sm"><Send className="w-4 h-4 text-white" /></button>
                    : <button onMouseDown={startRec} onMouseUp={stopRec} onTouchStart={startRec} onTouchEnd={stopRec} disabled={uploading}
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-all ${recording?'bg-red-500 scale-110':'bg-earth hover:bg-earth/90'} disabled:opacity-40`}>
                        {recording?<MicOff className="w-4 h-4 text-white"/>:<Mic className="w-4 h-4 text-white"/>}
                      </button>
                  }
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
