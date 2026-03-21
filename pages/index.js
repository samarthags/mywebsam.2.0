import { useState, useRef, useCallback, useEffect } from "react";

/* ── SSR-safe style injection ── */
let _booted = false;
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans','Inter',sans-serif;background:#f5f6fa;color:#111827;-webkit-font-smoothing:antialiased;}
*{-webkit-tap-highlight-color:transparent;}
*:focus{outline:none!important;}
button::-moz-focus-inner{border:0;}
input:focus,textarea:focus,select:focus{border-color:#6C63FF!important;box-shadow:0 0 0 3px rgba(108,99,255,0.13)!important;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes popIn{0%{opacity:0;transform:scale(.85);}100%{opacity:1;transform:scale(1);}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1;}100%{transform:translateY(60px) rotate(360deg);opacity:0;}}

.fu{animation:fadeUp 0.3s cubic-bezier(.22,.68,0,1.15) both;}
.pop{animation:popIn 0.35s cubic-bezier(.22,.68,0,1.2) both;}

/* inputs */
.inp{width:100%;padding:11px 14px;background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;color:#111827;font-family:inherit;font-size:14px;transition:border-color .16s,box-shadow .16s;}
.inp::placeholder{color:#b0b7c3;}
.inp:hover:not(:focus){border-color:#c5c8f6;}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 20px;border-radius:10px;border:none;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s,transform .1s,box-shadow .15s;user-select:none;white-space:nowrap;line-height:1;}
.btn:active{transform:scale(0.96)!important;box-shadow:none!important;}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
.btn-p{background:#6C63FF;color:#fff;}
.btn-p:hover{background:#5a52e8;box-shadow:0 4px 18px rgba(108,99,255,0.3);transform:translateY(-1px);}
.btn-s{background:#fff;color:#374151;border:1.5px solid #e5e7eb;}
.btn-s:hover{background:#f9fafb;transform:translateY(-1px);}
.btn-g{background:#10b981;color:#fff;}
.btn-g:hover{background:#059669;box-shadow:0 4px 18px rgba(16,185,129,0.28);transform:translateY(-1px);}
.btn-gh{background:transparent;color:#6b7280;border:1.5px solid #e5e7eb;}
.btn-gh:hover{background:#f9fafb;color:#374151;}
.btn-d{background:transparent;color:#ef4444;border:1.5px solid #fca5a5;padding:7px 12px;font-size:13px;}
.btn-d:hover{background:#fef2f2;border-color:#ef4444;}

/* tags */
.tag{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:999px;border:1.5px solid #e5e7eb;background:#fff;color:#6b7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;user-select:none;}
.tag:hover{border-color:#6C63FF;color:#6C63FF;background:#f2f0ff;}
.tag:active{transform:scale(0.95);}
.tag.on{background:#6C63FF;border-color:#6C63FF;color:#fff;}

/* cards */
.card{background:#fff;border:1.5px solid #e9eaf0;border-radius:16px;padding:20px;}

/* step dots */
.sdot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:inherit;border:2px solid #e5e7eb;background:#fff;color:#9ca3af;transition:all 0.22s ease;flex-shrink:0;}
.sdot.done{background:#10b981;border-color:#10b981;color:#fff;}
.sdot.active{background:#6C63FF;border-color:#6C63FF;color:#fff;box-shadow:0 0 0 4px rgba(108,99,255,0.16);}
.slbl{font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#b0b7c3;white-space:nowrap;margin-top:4px;}
.slbl.active{color:#6C63FF;}
.slbl.done{color:#10b981;}

/* social card */
.sc{display:flex;align-items:center;gap:10px;padding:11px 13px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.sc:focus-within{border-color:#6C63FF;box-shadow:0 0 0 3px rgba(108,99,255,0.1);}
.sc input{flex:1;border:none;background:transparent;font-family:inherit;font-size:13.5px;color:#111827;min-width:0;}
.sc input::placeholder{color:#b0b7c3;}

/* link row */
.lr{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.lr:hover{border-color:#c7c3f9;box-shadow:0 2px 8px rgba(108,99,255,0.07);}

/* success screen */
.success-ring{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#10b981);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 8px 32px rgba(108,99,255,0.3);}
.confetti-piece{position:absolute;width:8px;height:8px;border-radius:2px;animation:confettiFall 1.2s ease-out forwards;}

/* misc */
.lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;}
.hint{font-size:12px;color:#6b7280;margin-top:5px;display:flex;align-items:center;gap:5px;}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;}
.charcount{font-size:11px;color:#b0b7c3;text-align:right;margin-top:4px;}
.charcount.warn{color:#f59e0b;} .charcount.over{color:#ef4444;}

/* topbar */
.topbar{background:#fff;border-bottom:1px solid #e9eaf0;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}

/* footer */
.footer{text-align:center;padding:28px 16px 20px;font-size:13px;color:#9ca3af;}

/* AI badge */
.ai-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:linear-gradient(135deg,#f0edff,#e0fdf4);border:1px solid #c4b5fd;font-size:11px;font-weight:700;color:#5b21b6;}

/* mobile */
@media(max-width:500px){
  .card{padding:15px;}
  .btn{padding:11px 16px;font-size:13px;}
  .step-wrap{gap:2px!important;}
  .sdot{width:26px;height:26px;font-size:10px;}
  .slbl{display:none;}
  .grid-2{grid-template-columns:1fr!important;}
  .soc-grid{grid-template-columns:1fr!important;}
}
`;

function bootStyles() {
  if (_booted) return;
  _booted = true;
  ["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
   "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
  ].forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    }
  });
  if (!document.getElementById("dp-css")) {
    const s = document.createElement("style"); s.id = "dp-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }
}

/* ── Constants ── */
const ACCENT = "#6C63FF";
const SARVAM_KEY = "sk_rvgkd5mg_eorP6Y0JCfoWZxVqtCrmiOTB";

const SOCIAL_META = {
  email:         {icon:"fas fa-envelope",       color:"#EA4335",bg:"#fef2f2"},
  instagram:     {icon:"fab fa-instagram",       color:"#E4405F",bg:"#fdf2f4"},
  whatsapp:      {icon:"fab fa-whatsapp",        color:"#25D366",bg:"#edfaf3"},
  facebook:      {icon:"fab fa-facebook-f",      color:"#1877F2",bg:"#eef4ff"},
  youtube:       {icon:"fab fa-youtube",         color:"#FF0000",bg:"#fff2f2"},
  twitter:       {icon:"fab fa-x-twitter",       color:"#111",   bg:"#f5f5f5"},
  tiktok:        {icon:"fab fa-tiktok",          color:"#010101",bg:"#f5f5f5"},
  snapchat:      {icon:"fab fa-snapchat",        color:"#d4b800",bg:"#fffce8"},
  pinterest:     {icon:"fab fa-pinterest",       color:"#E60023",bg:"#fff0f1"},
  telegram:      {icon:"fab fa-telegram",        color:"#26A5E4",bg:"#edf7fd"},
  discord:       {icon:"fab fa-discord",         color:"#5865F2",bg:"#eef0ff"},
  linkedin:      {icon:"fab fa-linkedin-in",     color:"#0A66C2",bg:"#e8f3fc"},
  github:        {icon:"fab fa-github",          color:"#24292e",bg:"#f6f8fa"},
  twitch:        {icon:"fab fa-twitch",          color:"#9146FF",bg:"#f3eeff"},
  spotify:       {icon:"fab fa-spotify",         color:"#1DB954",bg:"#edfaf3"},
  reddit:        {icon:"fab fa-reddit-alien",    color:"#FF4500",bg:"#fff2ed"},
  medium:        {icon:"fab fa-medium",          color:"#333",   bg:"#f5f5f5"},
  devto:         {icon:"fab fa-dev",             color:"#0a0a0a",bg:"#f5f5f5"},
  codepen:       {icon:"fab fa-codepen",         color:"#111",   bg:"#f5f5f5"},
  stackoverflow: {icon:"fab fa-stack-overflow",  color:"#F58025",bg:"#fff4ed"},
  behance:       {icon:"fab fa-behance",         color:"#1769FF",bg:"#eef2ff"},
  dribbble:      {icon:"fab fa-dribbble",        color:"#ea4c89",bg:"#fdf0f5"},
  npm:           {icon:"fab fa-npm",             color:"#CC3534",bg:"#fff0f0"},
};

const ROLE_ICONS = {
  student:"fas fa-graduation-cap", professional:"fas fa-briefcase",
  creator:"fas fa-camera",         artist:"fas fa-palette",
  musician:"fas fa-music",         athlete:"fas fa-person-running",
  traveler:"fas fa-plane",         foodie:"fas fa-utensils",
  gamer:"fas fa-gamepad",          writer:"fas fa-pen-nib",
  entrepreneur:"fas fa-rocket",    volunteer:"fas fa-hand-holding-heart",
  other:"fas fa-star",
};

const LINK_ICONS = [
  "fas fa-link","fas fa-globe","fas fa-briefcase","fas fa-folder-open","fas fa-star",
  "fas fa-heart","fas fa-rocket","fas fa-bolt","fas fa-book-open","fas fa-video",
  "fas fa-microphone","fas fa-store","fas fa-graduation-cap","fas fa-code",
  "fas fa-pen-nib","fas fa-camera","fas fa-music","fas fa-gamepad","fas fa-trophy",
  "fas fa-film","fas fa-images","fas fa-newspaper","fas fa-podcast","fas fa-headphones",
  "fas fa-paintbrush","fas fa-leaf","fas fa-paw","fas fa-dumbbell","fas fa-plane",
  "fas fa-utensils","fas fa-flask","fas fa-laptop","fas fa-mobile-alt","fas fa-gift",
  "fas fa-handshake","fas fa-chart-bar","fas fa-comments","fas fa-envelope","fas fa-map-marker-alt",
];

const SOCIALS_LIST = [
  {n:"email",       l:"Email",          p:"your@email.com"},
  {n:"instagram",   l:"Instagram",      p:"@username"},
  {n:"whatsapp",    l:"WhatsApp",       p:"+1234567890"},
  {n:"facebook",    l:"Facebook",       p:"username"},
  {n:"youtube",     l:"YouTube",        p:"@channel"},
  {n:"twitter",     l:"Twitter / X",   p:"@username"},
  {n:"tiktok",      l:"TikTok",         p:"@username"},
  {n:"snapchat",    l:"Snapchat",       p:"username"},
  {n:"pinterest",   l:"Pinterest",      p:"username"},
  {n:"telegram",    l:"Telegram",       p:"@username"},
  {n:"discord",     l:"Discord",        p:"username"},
  {n:"linkedin",    l:"LinkedIn",       p:"username"},
  {n:"github",      l:"GitHub",         p:"username"},
  {n:"twitch",      l:"Twitch",         p:"username"},
  {n:"spotify",     l:"Spotify",        p:"username"},
  {n:"reddit",      l:"Reddit",         p:"u/username"},
  {n:"medium",      l:"Medium",         p:"@username"},
  {n:"devto",       l:"DEV.to",         p:"username"},
  {n:"codepen",     l:"CodePen",        p:"username"},
  {n:"stackoverflow",l:"Stack Overflow",p:"user ID"},
  {n:"behance",     l:"Behance",        p:"username"},
  {n:"dribbble",    l:"Dribbble",       p:"username"},
  {n:"npm",         l:"npm",            p:"~username"},
];

const STEPS = ["Basic","Vibe","Social","Links","Publish"];

const ROLES = [
  {v:"student",l:"Student"},{v:"professional",l:"Professional"},
  {v:"creator",l:"Creator"},{v:"artist",l:"Artist"},
  {v:"musician",l:"Musician"},{v:"athlete",l:"Athlete"},
  {v:"traveler",l:"Traveler"},{v:"foodie",l:"Foodie"},
  {v:"gamer",l:"Gamer"},{v:"writer",l:"Writer"},
  {v:"entrepreneur",l:"Entrepreneur"},{v:"volunteer",l:"Volunteer"},
  {v:"other",l:"Other"},
];

const HOBBIES   = ["Reading","Gaming","Cooking","Traveling","Photography","Art & Crafts","Dancing","Sports","Yoga","Meditation","Gardening","Hiking","Swimming","Music","Writing","Fitness","Baking","Cycling","Surfing","Camping"];
const VIBES     = ["Chill","Adventurous","Creative","Ambitious","Funny","Romantic","Spiritual","Minimalist","Social","Introverted","Outdoorsy","Bookworm","Foodie","Night Owl","Early Bird","Tech-savvy","Eco-conscious","Animal Lover"];
const MUSIC_G   = ["Pop","Rock","Hip Hop","R&B","Electronic","Jazz","Classical","Country","Metal","Indie","Latin","K-Pop","Folk","Reggae","Lo-fi","Ambient"];
const PASSIONS  = ["Family","Friendship","Health","Nature","Animals","Travel","Food","Fashion","Beauty","Fitness","Learning","Community","Creativity","Mindfulness","Sustainability","Diversity"];

const EMPTY_FORM = {
  username:"",name:"",dob:"",location:"",bio:"",
  avatar:"",
  socialProfiles:{},links:[],
  interests:{role:"",hobbies:[],vibes:[],music:[],passions:[]},
};

/* ── Main ── */
export default function DevProfileCreator() {
  useEffect(() => { bootStyles(); }, []);

  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [newLink, setNewLink] = useState({title:"",url:"",icon:"fas fa-link"});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiText,     setAiText]     = useState("");
  const [aiEdited,   setAiEdited]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [published,  setPublished]  = useState(null); // {url, username}
  const [copied,     setCopied]     = useState(false);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [editingId,     setEditingId]     = useState(null);
  const fileRef = useRef(null);

  /* load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("dp_profiles");
      if (raw) setSavedProfiles(JSON.parse(raw));
    } catch {}
  }, []);

  const saveToLocal = useCallback((profile) => {
    setSavedProfiles(prev => {
      const exists = prev.find(p => p.id === profile.id);
      const next = exists ? prev.map(p => p.id===profile.id ? profile : p) : [...prev, profile];
      try { localStorage.setItem("dp_profiles", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  /* computed */
  const filledSocials = Object.entries(form.socialProfiles).filter(([,v]) => v?.trim());
  const totalTags = Object.values(form.interests).flat().filter(Boolean).length;
  const score = Math.min(100, Math.round(
    [form.username,form.name,form.avatar,form.dob,form.location].filter(Boolean).length * 6 +
    Math.min(totalTags,10)*3 + Math.min(filledSocials.length,5)*4 +
    Math.min(form.links.length,3)*5 + (aiText||form.bio?5:0)
  ));

  const checklist = [
    {label:"Username set",            done:!!form.username},
    {label:"Full name added",         done:!!form.name},
    {label:"Profile photo",           done:!!form.avatar},
    {label:"Location added",          done:!!form.location},
    {label:"Role / vibe selected",    done:!!form.interests.role||form.interests.vibes.length>0},
    {label:"At least 3 interests",    done:totalTags>=3},
    {label:"Social profile linked",   done:filledSocials.length>0},
    {label:"Bio written",             done:!!(aiText||form.bio)},
  ];
  const allDone = checklist.every(c => c.done);

  /* handlers */
  const setField    = useCallback((k,v) => setForm(p=>({...p,[k]:v})), []);
  const setSocial   = useCallback((n,v) => setForm(p=>({...p,socialProfiles:{...p.socialProfiles,[n]:v}})), []);
  const toggleTag   = useCallback((cat,val) => setForm(p=>{
    const c=p.interests[cat];
    return {...p,interests:{...p.interests,[cat]:c.includes(val)?c.filter(x=>x!==val):[...c,val]}};
  }), []);
  const setRole     = useCallback((v) => setForm(p=>({...p,interests:{...p.interests,role:p.interests.role===v?"":v}})), []);

  const processImg = useCallback((file) => {
    if (!file||!file.type.startsWith("image/")) return;
    setUploading(true);
    const r = new FileReader();
    r.onload  = e => { setForm(p=>({...p,avatar:e.target.result})); setUploading(false); };
    r.onerror = () => setUploading(false);
    r.readAsDataURL(file);
  }, []);

  const handleFile = e => processImg(e.target.files[0]);
  const handleDrop = e => { e.preventDefault(); setDragOver(false); processImg(e.dataTransfer.files[0]); };

  const addLink = () => {
    if (!newLink.title.trim()||!newLink.url.trim()) return;
    const url = /^https?:\/\//.test(newLink.url) ? newLink.url : `https://${newLink.url}`;
    setForm(p=>({...p,links:[...p.links,{...newLink,url,id:Date.now()}]}));
    setNewLink({title:"",url:"",icon:"fas fa-link"});
    setShowIconPicker(false);
  };
  const removeLink = id => setForm(p=>({...p,links:p.links.filter(l=>l.id!==id)}));
  const moveLink   = (i,dir) => setForm(p=>{
    const ls=[...p.links]; const j=i+dir;
    if(j<0||j>=ls.length) return p;
    [ls[i],ls[j]]=[ls[j],ls[i]]; return {...p,links:ls};
  });

  /* Sarvam AI bio */
  const generateBio = async () => {
    setAiLoading(true);
    const role  = form.interests.role;
    const tags  = [...form.interests.hobbies,...form.interests.vibes,...form.interests.passions].slice(0,6).join(", ");
    const music = form.interests.music.slice(0,3).join(", ");
    const prompt = `Write a friendly, warm, and engaging bio for a link-in-bio profile page. 
Name: ${form.name||"the user"}. 
Role/identity: ${role||"person"}.
Interests & vibes: ${tags||"varied"}.
Music taste: ${music||"eclectic"}.
Location: ${form.location||"unknown"}.
Write 2-3 short sentences. Be casual, authentic, and relatable — not formal. No hashtags. No emojis. First person.`;
    try {
      const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","api-subscription-key": SARVAM_KEY},
        body: JSON.stringify({
          model:"sarvam-m",
          messages:[{role:"user",content:prompt}],
          max_tokens:200,
          temperature:0.85,
        }),
      });
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) { setAiText(text); setAiEdited(false); }
      else throw new Error("empty");
    } catch {
      /* fallback */
      setAiText(`${form.name||"Hey there"} — ${role||"living life"} with a passion for ${tags||"everything life has to offer"}. Always exploring, always growing.`);
      setAiEdited(false);
    } finally { setAiLoading(false); }
  };

  /* Submit / publish */
  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = { ...form, aboutme: aiText||form.bio };
    /* save to localStorage for future editing */
    const profileId = editingId || `profile_${Date.now()}`;
    const saved = { id: profileId, ...payload, savedAt: new Date().toISOString() };
    saveToLocal(saved);
    setEditingId(profileId);

    try {
      const res  = await fetch("/api/create", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data = await res.json();
      if (data.url) {
        setPublished({ url: data.url, username: form.username });
      } else {
        /* demo fallback — show success with local url */
        setPublished({ url: `https://mywebsam.site/${form.username}`, username: form.username });
      }
    } catch {
      setPublished({ url: `https://mywebsam.site/${form.username}`, username: form.username });
    } finally { setSubmitting(false); }
  };

  const copyLink = () => {
    if (!published) return;
    navigator.clipboard.writeText(published.url).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const loadSaved = (profile) => {
    setForm({
      username:       profile.username       || "",
      name:           profile.name           || "",
      dob:            profile.dob            || "",
      location:       profile.location       || "",
      bio:            profile.bio            || "",
      avatar:         profile.avatar         || "",
      socialProfiles: profile.socialProfiles || {},
      links:          profile.links          || [],
      interests:      profile.interests      || EMPTY_FORM.interests,
    });
    setAiText(profile.aboutme || "");
    setEditingId(profile.id);
    setPublished(null);
    setStep(1);
  };

  /* small helpers */
  const Lbl = ({children,req}) => <div className="lbl">{children}{req&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}</div>;
  const Hint = ({icon="fas fa-info-circle",children}) => (
    <div className="hint"><i className={icon} style={{color:ACCENT,fontSize:11}}/>{children}</div>
  );
  const SHead = ({icon,title,sub}) => (
    <div style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
          <i className={icon}/>
        </div>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,color:"#111827",lineHeight:1.1}}>{title}</h2>
          {sub && <p style={{fontSize:12,color:"#6b7280",marginTop:3}}>{sub}</p>}
        </div>
      </div>
    </div>
  );
  const TagGrid = ({items,cat}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {items.map(item => {
        const on = form.interests[cat].includes(item);
        return (
          <button key={item} type="button" className={`tag ${on?"on":""}`} onClick={()=>toggleTag(cat,item)}>
            {on && <i className="fas fa-check" style={{fontSize:9}}/>}{item}
          </button>
        );
      })}
    </div>
  );
  const NavRow = ({canGo=true}) => (
    <div style={{display:"flex",gap:10,marginTop:24}}>
      {step>1 && <button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(s=>s-1)}><i className="fas fa-arrow-left" style={{fontSize:12}}/> Back</button>}
      {step<5  && <button type="button" className="btn btn-p" style={{flex:2}} onClick={()=>setStep(s=>s+1)} disabled={!canGo}>Continue <i className="fas fa-arrow-right" style={{fontSize:12}}/></button>}
    </div>
  );

  /* ── Success screen ── */
  if (published) {
    return (
      <div style={{minHeight:"100vh",background:"#f5f6fa",display:"flex",flexDirection:"column"}}>
        <div className="topbar">
          <a href="https://mywebsam.site/" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <div style={{width:28,height:28,borderRadius:8,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="fas fa-link" style={{color:"#fff",fontSize:12}}/></div>
            <span style={{fontWeight:800,fontSize:15,color:"#111827"}}>mywebsam</span>
          </a>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
          <div style={{maxWidth:440,width:"100%"}}>
            {/* confetti */}
            <div style={{position:"relative",textAlign:"center",marginBottom:8}}>
              {["#6C63FF","#10b981","#f59e0b","#ef4444","#0ea5e9"].map((c,i)=>(
                <div key={i} className="confetti-piece" style={{background:c,left:`${15+i*16}%`,top:0,animationDelay:`${i*0.15}s`}}/>
              ))}
            </div>
            <div className="card pop" style={{textAlign:"center",padding:"36px 28px"}}>
              <div className="success-ring">
                <i className="fas fa-check" style={{color:"#fff",fontSize:34}}/>
              </div>
              <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Profile Created!</h2>
              <p style={{color:"#6b7280",fontSize:14,lineHeight:1.6,marginBottom:24}}>
                Your profile is live at <strong style={{color:ACCENT}}>mywebsam.site/{published.username}</strong>
              </p>

              {/* URL box */}
              <div style={{display:"flex",alignItems:"center",background:"#f5f6fa",border:"1.5px solid #e9eaf0",borderRadius:10,padding:"10px 14px",marginBottom:20,gap:10}}>
                <i className="fas fa-globe" style={{color:ACCENT,fontSize:14,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{published.url}</span>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(published.url,"_blank")}>
                  <i className="fas fa-arrow-up-right-from-square"/> View Profile
                </button>
                <button className="btn btn-s" style={{width:"100%"}} onClick={copyLink}>
                  <i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/> {copied?"Copied!":"Copy Link"}
                </button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>{
                  const text = `Check out my profile! ${published.url}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
                }}>
                  <i className="fab fa-whatsapp" style={{color:"#25D366"}}/> WhatsApp
                </button>
                <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>{
                  const text = `Check out my profile! ${published.url}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,"_blank");
                }}>
                  <i className="fab fa-x-twitter"/> Share
                </button>
              </div>

              <button className="btn btn-gh" style={{width:"100%",fontSize:13}}
                onClick={()=>{ setPublished(null); setStep(1); }}>
                <i className="fas fa-pen"/> Edit Profile
              </button>
            </div>
          </div>
        </div>
        <div className="footer">Made with ❤️‍🔥 by <strong>Samartha GS</strong></div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div style={{minHeight:"100vh",background:"#f5f6fa",paddingBottom:40}}>

      {/* Topbar */}
      <div className="topbar">
        <a href="https://mywebsam.site/" target="_blank" rel="noreferrer"
          style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <div style={{width:28,height:28,borderRadius:8,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <i className="fas fa-link" style={{color:"#fff",fontSize:12}}/>
          </div>
          <span style={{fontWeight:800,fontSize:15,color:"#111827"}}>mywebsam</span>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {savedProfiles.length>0 && (
            <select style={{fontSize:12,padding:"5px 10px",borderRadius:8,border:"1.5px solid #e9eaf0",background:"#fff",color:"#374151",cursor:"pointer",fontFamily:"inherit"}}
              onChange={e=>{ const p=savedProfiles.find(x=>x.id===e.target.value); if(p) loadSaved(p); }}
              value={editingId||""}>
              <option value="">Load saved...</option>
              {savedProfiles.map(p=>(
                <option key={p.id} value={p.id}>{p.name||p.username} ({new Date(p.savedAt).toLocaleDateString()})</option>
              ))}
            </select>
          )}
          <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>{score}%</span>
          <div style={{width:56,height:5,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${score}%`,height:"100%",background:score>=80?"#10b981":ACCENT,borderRadius:99,transition:"width 0.4s ease"}}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 14px 12px"}}>

        {/* Step indicator */}
        <div className="step-wrap" style={{display:"flex",alignItems:"flex-start",marginBottom:22,gap:4}}>
          {STEPS.map((label,i)=>{
            const s=i+1;
            const state=step>s?"done":step===s?"active":"idle";
            return (
              <div key={s} style={{display:"flex",alignItems:"center",flex:s<5?1:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div className={`sdot ${state}`}>
                    {state==="done"?<i className="fas fa-check" style={{fontSize:10}}/>:s}
                  </div>
                  <span className={`slbl ${state}`}>{label}</span>
                </div>
                {s<5 && <div style={{flex:1,height:2,background:step>s?"#10b981":"#e9eaf0",margin:"0 3px",marginBottom:18,borderRadius:1,transition:"background 0.3s"}}/>}
              </div>
            );
          })}
        </div>

        {/* ═══ STEP 1 — Basic Info ═══ */}
        {step===1 && (
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-user-circle" title="About You" sub="Let's start with the basics."/>

              <div style={{marginBottom:14}}>
                <Lbl req>Username</Lbl>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#b0b7c3",fontSize:14,pointerEvents:"none"}}>@</span>
                  <input className="inp" style={{paddingLeft:27}} placeholder="yourname"
                    value={form.username} onChange={e=>setField("username",e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,""))}/>
                </div>
                {form.username && <Hint icon="fas fa-globe">mywebsam.site/<strong style={{color:ACCENT}}>{form.username}</strong></Hint>}
              </div>

              <div style={{marginBottom:14}}>
                <Lbl req>Full Name</Lbl>
                <input className="inp" placeholder="Your full name" value={form.name} onChange={e=>setField("name",e.target.value)}/>
              </div>

              <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <Lbl>Date of Birth</Lbl>
                  <input className="inp" type="date" value={form.dob} onChange={e=>setField("dob",e.target.value)}/>
                </div>
                <div>
                  <Lbl>Location</Lbl>
                  <input className="inp" placeholder="City, Country" value={form.location} onChange={e=>setField("location",e.target.value)}/>
                </div>
              </div>

              <div>
                <Lbl>Short Bio <span style={{color:"#b0b7c3",fontWeight:400,textTransform:"none",fontSize:11}}>(or generate with AI in step 2)</span></Lbl>
                <textarea className="inp" rows={3} placeholder="Say something about yourself..."
                  value={form.bio} onChange={e=>setField("bio",e.target.value)} style={{resize:"vertical",lineHeight:1.6}}/>
                <div className={`charcount ${form.bio.length>180?"over":form.bio.length>140?"warn":""}`}>{form.bio.length}/200</div>
              </div>
            </div>

            {/* Avatar */}
            <div className="card">
              <Lbl>Profile Photo</Lbl>
              <div style={{display:"flex",alignItems:"center",gap:16,padding:16,borderRadius:12,cursor:"pointer",border:`2px dashed ${dragOver?"#6C63FF":form.avatar?"#6C63FF":"#e5e7eb"}`,background:dragOver?"#f2f0ff":form.avatar?"#f8f7ff":"#fafafa",transition:"all .2s"}}
                onClick={()=>fileRef.current?.click()}
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={handleDrop}>
                {form.avatar ? (
                  <>
                    <img src={form.avatar} alt="avatar" style={{width:66,height:66,borderRadius:"50%",objectFit:"cover",border:`2.5px solid ${ACCENT}`,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,marginBottom:2}}>Looking great!</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click to change photo</div>
                    </div>
                    <button type="button" className="btn btn-d" onClick={e=>{e.stopPropagation();setField("avatar","");}}>
                      <i className="fas fa-trash"/>
                    </button>
                  </>
                ):(
                  <>
                    <div style={{width:66,height:66,borderRadius:"50%",background:"#ede9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:ACCENT,flexShrink:0}}>
                      {uploading?<i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/>:<i className="fas fa-camera"/>}
                    </div>
                    <div>
                      <div style={{fontWeight:600,marginBottom:2}}>{uploading?"Uploading...":"Add a Photo"}</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click or drag — PNG, JPG, GIF, WebP</div>
                      <div style={{fontSize:11,color:"#b0b7c3",marginTop:2}}>Saved locally — no server required</div>
                    </div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
            </div>

            <NavRow canGo={!!form.username&&!!form.name}/>
          </div>
        )}

        {/* ═══ STEP 2 — Vibe & Interests ═══ */}
        {step===2 && (
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-face-smile" title="Your Vibe" sub="What describes you? Anyone can use this — not just developers."/>

              <div style={{marginBottom:18}}>
                <Lbl>I am a...</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {ROLES.map(r=>{
                    const on=form.interests.role===r.v;
                    return (
                      <button key={r.v} type="button" className={`tag ${on?"on":""}`} style={{borderRadius:10}}
                        onClick={()=>setRole(r.v)}>
                        <i className={ROLE_ICONS[r.v]||"fas fa-star"} style={{width:13,textAlign:"center"}}/>
                        {r.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {[
                {cat:"vibes",   label:"My Vibe",        items:VIBES},
                {cat:"hobbies", label:"Hobbies",         items:HOBBIES},
                {cat:"music",   label:"Music I Love",   items:MUSIC_G},
                {cat:"passions",label:"Things I Care About", items:PASSIONS},
              ].map(s=>(
                <div key={s.cat} style={{marginBottom:18}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl>{s.label}</Lbl>
                    {form.interests[s.cat].length>0 && (
                      <span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests[s.cat].length} selected</span>
                    )}
                  </div>
                  <TagGrid items={s.items} cat={s.cat}/>
                </div>
              ))}
            </div>

            {/* AI Bio */}
            <div className="card">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <Lbl>AI Bio Generator</Lbl>
                <div className="ai-badge"><i className="fas fa-wand-magic-sparkles"/>expo.1</div>
              </div>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>
                Select your role and interests above, then generate a personalised bio.
              </p>
              <button type="button" className="btn btn-g" style={{width:"100%"}} onClick={generateBio} disabled={aiLoading}>
                {aiLoading
                  ? <><i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> Generating with Sarvam AI...</>
                  : <><i className="fas fa-wand-magic-sparkles"/> Generate My Bio</>}
              </button>

              {aiText && (
                <div style={{marginTop:14,borderTop:"1px solid #f0edff",paddingTop:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                    <div className="ai-badge"><i className="fas fa-robot"/> expo.1 · Sarvam AI</div>
                    <button type="button" style={{background:"none",border:"none",fontSize:12,color:ACCENT,cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}}
                      onClick={generateBio} disabled={aiLoading}>
                      <i className="fas fa-redo" style={{marginRight:4,fontSize:10}}/>Regenerate
                    </button>
                  </div>
                  <textarea className="inp" rows={3} value={aiText}
                    onChange={e=>{setAiText(e.target.value);setAiEdited(true);}}
                    style={{resize:"vertical",lineHeight:1.6}}/>
                  {aiEdited && <Hint icon="fas fa-pencil">Edited — your version will be saved.</Hint>}
                </div>
              )}
            </div>

            <NavRow/>
          </div>
        )}

        {/* ═══ STEP 3 — Social ═══ */}
        {step===3 && (
          <div className="fu">
            <div className="card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:8}}>
                <SHead icon="fas fa-share-nodes" title="Social Profiles" sub="Only filled ones show on your page."/>
                {filledSocials.length>0 && <div className="badge"><i className="fas fa-check" style={{fontSize:9}}/>{filledSocials.length} linked</div>}
              </div>

              <div className="soc-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                {SOCIALS_LIST.map(p=>{
                  const m=SOCIAL_META[p.n]||{icon:"fas fa-link",color:"#6b7280",bg:"#f9fafb"};
                  const val=form.socialProfiles[p.n]||"";
                  return (
                    <div key={p.n} className="sc">
                      <div style={{width:32,height:32,borderRadius:8,background:m.bg,color:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                        <i className={m.icon}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",letterSpacing:"0.05em",marginBottom:2}}>{p.l.toUpperCase()}</div>
                        <input placeholder={p.p} value={val} onChange={e=>setSocial(p.n,e.target.value)}/>
                      </div>
                      {val && <i className="fas fa-circle-check" style={{color:"#10b981",fontSize:13}}/>}
                    </div>
                  );
                })}
              </div>
            </div>
            <NavRow/>
          </div>
        )}

        {/* ═══ STEP 4 — Links ═══ */}
        {step===4 && (
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-link" title="Your Links" sub="Add any URL — portfolio, shop, blog, project..."/>

              <div style={{background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:12,padding:16,marginBottom:18}}>
                <Lbl>Add a Link</Lbl>
                <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <input className="inp" style={{flex:"0 0 140px",minWidth:0}} placeholder="Label"
                    value={newLink.title} onChange={e=>setNewLink(p=>({...p,title:e.target.value}))}/>
                  <input className="inp" style={{flex:1,minWidth:140}} placeholder="https://..."
                    value={newLink.url} onChange={e=>setNewLink(p=>({...p,url:e.target.value}))}/>
                </div>

                {/* Icon picker */}
                <div style={{marginBottom:10}}>
                  <button type="button" className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setShowIconPicker(v=>!v)}>
                    <i className={newLink.icon}/> Choose Icon <i className={`fas fa-chevron-${showIconPicker?"up":"down"}`} style={{fontSize:10}}/>
                  </button>
                  {showIconPicker && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,maxHeight:180,overflowY:"auto",padding:4}}>
                      {LINK_ICONS.map(ic=>(
                        <button key={ic} type="button"
                          style={{width:36,height:36,borderRadius:8,border:`1.5px solid ${newLink.icon===ic?"#6C63FF":"#e5e7eb"}`,background:newLink.icon===ic?"#f0edff":"#fff",color:newLink.icon===ic?"#6C63FF":"#6b7280",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                          onClick={()=>{setNewLink(p=>({...p,icon:ic}));setShowIconPicker(false);}}>
                          <i className={ic}/>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button type="button" className="btn btn-p" style={{width:"100%"}} onClick={addLink}>
                  <i className="fas fa-plus"/> Add Link
                </button>
              </div>

              {form.links.length===0 ? (
                <div style={{textAlign:"center",padding:"28px 16px",color:"#b0b7c3"}}>
                  <i className="fas fa-link" style={{fontSize:26,marginBottom:8,display:"block"}}/>
                  <div style={{fontSize:14}}>No links yet. Add one above.</div>
                </div>
              ):(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl>Your Links ({form.links.length})</Lbl>
                    <span style={{fontSize:11,color:"#b0b7c3"}}>Reorder with arrows</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {form.links.map((link,idx)=>(
                      <div key={link.id} className="lr">
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===0?"default":"pointer",color:idx===0?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}} onClick={()=>moveLink(idx,-1)}><i className="fas fa-chevron-up"/></button>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===form.links.length-1?"default":"pointer",color:idx===form.links.length-1?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}} onClick={()=>moveLink(idx,1)}><i className="fas fa-chevron-down"/></button>
                        </div>
                        <div style={{width:32,height:32,borderRadius:8,background:"#f0edff",color:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                          <i className={link.icon}/>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14}}>{link.title}</div>
                          <div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link.url}</div>
                        </div>
                        <a href={link.url} target="_blank" rel="noreferrer" style={{padding:"4px 8px",color:"#9ca3af",textDecoration:"none",fontSize:12}} onClick={e=>e.stopPropagation()}>
                          <i className="fas fa-arrow-up-right-from-square"/>
                        </a>
                        <button type="button" className="btn btn-d" onClick={()=>removeLink(link.id)}><i className="fas fa-trash"/></button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <NavRow/>
          </div>
        )}

        {/* ═══ STEP 5 — Publish ═══ */}
        {step===5 && (
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-rocket" title="Ready to Publish?" sub="Check your profile and go live."/>

              {/* Checklist */}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {checklist.map(item=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:item.done?"#f0fdf4":"#fafafa",border:`1.5px solid ${item.done?"#bbf7d0":"#e9eaf0"}`,borderRadius:10,transition:"all .2s"}}>
                    <i className={item.done?"fas fa-circle-check":"far fa-circle"} style={{color:item.done?"#10b981":"#d1d5db",fontSize:16,flexShrink:0}}/>
                    <span style={{fontSize:14,fontWeight:item.done?600:400,color:item.done?"#065f46":"#9ca3af"}}>{item.label}</span>
                    {item.done && <i className="fas fa-check" style={{color:"#10b981",fontSize:11,marginLeft:"auto"}}/>}
                  </div>
                ))}
              </div>

              {/* Completion bar */}
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Profile Completeness</span>
                  <span style={{fontSize:12,fontWeight:700,color:score>=80?"#10b981":ACCENT}}>{score}%</span>
                </div>
                <div style={{height:8,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:`${score}%`,height:"100%",background:score>=80?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#6C63FF,#818cf8)",borderRadius:99,transition:"width 0.5s ease"}}/>
                </div>
                {!allDone && <div style={{fontSize:12,color:"#6b7280",marginTop:6}}><i className="fas fa-info-circle" style={{marginRight:5,color:ACCENT}}/>Fill more fields to improve your profile.</div>}
              </div>

              <div style={{display:"flex",gap:10}}>
                <button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(4)}>
                  <i className="fas fa-arrow-left" style={{fontSize:12}}/> Back
                </button>
                <button type="button" className="btn btn-p" style={{flex:2}}
                  onClick={handleSubmit} disabled={submitting||!form.username||!form.name}>
                  {submitting
                    ? <><i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> Publishing...</>
                    : <><i className="fas fa-rocket"/> Publish Profile</>}
                </button>
              </div>

              {(!form.username||!form.name) && (
                <div style={{marginTop:10,fontSize:13,color:"#ef4444",textAlign:"center"}}>
                  <i className="fas fa-triangle-exclamation" style={{marginRight:5}}/>Username and name are required.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer">Made with ❤️‍🔥 by <strong>Samartha GS</strong></div>
    </div>
  );
}
