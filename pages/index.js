import { useState, useRef, useCallback, useEffect } from "react";

let _booted = false;
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#f5f6fa;color:#111827;-webkit-font-smoothing:antialiased;}
*{-webkit-tap-highlight-color:transparent;}
*:focus{outline:none!important;}
button::-moz-focus-inner{border:0;}
input:focus,textarea:focus,select:focus{border-color:#6C63FF!important;box-shadow:0 0 0 3px rgba(108,99,255,0.14)!important;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:4px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pop{0%{opacity:0;transform:scale(.86);}100%{opacity:1;transform:scale(1);}}
@keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1;}100%{transform:translateY(100px) rotate(420deg);opacity:0;}}
.fu{animation:fadeUp .3s cubic-bezier(.22,.68,0,1.15) both;}
.pop{animation:pop .38s cubic-bezier(.22,.68,0,1.2) both;}
.inp{width:100%;padding:11px 14px;background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;color:#111827;font-family:inherit;font-size:14px;transition:border-color .15s,box-shadow .15s;}
.inp::placeholder{color:#b0b7c3;}
.inp:hover:not(:focus){border-color:#c5c8f6;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 20px;border-radius:10px;border:none;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .14s,transform .1s,box-shadow .14s;user-select:none;white-space:nowrap;line-height:1;}
.btn:active{transform:scale(0.96)!important;box-shadow:none!important;}
.btn:disabled{opacity:.38;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
.btn-p{background:#6C63FF;color:#fff;}.btn-p:hover{background:#5a52e8;box-shadow:0 4px 18px rgba(108,99,255,.3);transform:translateY(-1px);}
.btn-s{background:#fff;color:#374151;border:1.5px solid #e5e7eb;}.btn-s:hover{background:#f9fafb;transform:translateY(-1px);}
.btn-g{background:#10b981;color:#fff;}.btn-g:hover{background:#059669;box-shadow:0 4px 18px rgba(16,185,129,.28);transform:translateY(-1px);}
.btn-gh{background:transparent;color:#6b7280;border:1.5px solid #e5e7eb;}.btn-gh:hover{background:#f9fafb;color:#374151;}
.btn-d{background:transparent;color:#ef4444;border:1.5px solid #fca5a5;padding:7px 12px;font-size:13px;}.btn-d:hover{background:#fef2f2;border-color:#ef4444;}
.tag{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:999px;border:1.5px solid #e5e7eb;background:#fff;color:#6b7280;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:all .14s ease;user-select:none;}
.tag:hover{border-color:#6C63FF;color:#6C63FF;background:#f2f0ff;}.tag:active{transform:scale(.95);}
.tag.on{background:#6C63FF;border-color:#6C63FF;color:#fff;}
.card{background:#fff;border:1.5px solid #e9eaf0;border-radius:16px;padding:20px;}
.sdot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:inherit;border:2px solid #e5e7eb;background:#fff;color:#9ca3af;transition:all .22s ease;flex-shrink:0;}
.sdot.done{background:#10b981;border-color:#10b981;color:#fff;}
.sdot.active{background:#6C63FF;border-color:#6C63FF;color:#fff;box-shadow:0 0 0 4px rgba(108,99,255,.16);}
.slbl{font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#b0b7c3;white-space:nowrap;margin-top:4px;}
.slbl.active{color:#6C63FF;}.slbl.done{color:#10b981;}
.sc{display:flex;align-items:center;gap:10px;padding:11px 13px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.sc:focus-within{border-color:#6C63FF;box-shadow:0 0 0 3px rgba(108,99,255,.1);}
.sc input{flex:1;border:none;background:transparent;font-family:inherit;font-size:13.5px;color:#111827;min-width:0;}
.sc input::placeholder{color:#b0b7c3;}
.lr{display:flex;align-items:center;gap:10px;padding:11px 14px;background:#fff;border:1.5px solid #e9eaf0;border-radius:10px;transition:border-color .15s,box-shadow .15s;}
.lr:hover{border-color:#c7c3f9;box-shadow:0 2px 8px rgba(108,99,255,.07);}
.sring{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#10b981);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 8px 32px rgba(108,99,255,.28);}
.cp{position:absolute;width:9px;height:9px;border-radius:2px;animation:fall 1.5s ease-out forwards;}
.lbl{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;}
.hint{font-size:12px;color:#6b7280;margin-top:5px;display:flex;align-items:center;gap:5px;}
.bg{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;background:#d1fae5;color:#065f46;font-size:11px;font-weight:600;}
.aib{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:linear-gradient(135deg,#f0edff,#e0fdf4);border:1px solid #c4b5fd;font-size:11px;font-weight:700;color:#5b21b6;}
.cc{font-size:11px;color:#b0b7c3;text-align:right;margin-top:4px;}
.cc.w{color:#f59e0b;}.cc.o{color:#ef4444;}
.topbar{background:#fff;border-bottom:1px solid #e9eaf0;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
.footer{text-align:center;padding:24px 16px 20px;font-size:13px;color:#9ca3af;}
.divider{height:1px;background:#f0f0f5;margin:16px 0;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.48);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.sheet{background:#fff;border-radius:20px 20px 0 0;padding:20px 16px 36px;width:100%;max-width:500px;animation:fadeUp .22s ease;}
.si{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;user-select:none;min-width:64px;padding:4px;}
.sic{width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;transition:transform .12s;}
.si:active .sic{transform:scale(.9);}
.si span{font-size:11px;font-weight:600;color:#374151;text-align:center;}
@media(max-width:520px){
  .card{padding:14px;}
  .btn{padding:10px 14px;font-size:13px;}
  .sdot{width:26px;height:26px;font-size:10px;}
  .slbl{display:none;}
  .g2{grid-template-columns:1fr!important;}
  .sg{grid-template-columns:1fr!important;}
}
`;

function boot() {
  if (_booted) return;
  _booted = true;
  ["https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
   "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
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

function clean(t) {
  if (!t) return "";
  return t.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^[\s\n\r]+/, "").trim();
}

const LS = "mws_profile_v4";
const AC = "#6C63FF";
const GK = "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";

const SM = {
  email:{i:"fas fa-envelope",c:"#EA4335",b:"#fef2f2"},
  instagram:{i:"fab fa-instagram",c:"#E4405F",b:"#fdf2f4"},
  whatsapp:{i:"fab fa-whatsapp",c:"#25D366",b:"#edfaf3"},
  facebook:{i:"fab fa-facebook-f",c:"#1877F2",b:"#eef4ff"},
  youtube:{i:"fab fa-youtube",c:"#FF0000",b:"#fff2f2"},
  twitter:{i:"fab fa-x-twitter",c:"#111",b:"#f5f5f5"},
  tiktok:{i:"fab fa-tiktok",c:"#010101",b:"#f5f5f5"},
  snapchat:{i:"fab fa-snapchat",c:"#c9a800",b:"#fffce8"},
  pinterest:{i:"fab fa-pinterest",c:"#E60023",b:"#fff0f1"},
  telegram:{i:"fab fa-telegram",c:"#26A5E4",b:"#edf7fd"},
  discord:{i:"fab fa-discord",c:"#5865F2",b:"#eef0ff"},
  linkedin:{i:"fab fa-linkedin-in",c:"#0A66C2",b:"#e8f3fc"},
  github:{i:"fab fa-github",c:"#24292e",b:"#f6f8fa"},
  twitch:{i:"fab fa-twitch",c:"#9146FF",b:"#f3eeff"},
  spotify:{i:"fab fa-spotify",c:"#1DB954",b:"#edfaf3"},
  reddit:{i:"fab fa-reddit-alien",c:"#FF4500",b:"#fff2ed"},
  medium:{i:"fab fa-medium",c:"#333",b:"#f5f5f5"},
  devto:{i:"fab fa-dev",c:"#0a0a0a",b:"#f5f5f5"},
  codepen:{i:"fab fa-codepen",c:"#111",b:"#f5f5f5"},
  stackoverflow:{i:"fab fa-stack-overflow",c:"#F58025",b:"#fff4ed"},
  behance:{i:"fab fa-behance",c:"#1769FF",b:"#eef2ff"},
  dribbble:{i:"fab fa-dribbble",c:"#ea4c89",b:"#fdf0f5"},
  npm:{i:"fab fa-npm",c:"#CC3534",b:"#fff0f0"},
};
const RI={student:"fas fa-graduation-cap",professional:"fas fa-briefcase",creator:"fas fa-camera",artist:"fas fa-palette",musician:"fas fa-music",athlete:"fas fa-person-running",traveler:"fas fa-plane",foodie:"fas fa-utensils",gamer:"fas fa-gamepad",writer:"fas fa-pen-nib",entrepreneur:"fas fa-rocket",parent:"fas fa-heart",volunteer:"fas fa-hand-holding-heart",other:"fas fa-star"};
const LI=["fas fa-link","fas fa-globe","fas fa-briefcase","fas fa-folder-open","fas fa-star","fas fa-heart","fas fa-rocket","fas fa-bolt","fas fa-book-open","fas fa-video","fas fa-microphone","fas fa-store","fas fa-graduation-cap","fas fa-code","fas fa-pen-nib","fas fa-camera","fas fa-music","fas fa-gamepad","fas fa-trophy","fas fa-film","fas fa-images","fas fa-newspaper","fas fa-podcast","fas fa-headphones","fas fa-paintbrush","fas fa-leaf","fas fa-paw","fas fa-dumbbell","fas fa-plane","fas fa-utensils","fas fa-flask","fas fa-laptop","fas fa-gift","fas fa-handshake","fas fa-chart-bar","fas fa-fire","fas fa-crown","fas fa-gem","fas fa-sun","fas fa-moon","fas fa-futbol","fas fa-basketball","fas fa-baseball","fas fa-tree","fas fa-shopping-bag"];
const SL=[{n:"email",l:"Email",p:"your@email.com"},{n:"instagram",l:"Instagram",p:"@username"},{n:"whatsapp",l:"WhatsApp",p:"+1234567890"},{n:"facebook",l:"Facebook",p:"username"},{n:"youtube",l:"YouTube",p:"@channel"},{n:"twitter",l:"Twitter / X",p:"@username"},{n:"tiktok",l:"TikTok",p:"@username"},{n:"snapchat",l:"Snapchat",p:"username"},{n:"pinterest",l:"Pinterest",p:"username"},{n:"telegram",l:"Telegram",p:"@username"},{n:"discord",l:"Discord",p:"username"},{n:"linkedin",l:"LinkedIn",p:"username"},{n:"github",l:"GitHub",p:"username"},{n:"twitch",l:"Twitch",p:"username"},{n:"spotify",l:"Spotify",p:"username"},{n:"reddit",l:"Reddit",p:"u/username"},{n:"medium",l:"Medium",p:"@username"},{n:"devto",l:"DEV.to",p:"username"},{n:"codepen",l:"CodePen",p:"username"},{n:"stackoverflow",l:"Stack Overflow",p:"user ID"},{n:"behance",l:"Behance",p:"username"},{n:"dribbble",l:"Dribbble",p:"username"},{n:"npm",l:"npm",p:"~username"}];
const STEPS=["Basic","Vibe","Social","Links","Publish"];
const ROLES=[{v:"student",l:"Student"},{v:"professional",l:"Professional"},{v:"creator",l:"Creator"},{v:"artist",l:"Artist"},{v:"musician",l:"Musician"},{v:"athlete",l:"Athlete"},{v:"traveler",l:"Traveler"},{v:"foodie",l:"Foodie"},{v:"gamer",l:"Gamer"},{v:"writer",l:"Writer"},{v:"entrepreneur",l:"Entrepreneur"},{v:"parent",l:"Parent"},{v:"volunteer",l:"Volunteer"},{v:"other",l:"Other"}];
const SPORTS=["Cricket","Football","Basketball","Volleyball","Tennis","Badminton","Table Tennis","Baseball","Rugby","Hockey","Swimming","Athletics","Cycling","Boxing","Wrestling","Kabaddi","Kho-Kho","Archery","Gymnastics","Skating","Skiing","Surfing","Golf","Squash","Handball","Rowing","Sailing","Martial Arts","Judo","Karate","Taekwondo","Fencing","Shooting","Weightlifting","Powerlifting","CrossFit","Yoga","Pilates","Rock Climbing","Skateboarding","Parkour","Motorsports","Formula 1","MMA","Chess","Esports","Snooker","Bowling","Netball","Polo"];
const HOBBIES=["Reading","Gaming","Cooking","Baking","Traveling","Photography","Art & Crafts","Painting","Sketching","Dancing","Singing","Hiking","Camping","Gardening","Fishing","Knitting","Woodworking","Pottery","Candle Making","Journaling","Blogging","Vlogging","Podcasting","Streaming","Stand-up Comedy","Astronomy","Birdwatching","Collecting","Origami","Calligraphy","Digital Art","3D Printing","DIY Projects","Home Decor","Thrifting","Board Games","Puzzles","Meditation","Running"];
const MUSIC=["Pop","Rock","Hip Hop","R&B","Electronic","Jazz","Classical","Country","Metal","Indie","Latin","K-Pop","Folk","Reggae","Lo-fi","Ambient","Blues","Soul","Gospel","Devotional","Bollywood","Tollywood","Carnatic","Hindustani","EDM","House","Techno","Trap","Afrobeats","Bhangra"];
const VIBES=["Chill","Adventurous","Creative","Ambitious","Funny","Romantic","Spiritual","Minimalist","Social butterfly","Introverted","Outdoorsy","Bookworm","Night owl","Early bird","Tech-savvy","Eco-conscious","Animal lover","Family-oriented","Hustler","Dreamer","Free spirit","Homebody","Globetrotter","Empath","Old soul"];
const PASSIONS=["Family","Friendship","Health & Wellness","Nature","Animals","Travel","Food","Fashion","Beauty","Fitness","Learning","Community","Creativity","Mindfulness","Sustainability","Diversity & Inclusion","Mental Health","Child Education","Women Empowerment","Social Work","Technology","Space","Science","History","Philosophy","Spirituality"];
const SKILLS=["JavaScript","TypeScript","Python","Java","C++","Rust","Go","Swift","Kotlin","React","Next.js","Node.js","Flutter","UI/UX Design","Figma","Machine Learning","Data Science","Cybersecurity","DevOps","Blockchain","Cloud","Video Editing","Graphic Design","3D / Blender"];
const EF={username:"",name:"",dob:"",location:"",bio:"",avatar:"",socialProfiles:{},links:[],interests:{role:"",hobbies:[],sports:[],vibes:[],music:[],passions:[],skills:[]}};

export default function App() {
  useEffect(()=>{boot();},[]);
  const [view,setView]=useState("loading");
  const [step,setStep]=useState(1);
  const [form,setForm]=useState(EF);
  const [saved,setSaved]=useState(null);
  const [nlnk,setNlnk]=useState({title:"",url:"",icon:"fas fa-link"});
  const [showIP,setShowIP]=useState(false);
  const [upld,setUpld]=useState(false);
  const [drag,setDrag]=useState(false);
  const [aiLoad,setAiLoad]=useState(false);
  const [bio,setBio]=useState("");
  const [bioEd,setBioEd]=useState(false);
  const [pub,setPub]=useState(null);
  const [copied,setCopied]=useState(false);
  const [share,setShare]=useState(false);
  const [subLoad,setSubLoad]=useState(false);
  const fRef=useRef(null);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(LS);
      if(raw){const p=JSON.parse(raw);setSaved(p);setView("dash");}
      else setView("form");
    }catch{setView("form");}
  },[]);

  const persist=useCallback((p)=>{
    try{localStorage.setItem(LS,JSON.stringify(p));}catch{}
    setSaved(p);
  },[]);

  const loadEdit=useCallback((p)=>{
    setForm({username:p.username||"",name:p.name||"",dob:p.dob||"",location:p.location||"",bio:p.bio||"",avatar:p.avatar||"",socialProfiles:p.socialProfiles||{},links:p.links||[],interests:p.interests||EF.interests});
    setBio(p.aboutme||"");setBioEd(false);setStep(1);setView("form");
  },[]);

  const fso=Object.entries(form.socialProfiles).filter(([,v])=>v?.trim());
  const tags=Object.values(form.interests).flat().filter(Boolean).length;
  const score=Math.min(100,Math.round([form.username,form.name,form.avatar,form.dob,form.location].filter(Boolean).length*6+Math.min(tags,12)*2.5+Math.min(fso.length,5)*4+Math.min(form.links.length,3)*5+(bio||form.bio?5:0)));
  const CL=[{t:"Username set",d:!!form.username},{t:"Full name added",d:!!form.name},{t:"Profile photo",d:!!form.avatar},{t:"Location added",d:!!form.location},{t:"Role or vibe selected",d:!!form.interests.role||form.interests.vibes.length>0},{t:"At least 3 interests",d:tags>=3},{t:"Social profile linked",d:fso.length>0},{t:"Bio written/generated",d:!!(bio||form.bio)}];

  const sf=useCallback((k,v)=>setForm(p=>({...p,[k]:v})),[]);
  const ss=useCallback((n,v)=>setForm(p=>({...p,socialProfiles:{...p.socialProfiles,[n]:v}})),[]);
  const tt=useCallback((cat,val)=>setForm(p=>{const c=p.interests[cat];return{...p,interests:{...p.interests,[cat]:c.includes(val)?c.filter(x=>x!==val):[...c,val]}}}),[]);
  const sr=useCallback((v)=>setForm(p=>({...p,interests:{...p.interests,role:p.interests.role===v?"":v}})),[]);
  const pi=useCallback((file)=>{if(!file||!file.type.startsWith("image/"))return;setUpld(true);const r=new FileReader();r.onload=e=>{setForm(p=>({...p,avatar:e.target.result}));setUpld(false);};r.onerror=()=>setUpld(false);r.readAsDataURL(file);},[]);
  const hf=e=>pi(e.target.files[0]);
  const hd=e=>{e.preventDefault();setDrag(false);pi(e.dataTransfer.files[0]);};
  const addL=()=>{if(!nlnk.title.trim()||!nlnk.url.trim())return;const url=/^https?:\/\//.test(nlnk.url)?nlnk.url:`https://${nlnk.url}`;setForm(p=>({...p,links:[...p.links,{...nlnk,url,id:Date.now()}]}));setNlnk({title:"",url:"",icon:"fas fa-link"});setShowIP(false);};
  const rmL=id=>setForm(p=>({...p,links:p.links.filter(l=>l.id!==id)}));
  const mvL=(i,d)=>setForm(p=>{const ls=[...p.links],j=i+d;if(j<0||j>=ls.length)return p;[ls[i],ls[j]]=[ls[j],ls[i]];return{...p,links:ls};});

  const genBio=async()=>{
    setAiLoad(true);
    const role=ROLES.find(r=>r.v===form.interests.role)?.l||"person";
    const sports=form.interests.sports.slice(0,4).join(", ");
    const hobbies=form.interests.hobbies.slice(0,4).join(", ");
    const vibes=form.interests.vibes.slice(0,3).join(", ");
    const music=form.interests.music.slice(0,3).join(", ");
    const nm=form.name||"this person";
    const loc=form.location||"";
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${GK}`},
        body:JSON.stringify({
          model:"llama-3.1-8b-instant",
          messages:[
            {role:"system",content:"You write short bios for personal profile pages. Output ONLY the final bio text. No thinking, no labels, no preamble, no quotes. Just 2-3 warm casual first-person sentences."},
            {role:"user",content:`Write a 2-3 sentence casual first-person bio for ${nm}${loc?`, from ${loc}`:""}, who is a ${role}. Vibe: ${vibes||"easy-going"}. Sports: ${sports||"staying active"}. Hobbies: ${hobbies||"various"}. Music: ${music||"all kinds"}. Keep it warm, friendly, no hashtags, no emojis.`},
          ],
          max_tokens:140,
          temperature:0.75,
        }),
      });
      if(!res.ok)throw new Error(`${res.status}`);
      const data=await res.json();
      const txt=clean(data?.choices?.[0]?.message?.content||"");
      if(txt.length>8){setBio(txt);setBioEd(false);}
      else throw new Error("empty");
    }catch{
      const ex=[sports&&`love ${sports.split(",")[0].trim()}`,hobbies&&`enjoy ${hobbies.split(",")[0].trim()}`].filter(Boolean).join(" and ");
      setBio(`I'm ${nm}${loc?`, based in ${loc}`:""} — a ${role}. I ${ex||"enjoy life to the fullest"} and always looking for new experiences.`);
      setBioEd(false);
    }finally{setAiLoad(false);}
  };

  const publish=async()=>{
    setSubLoad(true);
    const aboutme=bio||form.bio;
    const pUrl=`https://mywebsam.site/${form.username}`;
    const pObj={...form,aboutme,savedAt:new Date().toISOString(),publishedUrl:pUrl};
    persist(pObj);
    const isUpdate=saved&&saved.username===form.username;
    try{
      const res=await fetch(isUpdate?"/api/update":"/api/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,aboutme})});
      const data=await res.json();
      const url=data.url||pUrl;
      persist({...pObj,publishedUrl:url});
      setPub({url,username:form.username});
    }catch{setPub({url:pUrl,username:form.username});}
    finally{setSubLoad(false);}
  };

  const getUrl=()=>pub?.url||saved?.publishedUrl||`https://mywebsam.site/${saved?.username||""}`;
  const copy=()=>{navigator.clipboard.writeText(getUrl()).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2200);});};
  const openShare=async()=>{if(navigator.share){try{await navigator.share({title:"My Profile",url:getUrl()});return;}catch{}}setShare(true);};

  const SO=[
    {l:"Copy Link",ic:"fas fa-link",bg:"#f0edff",c:AC,fn:()=>{copy();setShare(false);}},
    {l:"WhatsApp",ic:"fab fa-whatsapp",bg:"#edfaf3",c:"#25D366",fn:()=>{window.open(`https://wa.me/?text=${encodeURIComponent("Check out my profile! "+getUrl())}`);}},
    {l:"Telegram",ic:"fab fa-telegram",bg:"#edf7fd",c:"#26A5E4",fn:()=>{window.open(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=My+profile`);}},
    {l:"Instagram",ic:"fab fa-instagram",bg:"#fdf2f4",c:"#E4405F",fn:()=>{copy();alert("Link copied! Paste it in your Instagram story or bio.");setShare(false);}},
    {l:"Snapchat",ic:"fab fa-snapchat",bg:"#fffce8",c:"#c9a800",fn:()=>{window.open(`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(getUrl())}`);}},
    {l:"Twitter",ic:"fab fa-x-twitter",bg:"#f5f5f5",c:"#111",fn:()=>{window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out my profile! "+getUrl())}`);}},
    {l:"Facebook",ic:"fab fa-facebook-f",bg:"#eef4ff",c:"#1877F2",fn:()=>{window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`);}},
    {l:"LinkedIn",ic:"fab fa-linkedin-in",bg:"#e8f3fc",c:"#0A66C2",fn:()=>{window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`);}},
    {l:"Reddit",ic:"fab fa-reddit-alien",bg:"#fff2ed",c:"#FF4500",fn:()=>{window.open(`https://reddit.com/submit?url=${encodeURIComponent(getUrl())}`);}},
    {l:"Email",ic:"fas fa-envelope",bg:"#fef2f2",c:"#EA4335",fn:()=>{window.open(`mailto:?subject=My Profile&body=${encodeURIComponent(getUrl())}`);}},
    {l:"SMS",ic:"fas fa-comment-sms",bg:"#f0fdf4",c:"#10b981",fn:()=>{window.open(`sms:?body=${encodeURIComponent("My profile: "+getUrl())}`);}},
  ];

  const Lbl=({ch,req})=><div className="lbl">{ch}{req&&<span style={{color:"#ef4444",marginLeft:3}}>*</span>}</div>;
  const Hint=({icon="fas fa-info-circle",ch})=><div className="hint"><i className={icon} style={{color:AC,fontSize:11}}/>{ch}</div>;
  const TG=({items,cat})=>(
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {items.map(item=>{const on=form.interests[cat].includes(item);return(
        <button key={item} type="button" className={`tag${on?" on":""}`} onClick={()=>tt(cat,item)}>
          {on&&<i className="fas fa-check" style={{fontSize:9}}/>}{item}
        </button>
      );})}
    </div>
  );
  const NR=({ok=true})=>(
    <div style={{display:"flex",gap:10,marginTop:22}}>
      {step>1&&<button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(s=>s-1)}><i className="fas fa-arrow-left" style={{fontSize:12}}/> Back</button>}
      {step<5&&<button type="button" className="btn btn-p" style={{flex:2}} onClick={()=>setStep(s=>s+1)} disabled={!ok}>Continue <i className="fas fa-arrow-right" style={{fontSize:12}}/></button>}
    </div>
  );
  const TB=({right})=>(
    <div className="topbar">
      <a href="https://mywebsam.site/" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <div style={{width:28,height:28,borderRadius:8,background:AC,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="fas fa-link" style={{color:"#fff",fontSize:12}}/></div>
        <span style={{fontWeight:800,fontSize:15,color:"#111827"}}>mywebsam</span>
      </a>
      {right}
    </div>
  );
  const FT=()=><div className="footer">Made with ❤️‍🔥 by <strong>Samartha GS</strong></div>;
  const SS=()=>(
    <div className="overlay" onClick={()=>setShare(false)}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <h3 style={{fontSize:16,fontWeight:800}}>Share Profile</h3>
          <button onClick={()=>setShare(false)} style={{background:"none",border:"none",fontSize:22,color:"#9ca3af",cursor:"pointer",lineHeight:1,padding:"0 4px"}}>×</button>
        </div>
        <div style={{background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:10,padding:"10px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
          <i className="fas fa-globe" style={{color:AC,fontSize:13,flexShrink:0}}/>
          <span style={{flex:1,fontSize:12,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{getUrl()}</span>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
          {SO.map(o=>(
            <div key={o.l} className="si" onClick={()=>{o.fn();setShare(false);}}>
              <div className="sic" style={{background:o.bg,color:o.c}}><i className={o.ic}/></div>
              <span>{o.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if(view==="loading")return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f5f6fa"}}>
      <i className="fas fa-spinner" style={{animation:"spin .8s linear infinite",fontSize:28,color:AC}}/>
    </div>
  );

  if(view==="dash"&&saved&&!pub){
    const url=saved.publishedUrl||`https://mywebsam.site/${saved.username}`;
    const fso2=Object.entries(saved.socialProfiles||{}).filter(([,v])=>v?.trim());
    const date=new Date(saved.savedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
    return(
      <div style={{minHeight:"100vh",background:"#f5f6fa",paddingBottom:40}}>
        {share&&<SS/>}
        <TB right={<button className="btn btn-s" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>loadEdit(saved)}><i className="fas fa-pen" style={{fontSize:11}}/> Edit</button>}/>
        <div style={{maxWidth:460,margin:"0 auto",padding:"28px 14px 0"}}>
          <div className="card pop" style={{marginBottom:14}}>
            <div style={{textAlign:"center",marginBottom:20,paddingBottom:20,borderBottom:"1px solid #f0f0f5"}}>
              <div style={{fontSize:21,fontWeight:800,marginBottom:4}}>{saved.name}</div>
              <div style={{fontSize:13,color:AC,fontWeight:600,marginBottom:4}}>@{saved.username}</div>
              {saved.location&&<div style={{fontSize:12,color:"#9ca3af"}}><i className="fas fa-location-dot" style={{marginRight:4}}/>{saved.location}</div>}
              <div style={{fontSize:11,color:"#b0b7c3",marginTop:6}}><i className="fas fa-clock" style={{marginRight:4}}/>Updated {date}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:12,padding:"12px 16px",marginBottom:16,gap:10}}>
              <i className="fas fa-globe" style={{color:AC,fontSize:15,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",letterSpacing:"0.06em",marginBottom:2}}>YOUR PROFILE LINK</div>
                <div style={{fontSize:13,fontWeight:600,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(url,"_blank")}><i className="fas fa-arrow-up-right-from-square"/> View</button>
              <button className="btn btn-g" style={{width:"100%"}} onClick={openShare}><i className="fas fa-share-nodes"/> Share</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button className="btn btn-s" style={{width:"100%"}} onClick={copy}><i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/> {copied?"Copied!":"Copy Link"}</button>
              <button className="btn btn-s" style={{width:"100%"}} onClick={()=>loadEdit(saved)}><i className="fas fa-pen"/> Edit Profile</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[{l:"Socials",v:fso2.length,i:"fas fa-share-nodes",c:"#6C63FF"},{l:"Links",v:(saved.links||[]).length,i:"fas fa-link",c:"#10b981"},{l:"Interests",v:Object.values(saved.interests||{}).flat().filter(Boolean).length,i:"fas fa-tag",c:"#f59e0b"}].map(s=>(
              <div key={s.l} className="card" style={{textAlign:"center",padding:"14px 8px"}}>
                <i className={s.i} style={{color:s.c,fontSize:18,marginBottom:5,display:"block"}}/>
                <div style={{fontSize:20,fontWeight:800}}>{s.v}</div>
                <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",letterSpacing:".05em",textTransform:"uppercase"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <FT/>
      </div>
    );
  }

  if(pub){
    return(
      <div style={{minHeight:"100vh",background:"#f5f6fa",display:"flex",flexDirection:"column"}}>
        {share&&<SS/>}
        <TB/>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px"}}>
          <div style={{maxWidth:420,width:"100%"}}>
            <div style={{position:"relative",height:36}}>
              {["#6C63FF","#10b981","#f59e0b","#ef4444","#0ea5e9","#ec4899","#f97316"].map((c,i)=>(
                <div key={i} className="cp" style={{background:c,left:`${8+i*13}%`,animationDelay:`${i*.1}s`}}/>
              ))}
            </div>
            <div className="card pop" style={{textAlign:"center",padding:"36px 24px"}}>
              <div className="sring"><i className="fas fa-check" style={{color:"#fff",fontSize:36}}/></div>
              <h2 style={{fontSize:24,fontWeight:800,marginBottom:8}}>{saved?.savedAt?"Profile Updated!":"Profile Created!"}</h2>
              <p style={{color:"#6b7280",fontSize:14,lineHeight:1.6,marginBottom:20}}>
                Live at <strong style={{color:AC}}>mywebsam.site/{pub.username}</strong>
              </p>
              <div style={{display:"flex",alignItems:"center",background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:10,padding:"10px 14px",marginBottom:16,gap:10}}>
                <i className="fas fa-globe" style={{color:AC,fontSize:13,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"left"}}>{pub.url}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <button className="btn btn-p" style={{width:"100%"}} onClick={()=>window.open(pub.url,"_blank")}><i className="fas fa-arrow-up-right-from-square"/> View</button>
                <button className="btn btn-g" style={{width:"100%"}} onClick={openShare}><i className="fas fa-share-nodes"/> Share</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <button className="btn btn-s" style={{width:"100%"}} onClick={copy}><i className={`fas fa-${copied?"check":"copy"}`} style={{color:copied?"#10b981":undefined}}/> {copied?"Copied!":"Copy Link"}</button>
                <button className="btn btn-s" style={{width:"100%"}} onClick={()=>setView("dash")}><i className="fas fa-home"/> Dashboard</button>
              </div>
            </div>
          </div>
        </div>
        <FT/>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:"#f5f6fa",paddingBottom:40}}>
      {share&&<SS/>}
      <TB right={
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {saved&&<button className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setView("dash")}><i className="fas fa-arrow-left" style={{fontSize:11}}/> Dashboard</button>}
          <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>{score}%</span>
          <div style={{width:50,height:5,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${score}%`,height:"100%",background:score>=80?"#10b981":AC,borderRadius:99,transition:"width .4s"}}/>
          </div>
        </div>
      }/>
      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 14px 12px"}}>
        <div style={{display:"flex",alignItems:"flex-start",marginBottom:20,gap:4}}>
          {STEPS.map((lbl,i)=>{const s=i+1,st=step>s?"done":step===s?"active":"idle";return(
            <div key={s} style={{display:"flex",alignItems:"center",flex:s<5?1:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div className={`sdot ${st}`}>{st==="done"?<i className="fas fa-check" style={{fontSize:10}}/>:s}</div>
                <span className={`slbl ${st}`}>{lbl}</span>
              </div>
              {s<5&&<div style={{flex:1,height:2,background:step>s?"#10b981":"#e9eaf0",margin:"0 3px",marginBottom:18,borderRadius:1,transition:"background .3s"}}/>}
            </div>
          );})}
        </div>

        {step===1&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}><i className="fas fa-user-circle"/></div>
                <div><h2 style={{fontSize:18,fontWeight:800}}>About You</h2><p style={{fontSize:12,color:"#6b7280",marginTop:2}}>Let's start with the basics.</p></div>
              </div>
              <div style={{marginBottom:14}}>
                <Lbl ch="Username" req/>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#b0b7c3",fontSize:14,pointerEvents:"none"}}>@</span>
                  <input className="inp" style={{paddingLeft:27}} placeholder="yourname" value={form.username} onChange={e=>sf("username",e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,""))}/>
                </div>
                {form.username&&<Hint ch={<>mywebsam.site/<strong style={{color:AC}}>{form.username}</strong></>}/>}
                {saved?.username&&form.username!==saved.username&&<Hint icon="fas fa-triangle-exclamation" ch="Changing username will update your profile link."/>}
              </div>
              <div style={{marginBottom:14}}>
                <Lbl ch="Full Name" req/>
                <input className="inp" placeholder="Your full name" value={form.name} onChange={e=>sf("name",e.target.value)}/>
              </div>
              <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div><Lbl ch="Date of Birth"/><input className="inp" type="date" value={form.dob} onChange={e=>sf("dob",e.target.value)}/></div>
                <div><Lbl ch="Location"/><input className="inp" placeholder="City, Country" value={form.location} onChange={e=>sf("location",e.target.value)}/></div>
              </div>
              <div>
                <Lbl ch={<>Short Bio <span style={{color:"#b0b7c3",fontWeight:400,textTransform:"none",fontSize:11}}>(or generate with AI in step 2)</span></>}/>
                <textarea className="inp" rows={3} placeholder="Say something about yourself..." value={form.bio} onChange={e=>sf("bio",e.target.value)} style={{resize:"vertical",lineHeight:1.6}}/>
                <div className={`cc${form.bio.length>180?" o":form.bio.length>140?" w":""}`}>{form.bio.length}/200</div>
              </div>
            </div>
            <div className="card">
              <Lbl ch="Profile Photo"/>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:14,borderRadius:12,cursor:"pointer",border:`2px dashed ${drag?"#6C63FF":form.avatar?"#6C63FF":"#e5e7eb"}`,background:drag?"#f2f0ff":form.avatar?"#f8f7ff":"#fafafa",transition:"all .2s"}}
                onClick={()=>fRef.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={hd}>
                {form.avatar?(
                  <>
                    <img src={form.avatar} alt="av" style={{width:62,height:62,borderRadius:"50%",objectFit:"cover",border:`2.5px solid ${AC}`,flexShrink:0}}/>
                    <div style={{flex:1}}><div style={{fontWeight:600,marginBottom:2}}>Looking great!</div><div style={{fontSize:13,color:"#6b7280"}}>Click to change</div></div>
                    <button type="button" className="btn btn-d" onClick={e=>{e.stopPropagation();sf("avatar","");}}><i className="fas fa-trash"/></button>
                  </>
                ):(
                  <>
                    <div style={{width:62,height:62,borderRadius:"50%",background:"#ede9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:AC,flexShrink:0}}>
                      {upld?<i className="fas fa-spinner" style={{animation:"spin .8s linear infinite"}}/>:<i className="fas fa-camera"/>}
                    </div>
                    <div><div style={{fontWeight:600,marginBottom:2}}>{upld?"Uploading...":"Add a Photo"}</div><div style={{fontSize:13,color:"#6b7280"}}>Click or drag & drop</div><div style={{fontSize:11,color:"#b0b7c3",marginTop:2}}>PNG, JPG, GIF · Saved locally</div></div>
                  </>
                )}
              </div>
              <input ref={fRef} type="file" accept="image/*" style={{display:"none"}} onChange={hf}/>
            </div>
            <NR ok={!!form.username&&!!form.name}/>
          </div>
        )}

        {step===2&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}><i className="fas fa-face-smile"/></div>
                <div><h2 style={{fontSize:18,fontWeight:800}}>Your Vibe & Interests</h2><p style={{fontSize:12,color:"#6b7280",marginTop:2}}>Pick everything that's you.</p></div>
              </div>
              <div style={{marginBottom:16}}>
                <Lbl ch="I am a..."/>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {ROLES.map(r=>{const on=form.interests.role===r.v;return(
                    <button key={r.v} type="button" className={`tag${on?" on":""}`} style={{borderRadius:10}} onClick={()=>sr(r.v)}>
                      <i className={RI[r.v]||"fas fa-star"} style={{width:13,textAlign:"center"}}/>{r.l}
                    </button>
                  );})}
                </div>
              </div>
              {[{cat:"vibes",lbl:"My Vibe",items:VIBES},{cat:"sports",lbl:"Sports I Love",items:SPORTS},{cat:"hobbies",lbl:"Hobbies",items:HOBBIES},{cat:"music",lbl:"Music I Love",items:MUSIC},{cat:"passions",lbl:"Things I Care About",items:PASSIONS},{cat:"skills",lbl:"Skills & Tools (optional)",items:SKILLS}].map((s,idx)=>(
                <div key={s.cat}>
                  {idx>0&&<div className="divider"/>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl ch={s.lbl}/>{form.interests[s.cat].length>0&&<span style={{fontSize:11,color:AC,fontWeight:600}}>{form.interests[s.cat].length} selected</span>}
                  </div>
                  <TG items={s.items} cat={s.cat}/>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <Lbl ch="AI Bio Generator"/><div className="aib"><i className="fas fa-bolt"/>expo.1 · Groq AI</div>
              </div>
              <p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,marginBottom:12}}>Select interests above, then generate a personalised bio instantly.</p>
              <button type="button" className="btn btn-g" style={{width:"100%"}} onClick={genBio} disabled={aiLoad}>
                {aiLoad?<><i className="fas fa-spinner" style={{animation:"spin .8s linear infinite"}}/> Generating with Groq...</>:<><i className="fas fa-wand-magic-sparkles"/> Generate My Bio</>}
              </button>
              {bio&&(
                <div style={{marginTop:14,borderTop:"1px solid #f0edff",paddingTop:14}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                    <div className="aib"><i className="fas fa-robot"/> expo.1 Generated</div>
                    <button type="button" style={{background:"none",border:"none",fontSize:12,color:AC,cursor:"pointer",fontFamily:"inherit",fontWeight:600,padding:0}} onClick={genBio} disabled={aiLoad}><i className="fas fa-redo" style={{marginRight:4,fontSize:10}}/>Regenerate</button>
                  </div>
                  <textarea className="inp" rows={3} value={bio} onChange={e=>{setBio(e.target.value);setBioEd(true);}} style={{resize:"vertical",lineHeight:1.6}}/>
                  {bioEd&&<Hint icon="fas fa-pencil" ch="Edited — your version will be saved."/>}
                </div>
              )}
            </div>
            <NR/>
          </div>
        )}

        {step===3&&(
          <div className="fu">
            <div className="card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}><i className="fas fa-share-nodes"/></div>
                  <div><h2 style={{fontSize:18,fontWeight:800}}>Social Profiles</h2><p style={{fontSize:12,color:"#6b7280",marginTop:2}}>Only filled ones appear on your page.</p></div>
                </div>
                {fso.length>0&&<div className="bg"><i className="fas fa-check" style={{fontSize:9}}/>{fso.length} linked</div>}
              </div>
              <div className="sg" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:8}}>
                {SL.map(p=>{const m=SM[p.n]||{i:"fas fa-link",c:"#6b7280",b:"#f9fafb"};const val=form.socialProfiles[p.n]||"";return(
                  <div key={p.n} className="sc">
                    <div style={{width:32,height:32,borderRadius:8,background:m.b,color:m.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}><i className={m.i}/></div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#b0b7c3",letterSpacing:".05em",marginBottom:2}}>{p.l.toUpperCase()}</div>
                      <input placeholder={p.p} value={val} onChange={e=>ss(p.n,e.target.value)}/>
                    </div>
                    {val&&<i className="fas fa-circle-check" style={{color:"#10b981",fontSize:13}}/>}
                  </div>
                );})}
              </div>
            </div>
            <NR/>
          </div>
        )}

        {step===4&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}><i className="fas fa-link"/></div>
                <div><h2 style={{fontSize:18,fontWeight:800}}>Your Links</h2><p style={{fontSize:12,color:"#6b7280",marginTop:2}}>Portfolio, shop, blog, project — anything.</p></div>
              </div>
              <div style={{background:"#f8f7ff",border:"1.5px solid #ede9ff",borderRadius:12,padding:14,marginBottom:16}}>
                <Lbl ch="Add a Link"/>
                <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <input className="inp" style={{flex:"0 0 138px",minWidth:0}} placeholder="Label" value={nlnk.title} onChange={e=>setNlnk(p=>({...p,title:e.target.value}))}/>
                  <input className="inp" style={{flex:1,minWidth:130}} placeholder="https://..." value={nlnk.url} onChange={e=>setNlnk(p=>({...p,url:e.target.value}))}/>
                </div>
                <div style={{marginBottom:10}}>
                  <button type="button" className="btn btn-gh" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>setShowIP(v=>!v)}>
                    <i className={nlnk.icon}/> Icon <i className={`fas fa-chevron-${showIP?"up":"down"}`} style={{fontSize:10}}/>
                  </button>
                  {showIP&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,maxHeight:160,overflowY:"auto",padding:2}}>
                      {LI.map(ic=>(
                        <button key={ic} type="button"
                          style={{width:36,height:36,borderRadius:8,border:`1.5px solid ${nlnk.icon===ic?"#6C63FF":"#e5e7eb"}`,background:nlnk.icon===ic?"#f0edff":"#fff",color:nlnk.icon===ic?"#6C63FF":"#6b7280",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                          onClick={()=>{setNlnk(p=>({...p,icon:ic}));setShowIP(false);}}>
                          <i className={ic}/>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="btn btn-p" style={{width:"100%"}} onClick={addL}><i className="fas fa-plus"/> Add Link</button>
              </div>
              {form.links.length===0?(
                <div style={{textAlign:"center",padding:"24px",color:"#b0b7c3"}}><i className="fas fa-link" style={{fontSize:24,marginBottom:8,display:"block"}}/><div style={{fontSize:14}}>No links yet.</div></div>
              ):(
                <>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <Lbl ch={`Your Links (${form.links.length})`}/><span style={{fontSize:11,color:"#b0b7c3"}}>↑↓ to reorder</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {form.links.map((lnk,idx)=>(
                      <div key={lnk.id} className="lr">
                        <div style={{display:"flex",flexDirection:"column",gap:1}}>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===0?"default":"pointer",color:idx===0?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}} onClick={()=>mvL(idx,-1)}><i className="fas fa-chevron-up"/></button>
                          <button type="button" style={{background:"none",border:"none",cursor:idx===form.links.length-1?"default":"pointer",color:idx===form.links.length-1?"#e5e7eb":"#9ca3af",fontSize:10,padding:"2px 4px"}} onClick={()=>mvL(idx,1)}><i className="fas fa-chevron-down"/></button>
                        </div>
                        <div style={{width:32,height:32,borderRadius:8,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}><i className={lnk.icon}/></div>
                        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14}}>{lnk.title}</div><div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lnk.url}</div></div>
                        <a href={lnk.url} target="_blank" rel="noreferrer" style={{padding:"4px 8px",color:"#9ca3af",textDecoration:"none",fontSize:12}} onClick={e=>e.stopPropagation()}><i className="fas fa-arrow-up-right-from-square"/></a>
                        <button type="button" className="btn btn-d" onClick={()=>rmL(lnk.id)}><i className="fas fa-trash"/></button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <NR/>
          </div>
        )}

        {step===5&&(
          <div className="fu">
            <div className="card" style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#f0edff",color:AC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}><i className="fas fa-rocket"/></div>
                <div><h2 style={{fontSize:18,fontWeight:800}}>{saved?"Update Profile":"Ready to Publish?"}</h2><p style={{fontSize:12,color:"#6b7280",marginTop:2}}>Check completeness and go live.</p></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {CL.map(item=>(
                  <div key={item.t} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:item.d?"#f0fdf4":"#fafafa",border:`1.5px solid ${item.d?"#bbf7d0":"#e9eaf0"}`,borderRadius:10}}>
                    <i className={item.d?"fas fa-circle-check":"far fa-circle"} style={{color:item.d?"#10b981":"#d1d5db",fontSize:16,flexShrink:0}}/>
                    <span style={{fontSize:14,fontWeight:item.d?600:400,color:item.d?"#065f46":"#9ca3af",flex:1}}>{item.t}</span>
                    {item.d&&<i className="fas fa-check" style={{color:"#10b981",fontSize:11}}/>}
                  </div>
                ))}
              </div>
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Profile Completeness</span>
                  <span style={{fontSize:12,fontWeight:700,color:score>=80?"#10b981":AC}}>{score}%</span>
                </div>
                <div style={{height:8,background:"#e9eaf0",borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:`${score}%`,height:"100%",background:score>=80?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#6C63FF,#818cf8)",borderRadius:99,transition:"width .5s"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button type="button" className="btn btn-s" style={{flex:1}} onClick={()=>setStep(4)}><i className="fas fa-arrow-left" style={{fontSize:12}}/> Back</button>
                <button type="button" className="btn btn-p" style={{flex:2}} onClick={publish} disabled={subLoad||!form.username||!form.name}>
                  {subLoad?<><i className="fas fa-spinner" style={{animation:"spin .8s linear infinite"}}/> {saved?"Updating...":"Publishing..."}</>:<><i className="fas fa-rocket"/> {saved?"Update Profile":"Publish Profile"}</>}
                </button>
              </div>
              {(!form.username||!form.name)&&<div style={{marginTop:10,fontSize:13,color:"#ef4444",textAlign:"center"}}><i className="fas fa-triangle-exclamation" style={{marginRight:5}}/>Username and name are required.</div>}
            </div>
          </div>
        )}
      </div>
      <FT/>
    </div>
  );
}
