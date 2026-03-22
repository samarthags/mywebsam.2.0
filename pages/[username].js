// pages/[username].js
import Head from "next/head";
import { useState } from "react";
import clientPromise from "../lib/mongodb";

const PLAT = {
  email:        { i:"fas fa-envelope",      c:"#EA4335", u:(v)=>`mailto:${v}`,                                    n:"Email" },
  whatsapp:     { i:"fab fa-whatsapp",       c:"#25D366", u:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          n:"WhatsApp" },
  instagram:    { i:"fab fa-instagram",      c:"#E4405F", u:(v)=>`https://instagram.com/${v.replace("@","")}`,    n:"Instagram" },
  facebook:     { i:"fab fa-facebook-f",     c:"#1877F2", u:(v)=>`https://facebook.com/${v}`,                     n:"Facebook" },
  github:       { i:"fab fa-github",         c:"#ccc",    u:(v)=>`https://github.com/${v}`,                       n:"GitHub" },
  snapchat:     { i:"fab fa-snapchat",       c:"#FFE700", u:(v)=>`https://snapchat.com/add/${v}`,                 n:"Snapchat" },
  youtube:      { i:"fab fa-youtube",        c:"#FF0000", u:(v)=>`https://youtube.com/${v}`,                      n:"YouTube" },
  twitter:      { i:"fab fa-x-twitter",      c:"#ccc",    u:(v)=>`https://twitter.com/${v.replace("@","")}`,      n:"Twitter" },
  linkedin:     { i:"fab fa-linkedin-in",    c:"#0A66C2", u:(v)=>`https://linkedin.com/in/${v}`,                  n:"LinkedIn" },
  tiktok:       { i:"fab fa-tiktok",         c:"#ccc",    u:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      n:"TikTok" },
  discord:      { i:"fab fa-discord",        c:"#5865F2", u:(v)=>`https://discord.com/users/${v}`,                n:"Discord" },
  telegram:     { i:"fab fa-telegram",       c:"#26A5E4", u:(v)=>`https://t.me/${v.replace("@","")}`,             n:"Telegram" },
  twitch:       { i:"fab fa-twitch",         c:"#9146FF", u:(v)=>`https://twitch.tv/${v}`,                        n:"Twitch" },
  spotify:      { i:"fab fa-spotify",        c:"#1DB954", u:(v)=>`https://open.spotify.com/user/${v}`,            n:"Spotify" },
  pinterest:    { i:"fab fa-pinterest",      c:"#E60023", u:(v)=>`https://pinterest.com/${v}`,                    n:"Pinterest" },
  reddit:       { i:"fab fa-reddit-alien",   c:"#FF4500", u:(v)=>`https://reddit.com/user/${v}`,                  n:"Reddit" },
  medium:       { i:"fab fa-medium",         c:"#ccc",    u:(v)=>`https://medium.com/${v.replace("@","")}`,       n:"Medium" },
  devto:        { i:"fab fa-dev",            c:"#ccc",    u:(v)=>`https://dev.to/${v}`,                           n:"DEV.to" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  threads:      { i:"fab fa-threads",        c:"#ccc",    u:(v)=>`https://threads.net/${v.replace("@","")}`,      n:"Threads" },
  bluesky:      { i:"fas fa-cloud",          c:"#1185FE", u:(v)=>`https://bsky.app/profile/${v.replace("@","")}`, n:"Bluesky" },
  npm:          { i:"fab fa-npm",            c:"#CC3534", u:(v)=>`https://npmjs.com/~${v.replace("~","")}`,       n:"npm" },
  codepen:      { i:"fab fa-codepen",        c:"#ccc",    u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
};

function calcAge(dob) {
  if (!dob) return null;
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a > 0 ? a : null;
}

/* ─── Share Sheet ─── */
function ShareSheet({ url, name, onClose }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  async function doCopy() {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el = document.createElement("textarea");
      el.value = url; el.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  }
  const opts = [
    { l:"Copy Link", ic:"fas fa-copy",         bg:"#1a1a2a", fg:"#a78bfa", fn:doCopy },
    { l:"WhatsApp",  ic:"fab fa-whatsapp",      bg:"#0d1f15", fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc(name+" "+url)}`) },
    { l:"Telegram",  ic:"fab fa-telegram",      bg:"#0d1820", fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(name)}`) },
    { l:"Twitter",   ic:"fab fa-x-twitter",     bg:"#111",    fg:"#fff",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc(name+" "+url)}`) },
    { l:"Facebook",  ic:"fab fa-facebook-f",    bg:"#0d1220", fg:"#1877F2", fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`) },
    { l:"LinkedIn",  ic:"fab fa-linkedin-in",   bg:"#0a1520", fg:"#0A66C2", fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`) },
    { l:"Reddit",    ic:"fab fa-reddit-alien",  bg:"#1f1208", fg:"#FF4500", fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}`) },
    { l:"Email",     ic:"fas fa-envelope",      bg:"#1f0d0d", fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`) },
    { l:"SMS",       ic:"fas fa-comment-sms",   bg:"#0d1f15", fg:"#1DB954", fn:()=>window.open(`sms:?body=${enc(url)}`) },
  ];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,paddingBottom:44,animation:"ssUp .28s cubic-bezier(.34,1.4,.64,1) both"}}>
        <style>{`@keyframes ssUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 8px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#2a2a2a"}}/>
        </div>
        <div style={{padding:"8px 20px 16px",borderBottom:"1px solid #1e1e1e",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>Share Profile</div>
            <div style={{fontSize:11,color:"#444",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #2a2a2a",fontSize:17,color:"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{padding:"14px 10px 0",display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.l} onClick={o.fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:72,padding:"10px 4px",border:"none",background:"transparent",cursor:"pointer",borderRadius:14,outline:"none",WebkitTapHighlightColor:"transparent",transition:"background .12s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#161616"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:52,height:52,borderRadius:14,background:o.bg,color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,border:"1px solid rgba(255,255,255,.05)"}}>
                {o.l==="Copy Link"&&copied?<i className="fas fa-check" style={{color:"#1DB954"}}/>:<i className={o.ic}/>}
              </div>
              <span style={{fontSize:10.5,fontWeight:600,color:"#555",textAlign:"center",lineHeight:1.2}}>{o.l==="Copy Link"&&copied?"Copied!":o.l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function ProfilePage({ user, pageUrl, avatarUrl }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [spOpen,    setSpOpen]    = useState(false);

  /* 404 */
  if (!user) {
    return (
      <>
        <Head>
          <title>Not Found | mywebsam</title>
          <meta name="robots" content="noindex"/>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#080808;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;}`}</style>
        </Head>
        <div style={{textAlign:"center",padding:32}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#111",border:"1px solid #222",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,color:"#333"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8}}>Profile Not Found</h1>
          <p style={{color:"#444",marginBottom:28}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#fff",color:"#000",padding:"12px 28px",borderRadius:999,fontWeight:800,fontSize:14,display:"inline-flex",alignItems:"center",gap:8,outline:"none",WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const userAge   = calcAge(user.dob);
  const socials   = Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>PLAT[k]);
  const interests = Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,14);
  const bio       = user.aboutme||user.bio||"";
  const ptitle    = `${user.name} | mywebsam`;

  return (
    <>
      <Head>
        <title>{ptitle}</title>
        <meta name="description"         content={bio||`${user.name}'s profile on mywebsam`}/>
        <meta name="viewport"            content="width=device-width,initial-scale=1"/>
        <meta name="theme-color"         content="#080808"/>
        <meta property="og:type"         content="profile"/>
        <meta property="og:title"        content={ptitle}/>
        <meta property="og:description"  content={bio||`${user.name}'s links on mywebsam`}/>
        <meta property="og:url"          content={pageUrl}/>
        <meta property="og:site_name"    content="mywebsam"/>
        <meta property="og:image"        content={avatarUrl}/>
        <meta property="og:image:width"  content="400"/>
        <meta property="og:image:height" content="400"/>
        <meta property="og:image:type"   content="image/jpeg"/>
        <meta name="twitter:card"        content="summary_large_image"/>
        <meta name="twitter:title"       content={ptitle}/>
        <meta name="twitter:description" content={bio||`${user.name}'s links on mywebsam`}/>
        <meta name="twitter:image"       content={avatarUrl}/>
        {/* Font Awesome + Google Fonts */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{background:#080808;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;overflow-x:hidden;}

          @keyframes heroReveal{from{opacity:0;transform:scale(1.03);}to{opacity:1;transform:scale(1);}}
          @keyframes slideUp{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
          @keyframes breathe{0%,100%{opacity:1;}50%{opacity:.5;}}
          .a0{animation:heroReveal .8s cubic-bezier(.22,.68,0,1) both;}
          .a1{animation:slideUp .6s .08s cubic-bezier(.22,.68,0,1.12) both;}
          .a2{animation:slideUp .6s .16s cubic-bezier(.22,.68,0,1.12) both;}
          .a3{animation:slideUp .6s .24s cubic-bezier(.22,.68,0,1.12) both;}
          .a4{animation:slideUp .6s .32s cubic-bezier(.22,.68,0,1.12) both;}
          .a5{animation:slideUp .6s .40s cubic-bezier(.22,.68,0,1.12) both;}
          .a6{animation:slideUp .6s .48s cubic-bezier(.22,.68,0,1.12) both;}

          /* ── HERO ── */
          .hero{
            position:relative;width:100%;
            height:62vh;min-height:340px;max-height:540px;
            overflow:hidden;
          }
          .hero img{
            width:100%;height:100%;object-fit:cover;
            object-position:center 12%;display:block;
          }
          .hero-grad{
            position:absolute;inset:0;pointer-events:none;
            background:linear-gradient(to bottom,
              rgba(8,8,8,0) 0%,rgba(8,8,8,0) 22%,
              rgba(8,8,8,.18) 46%,rgba(8,8,8,.72) 70%,
              rgba(8,8,8,.96) 88%,rgba(8,8,8,1) 100%);
          }
          .hero-vig{
            position:absolute;inset:0;pointer-events:none;
            background:radial-gradient(ellipse at 50% 0%,transparent 50%,rgba(0,0,0,.3) 100%);
          }
          .hero-id{
            position:absolute;bottom:0;left:0;right:0;
            padding:0 24px 34px;text-align:center;z-index:5;
          }
          .pname{
            font-family:'Cormorant Garamond',Georgia,serif;
            font-size:clamp(54px,14.5vw,86px);
            font-weight:700;color:#fff;
            letter-spacing:-.02em;line-height:.95;
            text-shadow:0 2px 0 rgba(255,255,255,.04),0 6px 48px rgba(0,0,0,.9);
            margin-bottom:11px;
          }
          .id-row{
            display:flex;align-items:center;justify-content:center;
            gap:9px;flex-wrap:wrap;
          }
          .handle{font-size:13px;color:rgba(255,255,255,.38);font-weight:500;letter-spacing:.04em;}
          .age-pill{
            display:inline-flex;align-items:center;justify-content:center;
            background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);
            border-radius:999px;padding:3px 11px;
            font-size:12px;font-weight:600;color:rgba(255,255,255,.45);
          }

          /* No photo */
          .hero-ph{
            width:100%;height:62vh;min-height:340px;max-height:540px;
            background:#0c0c0c;display:flex;align-items:center;
            justify-content:center;flex-direction:column;gap:18px;
          }
          .av-ph{
            width:104px;height:104px;border-radius:50%;
            background:#141414;border:1.5px solid #222;
            display:flex;align-items:center;justify-content:center;
            font-family:'Cormorant Garamond',serif;
            font-size:44px;font-weight:700;color:#fff;
          }

          /* ── CONTENT ── */
          .content{max-width:456px;margin:0 auto;padding:22px 18px 80px;}

          /* Bio */
          .bio-block{text-align:center;margin-bottom:26px;}
          .bio-text{font-size:14px;color:rgba(255,255,255,.38);line-height:1.82;max-width:300px;margin:0 auto;}

          /* ── SOCIAL ICONS ── */
          .soc-row{display:flex;justify-content:center;flex-wrap:wrap;gap:9px;margin-bottom:28px;}
          .soc-btn{
            width:46px;height:46px;border-radius:13px;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;
            background:#111;border:1px solid #1c1c1c;
            color:rgba(255,255,255,.5);
            transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .15s,border-color .15s,color .15s,box-shadow .15s;
            position:relative;
          }
          .soc-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,.04),transparent);pointer-events:none;}
          .soc-btn:hover{transform:translateY(-5px) scale(1.06);background:#181818;border-color:#2c2c2c;color:rgba(255,255,255,.88);box-shadow:0 10px 28px rgba(0,0,0,.6);}
          .soc-btn:active{transform:scale(.92);}

          /* ── EXTERNAL LINK BUTTONS ── */
          .links{display:flex;flex-direction:column;gap:11px;margin-bottom:28px;}
          .lbtn{
            display:flex;align-items:center;
            width:100%;min-height:62px;
            background:#111;border:1px solid #1c1c1c;border-radius:18px;
            cursor:pointer;overflow:hidden;position:relative;
            transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .15s,border-color .15s,box-shadow .15s;
          }
          .lbtn::before{content:"";position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(to bottom,rgba(255,255,255,.04),transparent);pointer-events:none;z-index:1;}
          .lbtn:hover{transform:translateY(-3px) scale(1.008);background:#181818;border-color:#2c2c2c;box-shadow:0 14px 40px rgba(0,0,0,.55);}
          .lbtn:active{transform:scale(.98);}
          .lbtn-ic{
            width:62px;min-height:62px;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;color:rgba(255,255,255,.38);
            flex-shrink:0;border-right:1px solid #181818;
            transition:color .15s;z-index:2;
          }
          .lbtn:hover .lbtn-ic{color:rgba(255,255,255,.75);}
          .lbtn-t{
            flex:1;text-align:center;
            font-size:15px;font-weight:700;color:#f0f0f0;
            padding:0 14px;letter-spacing:-.01em;z-index:2;
          }
          .lbtn-a{
            width:46px;min-height:62px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:rgba(255,255,255,.15);
            flex-shrink:0;z-index:2;
            transition:color .15s,transform .18s;
          }
          .lbtn:hover .lbtn-a{color:rgba(255,255,255,.45);transform:translateX(3px);}

          /* ── SPOTIFY ── */
          .sp-block{margin-bottom:28px;}
          .sp-trig{
            display:flex;align-items:center;gap:14px;padding:14px 16px;
            background:#111;border:1px solid #1c1c1c;border-radius:18px;cursor:pointer;
            position:relative;overflow:hidden;
            transition:background .15s,border-color .15s,box-shadow .15s;
          }
          .sp-trig::before{content:"";position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(to bottom,rgba(255,255,255,.03),transparent);pointer-events:none;}
          .sp-trig:hover{background:#181818;border-color:#2c2c2c;box-shadow:0 8px 28px rgba(0,0,0,.45);}
          .sp-trig.open{border-radius:18px 18px 0 0;border-bottom-color:transparent;}
          .sp-art{
            width:50px;height:50px;border-radius:11px;
            background:#0d1f15;border:1px solid rgba(29,185,84,.18);
            display:flex;align-items:center;justify-content:center;
            font-size:22px;color:#1DB954;flex-shrink:0;overflow:hidden;
          }
          .sp-art img{width:100%;height:100%;object-fit:cover;}
          .sp-meta{flex:1;min-width:0;}
          .sp-eyebrow{
            font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
            color:rgba(29,185,84,.65);margin-bottom:4px;
            display:flex;align-items:center;gap:5px;
          }
          .sp-dot{width:5px;height:5px;border-radius:50%;background:#1DB954;animation:breathe 2s ease infinite;}
          .sp-title{font-size:14.5px;font-weight:700;color:#fff;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .sp-artist{font-size:12px;color:rgba(255,255,255,.32);margin-top:2px;}
          .sp-caret{font-size:12px;color:rgba(255,255,255,.22);transition:transform .25s cubic-bezier(.34,1.56,.64,1);flex-shrink:0;}
          .sp-caret.open{transform:rotate(180deg);}
          .sp-embed{border:1px solid #1c1c1c;border-top:none;border-radius:0 0 18px 18px;overflow:hidden;}

          /* ── INTERESTS ── */
          .int-block{margin-bottom:28px;}
          .sec-lbl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#2e2e2e;margin-bottom:12px;text-align:center;}
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;}
          .itag{
            padding:7px 15px;border-radius:999px;
            font-size:12px;font-weight:600;color:rgba(255,255,255,.42);
            background:#111;border:1px solid #1c1c1c;
            transition:background .14s,border-color .14s,color .14s,transform .18s cubic-bezier(.34,1.56,.64,1);
          }
          .itag:hover{background:#181818;border-color:#2c2c2c;color:rgba(255,255,255,.82);transform:translateY(-2px);}

          /* ── FOOTER ── */
          .foot{text-align:center;padding:4px 0;}
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:4px;}
          .foot a{font-size:12px;color:#282828;font-weight:700;}
          .foot a:hover{color:#484848;}
          .foot-sub{font-size:11px;color:#222;}

          /* ── SHARE FAB ── */
          .sfab{
            position:fixed;top:16px;right:16px;
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);
            backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
            display:flex;align-items:center;justify-content:center;
            font-size:15px;color:rgba(255,255,255,.6);
            cursor:pointer;z-index:80;
            transition:background .15s,transform .14s,color .15s;
          }
          .sfab:hover{background:rgba(255,255,255,.14);color:#fff;transform:scale(1.08);}
          .sfab:active{transform:scale(.92);}

          @media(max-width:420px){
            .hero{height:58vh;}
            .pname{font-size:48px;}
            .content{padding:18px 14px 64px;}
            .lbtn{min-height:58px;border-radius:16px;}
            .lbtn-ic{width:58px;min-height:58px;}
            .lbtn-a{width:42px;min-height:58px;}
            .soc-btn{width:42px;height:42px;font-size:16px;border-radius:12px;}
            .sp-trig{padding:13px 14px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="sfab" onClick={()=>setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      {/* ── HERO ── */}
      {user.avatar ? (
        <div className="hero a0">
          <img src={user.avatar} alt={user.name}/>
          <div className="hero-grad"/>
          <div className="hero-vig"/>
          <div className="hero-id">
            <div className="pname a1">{user.name}</div>
            <div className="id-row a2">
              <span className="handle">@{user.username}</span>
              {userAge && <span className="age-pill">{userAge}</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-ph a0">
          <div className="av-ph">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
          <div style={{textAlign:"center",padding:"0 22px"}}>
            <div className="pname a1" style={{fontSize:"clamp(44px,12vw,68px)"}}>{user.name}</div>
            <div className="id-row a2">
              <span className="handle">@{user.username}</span>
              {userAge && <span className="age-pill">{userAge}</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="content">

        {/* Bio */}
        {bio && (
          <div className="bio-block a2">
            <p className="bio-text">{bio}</p>
          </div>
        )}

        {/* Social icons */}
        {socials.length > 0 && (
          <div className="soc-row a3">
            {socials.map(([pl, val]) => {
              const m = PLAT[pl];
              return (
                <a key={pl} href={m.u(val)} target="_blank" rel="noopener noreferrer"
                  className="soc-btn" title={m.n} style={{color:m.c}}>
                  <i className={m.i}/>
                </a>
              );
            })}
          </div>
        )}

        {/* External link buttons */}
        {(user.links||[]).length > 0 && (
          <div className="links a4">
            {user.links.map((lnk, i) => (
              <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="lbtn">
                <div className="lbtn-ic"><i className={lnk.icon||"fas fa-link"}/></div>
                <div className="lbtn-t">{lnk.title}</div>
                <div className="lbtn-a"><i className="fas fa-arrow-up-right-from-square"/></div>
              </a>
            ))}
          </div>
        )}

        {/* Spotify — tap to expand square embed */}
        {user.favSongTrackId && (
          <div className="sp-block a5">
            <div className={`sp-trig${spOpen?" open":""}`} onClick={()=>setSpOpen(v=>!v)}>
              <div className="sp-art">
                <i className="fab fa-spotify"/>
              </div>
              <div className="sp-meta">
                <div className="sp-eyebrow">
                  <span className="sp-dot"/>
                  Currently Vibing To
                </div>
                <div className="sp-title">{user.favSong||"My Favourite Song"}</div>
                {user.favArtist && <div className="sp-artist">{user.favArtist}</div>}
              </div>
              <i className={`fas fa-chevron-down sp-caret${spOpen?" open":""}`}/>
            </div>
            {spOpen && (
              <div className="sp-embed">
                <iframe
                  src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                  width="100%" height="380" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy" style={{display:"block"}}
                />
              </div>
            )}
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="int-block a5">
            <div className="sec-lbl">Interests</div>
            <div className="int-tags">
              {interests.map((t,i) => <span key={i} className="itag">{t}</span>)}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="foot a6">
          <div className="foot-logo">
            <img src="/icon.png" alt="mywebsam" style={{width:16,height:16,borderRadius:4,verticalAlign:"middle",opacity:.4}}/>
            <a href="/"><strong>mywebsam</strong></a>
          </div>
          <div className="foot-sub">Your link in bio — <a href="/">Create yours free</a></div>
        </div>

      </div>

      {shareOpen && <ShareSheet url={pageUrl} name={user.name} onClose={()=>setShareOpen(false)}/>}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    const client  = await clientPromise;
    const db      = client.db(process.env.DB_NAME);
    const user    = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );
    const host    = req.headers.host || "mywebsammu.vercel.app";
    const proto   = host.startsWith("localhost") ? "http" : "https";
    const base    = `${proto}://${host}`;
    const pageUrl = `${base}/${params.username.toLowerCase()}`;
    const avatarUrl = `${base}/api/avatar/${params.username.toLowerCase()}`;
    if (!user) return { props: { user:null, pageUrl, avatarUrl } };
    return {
      props: {
        pageUrl, avatarUrl,
        user: JSON.parse(JSON.stringify({
          username:       user.username       || "",
          name:           user.name           || "",
          dob:            user.dob            || null,
          location:       user.location       || "",
          bio:            user.bio            || "",
          aboutme:        user.aboutme        || "",
          avatar:         user.avatar         || "",
          banner:         user.banner         || "",
          socialProfiles: user.socialProfiles || {},
          links:          user.links          || [],
          interests:      user.interests      || {},
          favSong:        user.favSong        || "",
          favArtist:      user.favArtist      || "",
          favSongUrl:     user.favSongUrl     || "",
          favSongTrackId: user.favSongTrackId || "",
        }))
      }
    };
  } catch(e) {
    console.error("[username page]", e);
    const host  = req?.headers?.host || "mywebsammu.vercel.app";
    const proto = host.startsWith("localhost") ? "http" : "https";
    const base  = `${proto}://${host}`;
    return { props: { user:null, pageUrl:`${base}/${params.username}`, avatarUrl:`${base}/api/avatar/${params.username}` } };
  }
}
