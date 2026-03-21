import { useState, useRef, useCallback, useEffect } from "react";

/* ── SSR-safe — never runs on server ── */
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
@keyframes popIn{0%{opacity:0;transform:scale(.88);}100%{opacity:1;transform:scale(1);}}
@keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1;}100%{transform:translateY(80px) rotate(360deg);opacity:0;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
.fu{animation:fadeUp 0.3s cubic-bezier(.22,.68,0,1.15) both;}
.pop{animation:popIn 0.38s cubic-bezier(.22,.68,0,1.2) both;}
.inp{width:100%;padding:11px 14px;background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;color:#111827;font-family:inherit;font-size:14px;transition:border-color .16s,box-shadow .16s;}
.inp::placeholder{color:#b0b7c3;}
.inp:hover:not(:focus){border-color:#c5c8f6;}
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
.btn-warn{background:#fff7ed;color:#c2410c;border:1.5px solid #fed7aa;padding:9px 16px;font-size:13px;}
.btn-warn:hover{background:#ffedd5;border-color:#fb923c;}
.tag{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:999px;border:1.5px solid #e5e7eb;background:#fff;color:#6b7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s ease;user-select:none;}
.tag:hover{border-color:#6C63FF;color:#6C63FF;background:#f2f0ff;}
.tag:active{transform:scale(0.95);}
.tag.on{background:#6C63FF;border-color:#6C63FF;color:#fff;}
.card{background:#fff;border:1.5px solid #e9eaf0;border-radius:16px;padding:20px;}
.sdot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:inherit;border:2px solid #e5e7eb;background:#fff;color:#9ca3af;transition:all 0.22s ease;flex-shrink:0;}
.sdot.done{background:#10b981;border-color:#10b981;color:#fff;}
.sdot.active{background:#6C63FF;border-color:#6C63FF;color:#fff;box-shadow:0 0 0 4px rgba(108,99,255,0.16);}
.slbl{font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#b0b7c3;white-space:nowrap;margin-top:4px;}
.slbl.active{color:#6C63FF;}
.slbl.done{color:#10b981;}
.sc{display:flex;align-items:center;gap:10px;padding:11px 13px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.sc:focus-within{border-color:#6C63FF;box-shadow:0 0 0 3px rgba(108,99,255,0.1);}
.sc input{flex:1;border:none;background:transparent;font-family:inherit;font-size:13.5px;color:#111827;min-width:0;}
.sc input::placeholder{color:#b0b7c3;}
.lr{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.lr:hover{border-color:#c7c3f9;box-shadow:0 2px 8px rgba(108,99,255,0.07);}
.success-ring{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#10b981);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 8px 32px rgba(108,99,255,0.28);}
.confetti-piece{position:absolute;width:8px;height:8px;border-radius:2px;animation:confettiFall 1.4s ease-out forwards;}
.lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;}
.hint{font-size:12px;color:#6b7280;margin-top:5px;display:flex;align-items:center;gap:5px;}
.badge-green{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;}
.ai-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:linear-gradient(135deg,#f0edff,#e0fdf4);border:1px solid #c4b5fd;font-size:11px;font-weight:700;color:#5b21b6;}
.charcount{font-size:11px;color:#b0b7c3;text-align:right;margin-top:4px;}
.charcount.warn{color:#f59e0b;}.charcount.over{color:#ef4444;}
.topbar{background:#fff;border-bottom:1px solid #e9eaf0;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
.footer{text-align:center;padding:28px 16px 20px;font-size:13px;color:#9ca3af;}
.section-divider{height:1px;background:#f0f0f5;margin:18px 0;}
@media(max-width:520px){
  .card{padding:15px 14px;}
  .btn{padding:11px 14px;font-size:13px;}
  .sdot{width:26px;height:26px;font-size:10px;}
  .slbl{display:none;}
  .grid2{grid-template-columns:1fr!important;}
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

/* ── Strip <think>...</think> blocks from AI output ── */
function stripThink(text) {
  if (!text) return "";
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^[\s\n]+/, "")
    .trim();
}

/* ── localStorage key ── */
const LS_KEY = "mywebsam_profile_v2";

/* ── Constants ── */
const ACCENT = "#6C63FF";
const SARVAM_KEY = "sk_rvgkd5mg_eorP6Y0JCfoWZxVqtCrmiOTB";

const SOCIAL_META = {
  email:         {icon:"fas fa-envelope",        color:"#EA4335", bg:"#fef2f2"},
  instagram:     {icon:"fab fa-instagram",        color:"#E4405F", bg:"#fdf2f4"},
  whatsapp:      {icon:"fab fa-whatsapp",         color:"#25D366", bg:"#edfaf3"},
  facebook:      {icon:"fab fa-facebook-f",       color:"#1877F2", bg:"#eef4ff"},
  youtube:       {icon:"fab fa-youtube",          color:"#FF0000", bg:"#fff2f2"},
  twitter:       {icon:"fab fa-x-twitter",        color:"#111",    bg:"#f5f5f5"},
  tiktok:        {icon:"fab fa-tiktok",           color:"#010101", bg:"#f5f5f5"},
  snapchat:      {icon:"fab fa-snapchat",         color:"#d4b800", bg:"#fffce8"},
  pinterest:     {icon:"fab fa-pinterest",        color:"#E60023", bg:"#fff0f1"},
  telegram:      {icon:"fab fa-telegram",         color:"#26A5E4", bg:"#edf7fd"},
  discord:       {icon:"fab fa-discord",          color:"#5865F2", bg:"#eef0ff"},
  linkedin:      {icon:"fab fa-linkedin-in",      color:"#0A66C2", bg:"#e8f3fc"},
  github:        {icon:"fab fa-github",           color:"#24292e", bg:"#f6f8fa"},
  twitch:        {icon:"fab fa-twitch",           color:"#9146FF", bg:"#f3eeff"},
  spotify:       {icon:"fab fa-spotify",          color:"#1DB954", bg:"#edfaf3"},
  reddit:        {icon:"fab fa-reddit-alien",     color:"#FF4500", bg:"#fff2ed"},
  medium:        {icon:"fab fa-medium",           color:"#333",    bg:"#f5f5f5"},
  devto:         {icon:"fab fa-dev",              color:"#0a0a0a", bg:"#f5f5f5"},
  codepen:       {icon:"fab fa-codepen",          color:"#111",    bg:"#f5f5f5"},
  stackoverflow: {icon:"fab fa-stack-overflow",   color:"#F58025", bg:"#fff4ed"},
  behance:       {icon:"fab fa-behance",          color:"#1769FF", bg:"#eef2ff"},
  dribbble:      {icon:"fab fa-dribbble",         color:"#ea4c89", bg:"#fdf0f5"},
  npm:           {icon:"fab fa-npm",              color:"#CC3534", bg:"#fff0f0"},
};

const ROLE_ICONS = {
  student:"fas fa-graduation-cap", professional:"fas fa-briefcase",
  creator:"fas fa-camera",         artist:"fas fa-palette",
  musician:"fas fa-music",         athlete:"fas fa-person-running",
  traveler:"fas fa-plane",         foodie:"fas fa-utensils",
  gamer:"fas fa-gamepad",          writer:"fas fa-pen-nib",
  entrepreneur:"fas fa-rocket",    parent:"fas fa-heart",
  volunteer:"fas fa-hand-holding-heart", other:"fas fa-star",
};

const LINK_ICONS = [
  "fas fa-link","fas fa-globe","fas fa-briefcase","fas fa-folder-open","fas fa-star",
  "fas fa-heart","fas fa-rocket","fas fa-bolt","fas fa-book-open","fas fa-video",
  "fas fa-microphone","fas fa-store","fas fa-graduation-cap","fas fa-code",
  "fas fa-pen-nib","fas fa-camera","fas fa-music","fas fa-gamepad","fas fa-trophy",
  "fas fa-film","fas fa-images","fas fa-newspaper","fas fa-podcast","fas fa-headphones",
  "fas fa-paintbrush","fas fa-leaf","fas fa-paw","fas fa-dumbbell","fas fa-plane",
  "fas fa-utensils","fas fa-flask","fas fa-laptop","fas fa-mobile-alt","fas fa-gift",
  "fas fa-handshake","fas fa-chart-bar","fas fa-comments","fas fa-envelope",
  "fas fa-map-marker-alt","fas fa-shopping-bag","fas fa-fire","fas fa-crown",
  "fas fa-gem","fas fa-sun","fas fa-moon","fas fa-cloud","fas fa-tree",
  "fas fa-futbol","fas fa-basketball","fas fa-baseball","fas fa-table-tennis-paddle-ball",
];

const SOCIALS_LIST = [
  {n:"email",        l:"Email",          p:"your@email.com"},
  {n:"instagram",    l:"Instagram",      p:"@username"},
  {n:"whatsapp",     l:"WhatsApp",       p:"+1234567890"},
  {n:"facebook",     l:"Facebook",       p:"username"},
  {n:"youtube",      l:"YouTube",        p:"@channel"},
  {n:"twitter",      l:"Twitter / X",   p:"@username"},
  {n:"tiktok",       l:"TikTok",         p:"@username"},
  {n:"snapchat",     l:"Snapchat",       p:"username"},
  {n:"pinterest",    l:"Pinterest",      p:"username"},
  {n:"telegram",     l:"Telegram",       p:"@username"},
  {n:"discord",      l:"Discord",        p:"username"},
  {n:"linkedin",     l:"LinkedIn",       p:"username"},
  {n:"github",       l:"GitHub",         p:"username"},
  {n:"twitch",       l:"Twitch",         p:"username"},
  {n:"spotify",      l:"Spotify",        p:"username"},
  {n:"reddit",       l:"Reddit",         p:"u/username"},
  {n:"medium",       l:"Medium",         p:"@username"},
  {n:"devto",        l:"DEV.to",         p:"username"},
  {n:"codepen",      l:"CodePen",        p:"username"},
  {n:"stackoverflow",l:"Stack Overflow", p:"user ID"},
  {n:"behance",      l:"Behance",        p:"username"},
  {n:"dribbble",     l:"Dribbble",       p:"username"},
  {n:"npm",          l:"npm",            p:"~username"},
];

const STEPS = ["Basic","Vibe","Social","Links","Publish"];

const ROLES = [
  {v:"student",l:"Student"},{v:"professional",l:"Professional"},
  {v:"creator",l:"Creator"},{v:"artist",l:"Artist"},
  {v:"musician",l:"Musician"},{v:"athlete",l:"Athlete"},
  {v:"traveler",l:"Traveler"},{v:"foodie",l:"Foodie"},
  {v:"gamer",l:"Gamer"},{v:"writer",l:"Writer"},
  {v:"entrepreneur",l:"Entrepreneur"},{v:"parent",l:"Parent"},
  {v:"volunteer",l:"Volunteer"},{v:"other",l:"Other"},
];

/* ── Massive interest lists — universal, not just dev ── */
const SPORTS = [
  "Cricket","Football","Basketball","Volleyball","Tennis","Badminton",
  "Table Tennis","Baseball","Rugby","Hockey","Swimming","Athletics",
  "Cycling","Boxing","Wrestling","Kabaddi","Kho-Kho","Archery",
  "Gymnastics","Skating","Skiing","Surfing","Golf","Squash",
  "Handball","Rowing","Sailing","Martial Arts","Judo","Karate",
  "Taekwondo","Fencing","Shooting","Weightlifting","Powerlifting",
  "CrossFit","Yoga","Pilates","Rock Climbing","Skateboarding",
  "Parkour","Cheerleading","Polo","Equestrian","Motorsports",
  "Formula 1","MMA","Chess","Esports","Snooker","Bowling",
];

const HOBBIES = [
  "Reading","Gaming","Cooking","Baking","Traveling","Photography",
  "Art & Crafts","Painting","Sketching","Dancing","Singing","Hiking",
  "Camping","Gardening","Fishing","Knitting","Sewing","Woodworking",
  "Pottery","Candle Making","Journaling","Blogging","Vlogging",
  "Podcasting","Streaming","Stand-up Comedy","Magic","Astronomy",
  "Birdwatching","Collecting","Origami","Calligraphy","Digital Art",
  "3D Printing","DIY Projects","Home Decor","Thrifting","Board Games",
  "Card Games","Puzzles","Meditation","Fitness","Running","Walking",
];

const MUSIC_G = [
  "Pop","Rock","Hip Hop","R&B","Electronic","Jazz","Classical",
  "Country","Metal","Indie","Latin","K-Pop","Folk","Reggae",
  "Lo-fi","Ambient","Blues","Soul","Gospel","Devotional",
  "Bollywood","Tollywood","Carnatic","Hindustani","EDM","House",
  "Techno","Drum & Bass","Trap","Afrobeats","Punjabi","Bhangra",
];

const VIBES = [
  "Chill","Adventurous","Creative","Ambitious","Funny","Romantic",
  "Spiritual","Minimalist","Social butterfly","Introverted","Outdoorsy",
  "Bookworm","Foodie","Night owl","Early bird","Tech-savvy",
  "Eco-conscious","Animal lover","Family-oriented","Hustler","Dreamer",
  "Old soul","Free spirit","Homebody","Globetrotter","Empath",
];

const PASSIONS = [
  "Family","Friendship","Health & Wellness","Nature","Animals","Travel",
  "Food","Fashion","Beauty","Fitness","Continuous Learning","Community",
  "Creativity","Mindfulness","Sustainability","Diversity & Inclusion",
  "Mental Health","Child Education","Women Empowerment","Social Work",
  "Technology","Space","Science","History","Philosophy","Spirituality",
];

const CODING_SKILLS = [
  "JavaScript","TypeScript","Python","Java","C++","C","Rust","Go",
  "Swift","Kotlin","React","Next.js","Node.js","Vue","Angular",
  "Flutter","React Native","Django","FastAPI","Spring Boot",
  "UI/UX Design","Figma","Machine Learning","Data Science",
  "Cybersecurity","DevOps","Blockchain","Cloud (AWS/GCP/Azure)",
  "Video Editing","Graphic Design","Photography Editing","3D / Blender",
];

const EMPTY_FORM = {
  username:"",name:"",dob:"",location:"",bio:"",avatar:"",
  socialProfiles:{},links:[],
  interests:{role:"",hobbies:[],sports:[],vibes:[],music:[],passions:[],skills:[]},
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function DevProfileCreator() {
  useEffect(() => { bootStyles(); }, []);

  /* ── view: "loading" | "dashboard" | "create" | "success" ── */
  const [view,       setView]       = useState("loading");
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [savedData,  setSavedData]  = useState(null); // the stored profile object
  const [newLink,    setNewLink]    = useState({title:"",url:"",icon:"fas fa-link"});
  const [showIcons,  setShowIcons]  = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiText,     setAiText]     = useState("");
  const [aiEdited,   setAiEdited]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [published,  setPublished]  = useState(null);
  const [copied,     setCopied]     = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileRef = useRef(null);

  /* ── On mount: check localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const profile = JSON.parse(raw);
        setSavedData(profile);
        setView("dashboard");
      } else {
        setView("create");
      }
    } catch {
      setView("create");
    }
  }, []);

  /* ── Persist to localStorage ── */
  const persist = useCallback((profile) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch {}
    setSavedData(profile);
  }, []);

  /* ── Load profile into form for editing ── */
  const loadIntoForm = useCallback((profile) => {
    setForm({
      username:       profile.username        || "",
      name:           profile.name            || "",
      dob:            profile.dob             || "",
      location:       profile.location        || "",
      bio:            profile.bio             || "",
      avatar:         profile.avatar          || "",
      socialProfiles: profile.socialProfiles  || {},
      links:          profile.links           || [],
      interests:      profile.interests       || EMPTY_FORM.interests,
    });
    setAiText(profile.aboutme || "");
    setAiEdited(false);
    setStep(1);
    setView("create");
  }, []);

  /* ── Computed ── */
  const filledSocials = Object.entries(form.socialProfiles).filter(([,v]) => v?.trim());
  const totalTags = Object.values(form.interests).flat().filter(Boolean).length;
  const score = Math.min(100, Math.round(
    [form.username,form.name,form.avatar,form.dob,form.location].filter(Boolean).length * 6 +
    Math.min(totalTags,12)*2.5 + Math.min(filledSocials.length,5)*4 +
    Math.min(form.links.length,3)*5 + (aiText||form.bio ? 5 : 0)
  ));

  const checklist = [
    {label:"Username set",             done:!!form.username},
    {label:"Full name added",          done:!!form.name},
    {label:"Profile photo",            done:!!form.avatar},
    {label:"Location added",           done:!!form.location},
    {label:"Role or vibe selected",    done:!!form.interests.role || form.interests.vibes.length>0},
    {label:"At least 3 interests",     done:totalTags>=3},
    {label:"Social profile linked",    done:filledSocials.length>0},
    {label:"Bio written or generated", done:!!(aiText||form.bio)},
  ];

  /* ── Stable handlers ── */
  const setField  = useCallback((k,v) => setForm(p=>({...p,[k]:v})), []);
  const setSocial = useCallback((n,v) => setForm(p=>({...p,socialProfiles:{...p.socialProfiles,[n]:v}})), []);
  const toggleTag = useCallback((cat,val) => setForm(p=>{
    const c=p.interests[cat];
    return {...p,interests:{...p.interests,[cat]:c.includes(val)?c.filter(x=>x!==val):[...c,val]}};
  }), []);
  const setRole = useCallback((v) => setForm(p=>({...p,interests:{...p.interests,role:p.interests.role===v?"":v}})), []);

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
    const url = /^https?:\/\//.test(newLink.url)?newLink.url:`https://${newLink.url}`;
    setForm(p=>({...p,links:[...p.links,{...newLink,url,id:Date.now()}]}));
    setNewLink({title:"",url:"",icon:"fas fa-link"});
    setShowIcons(false);
  };
  const removeLink = id => setForm(p=>({...p,links:p.links.filter(l=>l.id!==id)}));
  const moveLink   = (i,dir) => setForm(p=>{
    const ls=[...p.links]; const j=i+dir;
    if(j<0||j>=ls.length) return p;
    [ls[i],ls[j]]=[ls[j],ls[i]]; return {...p,links:ls};
  });

  /* ── Sarvam AI ── */
  const generateBio = async () => {
    setAiLoading(true);
    const role   = ROLES.find(r=>r.v===form.interests.role)?.l || "person";
    const sports = form.interests.sports.slice(0,4).join(", ");
    const hobbies= form.interests.hobbies.slice(0,4).join(", ");
    const vibes  = form.interests.vibes.slice(0,3).join(", ");
    const music  = form.interests.music.slice(0,3).join(", ");
    const name   = form.name || "this person";
    const loc    = form.location || "";

    /* System prompt that forces clean output — no thinking, no preamble */
    const systemPrompt = `You are a bio writer for a social profile page. Output ONLY the bio text. No thinking. No explanation. No preamble. No labels. Just 2-3 casual, warm, first-person sentences.`;

    const userPrompt = `Write a short, friendly, first-person bio for a profile page.
Person: ${name}${loc ? `, from ${loc}` : ""}.
They identify as: ${role}.
Vibes: ${vibes||"easy-going"}.
Sports they love: ${sports||"staying active"}.
Hobbies: ${hobbies||"varied interests"}.
Music: ${music||"all kinds"}.
Rules: 2-3 sentences only. Casual and warm tone. First person. No hashtags. No emojis. No <think> blocks. Output the bio directly.`;

    try {
      const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method:"POST",
        headers:{"Content-Type":"application/json","api-subscription-key":SARVAM_KEY},
        body: JSON.stringify({
          model:"sarvam-m",
          messages:[
            {role:"system", content:systemPrompt},
            {role:"user",   content:userPrompt},
          ],
          max_tokens:160,
          temperature:0.75,
        }),
      });
      const data = await res.json();
      const raw  = data?.choices?.[0]?.message?.content || "";
      const clean = stripThink(raw);
      if (clean.length > 10) {
        setAiText(clean);
        setAiEdited(false);
      } else throw new Error("empty");
    } catch {
      const fallbackParts = [name, role];
      if (vibes)   fallbackParts.push(`known for being ${vibes.split(",")[0].trim()}`);
      if (sports)  fallbackParts.push(`love playing ${sports.split(",")[0].trim()}`);
      if (hobbies) fallbackParts.push(`enjoy ${hobbies.split(",")[0].trim()}`);
      setAiText(`I'm ${name} — ${role}${loc?` based in ${loc}`:""}. I ${sports?"love playing "+sports.split(",")[0].trim()+" and ":""}enjoy ${hobbies?hobbies.split(",")[0].trim():"life to the fullest"}. Always exploring new things and making memories.`);
      setAiEdited(false);
    } finally {
      setAiLoading(false);
    }
  };

  /* ── Submit / Publish ── */
  const handleSubmit = async () => {
    setSubmitting(true);
    const aboutme = aiText || form.bio;
    const profile = {
      ...form,
      aboutme,
      savedAt: new Date().toISOString(),
      publishedUrl: `https://mywebsam.site/${form.username}`,
    };

    /* Always overwrite the single device profile */
    persist(profile);

    try {
      const res  = await fetch("/api/create", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({...form, aboutme}),
      });
      const data = await res.json();
      /* /api/create returns existing profile url on duplicate username — we just update */
      const url = data.url || `https://mywebsam.site/${form.username}`;
      persist({...profile, publishedUrl: url});
      setPublished({url, username:form.username});
    } catch {
      setPublished({url:`https://mywebsam.site/${form.username}`, username:form.username});
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    const url = published?.url || savedData?.publishedUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2200); });
  };

  const deleteProfile = () => {
    try { localStorage.removeItem(LS_KEY); } catch {}
    setSavedData(null);
    setPublished(null);
    setForm(EMPTY_FORM);
    setAiText("");
    setView("create");
    setShowDeleteConfirm(false);
  };

  /* ── Small UI helpers ── */
  const Lbl = ({children,req}) => (
    <div className="lbl">{children}{req&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}</div>
  );
  const Hint = ({icon="fas fa-info-circle",children}) => (
    <div className="hint"><i className={icon} style={{color:ACCENT,fontSize:11}}/>{children}</div>
  );
  const SHead = ({icon,title,sub}) => (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
          <i className={icon}/>
        </div>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,color:"#111827",lineHeight:1.15}}>{title}</h2>
          {sub&&<p style={{fontSize:12,color:"#6b7280",marginTop:3}}>{sub}</p>}
        </div>
      </div>
    </div>
  );
  const TagGrid = ({items,cat}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {items.map(item=>{
        const on=form.interests[cat].includes(item);
        return (
          <button key={item} type="button" className={`tag ${on?"on":""}`} onClick={()=>toggleTag(cat,item)}>
            {on&&<i className="fas fa-check" style={{fontSize:9}}/>}{item}
          </button>
        );
      })}
    </div>
  );
  const NavRow = ({canGo=true}) => (
    <div style={{display:"flex",gap:10,marginTop:22}}>
      {step>1&&<button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(s=>s-1)}><i className="fas fa-arrow-left" style={{fontSize:12}}/> Back</button>}
      {step<5&&<button type="button" className="btn btn-p" style={{flex:2}} onClick={()=>setStep(s=>s+1)} disabled={!canGo}>Continue <i className="fas fa-arrow-right" style={{fontSize:12}}/></button>}
    </div>
  );

  /* Topbar — shared */
  const Topbar = ({right}) => (
    <div className="topbar">
      <a href="https://mywebsam.site/" target="_blank" rel="noreferrer"
        style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <div style={{width:28,height:28,borderRadius:8,background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <i className="fas fa-link" style={{color:"#fff",fontSize:12}}/>
        </div>
        <span style={{fontWeight:800,fontSize:15,color:"#111827"}}>mywebsam</span>
      </a>
      {right}
    </div>
  );
  const Footer = () => <div className="footer">Made with ❤️‍🔥 by <strong>Samartha GS</strong></div>;

  /* ════════════════════════════════════
     LOADING
  ════════════════════════════════════ */
  if (view==="loading") {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f6fa"}}>
        <i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite",fontSize:28,color:ACCENT}}/>
      </div>
    );
  }

  /* ════════════════════════════════════
     DASHBOARD — profile already exists
  ════════════════════════════════════ */
  if (view==="dashboard" && savedData && !published) {
    const sp = savedData;
    const filledS = Object.entries(sp.socialProfiles||{}).filter(([,v])=>v?.trim());
    const profileUrl = sp.publishedUrl || `https://mywebsam.site/${sp.username}`;
    return (
      <div style={{minHeight:"100vh",background:"#f5f6fa",paddingBottom:40}}>
        <Topbar right={
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className="btn btn-s" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>loadIntoForm(sp)}>
              <i className="fas fa-pen" style={{fontSize:11}}/> Edit
            </button>
          </div>
        }/>

        <div style={{maxWidth:520,margin:"0 auto",padding:"28px 14px 0"}}>
          {/* Profile card */}
          <div className="card pop" style={{textAlign:"center",padding:"32px 24px",marginBottom:14}}>
            {sp.avatar
              ? <img src={sp.avatar} alt="av" style={{width:90,height:90,borderRadius:"50%",objectFit:"cover",border:`3px solid ${ACCENT}`,marginBottom:14}}/>
              : <div style={{width:90,height:90,borderRadius:"50%",background:"#ede9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,color:ACCENT,margin:"0 auto 14px"}}>
                  <i className="fas fa-user"/>
                </div>}
            <h2 style={{fontSize:22,fontWeight:800,marginBottom:4}}>{sp.name}</h2>
            <div style={{fontSize:13,color:ACCENT,fontWeight:600,marginBottom:sp.location?6:0}}>@{sp.username}</div>
            {sp.location&&<div style={{fontSize:12,color:"#6b7280",marginBottom:10}}><i className="fas fa-location-dot" style={{marginRight:4}}/>{sp.location}</div>}
            {(sp.aboutme||sp.bio)&&<p style={{fontSize:14,color:"#6b7280",lineHeight:1.7,maxWidth:360,margin:"0 auto 16px"}}>{sp.aboutme||sp.bio}</p>}

            {/* Social icons */}
            {filledS.length>0&&(
              <div style={{display:"flex",justifyContent:"center",gap:9,marginBottom:18,flexWrap:"wrap"}}>
                {filledS.map(([n])=>{
                  const m=SOCIAL_META[n]||{icon:"fas fa-link",color:"#6b7280",bg:"#f9fafb"};
                  return <div key={n} style={{width:36,height:36,borderRadius:9,background:m.bg,color:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}><i className={m.icon}/></div>;
                })}
              </div>
            )}

            {/* Links */}
            {(sp.links||[]).length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left",marginBottom:20}}>
                {sp.links.map(link=>(
                  <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",background:"#f8f7ff",borderRadius:10,border:`1.5px solid #ede9ff`,textDecoration:"none",color:"#111827"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <i className={link.icon} style={{color:ACCENT,fontSize:13}}/>
                      <span style={{fontWeight:600,fontSize:14}}>{link.title}</span>
                    </div>
                    <i className="fas fa-arrow-right" style={{color:"#b0b7c3",fontSize:11}}/>
                  </a>
                ))}
              </div>
            )}

            {/* URL row */}
            <div style={{display:"flex",alignItems:"center",background:"#f5f6fa",border:"1.5px solid #e9eaf0",borderRadius:10,padding:"10px 14px",marginBottom:14,gap:10}}>
              <i className="fas fa-globe" style={{color:ACCENT,fontSize:13,flexShrink:0}}/>
              <span style={{flex:1,fontSize:12,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{profileUrl}</span>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(profileUrl,"_blank")}>
                <i className="fas fa-arrow-up-right-from-square"/> View
              </button>
              <button className="btn btn-s" style={{width:"100%"}} onClick={copyLink}>
                <i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/> {copied?"Copied!":"Copy Link"}
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>{
                window.open(`https://wa.me/?text=${encodeURIComponent("Check out my profile! "+profileUrl)}`,"_blank");
              }}><i className="fab fa-whatsapp" style={{color:"#25D366"}}/> WhatsApp</button>
              <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>{
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my profile! "+profileUrl)}`,"_blank");
              }}><i className="fab fa-x-twitter"/> Share</button>
            </div>

            <button className="btn btn-s" style={{width:"100%",fontSize:13}} onClick={()=>loadIntoForm(sp)}>
              <i className="fas fa-pen"/> Edit Profile
            </button>
          </div>

          {/* Last saved */}
          <div style={{textAlign:"center",fontSize:12,color:"#b0b7c3",marginBottom:8}}>
            <i className="fas fa-clock" style={{marginRight:5}}/>
            Last saved {new Date(sp.savedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
          </div>

          {/* Delete */}
          {!showDeleteConfirm ? (
            <div style={{textAlign:"center"}}>
              <button className="btn btn-warn" style={{fontSize:12}} onClick={()=>setShowDeleteConfirm(true)}>
                <i className="fas fa-trash"/> Delete & Start Over
              </button>
            </div>
          ):(
            <div className="card" style={{padding:"16px",textAlign:"center"}}>
              <p style={{fontSize:13,color:"#374151",marginBottom:14}}>This will permanently delete your saved profile from this device.</p>
              <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                <button className="btn btn-s" style={{fontSize:13}} onClick={()=>setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn btn-d" style={{fontSize:13}} onClick={deleteProfile}><i className="fas fa-trash"/> Yes, Delete</button>
              </div>
            </div>
          )}
        </div>
        <Footer/>
      </div>
    );
  }

  /* ════════════════════════════════════
     SUCCESS SCREEN
  ════════════════════════════════════ */
  if (published) {
    return (
      <div style={{minHeight:"100vh",background:"#f5f6fa",display:"flex",flexDirection:"column"}}>
        <Topbar/>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
          <div style={{maxWidth:440,width:"100%"}}>
            <div style={{position:"relative",height:40}}>
              {["#6C63FF","#10b981","#f59e0b","#ef4444","#0ea5e9","#ec4899"].map((c,i)=>(
                <div key={i} className="confetti-piece" style={{background:c,left:`${10+i*14}%`,animationDelay:`${i*0.12}s`}}/>
              ))}
            </div>
            <div className="card pop" style={{textAlign:"center",padding:"36px 24px"}}>
              <div className="success-ring"><i className="fas fa-check" style={{color:"#fff",fontSize:36}}/></div>
              <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>
                {savedData ? "Profile Updated!" : "Profile Created!"}
              </h2>
              <p style={{color:"#6b7280",fontSize:14,lineHeight:1.6,marginBottom:20}}>
                Live at <strong style={{color:ACCENT}}>mywebsam.site/{published.username}</strong>
              </p>
              <div style={{display:"flex",alignItems:"center",background:"#f5f6fa",border:"1.5px solid #e9eaf0",borderRadius:10,padding:"10px 14px",marginBottom:18,gap:10}}>
                <i className="fas fa-globe" style={{color:ACCENT,fontSize:13,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{published.url}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(published.url,"_blank")}>
                  <i className="fas fa-arrow-up-right-from-square"/> View
                </button>
                <button className="btn btn-s" style={{width:"100%"}} onClick={copyLink}>
                  <i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/>{copied?" Copied!":" Copy Link"}
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent("Check out my profile! "+published.url)}`,"_blank")}>
                  <i className="fab fa-whatsapp" style={{color:"#25D366"}}/> WhatsApp
                </button>
                <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my profile! "+published.url)}`,"_blank")}>
                  <i className="fab fa-x-twitter"/> Share
                </button>
              </div>
              <button className="btn btn-gh" style={{width:"100%",fontSize:13}} onClick={()=>setView("dashboard")}>
                <i className="fas fa-home"/> Go to Dashboard
              </button>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  /* ════════════════════════════════════
     CREATE / EDIT FORM
  ════════════════════════════════════ */
  return (
    <div style={{minHeight:"100vh",background:"#f5f6fa",paddingBottom:40}}>
      <Topbar right={
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {savedData&&(
            <button className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setView("dashboard")}>
              <i className="fas fa-arrow-left" style={{fontSize:11}}/> Dashboard
            </button>
          )}
          <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>{score}%</span>
          <div style={{width:52,height:5,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${score}%`,height:"100%",background:score>=80?"#10b981":ACCENT,borderRadius:99,transition:"width 0.4s ease"}}/>
          </div>
        </div>
      }/>

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 14px 12px"}}>

        {/* Step indicator */}
        <div style={{display:"flex",alignItems:"flex-start",marginBottom:20,gap:4}}>
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
                {s<5&&<div style={{flex:1,height:2,background:step>s?"#10b981":"#e9eaf0",margin:"0 3px",marginBottom:18,borderRadius:1,transition:"background 0.3s"}}/>}
              </div>
            );
          })}
        </div>

        {/* ═══ STEP 1 ═══ */}
        {step===1&&(
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
                {form.username&&<Hint icon="fas fa-globe">mywebsam.site/<strong style={{color:ACCENT}}>{form.username}</strong></Hint>}
                {savedData&&savedData.username&&form.username!==savedData.username&&(
                  <Hint icon="fas fa-triangle-exclamation">Changing username will update your profile link.</Hint>
                )}
              </div>

              <div style={{marginBottom:14}}>
                <Lbl req>Full Name</Lbl>
                <input className="inp" placeholder="Your full name" value={form.name} onChange={e=>setField("name",e.target.value)}/>
              </div>

              <div className="grid2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
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
              <div style={{display:"flex",alignItems:"center",gap:16,padding:14,borderRadius:12,cursor:"pointer",border:`2px dashed ${dragOver?"#6C63FF":form.avatar?"#6C63FF":"#e5e7eb"}`,background:dragOver?"#f2f0ff":form.avatar?"#f8f7ff":"#fafafa",transition:"all .2s"}}
                onClick={()=>fileRef.current?.click()}
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={handleDrop}>
                {form.avatar?(
                  <>
                    <img src={form.avatar} alt="avatar" style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:`2.5px solid ${ACCENT}`,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,marginBottom:2}}>Looking great!</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click to change</div>
                    </div>
                    <button type="button" className="btn btn-d" onClick={e=>{e.stopPropagation();setField("avatar","");}}>
                      <i className="fas fa-trash"/>
                    </button>
                  </>
                ):(
                  <>
                    <div style={{width:64,height:64,borderRadius:"50%",background:"#ede9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:ACCENT,flexShrink:0}}>
                      {uploading?<i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/>:<i className="fas fa-camera"/>}
                    </div>
                    <div>
                      <div style={{fontWeight:600,marginBottom:2}}>{uploading?"Uploading...":"Add a Photo"}</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click or drag & drop</div>
                      <div style={{fontSize:11,color:"#b0b7c3",marginTop:2}}>PNG, JPG, GIF, WebP · Saved locally</div>
                    </div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
            </div>
            <NavRow canGo={!!form.username&&!!form.name}/>
          </div>
        )}

        {/* ═══ STEP 2 ═══ */}
        {step===2&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-face-smile" title="Your Vibe & Interests" sub="Select everything that describes you — sports, hobbies, music, passions."/>

              {/* Role */}
              <div style={{marginBottom:18}}>
                <Lbl>I am a...</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {ROLES.map(r=>{
                    const on=form.interests.role===r.v;
                    return (
                      <button key={r.v} type="button" className={`tag ${on?"on":""}`} style={{borderRadius:10}} onClick={()=>setRole(r.v)}>
                        <i className={ROLE_ICONS[r.v]||"fas fa-star"} style={{width:13,textAlign:"center"}}/>{r.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="section-divider"/>

              {/* Vibes */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl>My Vibe</Lbl>
                  {form.interests.vibes.length>0&&<span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests.vibes.length} selected</span>}
                </div>
                <TagGrid items={VIBES} cat="vibes"/>
              </div>

              <div className="section-divider"/>

              {/* Sports */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl>Sports I Love</Lbl>
                  {form.interests.sports.length>0&&<span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests.sports.length} selected</span>}
                </div>
                <TagGrid items={SPORTS} cat="sports"/>
              </div>

              <div className="section-divider"/>

              {/* Hobbies */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl>Hobbies</Lbl>
                  {form.interests.hobbies.length>0&&<span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests.hobbies.length} selected</span>}
                </div>
                <TagGrid items={HOBBIES} cat="hobbies"/>
              </div>

              <div className="section-divider"/>

              {/* Music */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl>Music I Love</Lbl>
                  {form.interests.music.length>0&&<span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests.music.length} selected</span>}
                </div>
                <TagGrid items={MUSIC_G} cat="music"/>
              </div>

              <div className="section-divider"/>

              {/* Passions */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl>Things I Care About</Lbl>
                  {form.interests.passions.length>0&&<span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests.passions.length} selected</span>}
                </div>
                <TagGrid items={PASSIONS} cat="passions"/>
              </div>

              <div className="section-divider"/>

              {/* Coding / Skills (optional) */}
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <Lbl>Skills & Tools <span style={{color:"#b0b7c3",fontWeight:400,textTransform:"none",fontSize:11}}>(optional)</span></Lbl>
                  {form.interests.skills.length>0&&<span style={{fontSize:11,color:ACCENT,fontWeight:600}}>{form.interests.skills.length} selected</span>}
                </div>
                <TagGrid items={CODING_SKILLS} cat="skills"/>
              </div>
            </div>

            {/* AI Bio */}
            <div className="card">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <Lbl>AI Bio Generator</Lbl>
                <div className="ai-badge"><i className="fas fa-wand-magic-sparkles"/>expo.1 · Sarvam AI</div>
              </div>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>
                Select your interests above, then click generate. The AI will write a personalised bio — you can edit it after.
              </p>
              <button type="button" className="btn btn-g" style={{width:"100%"}} onClick={generateBio} disabled={aiLoading}>
                {aiLoading
                  ? <><i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> Generating...</>
                  : <><i className="fas fa-wand-magic-sparkles"/> Generate My Bio</>}
              </button>

              {aiText&&(
                <div style={{marginTop:14,borderTop:"1px solid #f0edff",paddingTop:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                    <div className="ai-badge"><i className="fas fa-robot"/> expo.1 Generated</div>
                    <button type="button"
                      style={{background:"none",border:"none",fontSize:12,color:ACCENT,cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}}
                      onClick={generateBio} disabled={aiLoading}>
                      <i className="fas fa-redo" style={{marginRight:4,fontSize:10}}/>Regenerate
                    </button>
                  </div>
                  <textarea className="inp" rows={3} value={aiText}
                    onChange={e=>{setAiText(e.target.value);setAiEdited(true);}}
                    style={{resize:"vertical",lineHeight:1.6}}/>
                  {aiEdited&&<Hint icon="fas fa-pencil">Edited — your version will be used.</Hint>}
                </div>
              )}
            </div>
            <NavRow/>
          </div>
        )}

        {/* ═══ STEP 3 ═══ */}
        {step===3&&(
          <div className="fu">
            <div className="card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:8}}>
                <SHead icon="fas fa-share-nodes" title="Social Profiles" sub="Only filled ones appear on your page."/>
                {filledSocials.length>0&&<div className="badge-green"><i className="fas fa-check" style={{fontSize:9}}/>{filledSocials.length} linked</div>}
              </div>
              <div className="soc-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8,marginTop:8}}>
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
                      {val&&<i className="fas fa-circle-check" style={{color:"#10b981",fontSize:13}}/>}
                    </div>
                  );
                })}
              </div>
            </div>
            <NavRow/>
          </div>
        )}

        {/* ═══ STEP 4 ═══ */}
        {step===4&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-link" title="Your Links" sub="Portfolio, shop, blog, project — anything."/>

              <div style={{background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:12,padding:14,marginBottom:16}}>
                <Lbl>Add a Link</Lbl>
                <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <input className="inp" style={{flex:"0 0 140px",minWidth:0}} placeholder="Label"
                    value={newLink.title} onChange={e=>setNewLink(p=>({...p,title:e.target.value}))}/>
                  <input className="inp" style={{flex:1,minWidth:130}} placeholder="https://..."
                    value={newLink.url} onChange={e=>setNewLink(p=>({...p,url:e.target.value}))}/>
                </div>
                <div style={{marginBottom:10}}>
                  <button type="button" className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setShowIcons(v=>!v)}>
                    <i className={newLink.icon}/> Icon <i className={`fas fa-chevron-${showIcons?"up":"down"}`} style={{fontSize:10}}/>
                  </button>
                  {showIcons&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,maxHeight:160,overflowY:"auto",padding:2}}>
                      {LINK_ICONS.map(ic=>(
                        <button key={ic} type="button"
                          style={{width:36,height:36,borderRadius:8,border:`1.5px solid ${newLink.icon===ic?"#6C63FF":"#e5e7eb"}`,background:newLink.icon===ic?"#f0edff":"#fff",color:newLink.icon===ic?"#6C63FF":"#6b7280",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                          onClick={()=>{setNewLink(p=>({...p,icon:ic}));setShowIcons(false);}}>
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

              {form.links.length===0?(
                <div style={{textAlign:"center",padding:"24px",color:"#b0b7c3"}}>
                  <i className="fas fa-link" style={{fontSize:24,marginBottom:8,display:"block"}}/>
                  <div style={{fontSize:14}}>No links yet.</div>
                </div>
              ):(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl>Your Links ({form.links.length})</Lbl>
                    <span style={{fontSize:11,color:"#b0b7c3"}}>↑↓ to reorder</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {form.links.map((link,idx)=>(
                      <div key={link.id} className="lr">
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===0?"default":"pointer",color:idx===0?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}} onClick={()=>moveLink(idx,-1)}><i className="fas fa-chevron-up"/></button>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===form.links.length-1?"default":"pointer",color:idx===form.links.length-1?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}} onClick={()=>moveLink(idx,1)}><i className="fas fa-chevron-down"/></button>
                        </div>
                        <div style={{width:32,height:32,borderRadius:8,background:"#f0edff",color:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}><i className={link.icon}/></div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14}}>{link.title}</div>
                          <div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link.url}</div>
                        </div>
                        <a href={link.url} target="_blank" rel="noreferrer" style={{padding:"4px 8px",color:"#9ca3af",textDecoration:"none",fontSize:12}} onClick={e=>e.stopPropagation()}><i className="fas fa-arrow-up-right-from-square"/></a>
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

        {/* ═══ STEP 5 ═══ */}
        {step===5&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <SHead icon="fas fa-rocket" title={savedData?"Update Profile":"Ready to Publish?"} sub="Review your checklist and go live."/>

              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {checklist.map(item=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:item.done?"#f0fdf4":"#fafafa",border:`1.5px solid ${item.done?"#bbf7d0":"#e9eaf0"}`,borderRadius:10}}>
                    <i className={item.done?"fas fa-circle-check":"far fa-circle"} style={{color:item.done?"#10b981":"#d1d5db",fontSize:16,flexShrink:0}}/>
                    <span style={{fontSize:14,fontWeight:item.done?600:400,color:item.done?"#065f46":"#9ca3af"}}>{item.label}</span>
                    {item.done&&<i className="fas fa-check" style={{color:"#10b981",fontSize:11,marginLeft:"auto"}}/>}
                  </div>
                ))}
              </div>

              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Profile Completeness</span>
                  <span style={{fontSize:12,fontWeight:700,color:score>=80?"#10b981":ACCENT}}>{score}%</span>
                </div>
                <div style={{height:8,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:`${score}%`,height:"100%",background:score>=80?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#6C63FF,#818cf8)",borderRadius:99,transition:"width 0.5s ease"}}/>
                </div>
              </div>

              <div style={{display:"flex",gap:10}}>
                <button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(4)}>
                  <i className="fas fa-arrow-left" style={{fontSize:12}}/> Back
                </button>
                <button type="button" className="btn btn-p" style={{flex:2}}
                  onClick={handleSubmit} disabled={submitting||!form.username||!form.name}>
                  {submitting
                    ? <><i className="fas fa-spinner" style={{animation:"spin 0.8s linear infinite"}}/> {savedData?"Updating...":"Publishing..."}</>
                    : <><i className="fas fa-rocket"/> {savedData?"Update Profile":"Publish Profile"}</>}
                </button>
              </div>
              {(!form.username||!form.name)&&(
                <div style={{marginTop:10,fontSize:13,color:"#ef4444",textAlign:"center"}}>
                  <i className="fas fa-triangle-exclamation" style={{marginRight:5}}/>Username and name are required.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
