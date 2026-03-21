// pages/[username].js
import Head from "next/head";
import { useState } from "react";
import clientPromise from "../lib/mongodb";

/* ─── Platform config ─── */
const P = {
  email:        { i:"fas fa-envelope",      c:"#EA4335", u:(v)=>`mailto:${v}`,                                    n:"Email" },
  whatsapp:     { i:"fab fa-whatsapp",       c:"#25D366", u:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,          n:"WhatsApp" },
  instagram:    { i:"fab fa-instagram",      c:"#E4405F", u:(v)=>`https://instagram.com/${v.replace("@","")}`,    n:"Instagram" },
  facebook:     { i:"fab fa-facebook-f",     c:"#1877F2", u:(v)=>`https://facebook.com/${v}`,                     n:"Facebook" },
  github:       { i:"fab fa-github",         c:"#fff",    u:(v)=>`https://github.com/${v}`,                       n:"GitHub" },
  snapchat:     { i:"fab fa-snapchat",       c:"#FFE700", u:(v)=>`https://snapchat.com/add/${v}`,                 n:"Snapchat" },
  youtube:      { i:"fab fa-youtube",        c:"#FF0000", u:(v)=>`https://youtube.com/${v}`,                      n:"YouTube" },
  twitter:      { i:"fab fa-x-twitter",      c:"#fff",    u:(v)=>`https://twitter.com/${v.replace("@","")}`,      n:"Twitter" },
  linkedin:     { i:"fab fa-linkedin-in",    c:"#0A66C2", u:(v)=>`https://linkedin.com/in/${v}`,                  n:"LinkedIn" },
  tiktok:       { i:"fab fa-tiktok",         c:"#fff",    u:(v)=>`https://tiktok.com/@${v.replace("@","")}`,      n:"TikTok" },
  discord:      { i:"fab fa-discord",        c:"#5865F2", u:(v)=>`https://discord.com/users/${v}`,                n:"Discord" },
  telegram:     { i:"fab fa-telegram",       c:"#26A5E4", u:(v)=>`https://t.me/${v.replace("@","")}`,             n:"Telegram" },
  twitch:       { i:"fab fa-twitch",         c:"#9146FF", u:(v)=>`https://twitch.tv/${v}`,                        n:"Twitch" },
  spotify:      { i:"fab fa-spotify",        c:"#1DB954", u:(v)=>`https://open.spotify.com/user/${v}`,            n:"Spotify" },
  pinterest:    { i:"fab fa-pinterest",      c:"#E60023", u:(v)=>`https://pinterest.com/${v}`,                    n:"Pinterest" },
  reddit:       { i:"fab fa-reddit-alien",   c:"#FF4500", u:(v)=>`https://reddit.com/user/${v}`,                  n:"Reddit" },
  medium:       { i:"fab fa-medium",         c:"#fff",    u:(v)=>`https://medium.com/${v.replace("@","")}`,       n:"Medium" },
  devto:        { i:"fab fa-dev",            c:"#fff",    u:(v)=>`https://dev.to/${v}`,                           n:"DEV.to" },
  behance:      { i:"fab fa-behance",        c:"#1769FF", u:(v)=>`https://behance.net/${v}`,                      n:"Behance" },
  dribbble:     { i:"fab fa-dribbble",       c:"#ea4c89", u:(v)=>`https://dribbble.com/${v}`,                     n:"Dribbble" },
  threads:      { i:"fab fa-threads",        c:"#fff",    u:(v)=>`https://threads.net/${v.replace("@","")}`,      n:"Threads" },
  bluesky:      { i:"fas fa-cloud",          c:"#1185FE", u:(v)=>`https://bsky.app/profile/${v.replace("@","")}`, n:"Bluesky" },
  npm:          { i:"fab fa-npm",            c:"#CC3534", u:(v)=>`https://npmjs.com/~${v.replace("~","")}`,       n:"npm" },
  codepen:      { i:"fab fa-codepen",        c:"#fff",    u:(v)=>`https://codepen.io/${v}`,                       n:"CodePen" },
  stackoverflow:{ i:"fab fa-stack-overflow", c:"#F58025", u:(v)=>`https://stackoverflow.com/users/${v}`,          n:"Stack Overflow" },
};

