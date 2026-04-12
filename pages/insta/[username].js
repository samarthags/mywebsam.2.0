// pages/insta/[username].js
// ─────────────────────────────────────────────────────────────────
// Visit  linkitin.site/insta/<instausername>
//
// Strategy (most-reliable-first):
//  1. Instagram oEmbed public API  → gets author_name (display name)
//  2. unavatar.io CDN              → serves Instagram profile pic client-side
//  3. Letter avatar fallback       → if avatar fails to load
//
// No profile creation needed. Just visit the URL.
// ─────────────────────────────────────────────────────────────────

import Head from "next/head";
import { useState, useEffect } from "react";

// ─── Loading Screen ───────────────────────────────────────────────
function LoadingScreen({ visible }) {
  return (
    <div style={{
      position:"fixed",inset:0,background:"#080808",zIndex:9999,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      gap:16,transition:"opacity 0.45s ease, visibility 0.45s ease",
      opacity:visible?1:0,visibility:visible?"visible":"hidden",
      pointerEvents:visible?"all":"none",
    }}>
      <style>{`
        @keyframes lsDots{0%,80%,100%{opacity:.15;transform:translateY(0) scale(1);}40%{opacity:1;transform:translateY(-6px) scale(1.15);}}
        .ls-dots{display:flex;align-items:center;gap:8px;}
        .ls-dots span{display:inline-block;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.55);animation:lsDots 1.3s ease-in-out infinite;}
        .ls-dots span:nth-child(2){animation-delay:.18s;}
        .ls-dots span:nth-child(3){animation-delay:.36s;}
      `}</style>
      <div className="ls-dots"><span/><span/><span/></div>
    </div>
  );
}

