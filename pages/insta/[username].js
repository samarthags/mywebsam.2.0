// pages/insta/[username].js
// ─────────────────────────────────────────────────────────────────
// Visit  linkitin.site/insta/<instausername>
// Pulls the public Instagram profile picture + display name via
// the unofficial scrape endpoint (no API key needed), then renders
// it with the same dark Linkitin theme — zero sign-up required.
// ─────────────────────────────────────────────────────────────────

import Head from "next/head";
import { useState, useEffect } from "react";

// ─── Loading Screen (identical to main profile) ───────────────────
function LoadingScreen({ visible }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"#080808", zIndex:9999,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      gap:16, transition:"opacity 0.45s ease, visibility 0.45s ease",
      opacity:visible?1:0, visibility:visible?"visible":"hidden",
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

// ─── Gradient ring component ───────────────────────────────────────
function InstaRing({ size = 110, children }) {
  return (
    <div style={{
      width: size + 6, height: size + 6,
      borderRadius: "50%",
      background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      padding: 3,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "#0d0d0d",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {children}
      </div>
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
      const el = document.createElement("textarea"); el.value = url;
      el.style.cssText = "position:fixed;opacity:0;"; document.body.appendChild(el);
      el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  }
  const opts = [
    { l:"Copy Link", ic:"fas fa-copy",        bg:"#1a1a2a", fg:"#a78bfa", fn:doCopy },
    { l:"WhatsApp",  ic:"fab fa-whatsapp",     bg:"#0d1f15", fg:"#25D366", fn:()=>window.open(`https://wa.me/?text=${enc("Check out "+name+" on Instagram via Linkitin: "+url)}`) },
    { l:"Telegram",  ic:"fab fa-telegram",     bg:"#0d1820", fg:"#26A5E4", fn:()=>window.open(`https://t.me/share/url?url=${enc(url)}&text=${enc("Check out "+name+"'s Insta!")}`) },
    { l:"Twitter",   ic:"fab fa-x-twitter",    bg:"#111",    fg:"#fff",    fn:()=>window.open(`https://twitter.com/intent/tweet?text=${enc("Check out "+name+" on Instagram! "+url)}`) },
    { l:"Email",     ic:"fas fa-envelope",     bg:"#1f0d0d", fg:"#EA4335", fn:()=>window.open(`mailto:?subject=${enc(name+"'s Instagram")}&body=${enc(url)}`) },
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

// ─── Main Page ────────────────────────────────────────────────────
export default function InstaProfilePage({ instaUser, username, pageUrl, error }) {
  const [loading,    setLoading]    = useState(true);
  const [shareOpen,  setShareOpen]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const displayName  = instaUser?.full_name  || `@${username}`;
  const bio          = instaUser?.biography  || "";
  const avatarUrl    = instaUser?.profile_pic_url_hd || instaUser?.profile_pic_url || "";
  const followers    = instaUser?.edge_followed_by?.count ?? null;
  const following    = instaUser?.edge_follow?.count      ?? null;
  const posts        = instaUser?.edge_owner_to_timeline_media?.count ?? null;
  const isVerified   = instaUser?.is_verified ?? false;
  const isPrivate    = instaUser?.is_private  ?? false;
  const externalUrl  = instaUser?.external_url || "";
  const category     = instaUser?.category_name || "";

  const instaLink    = `https://instagram.com/${username}`;
  const ogImage      = avatarUrl || `https://linkitin.site/api/avatar/${username}`;

  function fmt(n) {
    if (n === null || n === undefined) return null;
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, "")     + "K";
    return String(n);
  }

  const ptitle = `${displayName} (@${username}) on Instagram · Linkitin`;
  const pdesc  = bio || `View ${displayName}'s Instagram profile on Linkitin — no login needed.`;

  return (
    <>
      <Head>
        <title>{ptitle}</title>
        <meta name="description"  content={pdesc}/>
        <meta name="viewport"     content="width=device-width,initial-scale=1,viewport-fit=cover"/>
        <meta name="theme-color"  content="#080808"/>
        <link rel="canonical"     href={pageUrl}/>
        <link rel="icon"          href="/icon.png" type="image/png"/>

        {/* Open Graph */}
        <meta property="og:type"        content="profile"/>
        <meta property="og:title"       content={ptitle}/>
        <meta property="og:description" content={pdesc}/>
        <meta property="og:url"         content={pageUrl}/>
        <meta property="og:site_name"   content="Linkitin"/>
        <meta property="og:image"       content={ogImage}/>
        <meta property="og:image:width" content="400"/>
        <meta property="og:image:height"content="400"/>
        <meta property="og:image:alt"   content={`${displayName}'s Instagram profile photo`}/>

        {/* Twitter */}
        <meta name="twitter:card"        content="summary"/>
        <meta name="twitter:title"       content={ptitle}/>
        <meta name="twitter:description" content={pdesc}/>
        <meta name="twitter:image"       content={ogImage}/>

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com"/>
        {avatarUrl && <link rel="preload" as="image" href={avatarUrl} fetchpriority="high"/>}

        {/* Fonts & Icons */}
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
          @keyframes ringPulse{0%,100%{opacity:1;}50%{opacity:.65;}}
          @keyframes lsDots{0%,80%,100%{opacity:.15;transform:translateY(0) scale(1);}40%{opacity:1;transform:translateY(-6px) scale(1.15);}}

          .s1{animation:slideUp .6s .04s cubic-bezier(.16,1,.3,1) both;}
          .s2{animation:slideUp .6s .14s cubic-bezier(.16,1,.3,1) both;}
          .s3{animation:slideUp .6s .24s cubic-bezier(.16,1,.3,1) both;}
          .s4{animation:slideUp .6s .34s cubic-bezier(.16,1,.3,1) both;}
          .s5{animation:slideUp .6s .44s cubic-bezier(.16,1,.3,1) both;}
          .s6{animation:slideUp .6s .54s cubic-bezier(.16,1,.3,1) both;}

          /* ── Hero banner — blurred avatar bg ── */
          .hero-banner{
            position:relative;width:100%;height:200px;overflow:hidden;
            animation:fadeIn .7s ease both;
          }
          .hero-blur{
            position:absolute;inset:-30px;
            background-size:cover;background-position:center;
            filter:blur(28px) brightness(.38) saturate(1.5);
            transform:scale(1.15);
          }
          .hero-fade{
            position:absolute;inset:0;
            background:linear-gradient(to bottom,transparent 0%,rgba(13,13,13,.55) 60%,#0d0d0d 100%);
          }

          /* ── Page wrapper ── */
          .page{max-width:480px;margin:0 auto;padding:0 0 60px;}

          /* ── Avatar + identity card ── */
          .identity{
            display:flex;flex-direction:column;align-items:center;
            padding:0 20px 0;margin-top:-56px;position:relative;z-index:2;
          }

          .av-wrap{
            width:116px;height:116px;border-radius:50%;
            background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);
            padding:3px;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 0 4px #0d0d0d;
          }
          .av-inner{
            width:110px;height:110px;border-radius:50%;
            background:#111;
            display:flex;align-items:center;justify-content:center;
            overflow:hidden;
          }
          .av-img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;}
          .av-ph-txt{font-size:40px;font-weight:800;color:#fff;}

          .display-name{
            margin-top:14px;
            font-size:clamp(26px,7vw,40px);font-weight:800;
            color:#fff;letter-spacing:-.025em;line-height:1.05;text-align:center;
          }
          .handle-row{
            display:flex;align-items:center;gap:6px;
            margin-top:4px;
          }
          .handle{font-size:14px;font-weight:600;color:rgba(255,255,255,.38);}
          .verified-badge{
            width:18px;height:18px;border-radius:50%;
            background:linear-gradient(135deg,#4facfe,#00f2fe);
            display:flex;align-items:center;justify-content:center;
            font-size:10px;color:#fff;flex-shrink:0;
          }
          .category{
            margin-top:6px;
            font-size:11.5px;font-weight:600;color:rgba(255,255,255,.28);
            letter-spacing:.06em;text-transform:uppercase;text-align:center;
          }

          /* ── Stats row ── */
          .stats-row{
            display:flex;justify-content:center;gap:0;
            margin:18px 20px 0;
            background:#111;border:1px solid #1e1e1e;border-radius:18px;
            overflow:hidden;
          }
          .stat-cell{
            flex:1;display:flex;flex-direction:column;align-items:center;
            padding:14px 8px;
            border-right:1px solid #1a1a1a;
          }
          .stat-cell:last-child{border-right:none;}
          .stat-num{font-size:17px;font-weight:800;color:#fff;line-height:1.1;}
          .stat-lbl{font-size:10.5px;font-weight:600;color:rgba(255,255,255,.3);margin-top:3px;letter-spacing:.03em;}

          /* ── Bio block ── */
          .bio-block{
            margin:16px 20px 0;
            padding:16px 18px;
            background:#111;border:1px solid #1e1e1e;border-radius:16px;
            font-size:14px;line-height:1.7;color:rgba(255,255,255,.65);
            white-space:pre-wrap;word-break:break-word;
          }

          /* ── Private notice ── */
          .private-notice{
            display:flex;flex-direction:column;align-items:center;gap:10px;
            margin:24px 20px 0;
            padding:24px 20px;
            background:#111;border:1px solid #1e1e1e;border-radius:18px;
            text-align:center;
          }
          .private-icon{font-size:32px;color:rgba(255,255,255,.18);}
          .private-txt{font-size:13.5px;font-weight:600;color:rgba(255,255,255,.35);}

          /* ── CTA Buttons ── */
          .cta-row{
            display:flex;gap:10px;
            margin:16px 20px 0;
          }
          .cta-primary{
            flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
            padding:14px;border-radius:14px;border:none;cursor:pointer;
            font-family:'Sora',sans-serif;font-size:14px;font-weight:700;
            background:linear-gradient(135deg,#e6683c,#dc2743,#cc2366);
            color:#fff;
            box-shadow:0 4px 18px rgba(220,39,67,.28);
            transition:transform .15s,box-shadow .15s;
          }
          .cta-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(220,39,67,.38);}
          .cta-primary:active{transform:scale(.96);}
          .cta-secondary{
            width:50px;height:50px;border-radius:14px;border:1px solid #1e1e1e;
            background:#111;cursor:pointer;color:rgba(255,255,255,.55);font-size:17px;
            display:flex;align-items:center;justify-content:center;
            transition:all .15s;flex-shrink:0;
          }
          .cta-secondary:hover{background:#1a1a1a;border-color:#2a2a2a;color:#fff;}
          .cta-secondary:active{transform:scale(.93);}

          /* ── External link ── */
          .ext-link{
            display:flex;align-items:center;gap:10px;
            margin:12px 20px 0;
            padding:13px 16px;
            background:#111;border:1px solid #1e1e1e;border-radius:14px;
            color:rgba(255,255,255,.65);font-size:13.5px;font-weight:600;
            overflow:hidden;
            transition:background .13s,border-color .13s;
          }
          .ext-link:hover{background:#181818;border-color:#2a2a2a;color:#fff;}
          .ext-link-icon{font-size:15px;color:#a78bfa;flex-shrink:0;}
          .ext-link-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
          .ext-link-arr{flex-shrink:0;font-size:12px;color:rgba(255,255,255,.25);}

          /* ── Linkitin CTA footer ── */
          .create-cta-box{
            margin:28px 20px 0;
            padding:22px 20px;
            background:linear-gradient(135deg,#0f0f0f 0%,#111 100%);
            border:1px solid #1e1e1e;border-radius:20px;
            display:flex;flex-direction:column;align-items:center;gap:14px;
          }
          .create-cta-title{font-size:16px;font-weight:800;color:#fff;text-align:center;}
          .create-cta-sub{font-size:12.5px;color:rgba(255,255,255,.35);text-align:center;line-height:1.55;}
          .create-cta-btn{
            display:inline-flex;align-items:center;gap:8px;
            padding:13px 28px;border-radius:999px;border:none;
            background:#fff;color:#000;font-family:'Sora',sans-serif;
            font-size:13.5px;font-weight:800;cursor:pointer;
            transition:transform .15s,box-shadow .15s;
            box-shadow:0 4px 18px rgba(255,255,255,.08);
            text-decoration:none;
          }
          .create-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,255,255,.14);}
          .create-cta-btn:active{transform:scale(.96);}

          /* ── Footer ── */
          .foot{text-align:center;padding:20px 0 4px;font-size:12px;color:#2a2a2a;font-weight:600;}

          /* ── Share FAB ── */
          .sfab{
            position:fixed;top:16px;right:16px;width:46px;height:46px;
            border-radius:13px;background:#111;border:1px solid #1e1e1e;
            display:flex;align-items:center;justify-content:center;
            font-size:17px;color:rgba(255,255,255,.6);cursor:pointer;
            z-index:80;
            transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .13s,border-color .13s,box-shadow .13s;
          }
          .sfab:hover{transform:translateY(-3px) scale(1.07);background:#181818;border-color:#2c2c2c;color:#fff;box-shadow:0 8px 22px rgba(0,0,0,.5);}
          .sfab:active{transform:scale(.93);}

          /* ── Error state ── */
          .err-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;}
          .err-icon{font-size:48px;margin-bottom:20px;color:#333;}
          .err-title{font-size:22px;font-weight:800;margin-bottom:8px;}
          .err-sub{font-size:14px;color:#444;margin-bottom:28px;line-height:1.6;}
          .err-btn{background:#fff;color:#000;padding:13px 28px;border-radius:999px;font-family:'Sora',sans-serif;font-weight:800;font-size:14px;display:inline-flex;align-items:center;gap:8px;}

          @media(max-width:420px){
            .display-name{font-size:26px;}
            .cta-row{flex-direction:column;}
            .cta-secondary{width:100%;height:50px;flex-direction:row;gap:8px;font-size:14px;}
          }
        `}</style>
      </Head>

      <LoadingScreen visible={loading}/>

      {/* ── Share FAB ── */}
      <button className="sfab" onClick={() => setShareOpen(true)} aria-label="Share">
        <i className="fas fa-share-nodes"/>
      </button>

      {error ? (
        <div className="err-wrap">
          <div className="err-icon"><i className="fab fa-instagram"/></div>
          <h1 className="err-title">Couldn&apos;t Load Profile</h1>
          <p className="err-sub">
            We couldn&apos;t fetch <strong>@{username}</strong>&apos;s Instagram info right now.<br/>
            Instagram may have blocked the request, or this account doesn&apos;t exist.
          </p>
          <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer" className="err-btn">
            <i className="fab fa-instagram"/> Open on Instagram
          </a>
          <div style={{marginTop:40,fontSize:12,color:"#222",fontWeight:500}}>
            Developed by <strong style={{color:"#444"}}>Samartha Gs</strong>
          </div>
        </div>
      ) : (
        <div className="page">

          {/* ── Hero banner (blurred avatar) ── */}
          <div className="hero-banner">
            {avatarUrl && (
              <div className="hero-blur" style={{backgroundImage:`url(${avatarUrl})`}}/>
            )}
            <div className="hero-fade"/>
          </div>

          {/* ── Identity ── */}
          <div className="identity s1">
            <div className="av-wrap">
              <div className="av-inner">
                {avatarUrl
                  ? <img src={avatarUrl} alt={`${displayName}'s Instagram photo`} className="av-img" fetchpriority="high"/>
                  : <span className="av-ph-txt">{username.charAt(0).toUpperCase()}</span>}
              </div>
            </div>

            <h1 className="display-name">{displayName}</h1>

            <div className="handle-row">
              <span className="handle">@{username}</span>
              {isVerified && (
                <span className="verified-badge" title="Verified">
                  <i className="fas fa-check" style={{fontSize:9}}/>
                </span>
              )}
            </div>

            {category && <p className="category">{category}</p>}
          </div>

          {/* ── Stats row ── */}
          {(posts !== null || followers !== null || following !== null) && (
            <div className="stats-row s2">
              {posts !== null && (
                <div className="stat-cell">
                  <span className="stat-num">{fmt(posts)}</span>
                  <span className="stat-lbl">Posts</span>
                </div>
              )}
              {followers !== null && (
                <div className="stat-cell">
                  <span className="stat-num">{fmt(followers)}</span>
                  <span className="stat-lbl">Followers</span>
                </div>
              )}
              {following !== null && (
                <div className="stat-cell">
                  <span className="stat-num">{fmt(following)}</span>
                  <span className="stat-lbl">Following</span>
                </div>
              )}
            </div>
          )}

          {/* ── Bio ── */}
          {bio ? (
            <div className="bio-block s3">{bio}</div>
          ) : isPrivate ? (
            <div className="private-notice s3">
              <div className="private-icon"><i className="fas fa-lock"/></div>
              <p className="private-txt">This account is private.<br/>Follow on Instagram to see their posts.</p>
            </div>
          ) : null}

          {/* ── External website link ── */}
          {externalUrl && (
            <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="ext-link s4">
              <i className="fas fa-link ext-link-icon"/>
              <span className="ext-link-txt">{externalUrl.replace(/^https?:\/\//, "")}</span>
              <i className="fas fa-arrow-up-right-from-square ext-link-arr"/>
            </a>
          )}

          {/* ── CTA Buttons ── */}
          <div className="cta-row s4">
            <a href={instaLink} target="_blank" rel="noopener noreferrer" className="cta-primary">
              <i className="fab fa-instagram" style={{fontSize:18}}/>
              Follow on Instagram
            </a>
            <button className="cta-secondary" onClick={() => setShareOpen(true)} aria-label="Share">
              <i className="fas fa-share-nodes"/>
            </button>
          </div>

          {/* ── Linkitin promo ── */}
          <div className="create-cta-box s5">
            <div style={{fontSize:28}}>⚡</div>
            <div>
              <p className="create-cta-title">Want your own link-in-bio?</p>
              <p className="create-cta-sub">Create a full Linkitin profile — add your links, socials,<br/>Spotify, and more. Free, no app needed.</p>
            </div>
            <a href="/" className="create-cta-btn">
              <i className="fas fa-plus"/> Create Your Profile
            </a>
          </div>

          {/* ── Footer ── */}
          <div className="foot s6">
            Powered by <strong style={{color:"#444"}}>Linkitin</strong> · Developed by <strong style={{color:"#444"}}>Samartha Gs</strong>
          </div>

        </div>
      )}

      {shareOpen && (
        <ShareSheet
          url={pageUrl}
          name={displayName}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}

// ─── SSR ──────────────────────────────────────────────────────────
export async function getServerSideProps({ params, req }) {
  const username = (params.username || "").toLowerCase().replace(/^@/, "");
  const host     = req.headers.host || "linkitin.site";
  const proto    = host.startsWith("localhost") ? "http" : "https";
  const base     = `${proto}://${host}`;
  const pageUrl  = `${base}/insta/${username}`;

  if (!username) {
    return { props: { instaUser: null, username: "", pageUrl, error: true } };
  }

  try {
    // ── Fetch from Instagram's public JSON endpoint ──────────────
    // Instagram's /api/v1/users/web_profile_info endpoint requires
    // a realistic browser User-Agent + the app_id header.
    // This works for public accounts without authentication.
    const igRes = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
          "Accept":          "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "X-IG-App-ID":     "936619743392459", // public web app id
          "Origin":          "https://www.instagram.com",
          "Referer":         `https://www.instagram.com/${username}/`,
        },
        // 5-second server-side timeout
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!igRes.ok) {
      console.warn(`[insta/${username}] Instagram returned ${igRes.status}`);
      return { props: { instaUser: null, username, pageUrl, error: true } };
    }

    const igJson   = await igRes.json();
    const userData = igJson?.data?.user || null;

    if (!userData) {
      return { props: { instaUser: null, username, pageUrl, error: true } };
    }

    // ── Strip only the fields we render so the prop stays lean ──
    const instaUser = {
      full_name:       userData.full_name       || "",
      biography:       userData.biography       || "",
      profile_pic_url_hd: userData.profile_pic_url_hd || "",
      profile_pic_url:    userData.profile_pic_url    || "",
      is_verified:     userData.is_verified     || false,
      is_private:      userData.is_private      || false,
      external_url:    userData.external_url    || "",
      category_name:   userData.category_name   || "",
      edge_followed_by: userData.edge_followed_by || null,
      edge_follow:      userData.edge_follow      || null,
      edge_owner_to_timeline_media: userData.edge_owner_to_timeline_media || null,
    };

    return { props: { instaUser, username, pageUrl, error: false } };

  } catch (err) {
    console.error(`[insta/${username}] fetch error:`, err?.message || err);
    return { props: { instaUser: null, username, pageUrl, error: true } };
  }
}