function calcAge(dob) {
  if (!dob) return null;
  const t = new Date(), b = new Date(dob);
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a > 0 ? a : null;
}

/* ─── Share sheet ─── */
function ShareSheet({ url, name, onClose }) {
  const enc = encodeURIComponent;
  const msg = enc(`Check out ${name}'s profile! ${url}`);
  const options = [
    { label:"Copy Link",   icon:"fas fa-link",        bg:"#f0edff", fg:"#6C63FF", fn: async ()=>{ try{ await navigator.clipboard.writeText(url); }catch(_){ const e=document.createElement("textarea");e.value=url;document.body.appendChild(e);e.select();document.execCommand("copy");document.body.removeChild(e); } onClose("Copied!"); }},
    { label:"WhatsApp",    icon:"fab fa-whatsapp",    bg:"#edfaf3", fg:"#25D366", fn:()=>{ window.open(`https://wa.me/?text=${msg}`,"_blank"); onClose(); }},
    { label:"Telegram",    icon:"fab fa-telegram",    bg:"#edf7fd", fg:"#26A5E4", fn:()=>{ window.open(`https://t.me/share/url?url=${enc(url)}`,"_blank"); onClose(); }},
    { label:"Twitter",     icon:"fab fa-x-twitter",   bg:"#f5f5f5", fg:"#111",    fn:()=>{ window.open(`https://twitter.com/intent/tweet?text=${msg}`,"_blank"); onClose(); }},
    { label:"Instagram",   icon:"fab fa-instagram",   bg:"#fdf2f4", fg:"#E4405F", fn: async ()=>{ try{ await navigator.clipboard.writeText(url); }catch(_){} alert("Link copied! Paste it in your Instagram bio or story."); onClose(); }},
    { label:"Facebook",    icon:"fab fa-facebook-f",  bg:"#eef4ff", fg:"#1877F2", fn:()=>{ window.open(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,"_blank"); onClose(); }},
    { label:"LinkedIn",    icon:"fab fa-linkedin-in", bg:"#e8f3fc", fg:"#0A66C2", fn:()=>{ window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,"_blank"); onClose(); }},
    { label:"Reddit",      icon:"fab fa-reddit-alien",bg:"#fff2ed", fg:"#FF4500", fn:()=>{ window.open(`https://reddit.com/submit?url=${enc(url)}`,"_blank"); onClose(); }},
    { label:"Email",       icon:"fas fa-envelope",    bg:"#fef2f2", fg:"#EA4335", fn:()=>{ window.open(`mailto:?subject=${enc(name)}&body=${enc(url)}`); onClose(); }},
    { label:"SMS",         icon:"fas fa-comment-sms", bg:"#f0fdf4", fg:"#10b981", fn:()=>{ window.open(`sms:?body=${enc(`${name}'s profile: ${url}`)}`); onClose(); }},
  ];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",width:"100%",maxWidth:520,
                animation:"sheetUp .22s cubic-bezier(.22,.68,0,1.2) both"}}>
        <style>{`@keyframes sheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}`}</style>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div>
            <div style={{fontWeight:800,fontSize:17,color:"#111827"}}>Share Profile</div>
            <div style={{fontSize:12,color:"#9ca3af",marginTop:2,maxWidth:280,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose} style={{background:"#f5f5f5",border:"none",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:18,color:"#6b7280",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {options.map(o=>(
            <div key={o.label} onClick={o.fn}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",width:64,padding:"6px 4px",borderRadius:12,transition:"background .12s",WebkitTapHighlightColor:"transparent"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f9f9f9"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:50,height:50,borderRadius:13,background:o.bg,color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21}}>
                <i className={o.icon}/>
              </div>
              <span style={{fontSize:10,fontWeight:600,color:"#374151",textAlign:"center",lineHeight:1.2}}>{o.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main profile page ─── */
export default function ProfilePage({ user, pageUrl }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [toast,     setToast]     = useState("");

  function openShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: user?.name, url: pageUrl }).catch(()=>setShareOpen(true));
    } else {
      setShareOpen(true);
    }
  }
  function closeShare(msg) {
    setShareOpen(false);
    if (msg) { setToast(msg); setTimeout(()=>setToast(""), 2200); }
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Not found — mywebsam</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
          <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f5f9;color:#111;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#fef2f2",border:"2px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash"/>
          </div>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:8}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,fontSize:15,lineHeight:1.6}}>This username does not exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"13px 28px",borderRadius:999,fontWeight:700,fontSize:15,display:"inline-flex",alignItems:"center",gap:9,boxShadow:"0 4px 18px rgba(108,99,255,.3)",textDecoration:"none",outline:"none",WebkitTapHighlightColor:"transparent"}}>
            <i className="fas fa-plus"/> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const age          = calcAge(user.dob);
  const socials      = Object.entries(user.socialProfiles||{}).filter(([,v])=>v?.trim()).filter(([k])=>P[k]);
  const interestTags = Object.values(user.interests||{}).flat().filter(v=>v&&typeof v==="string").slice(0,16);

  return (
    <>
      <Head>
        <title>{user.name} (@{user.username})</title>
        <meta name="description"        content={user.aboutme||user.bio||`${user.name} on mywebsam`}/>
        <meta property="og:title"       content={`${user.name} — mywebsam`}/>
        <meta property="og:description" content={user.aboutme||user.bio||""}/>
        {user.avatar && <meta property="og:image" content={user.avatar}/>}
        <meta name="viewport"           content="width=device-width,initial-scale=1"/>
        <meta name="twitter:card"       content="summary_large_image"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet"/>
        <style>{`
          /* ── Reset & base ── */
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;font-family:'Plus Jakarta Sans',sans-serif;}
          a,button{outline:none;-webkit-tap-highlight-color:transparent;}
          a{text-decoration:none;color:inherit;}
          button{cursor:pointer;font-family:inherit;}

          /* ── Full-page solid blue ── */
          body{
            background:#1246d6;
            color:#fff;
            min-height:100vh;
          }

          /* ── Top bar ── */
          .topbar{
            position:fixed;top:0;left:0;right:0;
            height:54px;
            display:flex;align-items:center;justify-content:flex-end;
            padding:0 16px;
            z-index:100;
            background:linear-gradient(to bottom,rgba(18,70,214,0.95) 60%,transparent);
          }
          .share-btn{
            width:40px;height:40px;border-radius:50%;
            background:rgba(255,255,255,0.18);
            border:1.5px solid rgba(255,255,255,0.32);
            color:#fff;font-size:15px;
            display:flex;align-items:center;justify-content:center;
            transition:background .15s,transform .12s;
          }
          .share-btn:hover{background:rgba(255,255,255,0.28);transform:scale(1.08);}
          .share-btn:active{transform:scale(0.94);}

          /* ── Hero photo — top portion fills naturally ── */
          .hero{
            width:100%;
            min-height:44vw;
            max-height:62vh;
            position:relative;
            overflow:hidden;
            flex-shrink:0;
          }
          .hero img{
            width:100%;
            height:100%;
            min-height:280px;
            object-fit:cover;
            object-position:center 20%;
            display:block;
          }
          /* smooth gradient from photo into blue bg */
          .hero::after{
            content:"";
            position:absolute;
            bottom:0;left:0;right:0;
            height:55%;
            background:linear-gradient(to bottom,transparent 0%,#1246d6 100%);
            pointer-events:none;
          }
          /* no avatar placeholder */
          .hero-ph{
            height:80px;
          }

          /* ── Page content ── */
          .page{
            max-width:460px;
            margin:0 auto;
            padding:0 20px 80px;
          }

          /* ── Identity ── */
          .id-wrap{
            text-align:center;
            margin-bottom:18px;
            animation:fadeUp .38s .05s cubic-bezier(.22,.68,0,1.2) both;
          }
          .pname{
            font-size:clamp(26px,7vw,36px);
            font-weight:800;
            font-style:italic;
            color:#fff;
            letter-spacing:-0.02em;
            line-height:1.1;
            margin-bottom:5px;
            text-shadow:0 3px 16px rgba(0,0,30,.35);
          }
          .phandle{
            font-size:13px;
            color:rgba(255,255,255,0.55);
            font-weight:500;
            margin-bottom:11px;
          }
          .meta-row{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:7px;
            margin-bottom:12px;
          }
          .mc{
            display:inline-flex;align-items:center;gap:5px;
            font-size:12px;color:rgba(255,255,255,0.72);
            background:rgba(255,255,255,0.13);
            border:1px solid rgba(255,255,255,0.18);
            padding:4px 12px;border-radius:999px;
          }
          .pbio{
            font-size:14px;color:rgba(255,255,255,0.78);
            line-height:1.75;
            max-width:340px;margin:0 auto;
          }

          /* ── Social icons — white outline circles ── */
          .soc-row{
            display:flex;justify-content:center;
            flex-wrap:wrap;gap:10px;
            margin-bottom:26px;
            animation:fadeUp .4s .1s cubic-bezier(.22,.68,0,1.2) both;
          }
          .soc-ic{
            width:44px;height:44px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            background:rgba(255,255,255,0.13);
            border:1.5px solid rgba(255,255,255,0.35);
            color:#fff;
            transition:transform .14s,background .14s,box-shadow .14s;
          }
          .soc-ic:hover{
            transform:scale(1.14);
            background:rgba(255,255,255,0.24);
            box-shadow:0 6px 20px rgba(0,0,0,0.2);
          }
          .soc-ic:active{transform:scale(0.94);}

          /* ── Links — solid WHITE pill buttons (Linktree style) ── */
          .links-col{
            display:flex;flex-direction:column;
            gap:12px;margin-bottom:26px;
            animation:fadeUp .42s .15s cubic-bezier(.22,.68,0,1.2) both;
          }
          .lbtn{
            display:block;
            width:100%;
            padding:17px 20px;
            background:#fff;
            border-radius:999px;
            color:#111827;
            font-weight:700;
            font-size:15px;
            text-align:center;
            border:none;
            transition:transform .15s,box-shadow .15s,background .15s;
            position:relative;
            letter-spacing:-0.01em;
          }
          .lbtn:hover{
            transform:scale(1.025);
            box-shadow:0 8px 28px rgba(0,0,50,.22);
            background:#f7f7f7;
          }
          .lbtn:active{transform:scale(0.97);}

          /* ── Spotify embed ── */
          .sp-block{
            margin-bottom:26px;
            animation:fadeUp .44s .2s cubic-bezier(.22,.68,0,1.2) both;
          }
          .sp-lbl{
            text-align:center;font-size:11px;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            color:rgba(255,255,255,0.45);
            margin-bottom:12px;
            display:flex;align-items:center;justify-content:center;gap:6px;
          }
          .sp-inner{border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.3);}

          /* ── Interests ── */
          .int-block{
            margin-bottom:26px;
            animation:fadeUp .46s .25s cubic-bezier(.22,.68,0,1.2) both;
          }
          .int-lbl{
            text-align:center;font-size:11px;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            color:rgba(255,255,255,0.45);
            margin-bottom:12px;
            display:flex;align-items:center;justify-content:center;gap:6px;
          }
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;}
          .itag{
            padding:6px 14px;border-radius:999px;
            font-size:12px;font-weight:600;
            color:rgba(255,255,255,0.82);
            background:rgba(255,255,255,0.12);
            border:1px solid rgba(255,255,255,0.2);
            transition:background .14s;
          }
          .itag:hover{background:rgba(255,255,255,0.2);}

          /* ── Footer ── */
          .foot{
            text-align:center;
            font-size:12px;color:rgba(255,255,255,0.3);
            padding:6px 0;
            animation:fadeUp .48s .3s cubic-bezier(.22,.68,0,1.2) both;
          }
          .foot a{color:rgba(255,255,255,0.52);font-weight:700;}
          .foot a:hover{color:#fff;}
          .foot-logo{display:inline-flex;align-items:center;gap:5px;margin-bottom:4px;}

          /* ── Toast ── */
          .toast{
            position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
            background:#111827;color:#fff;
            padding:10px 22px;border-radius:999px;
            font-size:13px;font-weight:600;
            box-shadow:0 4px 20px rgba(0,0,0,.25);
            z-index:9999;
            animation:toastIn .2s ease;
            pointer-events:none;
          }

          /* ── Keyframes ── */
          @keyframes fadeUp{
            from{opacity:0;transform:translateY(20px);}
            to{opacity:1;transform:translateY(0);}
          }
          @keyframes toastIn{
            from{opacity:0;transform:translateX(-50%) translateY(8px);}
            to{opacity:1;transform:translateX(-50%) translateY(0);}
          }

          /* ── Responsive ── */
          @media(max-width:440px){
            .pname{font-size:26px;}
            .lbtn{font-size:14px;padding:15px 18px;}
            .soc-ic{width:40px;height:40px;font-size:16px;}
            .page{padding:0 14px 70px;}
          }
        `}</style>
      </Head>

      {/* ── Fixed top bar with share button ── */}
      <div className="topbar">
        <button className="share-btn" onClick={openShare} aria-label="Share profile">
          <i className="fas fa-arrow-up-from-bracket"/>
        </button>
      </div>

      {/* ── Hero photo fills top ── */}
      {user.avatar ? (
        <div className="hero">
          <img src={user.avatar} alt={user.name}/>
        </div>
      ) : (
        <div className="hero-ph"/>
      )}

      {/* ── All content ── */}
      <div className="page">

        {/* Name, handle, bio */}
        <div className="id-wrap">
          <div className="pname">{user.name}</div>
          <div className="phandle">@{user.username}</div>

          {(user.location || age) && (
            <div className="meta-row">
              {user.location && (
                <span className="mc">
                  <i className="fas fa-location-dot" style={{fontSize:10}}/>
                  {user.location}
                </span>
              )}
              {age && (
                <span className="mc">
                  <i className="fas fa-cake-candles" style={{fontSize:10}}/>
                  {age} years old
                </span>
              )}
            </div>
          )}

          {(user.aboutme||user.bio) && (
            <p className="pbio">{user.aboutme||user.bio}</p>
          )}
        </div>

        {/* Social icon circles */}
        {socials.length > 0 && (
          <div className="soc-row">
            {socials.map(([platform, value]) => {
              const pl = P[platform];
              return (
                <a key={platform}
                  href={pl.u(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soc-ic"
                  title={pl.n}
                  style={{color: pl.c}}>
                  <i className={pl.i}/>
                </a>
              );
            })}
          </div>
        )}

        {/* Link pill buttons — solid white */}
        {(user.links||[]).length > 0 && (
          <div className="links-col">
            {user.links.map((link, i) => (
              <a key={link.id||i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lbtn">
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Spotify embed */}
        {user.favSongTrackId && (
          <div className="sp-block">
            <div className="sp-lbl">
              <i className="fab fa-spotify" style={{color:"#1DB954",fontSize:14}}/>
              Currently Vibing To
            </div>
            <div className="sp-inner">
              <iframe
                src={`https://open.spotify.com/embed/track/${user.favSongTrackId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{display:"block"}}
              />
            </div>
          </div>
        )}

        {/* Interests */}
        {interestTags.length > 0 && (
          <div className="int-block">
            <div className="int-lbl">
              <i className="fas fa-heart" style={{color:"#f87171",fontSize:12}}/>
              Interests
            </div>
            <div className="int-tags">
              {interestTags.map((tag, i) => (
                <span key={i} className="itag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="foot">
          <div className="foot-logo">
            <img src="/icon.png" alt="mywebsam" style={{width:18,height:18,borderRadius:4,verticalAlign:"middle"}}/>
            <a href="/"><strong>mywebsam</strong></a>
          </div>
          <div>Your link in bio — <a href="/">Create yours free</a></div>
        </div>
      </div>

      {/* Share sheet */}
      {shareOpen && (
        <ShareSheet
          url={pageUrl}
          name={user.name}
          onClose={closeShare}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );

    const host    = req.headers.host || "mywebsammu.vercel.app";
    const proto   = host.startsWith("localhost") ? "http" : "https";
    const pageUrl = `${proto}://${host}/${params.username.toLowerCase()}`;

    if (!user) return { props: { user: null, pageUrl } };

    return {
      props: {
        pageUrl,
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
  } catch (err) {
    console.error("[username page]", err);
    const host    = req?.headers?.host || "mywebsammu.vercel.app";
    const proto   = host.startsWith("localhost") ? "http" : "https";
    return { props: { user: null, pageUrl: `${proto}://${host}/${params.username}` } };
  }
}