// ─── Share Sheet ──────────────────────────────────────────────────
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
    {l:"Copy Link",ic:"fas fa-copy",       bg:"#1a1a2a",fg:"#a78bfa",fn:doCopy},
    {l:"WhatsApp", ic:"fab fa-whatsapp",   bg:"#0d1f15",fg:"#25D366",fn:()=>window.open(`https://wa.me/?text=${enc("Check out "+name+" on Linkitin: "+url)}`)},
    {l:"Telegram", ic:"fab fa-telegram",   bg:"#0d1820",fg:"#26A5E4",fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc("Check out "+name+"!")}`)},
    {l:"Twitter",  ic:"fab fa-x-twitter",  bg:"#111",   fg:"#fff",   fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc("Check out "+name+"! "+url)}`)},
    {l:"Email",    ic:"fas fa-envelope",   bg:"#1f0d0d",fg:"#EA4335",fn:()=>window.open(`mailto:?subject=${enc(name+"'s Instagram")}&body=${enc(url)}`)},
  ];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,paddingBottom:44,animation:"ssUp .28s cubic-bezier(.34,1.4,.64,1) both"}}>
        <style>{`@keyframes ssUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
        <div style={{display:"flex",justifyContent:"center",padding:"14px 0 8px"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"#2a2a2a"}}/>
        </div>
        <div style={{padding:"8px 20px 14px",borderBottom:"1px solid #1e1e1e",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:"#fff"}}>Share</div>
            <div style={{fontSize:11,color:"#444",marginTop:2,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:"50%",background:"#1a1a1a",border:"1px solid #2a2a2a",fontSize:17,color:"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",WebkitTapHighlightColor:"transparent"}}>×</button>
        </div>
        <div style={{padding:"14px 10px 0",display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
          {opts.map(o=>(
            <button key={o.l} onClick={o.fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,width:72,padding:"10px 4px",border:"none",background:"transparent",cursor:"pointer",borderRadius:14,outline:"none",WebkitTapHighlightColor:"transparent"}}>
              <div style={{width:52,height:52,borderRadius:14,background:o.bg,color:o.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                {o.l==="Copy Link"&&copied?<i className="fas fa-check" style={{color:"#1DB954"}}/>:<i className={o.ic}/>}
              </div>
              <span style={{fontSize:10.5,fontWeight:600,color:"#555",textAlign:"center"}}>{o.l==="Copy Link"&&copied?"Copied!":o.l}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Avatar — loads via unavatar.io with letter fallback ──────────
function Avatar({ username, displayName, size = 110 }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{
      width:size+6,height:size+6,borderRadius:"50%",
      background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      padding:3,display:"flex",alignItems:"center",justifyContent:"center",
      boxShadow:"0 0 0 4px #0d0d0d",flexShrink:0,
    }}>
      <div style={{
        width:size,height:size,borderRadius:"50%",background:"#111",
        display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",
      }}>
        {!failed ? (
          <img
            src={`https://unavatar.io/instagram/${username}`}
            alt={`${displayName}'s Instagram photo`}
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",borderRadius:"50%"}}
            fetchpriority="high"
            onError={()=>setFailed(true)}
          />
        ) : (
          <span style={{fontSize:40,fontWeight:800,color:"#fff"}}>
            {(displayName||username).charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function InstaProfilePage({ displayName, username, pageUrl, notFound }) {
  const [loading,   setLoading]   = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(()=>{
    const t = setTimeout(()=>setLoading(false), 500);
    return ()=>clearTimeout(t);
  },[]);

  const instaLink = `https://instagram.com/${username}`;
  const ogImage   = `https://unavatar.io/instagram/${username}`;
  const ptitle    = `${displayName} (@${username}) · Instagram on Linkitin`;
  const pdesc     = `View ${displayName}'s Instagram profile — no login needed.`;

  return (
    <>
      <Head>
        <title>{ptitle}</title>
        <meta name="description"  content={pdesc}/>
        <meta name="viewport"     content="width=device-width,initial-scale=1,viewport-fit=cover"/>
        <meta name="theme-color"  content="#080808"/>
        <link rel="canonical"     href={pageUrl}/>
        <link rel="icon"          href="/icon.png" type="image/png"/>
        <meta property="og:type"        content="profile"/>
        <meta property="og:title"       content={ptitle}/>
        <meta property="og:description" content={pdesc}/>
        <meta property="og:url"         content={pageUrl}/>
        <meta property="og:site_name"   content="Linkitin"/>
        <meta property="og:image"       content={ogImage}/>
        <meta name="twitter:card"       content="summary"/>
        <meta name="twitter:title"      content={ptitle}/>
        <meta name="twitter:image"      content={ogImage}/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com"/>
        <link rel="preconnect" href="https://unavatar.io"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>

        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{background:#0d0d0d;color:#fff;font-family:'Sora',sans-serif;min-height:100vh;overflow-x:hidden;}

          @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
          @keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
          @keyframes igGlow{0%,100%{opacity:.8;}50%{opacity:.35;}}

          .s1{animation:slideUp .6s .04s cubic-bezier(.16,1,.3,1) both;}
          .s2{animation:slideUp .6s .14s cubic-bezier(.16,1,.3,1) both;}
          .s3{animation:slideUp .6s .24s cubic-bezier(.16,1,.3,1) both;}
          .s4{animation:slideUp .6s .34s cubic-bezier(.16,1,.3,1) both;}
          .s5{animation:slideUp .6s .44s cubic-bezier(.16,1,.3,1) both;}

          /* ── Hero ── */
          .hero-banner{
            position:relative;width:100%;height:190px;overflow:hidden;
            animation:fadeIn .7s ease both;
            background:linear-gradient(135deg,#2d0a18 0%,#1a0510 35%,#0d0d0d 100%);
          }
          .hero-grid{
            position:absolute;inset:0;
            background-image:
              linear-gradient(rgba(220,39,67,.07) 1px,transparent 1px),
              linear-gradient(90deg,rgba(220,39,67,.07) 1px,transparent 1px);
            background-size:32px 32px;
            mask-image:linear-gradient(to bottom,transparent,rgba(0,0,0,.5) 40%,rgba(0,0,0,0));
          }
          .hero-glow{
            position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);
            width:280px;height:200px;border-radius:50%;
            background:radial-gradient(ellipse at center,rgba(220,39,67,.20) 0%,transparent 70%);
            animation:igGlow 3s ease-in-out infinite;
          }
          .hero-wordmark{
            position:absolute;top:18px;left:50%;transform:translateX(-50%);
            display:flex;align-items:center;gap:8px;opacity:.16;
          }
          .hero-wordmark i{font-size:18px;}
          .hero-wordmark span{font-size:14px;font-weight:700;letter-spacing:.06em;}
          .hero-fade{
            position:absolute;inset:0;
            background:linear-gradient(to bottom,transparent 0%,#0d0d0d 100%);
          }

          /* ── Page ── */
          .page{max-width:480px;margin:0 auto;padding:0 0 60px;}

          /* ── Identity ── */
          .identity{
            display:flex;flex-direction:column;align-items:center;
            padding:0 20px;margin-top:-58px;position:relative;z-index:2;
          }
          .display-name{
            margin-top:14px;
            font-size:clamp(26px,7vw,42px);font-weight:800;
            color:#fff;letter-spacing:-.025em;line-height:1.05;text-align:center;
          }
          .handle{font-size:14px;font-weight:600;color:rgba(255,255,255,.35);margin-top:5px;}
          .ig-pill{
            display:inline-flex;align-items:center;gap:6px;margin-top:10px;
            padding:5px 14px;border-radius:999px;
            background:linear-gradient(135deg,rgba(240,148,51,.10),rgba(220,39,67,.10),rgba(188,24,136,.10));
            border:1px solid rgba(220,39,67,.16);
            font-size:11.5px;font-weight:700;color:rgba(255,255,255,.38);letter-spacing:.04em;
          }
          .ig-pill i{
            background:linear-gradient(135deg,#f09433,#dc2743,#bc1888);
            -webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:13px;
          }

          /* ── Info card ── */
          .info-card{
            margin:20px 16px 0;background:#111;border:1px solid #1e1e1e;border-radius:20px;overflow:hidden;
          }
          .info-row{
            display:flex;align-items:center;gap:14px;
            padding:15px 18px;border-bottom:1px solid #181818;
          }
          .info-row:last-child{border-bottom:none;}
          .info-icon{
            width:36px;height:36px;border-radius:10px;
            background:#181818;border:1px solid #222;
            display:flex;align-items:center;justify-content:center;
            font-size:14px;color:rgba(255,255,255,.28);flex-shrink:0;
          }
          .info-label{font-size:10.5px;font-weight:700;color:rgba(255,255,255,.2);letter-spacing:.07em;text-transform:uppercase;margin-bottom:2px;}
          .info-value{font-size:14px;font-weight:600;color:rgba(255,255,255,.65);}

          /* ── CTA Buttons ── */
          .cta-row{display:flex;gap:10px;margin:16px 16px 0;}
          .cta-primary{
            flex:1;display:flex;align-items:center;justify-content:center;gap:9px;
            padding:15px;border-radius:15px;border:none;cursor:pointer;
            font-family:'Sora',sans-serif;font-size:14.5px;font-weight:700;
            background:linear-gradient(135deg,#e6683c 0%,#dc2743 45%,#cc2366 100%);
            color:#fff;box-shadow:0 4px 22px rgba(220,39,67,.28);
            transition:transform .15s,box-shadow .15s;text-decoration:none;
          }
          .cta-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(220,39,67,.40);}
          .cta-primary:active{transform:scale(.96);}
          .cta-share{
            width:52px;height:52px;border-radius:15px;border:1px solid #1e1e1e;background:#111;
            cursor:pointer;color:rgba(255,255,255,.5);font-size:17px;
            display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;
          }
          .cta-share:hover{background:#1a1a1a;border-color:#2a2a2a;color:#fff;}
          .cta-share:active{transform:scale(.93);}

          /* ── Divider ── */
          .divider{display:flex;align-items:center;gap:12px;margin:22px 16px 0;}
          .divider-line{flex:1;height:1px;background:#1a1a1a;}
          .divider-txt{font-size:10.5px;font-weight:700;color:rgba(255,255,255,.16);letter-spacing:.07em;white-space:nowrap;}

          /* ── Promo box ── */
          .promo-box{
            margin:12px 16px 0;padding:22px 20px;
            background:#111;border:1px solid #1e1e1e;border-radius:20px;
            display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;
          }
          .promo-title{font-size:15.5px;font-weight:800;color:#fff;}
          .promo-sub{font-size:12.5px;color:rgba(255,255,255,.3);line-height:1.65;}
          .promo-btn{
            display:inline-flex;align-items:center;gap:8px;
            padding:13px 26px;border-radius:999px;
            background:#fff;color:#000;font-family:'Sora',sans-serif;
            font-size:13.5px;font-weight:800;cursor:pointer;text-decoration:none;
            box-shadow:0 4px 18px rgba(255,255,255,.07);
            transition:transform .15s,box-shadow .15s;
          }
          .promo-btn:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(255,255,255,.13);}
          .promo-btn:active{transform:scale(.96);}

          /* ── Footer ── */
          .foot{text-align:center;padding:22px 0 4px;font-size:12px;color:#252525;font-weight:600;}

          /* ── Share FAB ── */
          .sfab{position:fixed;top:16px;right:16px;width:46px;height:46px;border-radius:13px;background:#111;border:1px solid #1e1e1e;display:flex;align-items:center;justify-content:center;font-size:17px;color:rgba(255,255,255,.6);cursor:pointer;z-index:80;transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .13s,box-shadow .13s;}
          .sfab:hover{transform:translateY(-3px) scale(1.07);background:#181818;border-color:#2c2c2c;color:#fff;box-shadow:0 8px 22px rgba(0,0,0,.5);}
          .sfab:active{transform:scale(.93);}

          /* ── Not found ── */
          .nf-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;}
          .nf-icon{font-size:52px;margin-bottom:20px;color:#2a2a2a;}
          .nf-title{font-size:22px;font-weight:800;margin-bottom:10px;}
          .nf-sub{font-size:14px;color:#444;margin-bottom:28px;line-height:1.65;}
          .nf-btn{background:#fff;color:#000;padding:13px 28px;border-radius:999px;font-family:'Sora',sans-serif;font-weight:800;font-size:14px;display:inline-flex;align-items:center;gap:8px;}

          @media(max-width:420px){.display-name{font-size:26px;}}
        `}</style>
      </Head>

      <LoadingScreen visible={loading}/>

      <button className="sfab" onClick={()=>setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      {notFound ? (
        <div className="nf-wrap">
          <div className="nf-icon"><i className="fab fa-instagram"/></div>
          <h1 className="nf-title">Profile Not Found</h1>
          <p className="nf-sub">
            We couldn&apos;t find <strong style={{color:"rgba(255,255,255,.6)"}}>@{username}</strong> on Instagram.<br/>
            Double-check the username and try again.
          </p>
          <a href={instaLink} target="_blank" rel="noopener noreferrer" className="nf-btn">
            <i className="fab fa-instagram"/> Search on Instagram
          </a>
          <div style={{marginTop:40,fontSize:12,color:"#222",fontWeight:500}}>
            Developed by <strong style={{color:"#3a3a3a"}}>Samartha Gs</strong>
          </div>
        </div>
      ) : (
        <div className="page">

          {/* ── Hero ── */}
          <div className="hero-banner">
            <div className="hero-grid"/>
            <div className="hero-glow"/>
            <div className="hero-wordmark">
              <i className="fab fa-instagram"/>
              <span>INSTAGRAM</span>
            </div>
            <div className="hero-fade"/>
          </div>

          {/* ── Identity ── */}
          <div className="identity s1">
            <Avatar username={username} displayName={displayName} size={110}/>
            <h1 className="display-name">{displayName}</h1>
            <p className="handle">@{username}</p>
            <div className="ig-pill">
              <i className="fab fa-instagram"/>
              Instagram Profile
            </div>
          </div>

          {/* ── Info card ── */}
          <div className="info-card s2">
            <div className="info-row">
              <div className="info-icon"><i className="fab fa-instagram"/></div>
              <div>
                <div className="info-label">Username</div>
                <div className="info-value">@{username}</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><i className="fas fa-user"/></div>
              <div>
                <div className="info-label">Display Name</div>
                <div className="info-value">{displayName}</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon"><i className="fas fa-globe"/></div>
              <div>
                <div className="info-label">Profile URL</div>
                <div className="info-value" style={{fontSize:13,color:"rgba(255,255,255,.38)"}}>
                  instagram.com/{username}
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="cta-row s3">
            <a href={instaLink} target="_blank" rel="noopener noreferrer" className="cta-primary">
              <i className="fab fa-instagram" style={{fontSize:19}}/>
              Open on Instagram
            </a>
            <button className="cta-share" onClick={()=>setShareOpen(true)} aria-label="Share">
              <i className="fas fa-share-nodes"/>
            </button>
          </div>

          {/* ── Divider ── */}
          <div className="divider s4">
            <div className="divider-line"/>
            <span className="divider-txt">WANT YOUR OWN PAGE?</span>
            <div className="divider-line"/>
          </div>

          {/* ── Promo ── */}
          <div className="promo-box s4">
            <div style={{fontSize:26}}>⚡</div>
            <p className="promo-title">Create your own link-in-bio</p>
            <p className="promo-sub">
              Add all your socials, links, Spotify and more.<br/>
              Get <strong style={{color:"rgba(255,255,255,.5)"}}>linkitin.site/yourname</strong> — free, no app needed.
            </p>
            <a href="/" className="promo-btn">
              <i className="fas fa-plus"/> Create Your Profile
            </a>
          </div>

          <div className="foot s5">
            Powered by <strong style={{color:"#3a3a3a"}}>Linkitin</strong> · Developed by <strong style={{color:"#3a3a3a"}}>Samartha Gs</strong>
          </div>
        </div>
      )}

      {shareOpen && (
        <ShareSheet url={pageUrl} name={displayName} onClose={()=>setShareOpen(false)}/>
      )}
    </>
  );
}

// ─── SSR ──────────────────────────────────────────────────────────
export async function getServerSideProps({ params, req }) {
  const username = (params.username || "").toLowerCase().replace(/^@/, "").trim();
  const host     = req.headers.host || "linkitin.site";
  const proto    = host.startsWith("localhost") ? "http" : "https";
  const base     = `${proto}://${host}`;
  const pageUrl  = `${base}/insta/${username}`;

  if (!username) {
    return { props: { displayName:"", username:"", pageUrl, notFound:true } };
  }

  // ── Pretty-format username as fallback display name ──────────────
  // e.g. "samartha_gs" → "Samartha Gs"
  const prettyName = username
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();

  let displayName = prettyName; // default — always works

  try {
    // ── Instagram public oEmbed (no token needed for profile URLs) ──
    // This is the same endpoint Instagram uses for link previews.
    // It returns author_name reliably for public accounts.
    const res = await fetch(
      `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent("https://www.instagram.com/" + username + "/")}&maxwidth=320`,
      {
        headers: {
          "User-Agent": "facebookexternalhit/1.1",
          "Accept":     "application/json",
        },
        signal: AbortSignal.timeout(4000),
      }
    );
    if (res.ok) {
      const json = await res.json();
      if (json?.author_name) displayName = json.author_name;
    }
  } catch (_) {
    // oEmbed failed — prettyName fallback is already set above
  }

  return {
    props: { displayName, username, pageUrl, notFound: false },
  };
}