// pages/[username].js
import Head from "next/head";
import { useState, useEffect } from "react";
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
  codepen:      { i:"fab fa-codepen",        c:"#ccc",    u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
};

function calcAge(dob) {
  if (!dob) return null;
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a > 0 ? a : null;
}

function track(username, event) {
  fetch("/api/track", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ username, event }),
  }).catch(()=>{});
}

function ShareSheet({ url, name, onClose }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  async function doCopy() {
    try { await navigator.clipboard.writeText(url); }
    catch (_) {
      const el=document.createElement("textarea"); el.value=url;
      el.style.cssText="position:fixed;opacity:0;"; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(()=>setCopied(false),2200);
  }
  const opts = [
    { l:"Copy Link", ic:"fas fa-copy",        bg:"#1a1a2a",fg:"#a78bfa", fn:doCopy },
    { l:"WhatsApp",  ic:"fab fa-whatsapp",     bg:"#0d1f15",fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc(name+" "+url)}`) },
    { l:"Telegram",  ic:"fab fa-telegram",     bg:"#0d1820",fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc(name)}`) },
    { l:"Twitter",   ic:"fab fa-x-twitter",    bg:"#111",   fg:"#fff",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc(name+" "+url)}`) },
    { l:"Facebook",  ic:"fab fa-facebook-f",   bg:"#0d1220",fg:"#1877F2", fn:()=>window.open(`https://facebook.com/sharer/sharer.php?u=${enc(url)}`) },
    { l:"LinkedIn",  ic:"fab fa-linkedin-in",  bg:"#0a1520",fg:"#0A66C2", fn:()=>window.open(`https://linkedin.com/sharing/share-offsite/?url=${enc(url)}`) },
    { l:"Reddit",    ic:"fab fa-reddit-alien", bg:"#1f1208",fg:"#FF4500", fn:()=>window.open(`https://reddit.com/submit?url=${enc(url)}`) },
    { l:"Email",     ic:"fas fa-envelope",     bg:"#1f0d0d",fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`) },
    { l:"SMS",       ic:"fas fa-comment-sms",  bg:"#0d1f15",fg:"#1DB954", fn:()=>window.open(`sms:?body=${enc(url)}`) },
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
            <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>Share</div>
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

export default function ProfilePage({ user, pageUrl, avatarUrl }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [spOpen,    setSpOpen]    = useState(false);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(()=>{
    setLoaded(true);
    if (user?.username) track(user.username, "view");
  },[]);

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
  const badge     = user.interests?.role;

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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{background:#080808;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;overflow-x:hidden;}

          /* ── Animations ── */
          @keyframes revealUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}
          @keyframes scaleIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
          @keyframes breathe{0%,100%{opacity:.8;}50%{opacity:.4;}}
          @keyframes shimmerSlide{0%{transform:translateX(-100%);}100%{transform:translateX(100%)}}

          .loaded .a1{animation:revealUp .65s .05s cubic-bezier(.22,.68,0,1.12) both;}
          .loaded .a2{animation:revealUp .65s .13s cubic-bezier(.22,.68,0,1.12) both;}
          .loaded .a3{animation:revealUp .65s .21s cubic-bezier(.22,.68,0,1.12) both;}
          .loaded .a4{animation:revealUp .65s .29s cubic-bezier(.22,.68,0,1.12) both;}
          .loaded .a5{animation:revealUp .65s .37s cubic-bezier(.22,.68,0,1.12) both;}
          .loaded .a6{animation:revealUp .65s .45s cubic-bezier(.22,.68,0,1.12) both;}
          .loaded .a7{animation:revealUp .65s .53s cubic-bezier(.22,.68,0,1.12) both;}

          /* ── HERO ── */
          .hero-wrap{
            position:relative;
            width:100%;
            height:60vh;
            min-height:340px;
            max-height:560px;
            overflow:hidden;
          }
          /* Actual sharp photo — right half */
          .hero-photo{
            position:absolute;
            right:0;top:0;
            width:65%;height:100%;
            z-index:1;
          }
          .hero-photo img{
            width:100%;height:100%;
            object-fit:cover;
            object-position:center 10%;
            display:block;
          }
          /* Blurred version full width — left side backdrop */
          .hero-blur{
            position:absolute;inset:0;
            z-index:0;
            overflow:hidden;
          }
          .hero-blur img{
            width:100%;height:100%;
            object-fit:cover;
            object-position:center 10%;
            display:block;
            filter:blur(28px) brightness(.45) saturate(1.2);
            transform:scale(1.1);
          }
          /* Gradient: black left → transparent right (smooth transition) */
          .hero-blend{
            position:absolute;inset:0;z-index:2;pointer-events:none;
            background:linear-gradient(
              to right,
              rgba(8,8,8,1)   0%,
              rgba(8,8,8,.92) 22%,
              rgba(8,8,8,.7)  38%,
              rgba(8,8,8,.2)  52%,
              rgba(8,8,8,0)   65%
            );
          }
          /* Bottom fade to black for content below */
          .hero-bottom{
            position:absolute;bottom:0;left:0;right:0;z-index:3;pointer-events:none;
            height:55%;
            background:linear-gradient(to bottom,transparent,rgba(8,8,8,.85) 70%,rgba(8,8,8,1) 100%);
          }

          /* Identity block — sits left, z-index above blends */
          .hero-id{
            position:absolute;
            bottom:0;left:0;
            padding:0 24px 32px;
            z-index:10;
            max-width:75%;
          }
          .pname{
            font-family:'Bebas Neue',sans-serif;
            font-size:clamp(62px,17vw,96px);
            font-weight:400;
            color:#fff;
            letter-spacing:.03em;
            line-height:.92;
            text-shadow:0 4px 48px rgba(0,0,0,.9);
            margin-bottom:12px;
          }
          .id-row{
            display:flex;align-items:center;
            gap:8px;flex-wrap:wrap;
          }
          .handle{
            font-size:13px;color:rgba(255,255,255,.42);
            font-weight:500;letter-spacing:.04em;
          }
          .age-pill{
            display:inline-flex;align-items:center;justify-content:center;
            background:rgba(255,255,255,.08);
            border:1px solid rgba(255,255,255,.14);
            border-radius:999px;padding:3px 12px;
            font-size:12px;font-weight:700;
            color:rgba(255,255,255,.55);
          }
          /* Professional badge */
          .badge-pill{
            display:inline-flex;align-items:center;gap:6px;
            background:rgba(255,255,255,.1);
            border:1px solid rgba(255,255,255,.2);
            border-radius:999px;padding:4px 13px;
            font-size:11.5px;font-weight:700;
            color:rgba(255,255,255,.7);
            letter-spacing:.02em;
            position:relative;overflow:hidden;
          }
          .badge-pill::after{
            content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;
            background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
            animation:shimmerSlide 2.5s ease infinite;
          }

          /* No photo fallback */
          .hero-ph{
            width:100%;height:60vh;min-height:340px;max-height:560px;
            background:#0c0c0c;display:flex;align-items:center;
            justify-content:center;flex-direction:column;gap:18px;
            position:relative;
          }
          .av-ph{
            width:104px;height:104px;border-radius:50%;
            background:#141414;border:1.5px solid #222;
            display:flex;align-items:center;justify-content:center;
            font-family:'Bebas Neue',sans-serif;
            font-size:48px;color:#fff;
          }

          /* ── CONTENT ── */
          .content{max-width:460px;margin:0 auto;padding:20px 18px 80px;}

          /* Bio */
          .bio-block{margin-bottom:24px;}
          .bio-text{
            font-size:14px;color:rgba(255,255,255,.4);
            line-height:1.82;
          }

          /* ── INTEREST BADGES ── */
          .int-block{margin-bottom:26px;}
          .int-tags{display:flex;flex-wrap:wrap;gap:7px;}
          .itag{
            display:inline-flex;align-items:center;gap:5px;
            padding:6px 14px;border-radius:999px;
            font-size:12px;font-weight:600;
            color:rgba(255,255,255,.55);
            background:#111;border:1px solid #1e1e1e;
            transition:background .14s,border-color .14s,color .18s,transform .2s cubic-bezier(.34,1.56,.64,1);
          }
          .itag:hover{background:#1a1a1a;border-color:#2e2e2e;color:rgba(255,255,255,.88);transform:translateY(-2px);}

          /* ── SOCIAL ICONS ── */
          .soc-row{
            display:flex;flex-wrap:wrap;gap:9px;
            margin-bottom:26px;
          }
          .soc-btn{
            width:46px;height:46px;border-radius:13px;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            background:#111;border:1px solid #1e1e1e;
            transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .14s,border-color .14s,box-shadow .14s;
            position:relative;overflow:hidden;
          }
          .soc-btn::before{
            content:"";position:absolute;inset:0;
            background:linear-gradient(135deg,rgba(255,255,255,.06),transparent);
            border-radius:inherit;pointer-events:none;
          }
          .soc-btn:hover{
            transform:translateY(-5px) scale(1.06);
            background:#181818;border-color:#2d2d2d;
            box-shadow:0 10px 28px rgba(0,0,0,.6);
          }
          .soc-btn:active{transform:scale(.92);}

          /* ── LINK BUTTONS ── */
          .links{display:flex;flex-direction:column;gap:10px;margin-bottom:26px;}
          .lbtn{
            display:flex;align-items:center;
            width:100%;min-height:60px;
            background:#111;border:1px solid #1e1e1e;border-radius:16px;
            cursor:pointer;overflow:hidden;position:relative;
            transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .14s,border-color .14s,box-shadow .14s;
          }
          .lbtn::before{
            content:"";position:absolute;top:0;left:0;right:0;height:50%;
            background:linear-gradient(to bottom,rgba(255,255,255,.04),transparent);
            pointer-events:none;
          }
          .lbtn:hover{
            transform:translateY(-3px) scale(1.01);
            background:#181818;border-color:#2d2d2d;
            box-shadow:0 12px 36px rgba(0,0,0,.55);
          }
          .lbtn:active{transform:scale(.98);}
          .lbtn-ic{
            width:60px;min-height:60px;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;color:rgba(255,255,255,.38);
            flex-shrink:0;border-right:1px solid #181818;
            transition:color .14s;
          }
          .lbtn:hover .lbtn-ic{color:rgba(255,255,255,.75);}
          .lbtn-t{
            flex:1;text-align:center;font-size:15px;font-weight:700;
            color:#f0f0f0;padding:0 14px;letter-spacing:-.01em;
          }
          .lbtn-a{
            width:44px;min-height:60px;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:rgba(255,255,255,.15);flex-shrink:0;
            transition:color .14s,transform .2s;
          }
          .lbtn:hover .lbtn-a{color:rgba(255,255,255,.45);transform:translateX(3px);}

          /* ── SPOTIFY ── */
          .sp-block{margin-bottom:26px;}
          .sp-trig{
            display:flex;align-items:center;gap:14px;padding:13px 16px;
            background:#111;border:1px solid #1e1e1e;border-radius:16px;cursor:pointer;
            position:relative;overflow:hidden;
            transition:background .14s,border-color .14s,box-shadow .14s;
          }
          .sp-trig::before{
            content:"";position:absolute;top:0;left:0;right:0;height:50%;
            background:linear-gradient(to bottom,rgba(255,255,255,.03),transparent);
            pointer-events:none;
          }
          .sp-trig:hover{background:#181818;border-color:#2d2d2d;box-shadow:0 8px 28px rgba(0,0,0,.4);}
          .sp-trig.open{border-radius:16px 16px 0 0;border-bottom-color:transparent;}
          .sp-art{
            width:48px;height:48px;border-radius:10px;
            background:#0d1f15;border:1px solid rgba(29,185,84,.2);
            display:flex;align-items:center;justify-content:center;
            font-size:22px;color:#1DB954;flex-shrink:0;
          }
          .sp-meta{flex:1;min-width:0;}
          .sp-eye{
            font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
            color:rgba(29,185,84,.65);margin-bottom:3px;
            display:flex;align-items:center;gap:5px;
          }
          .sp-dot{
            width:5px;height:5px;border-radius:50%;background:#1DB954;
            animation:breathe 2s ease infinite;flex-shrink:0;
          }
          .sp-title{font-size:14px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .sp-artist{font-size:12px;color:rgba(255,255,255,.32);margin-top:1px;}
          .sp-caret{font-size:12px;color:rgba(255,255,255,.22);transition:transform .25s cubic-bezier(.34,1.56,.64,1);flex-shrink:0;}
          .sp-caret.open{transform:rotate(180deg);}
          .sp-embed{border:1px solid #1e1e1e;border-top:none;border-radius:0 0 16px 16px;overflow:hidden;}

          /* ── FOOTER ── */
          .foot{text-align:center;padding:4px 0;}
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;}
          .foot a{font-size:12px;color:#252525;font-weight:700;}
          .foot a:hover{color:#454545;}
          .foot-sub{font-size:11px;color:#1e1e1e;}

          /* ── SHARE FAB ── */
          .sfab{
            position:fixed;top:16px;right:16px;
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
            backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
            display:flex;align-items:center;justify-content:center;
            font-size:15px;color:rgba(255,255,255,.65);cursor:pointer;z-index:80;
            transition:background .14s,transform .13s,color .14s;
          }
          .sfab:hover{background:rgba(255,255,255,.16);color:#fff;transform:scale(1.08);}
          .sfab:active{transform:scale(.92);}

          @media(max-width:420px){
            .hero-wrap{height:56vh;}
            .hero-photo{width:70%;}
            .pname{font-size:54px;}
            .hero-id{padding:0 16px 24px;max-width:80%;}
            .content{padding:18px 14px 64px;}
            .lbtn{min-height:56px;border-radius:14px;}
            .soc-btn{width:42px;height:42px;font-size:16px;border-radius:11px;}
          }
        `}</style>
      </Head>

      {/* Share FAB */}
      <button className="sfab" onClick={()=>setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      <div className={loaded?"loaded":""}>

        {/* ── HERO ── */}
        {user.avatar ? (
          <div className="hero-wrap">
            {/* Blurred full-width background */}
            <div className="hero-blur">
              <img src={user.avatar} alt=""/>
            </div>
            {/* Sharp photo right side */}
            <div className="hero-photo">
              <img src={user.avatar} alt={user.name}/>
            </div>
            {/* Gradient blends left→right */}
            <div className="hero-blend"/>
            {/* Fade to black at bottom */}
            <div className="hero-bottom"/>
            {/* Identity over everything */}
            <div className="hero-id">
              <div className="pname a1">{user.name}</div>
              <div className="id-row a2">
                <span className="handle">@{user.username}</span>
                {userAge && <span className="age-pill">{userAge}</span>}
                {badge && (
                  <span className="badge-pill">
                    <i className="fas fa-certificate" style={{fontSize:9,color:"rgba(255,255,255,.5)"}}/>
                    {badge.replace(/_/g," ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-ph">
            <div className="av-ph">{user.name?.charAt(0)?.toUpperCase()||"?"}</div>
            <div style={{padding:"0 20px",textAlign:"left"}}>
              <div className="pname a1" style={{fontSize:"clamp(52px,14vw,78px)"}}>{user.name}</div>
              <div className="id-row a2">
                <span className="handle">@{user.username}</span>
                {userAge&&<span className="age-pill">{userAge}</span>}
                {badge&&<span className="badge-pill"><i className="fas fa-certificate" style={{fontSize:9,color:"rgba(255,255,255,.5)"}}/>{badge.replace(/_/g," ")}</span>}
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

          {/* Interest badges */}
          {interests.length > 0 && (
            <div className="int-block a3">
              <div className="int-tags">
                {interests.map((t,i)=>(
                  <span key={i} className="itag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Social icons */}
          {socials.length > 0 && (
            <div className="soc-row a4">
              {socials.map(([pl,val])=>{
                const m=PLAT[pl];
                return(
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
            <div className="links a5">
              {user.links.map((lnk,i)=>(
                <a key={lnk.id||i} href={lnk.url} target="_blank" rel="noopener noreferrer"
                  className="lbtn"
                  onClick={()=>track(user.username,"link_click")}>
                  <div className="lbtn-ic" style={{overflow:"hidden",padding:lnk.icon?.startsWith("data:")?"0":undefined}}>
                    {lnk.icon?.startsWith("data:")
                      ? <img src={lnk.icon} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} alt=""/>
                      : lnk.icon?.startsWith("fas ")||lnk.icon?.startsWith("fab ")
                        ? <i className={lnk.icon}/>
                        : <span style={{fontSize:20}}>{lnk.icon||"🔗"}</span>}
                  </div>
                  <div className="lbtn-t">{lnk.title}</div>
                  <div className="lbtn-a"><i className="fas fa-arrow-up-right-from-square"/></div>
                </a>
              ))}
            </div>
          )}

          {/* Spotify */}
          {user.favSongTrackId && (
            <div className="sp-block a6">
              <div className={`sp-trig${spOpen?" open":""}`}
                onClick={()=>{ setSpOpen(v=>!v); if(!spOpen) track(user.username,"spotify_play"); }}>
                <div className="sp-art"><i className="fab fa-spotify"/></div>
                <div className="sp-meta">
                  <div className="sp-eye"><span className="sp-dot"/>Currently Vibing To</div>
                  <div className="sp-title">{user.favSong||"My Favourite Song"}</div>
                  {user.favArtist&&<div className="sp-artist">{user.favArtist}</div>}
                </div>
                <i className={`fas fa-chevron-down sp-caret${spOpen?" open":""}`}/>
              </div>
              {spOpen&&(
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

          {/* Footer */}
          <div className="foot a7">
            <div className="foot-logo">
              <img src="/icon.png" alt="mywebsam" style={{width:15,height:15,borderRadius:3,verticalAlign:"middle",opacity:.35}}/>
              <a href="/"><strong>mywebsam</strong></a>
            </div>
            <div className="foot-sub">Your link in bio — <a href="/">Create yours free</a></div>
          </div>

        </div>
      </div>

      {shareOpen&&<ShareSheet url={pageUrl} name={user.name} onClose={()=>setShareOpen(false)}/>}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    const client    = await clientPromise;
    const db        = client.db(process.env.DB_NAME);
    const user      = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );
    const host      = req.headers.host || "mywebsammu.vercel.app";
    const proto     = host.startsWith("localhost") ? "http" : "https";
    const base      = `${proto}://${host}`;
    const pageUrl   = `${base}/${params.username.toLowerCase()}`;
    const avatarUrl = `${base}/api/avatar/${params.username.toLowerCase()}`;
    if (!user) return { props: { user:null, pageUrl, avatarUrl } };
    return {
      props: {
        pageUrl, avatarUrl,
        user: JSON.parse(JSON.stringify({
          username:       user.username       || "",
          name:           user.name           || "",
          dob:            user.dob            || null,
          bio:            user.bio            || "",
          aboutme:        user.aboutme        || "",
          avatar:         user.avatar         || "",
          socialProfiles: user.socialProfiles || {},
          links:          user.links          || [],
          interests:      user.interests      || {},
          favSong:        user.favSong        || "",
          favArtist:      user.favArtist      || "",
          favSongTrackId: user.favSongTrackId || "",
          analytics:      user.analytics      || {},
        }))
      }
    };
  } catch(e) {
    console.error("[username page]",e);
    const host  = req?.headers?.host||"mywebsammu.vercel.app";
    const proto = host.startsWith("localhost")?"http":"https";
    const base  = `${proto}://${host}`;
    return { props:{user:null,pageUrl:`${base}/${params.username}`,avatarUrl:`${base}/api/avatar/${params.username}`} };
  }
}
