import { useState, useEffect, useRef } from 'react';
import { Send, Image as ImgIcon, Check, CheckCheck, Search, MessageCircle, X, Video, Mic, MicOff, Play, Pause } from 'lucide-react';
import { getDatabase, ref, push, set, update, onValue, off, query as dbQ, orderByChild } from 'firebase/database';
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

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file); fd.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET as string); fd.append('folder','sahr_admin');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/upload`,{method:'POST',body:fd});
  if(!res.ok) throw new Error('failed');
  return (await res.json()).secure_url;
}

let adminPageLoaded = false;
setTimeout(() => { adminPageLoaded = true; }, 3000); // Wait 3s after load before enabling sound
function playNotif() {
  if (!adminPageLoaded) return; // Skip sound on initial page load
  try {
    const ctx = new (window.AudioContext||(window as any).webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type='sine';
    osc.frequency.setValueAtTime(660,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.1);
    gain.gain.setValueAtTime(0.3,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.4);
  } catch { /* ignore */ }
}

interface Msg { id:string; type:'text'|'image'|'audio'|'video_call'; text?:string; url?:string; by:'u'|'a'; ts:number; read:boolean; }
interface Session { id:string; name:string; email:string; lastMsg:string; lastTs:number; unread:number; }

function VoicePlayer({url,isMe}:{url:string;isMe:boolean}) {
  const [playing,setPlaying]=useState(false);
  const [prog,setProg]=useState(0);
  const [dur,setDur]=useState(0);
  const aRef=useRef<HTMLAudioElement>(null);
  useEffect(()=>{
    const a=aRef.current; if(!a) return;
    a.onloadedmetadata=()=>setDur(a.duration);
    a.ontimeupdate=()=>setProg(a.currentTime/(a.duration||1)*100);
    a.onended=()=>{setPlaying(false);setProg(0);};
  },[]);
  const toggle=()=>{const a=aRef.current;if(!a)return;playing?(a.pause(),setPlaying(false)):(a.play(),setPlaying(true));};
  const fmtT=(s:number)=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  return(
    <div className="flex items-center gap-2 min-w-[140px]">
      <audio ref={aRef} src={url} preload="metadata"/>
      <button onClick={toggle} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe?'bg-white/20':'bg-earth/20'}`}>
        {playing?<Pause className="w-3.5 h-3.5"/>:<Play className="w-3.5 h-3.5 ml-0.5"/>}
      </button>
      <div className="flex-1">
        <div className={`h-1 rounded-full ${isMe?'bg-white/20':'bg-sand'}`}>
          <div className={`h-1 rounded-full transition-all ${isMe?'bg-white':'bg-earth'}`} style={{width:`${prog}%`}}/>
        </div>
        <p className={`text-[10px] mt-0.5 ${isMe?'text-white/60':'text-muted'}`}>{fmtT(dur)}</p>
      </div>
    </div>
  );
}

