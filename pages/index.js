import { useState, useRef, useCallback, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   STYLE INJECTION — runs once in browser only (SSR safe)
───────────────────────────────────────────────────────────── */
let _stylesLoaded = false;

function loadStyles() {
  if (typeof window === "undefined" || _stylesLoaded) return;
  _stylesLoaded = true;

  // Font Awesome + Google Font
  [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  ].forEach((href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  });

  if (document.getElementById("mws-global-css")) return;
  const style = document.createElement("style");
  style.id = "mws-global-css";
  style.textContent = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#f4f5f9;color:#111827;-webkit-font-smoothing:antialiased;}
*{-webkit-tap-highlight-color:transparent;}
*:focus{outline:none!important;}
button::-moz-focus-inner{border:0;}
input:focus,textarea:focus,select:focus{
  border-color:#6C63FF!important;
  box-shadow:0 0 0 3px rgba(108,99,255,0.15)!important;
}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px;}

@keyframes mwsFadeUp{
  from{opacity:0;transform:translateY(14px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes mwsSpin{to{transform:rotate(360deg);}}
@keyframes mwsPopIn{
  0%{opacity:0;transform:scale(0.85);}
  100%{opacity:1;transform:scale(1);}
}
@keyframes mwsFall{
  0%{transform:translateY(-10px) rotate(0deg);opacity:1;}
  100%{transform:translateY(90px) rotate(400deg);opacity:0;}
}

.mws-fu{animation:mwsFadeUp 0.3s cubic-bezier(0.22,0.68,0,1.15) both;}
.mws-pop{animation:mwsPopIn 0.38s cubic-bezier(0.22,0.68,0,1.2) both;}
.mws-spin{animation:mwsSpin 0.8s linear infinite;}
.mws-confetti{position:absolute;width:9px;height:9px;border-radius:2px;animation:mwsFall 1.5s ease-out forwards;}

/* ── Inputs ── */
.mws-inp{
  width:100%;padding:11px 14px;
  background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;
  color:#111827;font-family:inherit;font-size:14px;
  transition:border-color .15s,box-shadow .15s;
  -webkit-appearance:none;
}
.mws-inp::placeholder{color:#adb5c0;}
.mws-inp:hover:not(:focus){border-color:#c5c8f6;}

/* ── Buttons ── */
.mws-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 20px;border-radius:10px;border:none;
  font-family:inherit;font-size:14px;font-weight:600;
  cursor:pointer;transition:background .14s,transform .1s,box-shadow .14s;
  user-select:none;white-space:nowrap;line-height:1;
  -webkit-appearance:none;
}
.mws-btn:active{transform:scale(0.96)!important;box-shadow:none!important;}
.mws-btn:disabled{opacity:0.38;cursor:not-allowed;transform:none!important;box-shadow:none!important;}

.mws-btn-primary{background:#6C63FF;color:#fff;}
.mws-btn-primary:hover{background:#5a52e8;box-shadow:0 4px 18px rgba(108,99,255,.32);transform:translateY(-1px);}

.mws-btn-secondary{background:#fff;color:#374151;border:1.5px solid #e5e7eb;}
.mws-btn-secondary:hover{background:#f9fafb;transform:translateY(-1px);}

.mws-btn-green{background:#10b981;color:#fff;}
.mws-btn-green:hover{background:#059669;box-shadow:0 4px 18px rgba(16,185,129,.3);transform:translateY(-1px);}

.mws-btn-ghost{background:transparent;color:#6b7280;border:1.5px solid #e5e7eb;}
.mws-btn-ghost:hover{background:#f9fafb;color:#374151;}

.mws-btn-danger{background:transparent;color:#ef4444;border:1.5px solid #fca5a5;padding:7px 12px;font-size:13px;}
.mws-btn-danger:hover{background:#fef2f2;border-color:#ef4444;}

/* ── Tags / pills ── */
.mws-tag{
  display:inline-flex;align-items:center;gap:5px;
  padding:6px 13px;border-radius:999px;
  border:1.5px solid #e5e7eb;background:#fff;color:#6b7280;
  font-family:inherit;font-size:13px;font-weight:500;
  cursor:pointer;transition:all .14s ease;user-select:none;
}
.mws-tag:hover{border-color:#6C63FF;color:#6C63FF;background:#f2f0ff;}
.mws-tag:active{transform:scale(0.95);}
.mws-tag.mws-on{background:#6C63FF;border-color:#6C63FF;color:#fff;}

/* ── Cards ── */
.mws-card{
  background:#fff;border:1.5px solid #e9eaf0;
  border-radius:16px;padding:20px;
}

/* ── Step dots ── */
.mws-dot{
  width:30px;height:30px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;font-family:inherit;
  border:2px solid #e5e7eb;background:#fff;color:#9ca3af;
  transition:all .2s ease;flex-shrink:0;
}
.mws-dot.done{background:#10b981;border-color:#10b981;color:#fff;}
.mws-dot.active{background:#6C63FF;border-color:#6C63FF;color:#fff;box-shadow:0 0 0 4px rgba(108,99,255,.16);}
.mws-steplbl{font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#b0b7c3;white-space:nowrap;margin-top:4px;}
.mws-steplbl.active{color:#6C63FF;}
.mws-steplbl.done{color:#10b981;}

/* ── Social input card ── */
.mws-sc{
  display:flex;align-items:center;gap:10px;
  padding:11px 13px;background:#fff;
  border:1.5px solid #e9eaf0;border-radius:10px;
  transition:border-color .15s,box-shadow .15s;
}
.mws-sc:focus-within{border-color:#6C63FF;box-shadow:0 0 0 3px rgba(108,99,255,.1);}
.mws-sc-inp{flex:1;border:none;background:transparent;font-family:inherit;font-size:13.5px;color:#111827;min-width:0;}
.mws-sc-inp::placeholder{color:#adb5c0;}

/* ── Link row ── */
.mws-lr{
  display:flex;align-items:center;gap:10px;
  padding:11px 14px;background:#fff;
  border:1.5px solid #e9eaf0;border-radius:10px;
  transition:border-color .15s,box-shadow .15s;
}
.mws-lr:hover{border-color:#c7c3f9;box-shadow:0 2px 8px rgba(108,99,255,.07);}

/* ── Topbar ── */
.mws-topbar{
  background:#fff;border-bottom:1px solid #e9eaf0;
  padding:10px 16px;
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:100;
}

/* ── Share overlay ── */
.mws-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,0.5);
  z-index:1000;display:flex;align-items:flex-end;justify-content:center;
}
.mws-sheet{
  background:#fff;border-radius:20px 20px 0 0;
  padding:20px 16px 40px;width:100%;max-width:520px;
  animation:mwsFadeUp 0.22s ease;
}
.mws-share-grid{
  display:flex;flex-wrap:wrap;gap:8px;justify-content:center;
}
.mws-share-item{
  display:flex;flex-direction:column;align-items:center;gap:5px;
  cursor:pointer;user-select:none;width:68px;padding:4px;
  border-radius:12px;transition:background .14s;
}
.mws-share-item:hover{background:#f5f5f5;}
.mws-share-item:active{transform:scale(0.9);}
.mws-share-icon{
  width:52px;height:52px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  font-size:22px;
}
.mws-share-label{font-size:11px;font-weight:600;color:#374151;text-align:center;line-height:1.2;}

/* ── Success ring ── */
.mws-sring{
  width:84px;height:84px;border-radius:50%;
  background:linear-gradient(135deg,#6C63FF,#10b981);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 20px;
  box-shadow:0 8px 32px rgba(108,99,255,.28);
}

/* ── Misc ── */
.mws-lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;}
.mws-hint{font-size:12px;color:#6b7280;margin-top:5px;display:flex;align-items:center;gap:5px;}
.mws-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;}
.mws-aibadge{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:linear-gradient(135deg,#f0edff,#e0fdf4);border:1px solid #c4b5fd;font-size:11px;font-weight:700;color:#5b21b6;}
.mws-cc{font-size:11px;color:#adb5c0;text-align:right;margin-top:4px;}
.mws-cc.w{color:#f59e0b;}.mws-cc.o{color:#ef4444;}
.mws-divider{height:1px;background:#f0f0f5;margin:18px 0;}
.mws-footer{text-align:center;padding:24px 16px 20px;font-size:13px;color:#9ca3af;}
.mws-urlbox{display:flex;align-items:center;gap:10px;background:#f8f7ff;border:1.5px solid #ede9ff;border-radius:12px;padding:12px 16px;}

@media(max-width:520px){
  .mws-card{padding:14px;}
  .mws-btn{padding:10px 14px;font-size:13px;}
  .mws-dot{width:26px;height:26px;font-size:10px;}
  .mws-steplbl{display:none;}
  .mws-g2{grid-template-columns:1fr!important;}
  .mws-sg{grid-template-columns:1fr!important;}
  .mws-share-item{width:60px;}
  .mws-share-icon{width:46px;height:46px;font-size:20px;}
}
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const LS_KEY  = "mws_v5";
const ACCENT  = "#6C63FF";
const GROQ_KEY = "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";

const SOCIAL_META = {
  email:        {icon:"fas fa-envelope",      color:"#EA4335",bg:"#fef2f2"},
  instagram:    {icon:"fab fa-instagram",      color:"#E4405F",bg:"#fdf2f4"},
  whatsapp:     {icon:"fab fa-whatsapp",       color:"#25D366",bg:"#edfaf3"},
  facebook:     {icon:"fab fa-facebook-f",     color:"#1877F2",bg:"#eef4ff"},
  youtube:      {icon:"fab fa-youtube",        color:"#FF0000",bg:"#fff2f2"},
  twitter:      {icon:"fab fa-x-twitter",      color:"#111",   bg:"#f5f5f5"},
  tiktok:       {icon:"fab fa-tiktok",         color:"#010101",bg:"#f5f5f5"},
  snapchat:     {icon:"fab fa-snapchat",       color:"#c9a800",bg:"#fffce8"},
  pinterest:    {icon:"fab fa-pinterest",      color:"#E60023",bg:"#fff0f1"},
  telegram:     {icon:"fab fa-telegram",       color:"#26A5E4",bg:"#edf7fd"},
  discord:      {icon:"fab fa-discord",        color:"#5865F2",bg:"#eef0ff"},
  linkedin:     {icon:"fab fa-linkedin-in",    color:"#0A66C2",bg:"#e8f3fc"},
  github:       {icon:"fab fa-github",         color:"#24292e",bg:"#f6f8fa"},
  twitch:       {icon:"fab fa-twitch",         color:"#9146FF",bg:"#f3eeff"},
  spotify:      {icon:"fab fa-spotify",        color:"#1DB954",bg:"#edfaf3"},
  reddit:       {icon:"fab fa-reddit-alien",   color:"#FF4500",bg:"#fff2ed"},
  medium:       {icon:"fab fa-medium",         color:"#333",   bg:"#f5f5f5"},
  devto:        {icon:"fab fa-dev",            color:"#0a0a0a",bg:"#f5f5f5"},
  codepen:      {icon:"fab fa-codepen",        color:"#111",   bg:"#f5f5f5"},
  stackoverflow:{icon:"fab fa-stack-overflow", color:"#F58025",bg:"#fff4ed"},
  behance:      {icon:"fab fa-behance",        color:"#1769FF",bg:"#eef2ff"},
  dribbble:     {icon:"fab fa-dribbble",       color:"#ea4c89",bg:"#fdf0f5"},
  npm:          {icon:"fab fa-npm",            color:"#CC3534",bg:"#fff0f0"},
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
  "fas fa-link","fas fa-globe","fas fa-briefcase","fas fa-folder-open",
  "fas fa-star","fas fa-heart","fas fa-rocket","fas fa-bolt",
  "fas fa-book-open","fas fa-video","fas fa-microphone","fas fa-store",
  "fas fa-graduation-cap","fas fa-code","fas fa-pen-nib","fas fa-camera",
  "fas fa-music","fas fa-gamepad","fas fa-trophy","fas fa-film",
  "fas fa-images","fas fa-newspaper","fas fa-podcast","fas fa-headphones",
  "fas fa-paintbrush","fas fa-leaf","fas fa-paw","fas fa-dumbbell",
  "fas fa-plane","fas fa-utensils","fas fa-flask","fas fa-laptop",
  "fas fa-gift","fas fa-handshake","fas fa-chart-bar","fas fa-fire",
  "fas fa-crown","fas fa-gem","fas fa-sun","fas fa-moon",
  "fas fa-futbol","fas fa-basketball","fas fa-baseball","fas fa-tree",
  "fas fa-shopping-bag","fas fa-map-marker-alt","fas fa-coffee",
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

const SPORTS = ["Cricket","Football","Basketball","Volleyball","Tennis","Badminton","Table Tennis","Baseball","Rugby","Hockey","Swimming","Athletics","Cycling","Boxing","Wrestling","Kabaddi","Kho-Kho","Archery","Gymnastics","Skating","Skiing","Surfing","Golf","Squash","Handball","Rowing","Sailing","Martial Arts","Judo","Karate","Taekwondo","Fencing","Shooting","Weightlifting","Powerlifting","CrossFit","Yoga","Pilates","Rock Climbing","Skateboarding","Parkour","Motorsports","Formula 1","MMA","Chess","Esports","Snooker","Bowling","Netball","Polo"];
const HOBBIES = ["Reading","Gaming","Cooking","Baking","Traveling","Photography","Art & Crafts","Painting","Sketching","Dancing","Singing","Hiking","Camping","Gardening","Fishing","Knitting","Woodworking","Pottery","Candle Making","Journaling","Blogging","Vlogging","Podcasting","Streaming","Stand-up Comedy","Astronomy","Birdwatching","Collecting","Origami","Calligraphy","Digital Art","3D Printing","DIY Projects","Home Decor","Thrifting","Board Games","Puzzles","Meditation","Running","Walking"];
const MUSIC = ["Pop","Rock","Hip Hop","R&B","Electronic","Jazz","Classical","Country","Metal","Indie","Latin","K-Pop","Folk","Reggae","Lo-fi","Ambient","Blues","Soul","Gospel","Devotional","Bollywood","Tollywood","Carnatic","Hindustani","EDM","House","Techno","Trap","Afrobeats","Bhangra"];
const VIBES = ["Chill","Adventurous","Creative","Ambitious","Funny","Romantic","Spiritual","Minimalist","Social butterfly","Introverted","Outdoorsy","Bookworm","Night owl","Early bird","Tech-savvy","Eco-conscious","Animal lover","Family-oriented","Hustler","Dreamer","Free spirit","Homebody","Globetrotter","Empath","Old soul"];
const PASSIONS = ["Family","Friendship","Health & Wellness","Nature","Animals","Travel","Food","Fashion","Beauty","Fitness","Learning","Community","Creativity","Mindfulness","Sustainability","Diversity & Inclusion","Mental Health","Child Education","Women Empowerment","Social Work","Technology","Space","Science","History","Philosophy","Spirituality"];
const SKILLS = ["JavaScript","TypeScript","Python","Java","C++","Rust","Go","Swift","Kotlin","React","Next.js","Node.js","Flutter","UI/UX Design","Figma","Machine Learning","Data Science","Cybersecurity","DevOps","Blockchain","Cloud","Video Editing","Graphic Design","3D / Blender"];

const EMPTY = {
  username:"",name:"",dob:"",location:"",bio:"",avatar:"",
  socialProfiles:{},links:[],
  interests:{role:"",hobbies:[],sports:[],vibes:[],music:[],passions:[],skills:[]},
};

/* ─────────────────────────────────────────────────────────────
   HELPER: strip AI thinking blocks
───────────────────────────────────────────────────────────── */
function stripAI(text) {
  if (!text) return "";
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^[\s\n\r]+/, "")
    .trim();
}

/* ─────────────────────────────────────────────────────────────
   SHARE OPTIONS — defined outside component so stable ref
───────────────────────────────────────────────────────────── */
function getShareOptions(url, onClose, onCopy) {
  const enc = encodeURIComponent;
  const msg = enc("Check out my profile! " + url);
  return [
    {label:"Copy Link",   icon:"fas fa-link",           bg:"#f0edff",bg2:"#6C63FF",  fn:()=>{ onCopy(); onClose(); }},
    {label:"WhatsApp",    icon:"fab fa-whatsapp",        bg:"#edfaf3",bg2:"#25D366",  fn:()=>{ window.open(`https://wa.me/?text=${msg}`); onClose(); }},
    {label:"Telegram",    icon:"fab fa-telegram",        bg:"#edf7fd",bg2:"#26A5E4",  fn:()=>{ window.open(`https://t.me/share/url?url=${enc(url)}&text=My+profile`); onClose(); }},
    {label:"Instagram",   icon:"fab fa-instagram",       bg:"#fdf2f4",bg2:"#E4405F",  fn:()=>{ onCopy(); alert("Link copied! Open Instagram and paste it in your bio or story."); onClose(); }},
    {label:"Snapchat",    icon:"fab fa-snapchat",        bg:"#fffce8",bg2:"#c9a800",  fn:()=>{ window.open(`https://www.snapchat.com/scan?attachmentUrl=${enc(url)}`); onClose(); }},
    {label:"Twitter / X", icon:"fab fa-x-twitter",       bg:"#f5f5f5",bg2:"#111",    fn:()=>{ window.open(`https://twitter.com/intent/tweet?text=${msg}`); onClose(); }},
    {label:"Facebook",    icon:"fab fa-facebook-f",      bg:"#eef4ff",bg2:"#1877F2",  fn:()=>{ window.open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`); onClose(); }},
    {label:"LinkedIn",    icon:"fab fa-linkedin-in",     bg:"#e8f3fc",bg2:"#0A66C2",  fn:()=>{ window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`); onClose(); }},
    {label:"Reddit",      icon:"fab fa-reddit-alien",    bg:"#fff2ed",bg2:"#FF4500",  fn:()=>{ window.open(`https://reddit.com/submit?url=${enc(url)}&title=My+Profile`); onClose(); }},
    {label:"Pinterest",   icon:"fab fa-pinterest",       bg:"#fff0f1",bg2:"#E60023",  fn:()=>{ window.open(`https://pinterest.com/pin/create/button/?url=${enc(url)}`); onClose(); }},
    {label:"Email",       icon:"fas fa-envelope",        bg:"#fef2f2",bg2:"#EA4335",  fn:()=>{ window.open(`mailto:?subject=My Profile&body=${enc(url)}`); onClose(); }},
    {label:"SMS",         icon:"fas fa-comment-sms",     bg:"#f0fdf4",bg2:"#10b981",  fn:()=>{ window.open(`sms:?body=${enc("My profile: "+url)}`); onClose(); }},
  ];
}

/* ─────────────────────────────────────────────────────────────
   SHARE SHEET COMPONENT — outside main component
───────────────────────────────────────────────────────────── */
function ShareSheet({ url, onClose, onCopy }) {
  const options = getShareOptions(url, onClose, onCopy);
  return (
    <div className="mws-overlay" onClick={onClose}>
      <div className="mws-sheet" onClick={e => e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{fontWeight:800,fontSize:17}}>Share Profile</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>mywebsam.site</div>
          </div>
          <button
            onClick={onClose}
            style={{background:"none",border:"none",fontSize:24,color:"#9ca3af",cursor:"pointer",
                    width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",
                    borderRadius:8,transition:"background .14s"}}
            onMouseOver={e=>e.currentTarget.style.background="#f5f5f5"}
            onMouseOut={e=>e.currentTarget.style.background="none"}
          >×</button>
        </div>

        {/* URL display */}
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#f8f7ff",border:"1.5px solid #ede9ff",
                     borderRadius:10,padding:"10px 14px",marginBottom:18}}>
          <i className="fas fa-globe" style={{color:ACCENT,fontSize:13,flexShrink:0}} />
          <span style={{flex:1,fontSize:12,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {url}
          </span>
        </div>

        <div className="mws-share-grid">
          {options.map(opt => (
            <div key={opt.label} className="mws-share-item" onClick={opt.fn}>
              <div className="mws-share-icon" style={{background:opt.bg,color:opt.bg2}}>
                <i className={opt.icon} />
              </div>
              <span className="mws-share-label">{opt.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOPBAR COMPONENT — outside main component
───────────────────────────────────────────────────────────── */
function Topbar({ right }) {
  return (
    <div className="mws-topbar">
      <a href="https://mywebsam.site/" target="_blank" rel="noreferrer"
        style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <div style={{width:28,height:28,borderRadius:8,background:ACCENT,
                     display:"flex",alignItems:"center",justifyContent:"center"}}>
          <i className="fas fa-link" style={{color:"#fff",fontSize:12}} />
        </div>
        <span style={{fontWeight:800,fontSize:15,color:"#111827",letterSpacing:"-0.01em"}}>mywebsam</span>
      </a>
      {right}
    </div>
  );
}

function Footer() {
  return (
    <div className="mws-footer">
      Made with ❤️‍🔥 by <strong style={{color:"#374151"}}>Samartha GS</strong>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function ProfileCreator() {
  // Load styles once on mount
  useEffect(() => { loadStyles(); }, []);

  // view: "loading" | "dashboard" | "form" | "success"
  const [view,     setView]     = useState("loading");
  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState(EMPTY);
  const [saved,    setSaved]    = useState(null);   // profile from localStorage
  const [genBio,   setGenBio]   = useState("");     // AI generated bio
  const [bioEdited,setBioEdited]= useState(false);
  const [newLink,  setNewLink]  = useState({title:"",url:"",icon:"fas fa-link"});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [publishedUser, setPublishedUser] = useState("");
  const [copied,     setCopied]     = useState(false);
  const [showShare,  setShowShare]  = useState(false);
  const fileRef = useRef(null);

  /* ── Load saved profile on mount ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && p.username) {
          setSaved(p);
          setView("dashboard");
          return;
        }
      }
    } catch (_) {}
    setView("form");
  }, []);

  /* ── Persist to localStorage ── */
  const persist = useCallback((profile) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch (_) {}
    setSaved(profile);
  }, []);

  /* ── Load saved profile into edit form ── */
  const startEdit = useCallback((p) => {
    setForm({
      username:       p.username       || "",
      name:           p.name           || "",
      dob:            p.dob            || "",
      location:       p.location       || "",
      bio:            p.bio            || "",
      avatar:         p.avatar         || "",
      socialProfiles: p.socialProfiles || {},
      links:          p.links          || [],
      interests:      p.interests      || EMPTY.interests,
    });
    setGenBio(p.aboutme || "");
    setBioEdited(false);
    setStep(1);
    setView("form");
  }, []);

  /* ── Computed values ── */
  const filledSocials = Object.entries(form.socialProfiles).filter(([, v]) => v?.trim());
  const totalTags = Object.values(form.interests).flat().filter(Boolean).length;
  const completionScore = Math.min(100, Math.round(
    [form.username,form.name,form.avatar,form.dob,form.location].filter(Boolean).length * 6 +
    Math.min(totalTags, 12) * 2.5 +
    Math.min(filledSocials.length, 5) * 4 +
    Math.min(form.links.length, 3) * 5 +
    (genBio || form.bio ? 5 : 0)
  ));

  const checklist = [
    {label:"Username set",            done: !!form.username},
    {label:"Full name added",         done: !!form.name},
    {label:"Profile photo",           done: !!form.avatar},
    {label:"Location added",          done: !!form.location},
    {label:"Role or vibe selected",   done: !!form.interests.role || form.interests.vibes.length > 0},
    {label:"At least 3 interests",    done: totalTags >= 3},
    {label:"Social profile linked",   done: filledSocials.length > 0},
    {label:"Bio written/generated",   done: !!(genBio || form.bio)},
  ];

  /* ── Stable field handlers (keyboard won't close on re-render) ── */
  const setField = useCallback((k, v) => setForm(p => ({...p, [k]: v})), []);

  const setSocial = useCallback((n, v) =>
    setForm(p => ({...p, socialProfiles: {...p.socialProfiles, [n]: v}})), []);

  const toggleTag = useCallback((cat, val) =>
    setForm(p => {
      const cur = p.interests[cat];
      return {...p, interests: {...p.interests,
        [cat]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val]
      }};
    }), []);

  const setRole = useCallback((v) =>
    setForm(p => ({...p, interests: {...p.interests, role: p.interests.role === v ? "" : v}})), []);

  /* ── Image upload ── */
  const processImage = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => { setForm(p => ({...p, avatar: e.target.result})); setUploading(false); };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e) => processImage(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processImage(e.dataTransfer.files[0]);
  };

  /* ── Links ── */
  const addLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    const url = /^https?:\/\//.test(newLink.url) ? newLink.url : `https://${newLink.url}`;
    setForm(p => ({...p, links: [...p.links, {...newLink, url, id: Date.now()}]}));
    setNewLink({title:"",url:"",icon:"fas fa-link"});
    setShowIconPicker(false);
  };

  const removeLink = (id) => setForm(p => ({...p, links: p.links.filter(l => l.id !== id)}));

  const moveLink = (idx, dir) => setForm(p => {
    const ls = [...p.links];
    const j = idx + dir;
    if (j < 0 || j >= ls.length) return p;
    [ls[idx], ls[j]] = [ls[j], ls[idx]];
    return {...p, links: ls};
  });

  /* ── Groq AI Bio ── */
  const generateBio = async () => {
    setAiLoading(true);
    const roleName = ROLES.find(r => r.v === form.interests.role)?.l || "person";
    const sports   = form.interests.sports.slice(0,4).join(", ");
    const hobbies  = form.interests.hobbies.slice(0,4).join(", ");
    const vibes    = form.interests.vibes.slice(0,3).join(", ");
    const music    = form.interests.music.slice(0,3).join(", ");
    const name     = form.name || "someone";
    const loc      = form.location;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are a bio writer for social profile pages. Your response must contain ONLY the bio text. Do not include any thinking, reasoning, labels, quotes, or explanations. Output exactly 2-3 sentences of warm, casual, first-person bio text and nothing else.",
            },
            {
              role: "user",
              content: `Write a 2-3 sentence first-person bio for ${name}${loc ? `, from ${loc}` : ""}, who is a ${roleName}. ${vibes ? `Their vibe: ${vibes}.` : ""} ${sports ? `Sports they love: ${sports}.` : ""} ${hobbies ? `Hobbies: ${hobbies}.` : ""} ${music ? `Music: ${music}.` : ""} Keep it warm, genuine, and casual. No hashtags. No emojis.`,
            },
          ],
          max_tokens: 140,
          temperature: 0.72,
        }),
      });

      if (!res.ok) throw new Error(`Groq ${res.status}`);
      const data = await res.json();
      const raw  = data?.choices?.[0]?.message?.content || "";
      const text = stripAI(raw);

      if (text.length > 10) {
        setGenBio(text);
        setBioEdited(false);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.error("Groq error:", err);
      // Friendly fallback
      const parts = [
        `I'm ${name}`,
        loc && `based in ${loc}`,
        roleName !== "person" && `a ${roleName}`,
      ].filter(Boolean).join(", ");
      const extra = [
        sports && `love ${sports.split(",")[0].trim()}`,
        hobbies && `enjoy ${hobbies.split(",")[0].trim()}`,
      ].filter(Boolean).join(" and ");
      setGenBio(`${parts}. ${extra ? `I ${extra} and` : "I"} always look for new experiences and ways to grow. Life's too short not to enjoy every moment!`);
      setBioEdited(false);
    } finally {
      setAiLoading(false);
    }
  };

  /* ── Publish / Update — smart upsert ── */
  const handlePublish = async () => {
    setSubmitting(true);
    const aboutme = genBio || form.bio;
    const profileUrl = `https://mywebsam.site/${form.username}`;

    // Save locally first — always
    const profileToSave = {
      ...form,
      aboutme,
      savedAt: new Date().toISOString(),
      publishedUrl: profileUrl,
    };
    persist(profileToSave);

    // Determine if this is an update (same username) or new create
    const isUpdate = saved && saved.username === form.username;

    try {
      const res = await fetch(isUpdate ? "/api/update" : "/api/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...form, aboutme}),
      });
      const data = await res.json();
      const finalUrl = data.url || profileUrl;
      persist({...profileToSave, publishedUrl: finalUrl});
      setPublishedUrl(finalUrl);
      setPublishedUser(form.username);
    } catch (_) {
      setPublishedUrl(profileUrl);
      setPublishedUser(form.username);
    } finally {
      setSubmitting(false);
      setView("success");
    }
  };

  /* ── Copy link ── */
  const getShareUrl = () => publishedUrl || saved?.publishedUrl || `https://mywebsam.site/${saved?.username || ""}`;

  const copyLink = useCallback(() => {
    const url = getShareUrl();
    if (!url) return;
    navigator.clipboard.writeText(url).catch(() => {
      // fallback for browsers that block clipboard
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [publishedUrl, saved]);

  const openShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({title: "My Profile", url});
        return;
      } catch (_) {}
    }
    setShowShare(true);
  };

  /* ── Small reusable UI pieces ── */
  const Label = ({children, required}) => (
    <div className="mws-lbl">
      {children}
      {required && <span style={{color:"#ef4444",marginLeft:3}}>*</span>}
    </div>
  );

  const Hint = ({icon="fas fa-info-circle", children}) => (
    <div className="mws-hint">
      <i className={icon} style={{color:ACCENT,fontSize:11}} />
      {children}
    </div>
  );

  const SectionHead = ({icon, title, sub}) => (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
      <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:ACCENT,
                   display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
        <i className={icon} />
      </div>
      <div>
        <div style={{fontSize:18,fontWeight:800,color:"#111827",lineHeight:1.15}}>{title}</div>
        {sub && <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );

  const TagGrid = ({items, cat}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {items.map(item => {
        const on = form.interests[cat].includes(item);
        return (
          <button key={item} type="button"
            className={`mws-tag${on ? " mws-on" : ""}`}
            onClick={() => toggleTag(cat, item)}>
            {on && <i className="fas fa-check" style={{fontSize:9}} />}
            {item}
          </button>
        );
      })}
    </div>
  );

  const NavRow = ({canContinue = true}) => (
    <div style={{display:"flex",gap:10,marginTop:22}}>
      {step > 1 && (
        <button type="button" className="mws-btn mws-btn-secondary" style={{flex:1}}
          onClick={() => setStep(s => s-1)}>
          <i className="fas fa-arrow-left" style={{fontSize:12}} /> Back
        </button>
      )}
      {step < 5 && (
        <button type="button" className="mws-btn mws-btn-primary" style={{flex:2}}
          onClick={() => setStep(s => s+1)} disabled={!canContinue}>
          Continue <i className="fas fa-arrow-right" style={{fontSize:12}} />
        </button>
      )}
    </div>
  );

  /* ─────────────── LOADING ─────────────── */
  if (view === "loading") {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",
                   justifyContent:"center",background:"#f4f5f9"}}>
        <i className="fas fa-spinner mws-spin" style={{fontSize:32,color:ACCENT}} />
      </div>
    );
  }

  /* ─────────────── DASHBOARD ─────────────── */
  if (view === "dashboard" && saved) {
    const url  = saved.publishedUrl || `https://mywebsam.site/${saved.username}`;
    const date = new Date(saved.savedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
    const fso2 = Object.entries(saved.socialProfiles || {}).filter(([,v]) => v?.trim());
    const itags = Object.values(saved.interests || {}).flat().filter(Boolean).length;

    return (
      <div style={{minHeight:"100vh",background:"#f4f5f9",paddingBottom:48}}>
        {showShare && (
          <ShareSheet url={url} onClose={() => setShowShare(false)} onCopy={() => {
            navigator.clipboard.writeText(url).catch(()=>{});
            setCopied(true); setTimeout(() => setCopied(false), 2200);
          }} />
        )}

        <Topbar right={
          <button className="mws-btn mws-btn-secondary" style={{fontSize:12,padding:"7px 14px"}}
            onClick={() => startEdit(saved)}>
            <i className="fas fa-pen" style={{fontSize:11}} /> Edit
          </button>
        } />

        <div style={{maxWidth:460,margin:"0 auto",padding:"28px 14px 0"}}>

          {/* Main card */}
          <div className="mws-card mws-pop" style={{marginBottom:14}}>
            {/* Name + username */}
            <div style={{textAlign:"center",paddingBottom:18,marginBottom:18,borderBottom:"1.5px solid #f0f0f5"}}>
              {saved.avatar && (
                <img src={saved.avatar} alt="avatar"
                  style={{width:76,height:76,borderRadius:"50%",objectFit:"cover",
                          border:`3px solid ${ACCENT}`,marginBottom:12,display:"block",margin:"0 auto 12px"}} />
              )}
              <div style={{fontSize:22,fontWeight:800,marginBottom:3}}>{saved.name}</div>
              <div style={{fontSize:13,color:ACCENT,fontWeight:600,marginBottom:saved.location?4:0}}>
                @{saved.username}
              </div>
              {saved.location && (
                <div style={{fontSize:12,color:"#9ca3af"}}>
                  <i className="fas fa-location-dot" style={{marginRight:4}} />
                  {saved.location}
                </div>
              )}
              <div style={{fontSize:11,color:"#b0b7c3",marginTop:6}}>
                <i className="fas fa-clock" style={{marginRight:4}} />
                Updated {date}
              </div>
            </div>

            {/* Profile URL */}
            <div className="mws-urlbox" style={{marginBottom:16}}>
              <i className="fas fa-globe" style={{color:ACCENT,fontSize:15,flexShrink:0}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",letterSpacing:"0.06em",marginBottom:2}}>
                  YOUR PROFILE LINK
                </div>
                <div style={{fontSize:13,fontWeight:600,color:"#374151",
                             overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {url}
                </div>
              </div>
            </div>

            {/* 4 action buttons */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button className="mws-btn mws-btn-primary" style={{width:"100%"}}
                onClick={() => window.open(url, "_blank")}>
                <i className="fas fa-arrow-up-right-from-square" /> View
              </button>
              <button className="mws-btn mws-btn-green" style={{width:"100%"}}
                onClick={openShare}>
                <i className="fas fa-share-nodes" /> Share
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button className="mws-btn mws-btn-secondary" style={{width:"100%"}}
                onClick={() => {
                  navigator.clipboard.writeText(url).catch(()=>{});
                  setCopied(true); setTimeout(() => setCopied(false), 2200);
                }}>
                <i className={`fas fa-${copied ? "check" : "copy"}`}
                   style={{color: copied ? "#10b981" : undefined}} />
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button className="mws-btn mws-btn-secondary" style={{width:"100%"}}
                onClick={() => startEdit(saved)}>
                <i className="fas fa-pen" /> Edit Profile
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[
              {label:"Socials",   value:fso2.length,  icon:"fas fa-share-nodes", color:"#6C63FF"},
              {label:"Links",     value:(saved.links||[]).length, icon:"fas fa-link", color:"#10b981"},
              {label:"Interests", value:itags,         icon:"fas fa-tag",         color:"#f59e0b"},
            ].map(s => (
              <div key={s.label} className="mws-card" style={{textAlign:"center",padding:"14px 8px"}}>
                <i className={s.icon} style={{color:s.color,fontSize:18,marginBottom:5,display:"block"}} />
                <div style={{fontSize:20,fontWeight:800}}>{s.value}</div>
                <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",
                             letterSpacing:".05em",textTransform:"uppercase"}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ─────────────── SUCCESS ─────────────── */
  if (view === "success") {
    const url = getShareUrl();
    return (
      <div style={{minHeight:"100vh",background:"#f4f5f9",display:"flex",flexDirection:"column"}}>
        {showShare && (
          <ShareSheet url={url} onClose={() => setShowShare(false)} onCopy={copyLink} />
        )}
        <Topbar />

        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
          <div style={{maxWidth:420,width:"100%"}}>
            {/* Confetti */}
            <div style={{position:"relative",height:40,overflow:"hidden"}}>
              {["#6C63FF","#10b981","#f59e0b","#ef4444","#0ea5e9","#ec4899","#f97316"].map((c,i) => (
                <div key={i} className="mws-confetti"
                  style={{background:c,left:`${8+i*13}%`,top:0,animationDelay:`${i*0.1}s`}} />
              ))}
            </div>

            <div className="mws-card mws-pop" style={{textAlign:"center",padding:"36px 24px"}}>
              <div className="mws-sring">
                <i className="fas fa-check" style={{color:"#fff",fontSize:36}} />
              </div>
              <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>
                {saved?.savedAt ? "Profile Updated!" : "Profile Created!"}
              </h2>
              <p style={{color:"#6b7280",fontSize:14,lineHeight:1.7,marginBottom:20}}>
                Your link is live at{" "}
                <strong style={{color:ACCENT}}>mywebsam.site/{publishedUser}</strong>
              </p>

              {/* URL box */}
              <div className="mws-urlbox" style={{marginBottom:16}}>
                <i className="fas fa-globe" style={{color:ACCENT,fontSize:13,flexShrink:0}} />
                <span style={{flex:1,fontSize:13,color:"#374151",overflow:"hidden",
                              textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>
                  {url}
                </span>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <button className="mws-btn mws-btn-primary" style={{width:"100%"}}
                  onClick={() => window.open(url, "_blank")}>
                  <i className="fas fa-arrow-up-right-from-square" /> View
                </button>
                <button className="mws-btn mws-btn-green" style={{width:"100%"}}
                  onClick={openShare}>
                  <i className="fas fa-share-nodes" /> Share
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <button className="mws-btn mws-btn-secondary" style={{width:"100%"}}
                  onClick={copyLink}>
                  <i className={`fas fa-${copied ? "check" : "copy"}`}
                     style={{color: copied ? "#10b981" : undefined}} />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button className="mws-btn mws-btn-secondary" style={{width:"100%"}}
                  onClick={() => setView("dashboard")}>
                  <i className="fas fa-home" /> Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ─────────────── FORM (Create / Edit) ─────────────── */
  return (
    <div style={{minHeight:"100vh",background:"#f4f5f9",paddingBottom:48}}>
      {showShare && (
        <ShareSheet url={getShareUrl()} onClose={() => setShowShare(false)} onCopy={copyLink} />
      )}

      <Topbar right={
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {saved && (
            <button className="mws-btn mws-btn-ghost" style={{fontSize:12,padding:"6px 12px"}}
              onClick={() => setView("dashboard")}>
              <i className="fas fa-arrow-left" style={{fontSize:11}} /> Dashboard
            </button>
          )}
          <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>{completionScore}%</span>
          <div style={{width:52,height:5,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${completionScore}%`,height:"100%",borderRadius:99,
                         background:completionScore>=80?"#10b981":ACCENT,transition:"width .4s"}} />
          </div>
        </div>
      } />

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 14px 12px"}}>

        {/* Step indicator */}
        <div style={{display:"flex",alignItems:"flex-start",gap:4,marginBottom:22}}>
          {STEPS.map((label, i) => {
            const s = i + 1;
            const state = step > s ? "done" : step === s ? "active" : "idle";
            return (
              <div key={s} style={{display:"flex",alignItems:"center",flex: s < 5 ? 1 : 0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div className={`mws-dot ${state}`}>
                    {state === "done"
                      ? <i className="fas fa-check" style={{fontSize:10}} />
                      : s}
                  </div>
                  <span className={`mws-steplbl ${state}`}>{label}</span>
                </div>
                {s < 5 && (
                  <div style={{flex:1,height:2,margin:"0 3px",marginBottom:18,borderRadius:1,
                               background:step>s?"#10b981":"#e9eaf0",transition:"background .3s"}} />
                )}
              </div>
            );
          })}
        </div>

        {/* ════ STEP 1 ════ */}
        {step === 1 && (
          <div className="mws-fu">
            <div className="mws-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-user-circle" title="About You" sub="Let's start with the basics." />

              <div style={{marginBottom:14}}>
                <Label required>Username</Label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",
                                color:"#adb5c0",fontSize:14,pointerEvents:"none"}}>@</span>
                  <input className="mws-inp" style={{paddingLeft:27}} placeholder="yourname"
                    value={form.username}
                    onChange={e => setField("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,""))} />
                </div>
                {form.username && (
                  <Hint>mywebsam.site/<strong style={{color:ACCENT}}>{form.username}</strong></Hint>
                )}
                {saved?.username && form.username !== saved.username && (
                  <Hint icon="fas fa-triangle-exclamation">
                    Changing username will change your profile link.
                  </Hint>
                )}
              </div>

              <div style={{marginBottom:14}}>
                <Label required>Full Name</Label>
                <input className="mws-inp" placeholder="Your full name"
                  value={form.name} onChange={e => setField("name", e.target.value)} />
              </div>

              <div className="mws-g2"
                style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <Label>Date of Birth</Label>
                  <input className="mws-inp" type="date"
                    value={form.dob} onChange={e => setField("dob", e.target.value)} />
                </div>
                <div>
                  <Label>Location</Label>
                  <input className="mws-inp" placeholder="City, Country"
                    value={form.location} onChange={e => setField("location", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>
                  Short Bio{" "}
                  <span style={{color:"#adb5c0",fontWeight:400,textTransform:"none",fontSize:11}}>
                    (or generate with AI in step 2)
                  </span>
                </Label>
                <textarea className="mws-inp" rows={3}
                  placeholder="Say something about yourself..."
                  value={form.bio}
                  onChange={e => setField("bio", e.target.value)}
                  style={{resize:"vertical",lineHeight:1.6}} />
                <div className={`mws-cc${form.bio.length>180?" o":form.bio.length>140?" w":""}`}>
                  {form.bio.length}/200
                </div>
              </div>
            </div>

            {/* Photo upload */}
            <div className="mws-card">
              <Label>Profile Photo</Label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{display:"flex",alignItems:"center",gap:14,padding:14,borderRadius:12,
                        cursor:"pointer",
                        border:`2px dashed ${dragOver?"#6C63FF":form.avatar?"#6C63FF":"#e5e7eb"}`,
                        background:dragOver?"#f2f0ff":form.avatar?"#f8f7ff":"#fafafa",
                        transition:"all .2s"}}>
                {form.avatar ? (
                  <>
                    <img src={form.avatar} alt="avatar"
                      style={{width:62,height:62,borderRadius:"50%",objectFit:"cover",
                              border:`2.5px solid ${ACCENT}`,flexShrink:0}} />
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,marginBottom:2}}>Looking great!</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click to change</div>
                    </div>
                    <button type="button" className="mws-btn mws-btn-danger"
                      onClick={e => { e.stopPropagation(); setField("avatar", ""); }}>
                      <i className="fas fa-trash" />
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{width:62,height:62,borderRadius:"50%",background:"#ede9ff",
                                 display:"flex",alignItems:"center",justifyContent:"center",
                                 fontSize:22,color:ACCENT,flexShrink:0}}>
                      {uploading
                        ? <i className="fas fa-spinner mws-spin" />
                        : <i className="fas fa-camera" />}
                    </div>
                    <div>
                      <div style={{fontWeight:600,marginBottom:2}}>
                        {uploading ? "Uploading..." : "Add a Photo"}
                      </div>
                      <div style={{fontSize:13,color:"#6b7280"}}>Click or drag & drop</div>
                      <div style={{fontSize:11,color:"#adb5c0",marginTop:2}}>
                        PNG, JPG, GIF · Saved locally
                      </div>
                    </div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*"
                style={{display:"none"}} onChange={handleFileInput} />
            </div>

            <NavRow canContinue={!!form.username && !!form.name} />
          </div>
        )}

        {/* ════ STEP 2 ════ */}
        {step === 2 && (
          <div className="mws-fu">
            <div className="mws-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-face-smile" title="Your Vibe & Interests"
                sub="Pick everything that's you — sports, hobbies, music and more." />

              {/* Role */}
              <div style={{marginBottom:16}}>
                <Label>I am a...</Label>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {ROLES.map(r => {
                    const on = form.interests.role === r.v;
                    return (
                      <button key={r.v} type="button"
                        className={`mws-tag${on ? " mws-on" : ""}`}
                        style={{borderRadius:10}}
                        onClick={() => setRole(r.v)}>
                        <i className={ROLE_ICONS[r.v]||"fas fa-star"} style={{width:13,textAlign:"center"}} />
                        {r.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {[
                {cat:"vibes",   label:"My Vibe",               items:VIBES},
                {cat:"sports",  label:"Sports I Love",          items:SPORTS},
                {cat:"hobbies", label:"Hobbies",                items:HOBBIES},
                {cat:"music",   label:"Music I Love",           items:MUSIC},
                {cat:"passions",label:"Things I Care About",    items:PASSIONS},
                {cat:"skills",  label:"Skills & Tools (optional)",items:SKILLS},
              ].map((section, idx) => (
                <div key={section.cat}>
                  <div className="mws-divider" />
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Label>{section.label}</Label>
                    {form.interests[section.cat].length > 0 && (
                      <span style={{fontSize:11,color:ACCENT,fontWeight:600}}>
                        {form.interests[section.cat].length} selected
                      </span>
                    )}
                  </div>
                  <TagGrid items={section.items} cat={section.cat} />
                </div>
              ))}
            </div>

            {/* AI Bio */}
            <div className="mws-card">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <Label>AI Bio Generator</Label>
                <div className="mws-aibadge">
                  <i className="fas fa-bolt" /> expo.1 · Groq AI
                </div>
              </div>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>
                Select your interests above, then generate a personalised bio instantly.
              </p>
              <button type="button" className="mws-btn mws-btn-green" style={{width:"100%"}}
                onClick={generateBio} disabled={aiLoading}>
                {aiLoading
                  ? <><i className="fas fa-spinner mws-spin" /> Generating with Groq...</>
                  : <><i className="fas fa-wand-magic-sparkles" /> Generate My Bio</>}
              </button>

              {genBio && (
                <div style={{marginTop:14,borderTop:"1px solid #f0edff",paddingTop:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                               marginBottom:8,flexWrap:"wrap",gap:6}}>
                    <div className="mws-aibadge">
                      <i className="fas fa-robot" /> expo.1 Generated
                    </div>
                    <button type="button"
                      style={{background:"none",border:"none",fontSize:12,color:ACCENT,
                              cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}}
                      onClick={generateBio} disabled={aiLoading}>
                      <i className="fas fa-redo" style={{marginRight:4,fontSize:10}} />
                      Regenerate
                    </button>
                  </div>
                  <textarea className="mws-inp" rows={3} value={genBio}
                    onChange={e => { setGenBio(e.target.value); setBioEdited(true); }}
                    style={{resize:"vertical",lineHeight:1.6}} />
                  {bioEdited && (
                    <Hint icon="fas fa-pencil">Edited — your version will be saved.</Hint>
                  )}
                </div>
              )}
            </div>

            <NavRow />
          </div>
        )}

        {/* ════ STEP 3 ════ */}
        {step === 3 && (
          <div className="mws-fu">
            <div className="mws-card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",
                           marginBottom:14,flexWrap:"wrap",gap:8}}>
                <SectionHead icon="fas fa-share-nodes" title="Social Profiles"
                  sub="Only filled ones appear on your page." />
                {filledSocials.length > 0 && (
                  <div className="mws-badge">
                    <i className="fas fa-check" style={{fontSize:9}} />
                    {filledSocials.length} linked
                  </div>
                )}
              </div>

              <div className="mws-sg"
                style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                {SOCIALS_LIST.map(p => {
                  const m = SOCIAL_META[p.n] || {icon:"fas fa-link",color:"#6b7280",bg:"#f9fafb"};
                  const val = form.socialProfiles[p.n] || "";
                  return (
                    <div key={p.n} className="mws-sc">
                      <div style={{width:32,height:32,borderRadius:8,background:m.bg,color:m.color,
                                   display:"flex",alignItems:"center",justifyContent:"center",
                                   fontSize:14,flexShrink:0}}>
                        <i className={m.icon} />
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#adb5c0",
                                     letterSpacing:".05em",marginBottom:2}}>
                          {p.l.toUpperCase()}
                        </div>
                        <input className="mws-sc-inp" placeholder={p.p}
                          value={val} onChange={e => setSocial(p.n, e.target.value)} />
                      </div>
                      {val && <i className="fas fa-circle-check" style={{color:"#10b981",fontSize:13}} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <NavRow />
          </div>
        )}

        {/* ════ STEP 4 ════ */}
        {step === 4 && (
          <div className="mws-fu">
            <div className="mws-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-link" title="Your Links"
                sub="Portfolio, shop, blog, project — anything." />

              {/* Add link */}
              <div style={{background:"#f8f7ff",border:"1.5px solid #ede9ff",
                           borderRadius:12,padding:14,marginBottom:16}}>
                <Label>Add a Link</Label>
                <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <input className="mws-inp" style={{flex:"0 0 138px",minWidth:0}}
                    placeholder="Label"
                    value={newLink.title}
                    onChange={e => setNewLink(p => ({...p, title:e.target.value}))} />
                  <input className="mws-inp" style={{flex:1,minWidth:130}}
                    placeholder="https://..."
                    value={newLink.url}
                    onChange={e => setNewLink(p => ({...p, url:e.target.value}))} />
                </div>

                {/* Icon picker */}
                <div style={{marginBottom:10}}>
                  <button type="button" className="mws-btn mws-btn-ghost"
                    style={{fontSize:12,padding:"6px 12px"}}
                    onClick={() => setShowIconPicker(v => !v)}>
                    <i className={newLink.icon} /> Icon{" "}
                    <i className={`fas fa-chevron-${showIconPicker?"up":"down"}`} style={{fontSize:10}} />
                  </button>
                  {showIconPicker && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,
                                 maxHeight:160,overflowY:"auto",padding:2}}>
                      {LINK_ICONS.map(ic => (
                        <button key={ic} type="button"
                          style={{width:36,height:36,borderRadius:8,fontSize:14,cursor:"pointer",
                                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                                  border:`1.5px solid ${newLink.icon===ic?"#6C63FF":"#e5e7eb"}`,
                                  background:newLink.icon===ic?"#f0edff":"#fff",
                                  color:newLink.icon===ic?"#6C63FF":"#6b7280"}}
                          onClick={() => { setNewLink(p=>({...p,icon:ic})); setShowIconPicker(false); }}>
                          <i className={ic} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button type="button" className="mws-btn mws-btn-primary" style={{width:"100%"}}
                  onClick={addLink}>
                  <i className="fas fa-plus" /> Add Link
                </button>
              </div>

              {form.links.length === 0 ? (
                <div style={{textAlign:"center",padding:"24px",color:"#adb5c0"}}>
                  <i className="fas fa-link" style={{fontSize:24,marginBottom:8,display:"block"}} />
                  <div style={{fontSize:14}}>No links yet. Add one above.</div>
                </div>
              ) : (
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Label>Your Links ({form.links.length})</Label>
                    <span style={{fontSize:11,color:"#adb5c0"}}>↑↓ to reorder</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {form.links.map((link, idx) => (
                      <div key={link.id} className="mws-lr">
                        {/* Reorder */}
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          <button type="button"
                            style={{background:"none",border:"none",fontSize:10,padding:"2px 4px",
                                    color:idx===0?"#e5e7eb":"#9ca3af",cursor:idx===0?"default":"pointer"}}
                            onClick={() => moveLink(idx,-1)}>
                            <i className="fas fa-chevron-up" />
                          </button>
                          <button type="button"
                            style={{background:"none",border:"none",fontSize:10,padding:"2px 4px",
                                    color:idx===form.links.length-1?"#e5e7eb":"#9ca3af",
                                    cursor:idx===form.links.length-1?"default":"pointer"}}
                            onClick={() => moveLink(idx,1)}>
                            <i className="fas fa-chevron-down" />
                          </button>
                        </div>
                        {/* Icon */}
                        <div style={{width:32,height:32,borderRadius:8,background:"#f0edff",color:ACCENT,
                                     display:"flex",alignItems:"center",justifyContent:"center",
                                     fontSize:13,flexShrink:0}}>
                          <i className={link.icon} />
                        </div>
                        {/* Info */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14}}>{link.title}</div>
                          <div style={{fontSize:11,color:"#9ca3af",
                                       overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {link.url}
                          </div>
                        </div>
                        <a href={link.url} target="_blank" rel="noreferrer"
                          style={{padding:"4px 8px",color:"#9ca3af",textDecoration:"none",fontSize:12}}
                          onClick={e => e.stopPropagation()}>
                          <i className="fas fa-arrow-up-right-from-square" />
                        </a>
                        <button type="button" className="mws-btn mws-btn-danger"
                          onClick={() => removeLink(link.id)}>
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <NavRow />
          </div>
        )}

        {/* ════ STEP 5 ════ */}
        {step === 5 && (
          <div className="mws-fu">
            <div className="mws-card" style={{marginBottom:12}}>
              <SectionHead icon="fas fa-rocket"
                title={saved ? "Update Profile" : "Ready to Publish?"}
                sub="Check your checklist and go live." />

              {/* Checklist */}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {checklist.map(item => (
                  <div key={item.label}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                            background:item.done?"#f0fdf4":"#fafafa",
                            border:`1.5px solid ${item.done?"#bbf7d0":"#e9eaf0"}`,
                            borderRadius:10}}>
                    <i className={item.done ? "fas fa-circle-check" : "far fa-circle"}
                       style={{color:item.done?"#10b981":"#d1d5db",fontSize:16,flexShrink:0}} />
                    <span style={{fontSize:14,flex:1,
                                  fontWeight:item.done?600:400,
                                  color:item.done?"#065f46":"#9ca3af"}}>
                      {item.label}
                    </span>
                    {item.done && <i className="fas fa-check" style={{color:"#10b981",fontSize:11}} />}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Completeness</span>
                  <span style={{fontSize:12,fontWeight:700,
                                color:completionScore>=80?"#10b981":ACCENT}}>
                    {completionScore}%
                  </span>
                </div>
                <div style={{height:8,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:`${completionScore}%`,height:"100%",borderRadius:99,
                               background:completionScore>=80
                                 ?"linear-gradient(90deg,#10b981,#34d399)"
                                 :"linear-gradient(90deg,#6C63FF,#818cf8)",
                               transition:"width .5s"}} />
                </div>
              </div>

              <div style={{display:"flex",gap:10}}>
                <button type="button" className="mws-btn mws-btn-secondary" style={{flex:1}}
                  onClick={() => setStep(4)}>
                  <i className="fas fa-arrow-left" style={{fontSize:12}} /> Back
                </button>
                <button type="button" className="mws-btn mws-btn-primary" style={{flex:2}}
                  onClick={handlePublish}
                  disabled={submitting || !form.username || !form.name}>
                  {submitting
                    ? <><i className="fas fa-spinner mws-spin" /> {saved ? "Updating..." : "Publishing..."}</>
                    : <><i className="fas fa-rocket" /> {saved ? "Update Profile" : "Publish Profile"}</>}
                </button>
              </div>

              {(!form.username || !form.name) && (
                <div style={{marginTop:10,fontSize:13,color:"#ef4444",textAlign:"center"}}>
                  <i className="fas fa-triangle-exclamation" style={{marginRight:5}} />
                  Username and name are required.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