export default function AdminChat() {
  const [sessions,setSessions] = useState<Session[]>([]);
  const [selId,setSelId]       = useState<string|null>(null);
  const [msgs,setMsgs]         = useState<Msg[]>([]);
  const [text,setText]         = useState('');
  const [pendImg,setPendImg]   = useState('');
  const [uploading,setUploading] = useState(false);
  const [search,setSearch]     = useState('');
  const [recording,setRecording] = useState(false);
  const [recDur,setRecDur]     = useState(0);

  const endRef    = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);
  const msgsUnsub = useRef<(()=>void)|null>(null);
  const mrRef     = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval>|null>(null);
  const selIdRef  = useRef<string|null>(null); selIdRef.current = selId;

  /* track previous user msg count per session for notification sound */
  const prevUserMsgsRef = useRef<Record<string,number>>({});

  /* ── ALL SESSIONS subscription ──────────────────────────────────────── */
  useEffect(() => {
    const r = ref(rtdb, 'chat');
    const handler = (snap: any) => {
      const list: Session[] = [];
      let hasNewMsg = false;

      snap.forEach((child: any) => {
        const d = child.val() || {};
        const sid = child.key!;
        /* count user messages in this session */
        const msgData = d.msgs || {};
        const userMsgCount = Object.values(msgData).filter((m: any) => m.by === 'u').length;
        const prevCount = prevUserMsgsRef.current[sid] || 0;
        if (userMsgCount > prevCount && selIdRef.current !== sid) hasNewMsg = true;
        prevUserMsgsRef.current[sid] = userMsgCount;

        list.push({
          id: sid,
          name: d.name || d.info?.name || 'Guest',
          email: d.email || d.info?.email || '',
          lastMsg: d.lastMsg || '',
          lastTs: d.lastTs || 0,
          unread: d.unread || 0,
        });
      });

      list.sort((a,b) => b.lastTs - a.lastTs);
      setSessions(list);
      if (hasNewMsg) playNotif();
    };
    onValue(r, handler);
    return () => off(r, handler);
  }, []);

  /* ── SELECTED SESSION messages ──────────────────────────────────────── */
  useEffect(() => {
    /* cleanup previous subscription */
    if (msgsUnsub.current) { msgsUnsub.current(); msgsUnsub.current = null; }
    if (!selId) { setMsgs([]); return; }

    setMsgs([]);
    /* mark as read */
    update(ref(rtdb, `chat/${selId}`), { unread: 0 }).catch(() => {});

    const q = dbQ(ref(rtdb, `chat/${selId}/msgs`), orderByChild('ts'));
    const handler = (snap: any) => {
      const list: Msg[] = [];
      snap.forEach((c: any) => {
        const v = c.val();
        if (v && typeof v.ts === 'number') list.push({ id: c.key!, ...v });
      });
      list.sort((a,b) => a.ts - b.ts);
      setMsgs(list);
      /* auto mark user messages as read */
      list.filter(m => m.by==='u' && !m.read).forEach(m => {
        update(ref(rtdb, `chat/${selId}/msgs/${m.id}`), { read: true }).catch(() => {});
      });
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    };
    onValue(q, handler);
    msgsUnsub.current = () => off(q, handler);
    return () => { if (msgsUnsub.current) { msgsUnsub.current(); msgsUnsub.current = null; } };
  }, [selId]);

  /* ── PUSH admin message ─────────────────────────────────────────────── */
  async function pushMsg(payload: Omit<Msg,'id'>) {
    if (!selId) return;
    try {
      const r = push(ref(rtdb, `chat/${selId}/msgs`));
      await set(r, payload);
      const preview = payload.type==='text' ? (payload.text||'') : `[${payload.type}]`;
      update(ref(rtdb, `chat/${selId}`), { lastMsg: preview, lastTs: payload.ts, unread: 0 }).catch(() => {});
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    } catch { alert('Failed to send reply.'); }
  }

  async function sendText() {
    const t=text.trim(), img=pendImg;
    if(!t&&!img) return;
    setText(''); setPendImg('');
    const ts=Date.now();
    if(img) await pushMsg({type:'image',url:img,by:'a',ts,read:false});
    if(t)   await pushMsg({type:'text',text:t,by:'a',ts:img?ts+1:ts,read:false});
  }

  async function handleImg(e: React.ChangeEvent<HTMLInputElement>) {
    const f=e.target.files?.[0]; if(!f||!selId) return;
    setUploading(true);
    try{const url=await uploadFile(f);setPendImg(url);}
    catch{alert('Upload failed');}
    setUploading(false); e.target.value='';
  }

  async function startRec() {
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(stream,{mimeType:'audio/webm'});
      chunksRef.current=[];
      mr.ondataavailable=e=>chunksRef.current.push(e.data);
      mr.onstop=async()=>{
        stream.getTracks().forEach(t=>t.stop());
        const blob=new Blob(chunksRef.current,{type:'audio/webm'});
        if(blob.size<500||!selId) return;
        setUploading(true);
        try{
          const url=await uploadFile(new File([blob],`v${Date.now()}.webm`,{type:'audio/webm'}));
          await pushMsg({type:'audio',url,by:'a',ts:Date.now(),read:false});
        }catch{alert('Voice failed');}
        setUploading(false); setRecDur(0);
      };
      mr.start(); mrRef.current=mr; setRecording(true);
      timerRef.current=setInterval(()=>setRecDur(p=>p+1),1000);
    } catch{alert('Mic denied');}
  }
  function stopRec(){mrRef.current?.stop();setRecording(false);if(timerRef.current)clearInterval(timerRef.current);}
  function cancelRec(){mrRef.current?.stop();setRecording(false);if(timerRef.current)clearInterval(timerRef.current);setRecDur(0);chunksRef.current=[];}

  async function startVC() {
    if(!selId) return;
    const url=`https://meet.jit.si/sahr-admin-${selId.slice(-6)}-${Date.now()}`;
    await pushMsg({type:'video_call',url,by:'a',ts:Date.now(),read:false});
    window.open(url,'_blank');
  }

  const fmtTime=(ts:number)=>ts?new Date(ts).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}):'';
  const fmtDate=(ts:number)=>{
    if(!ts) return 'Today';
    const d=new Date(ts),now=new Date(),yest=new Date(now); yest.setDate(now.getDate()-1);
    return d.toDateString()===now.toDateString()?'Today':d.toDateString()===yest.toDateString()?'Yesterday':d.toLocaleDateString('en-US',{day:'numeric',month:'short'});
  };
  const fmtRec=(s:number)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const groups:Record<string,Msg[]>={};
  msgs.forEach(m=>{const k=fmtDate(m.ts);(groups[k]??=[]).push(m);});
  const filtered=sessions.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.email.toLowerCase().includes(search.toLowerCase()));
  const sel=sessions.find(s=>s.id===selId);
  const totalUnread=sessions.reduce((a,s)=>a+(s.unread||0),0);

  return(
    <div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg}/>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-charcoal">Live Chat</h1>
        <p className="text-muted text-sm mt-1">{sessions.length} conversations{totalUnread>0?` · ${totalUnread} unread`:''}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{height:'calc(100vh - 220px)',minHeight:500}}>
        <div className="flex h-full">

          {/* Sidebar */}
          <div className="w-64 border-r border-sand/50 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-sand/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="w-full pl-9 pr-3 py-2 rounded-lg bg-cream text-sm focus:outline-none"/>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length===0
                ? <div className="p-6 text-center"><MessageCircle className="w-8 h-8 text-muted/40 mx-auto mb-2"/><p className="text-xs text-muted">No conversations</p></div>
                : filtered.map(s=>(
                  <button key={s.id} onClick={()=>setSelId(s.id)}
                    className={`w-full p-3 text-left flex items-center gap-3 hover:bg-cream border-b border-sand/30 ${selId===s.id?'bg-earth/5 border-l-2 border-l-earth':''}`}>
                    <div className="w-9 h-9 rounded-full bg-earth/10 flex items-center justify-center text-earth font-bold text-sm flex-shrink-0">{s.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-charcoal text-xs truncate">{s.name}</p>
                        <p className="text-[10px] text-muted">{fmtTime(s.lastTs)}</p>
                      </div>
                      <p className="text-[11px] text-muted truncate">{s.lastMsg||s.email}</p>
                      {s.unread>0&&<span className="inline-block px-1.5 py-0.5 rounded-full bg-earth text-white text-[10px] mt-0.5">{s.unread} new</span>}
                    </div>
                  </button>
                ))
              }
            </div>
          </div>

          {/* Chat panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {sel ? (
              <>
                <div className="px-5 py-3 border-b border-sand/50 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-earth/10 flex items-center justify-center text-earth font-bold text-sm">{sel.name.charAt(0).toUpperCase()}</div>
                    <div><p className="font-medium text-charcoal text-sm">{sel.name}</p><p className="text-xs text-muted">{sel.email}</p></div>
                  </div>
                  <button onClick={startVC} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium">
                    <Video className="w-3.5 h-3.5"/> Video Call
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4" style={{background:'#FAFAF8'}}>
                  {msgs.length===0&&<div className="text-center py-10"><p className="text-sm text-muted">No messages yet</p></div>}
                  {Object.entries(groups).map(([date,list])=>(
                    <div key={date}>
                      <div className="flex justify-center my-3"><span className="px-3 py-1 rounded-full bg-white/80 text-charcoal/50 text-xs shadow-sm">{date}</span></div>
                      {list.map((m,i)=>(
                        <div key={m.id||i} className={`flex ${m.by==='a'?'justify-end':'justify-start'} mb-1.5`}>
                          {m.by==='u'&&<div className="w-6 h-6 rounded-full bg-earth/20 flex items-center justify-center text-earth text-xs font-bold mr-1.5 mt-1 flex-shrink-0">{sel.name.charAt(0).toUpperCase()}</div>}
                          <div className={`max-w-[70%] rounded-2xl px-3 py-2 shadow-sm ${m.by==='a'?'bg-earth text-white rounded-br-sm':'bg-white text-charcoal rounded-bl-sm border border-sand/50'}`}>
                            {m.type==='image'&&m.url&&<img src={m.url} alt="img" className="rounded-xl mb-1.5 max-w-full max-h-40 object-cover cursor-pointer" onClick={()=>window.open(m.url,'_blank')} onError={e=>{(e.target as HTMLImageElement).style.display='none';}}/>}
                            {m.type==='audio'&&m.url&&<VoicePlayer url={m.url} isMe={m.by==='a'}/>}
                            {m.type==='video_call'&&m.url&&(
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.by==='a'?'bg-white/20':'bg-earth/10'}`}><Video className="w-3.5 h-3.5"/></div>
                                <div><p className="text-xs font-medium">Video Call</p><button onClick={()=>window.open(m.url,'_blank')} className="text-[11px] underline opacity-70">Join</button></div>
                              </div>
                            )}
                            {m.type==='text'&&m.text&&<p className="text-sm leading-relaxed break-words">{m.text}</p>}
                            <div className={`flex items-center justify-end gap-0.5 mt-0.5 ${m.by==='a'?'text-white/50':'text-muted'}`}>
                              <span className="text-[10px]">{fmtTime(m.ts)}</span>
                              {m.by==='a'&&(m.read?<CheckCheck className="w-3 h-3 text-blue-300"/>:<Check className="w-3 h-3"/>)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={endRef}/>
                </div>

                {(pendImg||uploading)&&(
                  <div className="px-4 py-2 border-t border-sand/50 flex items-center gap-2 bg-cream/50 flex-shrink-0">
                    {uploading?<><div className="w-4 h-4 border-2 border-earth/30 border-t-earth rounded-full animate-spin"/><span className="text-xs text-muted">Uploading…</span></>
                    :<><img src={pendImg} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"/><span className="text-xs text-muted flex-1">Ready</span><button onClick={()=>setPendImg('')}><X className="w-4 h-4 text-muted"/></button></>}
                  </div>
                )}

                {recording&&(
                  <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2 flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"/>
                    <span className="text-xs text-red-600 font-medium flex-1">Recording… {fmtRec(recDur)}</span>
                    <button onClick={stopRec} className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium">Send</button>
                    <button onClick={cancelRec} className="text-red-400"><X className="w-4 h-4"/></button>
                  </div>
                )}

                <div className="bg-white border-t border-sand/50 px-3 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button onClick={()=>fileRef.current?.click()} disabled={uploading} className={`p-2 rounded-lg ${pendImg?'text-earth bg-earth/10':'text-muted hover:bg-cream'}`}><ImgIcon className="w-4 h-4"/></button>
                    <input value={text} onChange={e=>setText(e.target.value)} placeholder="Reply to customer…"
                      className="flex-1 px-4 py-2.5 rounded-full bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-earth/20"
                      onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendText();}}}/>
                    {(text.trim()||pendImg)
                      ? <button onClick={sendText} disabled={uploading} className="w-9 h-9 rounded-full bg-earth flex items-center justify-center disabled:opacity-40 hover:bg-earth/90 shadow-sm flex-shrink-0"><Send className="w-4 h-4 text-white"/></button>
                      : <button onMouseDown={startRec} onMouseUp={stopRec} onTouchStart={startRec} onTouchEnd={stopRec} disabled={uploading}
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-all ${recording?'bg-red-500 scale-110':'bg-earth hover:bg-earth/90'} disabled:opacity-40`}>
                          {recording?<MicOff className="w-4 h-4 text-white"/>:<Mic className="w-4 h-4 text-white"/>}
                        </button>
                    }
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center" style={{background:'#FAFAF8'}}>
                <div className="text-center"><MessageCircle className="w-12 h-12 text-muted/30 mx-auto mb-3"/><p className="text-charcoal/30 font-display text-xl">Select a conversation</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
