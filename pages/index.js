// pages/index.js  — Landing page
// Domain root opens this. "Create Profile" → /create
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Landing() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  const features = [
    { icon:"fas fa-user-circle",  title:"Your Link in Bio",    desc:"One clean URL that holds everything — socials, links, music and your story." },
    { icon:"fas fa-share-nodes",  title:"Share Anywhere",      desc:"Share on WhatsApp, Instagram, Telegram and more with one tap." },
    { icon:"fab fa-spotify",      title:"Spotify Integration",  desc:"Show the world what you're listening to with an embedded player." },
    { icon:"fas fa-certificate",  title:"Professional Badge",   desc:"Coder, Designer, Trader, Doctor — pick your badge and own your identity." },
    { icon:"fas fa-chart-bar",    title:"Profile Analytics",    desc:"See how many views, link clicks and Spotify plays your profile gets." },
    { icon:"fas fa-wand-magic-sparkles", title:"AI Bio Generator", desc:"Type a few words about yourself and AI writes a cool bio instantly." },
  ];

  const steps = [
    { n:"01", t:"Pick your username",     d:"Choose a unique handle like mywebsam.site/sam" },
    { n:"02", t:"Add your badge & links", d:"Photo, badge, socials, external links, favourite song" },
    { n:"03", t:"Publish in seconds",     d:"Your profile goes live instantly — share it everywhere" },
  ];

  return (
    <>
      <Head>
        <title>mywebsam — Your Link in Bio</title>
        <meta name="description" content="Create your personal link-in-bio profile. Add your socials, links, Spotify song, badge and AI bio — all in one place. Free forever."/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta property="og:title"       content="mywebsam — Your Link in Bio"/>
        <meta property="og:description" content="Create your personal profile with socials, links, music and AI bio. Free forever."/>
        <meta property="og:type"        content="website"/>
        <meta name="twitter:card"       content="summary"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;}
          *{-webkit-tap-highlight-color:transparent;}
          a,button{outline:none;text-decoration:none;color:inherit;}
          body{
            font-family:'Sora',sans-serif;
            background:#0d0d0d;
            color:#fff;
            min-height:100vh;
            overflow-x:hidden;
          }

          /* ── Animations ── */
          @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
          @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
          @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
          @keyframes gradMove{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}

          .vis .a1{animation:fadeUp .7s .05s cubic-bezier(.16,1,.3,1) both;}
          .vis .a2{animation:fadeUp .7s .15s cubic-bezier(.16,1,.3,1) both;}
          .vis .a3{animation:fadeUp .7s .25s cubic-bezier(.16,1,.3,1) both;}
          .vis .a4{animation:fadeUp .7s .35s cubic-bezier(.16,1,.3,1) both;}
          .vis .a5{animation:fadeUp .7s .45s cubic-bezier(.16,1,.3,1) both;}

          /* ── NAV ── */
          nav{
            position:fixed;top:0;left:0;right:0;
            height:60px;
            display:flex;align-items:center;justify-content:space-between;
            padding:0 20px;
            z-index:100;
            background:rgba(13,13,13,.85);
            backdrop-filter:blur(16px);
            -webkit-backdrop-filter:blur(16px);
            border-bottom:1px solid rgba(255,255,255,.06);
          }
          .nav-logo{
            display:flex;align-items:center;gap:8px;
            font-size:16px;font-weight:700;
            color:#fff;letter-spacing:-.02em;
          }
          .nav-logo img{width:28px;height:28px;border-radius:7px;object-fit:contain;}
          .nav-cta{
            display:inline-flex;align-items:center;gap:7px;
            background:#fff;color:#0d0d0d;
            padding:9px 18px;border-radius:999px;
            font-size:13px;font-weight:700;
            transition:background .14s,transform .13s;
            letter-spacing:-.01em;
          }
          .nav-cta:hover{background:#f0f0f0;transform:scale(1.03);}
          .nav-cta:active{transform:scale(.97);}

          /* ── HERO SECTION ── */
          .hero-section{
            min-height:100vh;
            display:flex;flex-direction:column;
            align-items:center;justify-content:center;
            padding:80px 20px 60px;
            text-align:center;
            position:relative;
            overflow:hidden;
          }
          /* ambient glow behind hero */
          .hero-section::before{
            content:"";
            position:absolute;
            top:-20%;left:50%;
            transform:translateX(-50%);
            width:700px;height:700px;
            background:radial-gradient(circle,rgba(255,255,255,.04) 0%,transparent 65%);
            pointer-events:none;
          }
          .eyebrow{
            display:inline-flex;align-items:center;gap:7px;
            background:rgba(255,255,255,.07);
            border:1px solid rgba(255,255,255,.12);
            border-radius:999px;
            padding:5px 14px;
            font-size:12px;font-weight:600;
            color:rgba(255,255,255,.6);
            letter-spacing:.04em;text-transform:uppercase;
            margin-bottom:24px;
          }
          .eyebrow i{font-size:10px;opacity:.7;}
          .hero-title{
            font-size:clamp(38px,10vw,72px);
            font-weight:800;
            color:#fff;
            letter-spacing:-.04em;
            line-height:1.0;
            margin-bottom:20px;
            max-width:700px;
          }
          .hero-title span{
            background:linear-gradient(90deg,rgba(255,255,255,.55) 0%,#fff 40%,rgba(255,255,255,.55) 100%);
            background-size:200% auto;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            background-clip:text;
            animation:shimmer 4s linear infinite;
          }
          .hero-sub{
            font-size:clamp(15px,3.5vw,18px);
            color:rgba(255,255,255,.42);
            font-weight:400;
            line-height:1.7;
            max-width:480px;
            margin:0 auto 36px;
          }
          .hero-btns{
            display:flex;align-items:center;justify-content:center;
            gap:12px;flex-wrap:wrap;
          }
          .btn-primary{
            display:inline-flex;align-items:center;gap:8px;
            background:#fff;color:#0d0d0d;
            padding:14px 28px;border-radius:999px;
            font-size:15px;font-weight:700;
            font-family:'Sora',sans-serif;
            transition:background .14s,transform .14s,box-shadow .14s;
            letter-spacing:-.01em;
            box-shadow:0 4px 24px rgba(255,255,255,.1);
          }
          .btn-primary:hover{background:#f0f0f0;transform:scale(1.03);box-shadow:0 8px 32px rgba(255,255,255,.15);}
          .btn-primary:active{transform:scale(.97);}
          .btn-ghost{
            display:inline-flex;align-items:center;gap:7px;
            background:transparent;
            border:1px solid rgba(255,255,255,.16);
            color:rgba(255,255,255,.65);
            padding:13px 24px;border-radius:999px;
            font-size:14px;font-weight:600;
            font-family:'Sora',sans-serif;
            transition:border-color .14s,color .14s,transform .13s;
          }
          .btn-ghost:hover{border-color:rgba(255,255,255,.35);color:#fff;transform:scale(1.02);}

          /* Profile card preview */
          .preview-wrap{
            margin-top:52px;
            position:relative;
            display:inline-block;
          }
          .preview-card{
            width:min(320px,85vw);
            background:#141414;
            border:1px solid #222;
            border-radius:22px;
            overflow:hidden;
            box-shadow:0 32px 80px rgba(0,0,0,.6);
            animation:float 5s ease-in-out infinite;
          }
          .preview-photo{
            width:100%;height:160px;
            background:linear-gradient(135deg,#1a1a1a,#2a2a2a,#1a1a1a);
            display:flex;align-items:center;justify-content:center;
            font-size:48px;color:rgba(255,255,255,.15);
            position:relative;overflow:hidden;
          }
          .preview-photo::after{
            content:"";position:absolute;bottom:0;left:0;right:0;height:60%;
            background:linear-gradient(to bottom,transparent,#141414);
          }
          .preview-body{padding:16px 18px 18px;text-align:center;}
          .preview-name{font-size:20px;font-weight:700;margin-bottom:6px;letter-spacing:-.02em;}
          .preview-badge{
            display:inline-flex;align-items:center;gap:5px;
            background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);
            border-radius:999px;padding:4px 12px;
            font-size:11px;font-weight:600;color:rgba(255,255,255,.5);
            margin-bottom:14px;
          }
          .preview-icons{display:flex;justify-content:center;gap:8px;margin-bottom:14px;}
          .preview-icon{
            width:36px;height:36px;border-radius:10px;
            background:#1e1e1e;border:1px solid #2a2a2a;
            display:flex;align-items:center;justify-content:center;
            font-size:14px;
          }
          .preview-link{
            width:100%;padding:11px;
            background:#1e1e1e;border:1px solid #2a2a2a;border-radius:12px;
            font-size:13px;font-weight:600;color:rgba(255,255,255,.7);
            margin-bottom:8px;display:block;text-align:center;
          }
          .preview-url{
            font-size:11px;color:rgba(255,255,255,.2);
            margin-top:6px;letter-spacing:.02em;
          }

          /* ── FEATURES ── */
          .section{
            max-width:1000px;margin:0 auto;
            padding:80px 20px;
          }
          .section-label{
            text-align:center;
            font-size:11px;font-weight:700;
            letter-spacing:.1em;text-transform:uppercase;
            color:rgba(255,255,255,.3);
            margin-bottom:14px;
          }
          .section-title{
            text-align:center;
            font-size:clamp(26px,6vw,40px);
            font-weight:700;
            letter-spacing:-.03em;
            color:#fff;
            margin-bottom:48px;
            line-height:1.1;
          }
          .features-grid{
            display:grid;
            grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
            gap:14px;
          }
          .feat-card{
            background:#111;
            border:1px solid #1e1e1e;
            border-radius:18px;
            padding:24px;
            transition:border-color .15s,transform .18s,box-shadow .18s;
          }
          .feat-card:hover{
            border-color:#2c2c2c;
            transform:translateY(-3px);
            box-shadow:0 12px 32px rgba(0,0,0,.4);
          }
          .feat-icon{
            width:44px;height:44px;border-radius:12px;
            background:#1a1a1a;border:1px solid #252525;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;color:rgba(255,255,255,.7);
            margin-bottom:14px;
          }
          .feat-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:6px;letter-spacing:-.01em;}
          .feat-desc{font-size:13px;color:rgba(255,255,255,.4);line-height:1.7;}

          /* ── HOW IT WORKS ── */
          .steps-row{
            display:flex;flex-direction:column;gap:16px;
            max-width:560px;margin:0 auto;
          }
          .step-item{
            display:flex;align-items:flex-start;gap:18px;
            padding:20px 22px;
            background:#111;border:1px solid #1e1e1e;border-radius:16px;
          }
          .step-num{
            font-size:11px;font-weight:700;
            color:rgba(255,255,255,.2);
            letter-spacing:.05em;
            flex-shrink:0;margin-top:2px;
            font-variant-numeric:tabular-nums;
          }
          .step-t{font-size:15px;font-weight:700;color:#fff;margin-bottom:4px;letter-spacing:-.01em;}
          .step-d{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6;}

          /* ── CTA SECTION ── */
          .cta-section{
            text-align:center;
            padding:80px 20px 40px;
          }
          .cta-box{
            max-width:520px;margin:0 auto;
            padding:48px 32px;
            background:#111;
            border:1px solid #1e1e1e;
            border-radius:24px;
          }
          .cta-title{
            font-size:clamp(24px,5vw,34px);
            font-weight:700;letter-spacing:-.03em;
            color:#fff;margin-bottom:12px;line-height:1.1;
          }
          .cta-sub{
            font-size:14px;color:rgba(255,255,255,.38);
            line-height:1.7;margin-bottom:28px;
          }

          /* ── FOOTER ── */
          footer{
            text-align:center;
            padding:24px 20px 32px;
            border-top:1px solid #161616;
          }
          .foot-row{
            display:flex;align-items:center;justify-content:center;
            gap:8px;margin-bottom:8px;
          }
          .foot-logo-img{width:22px;height:22px;border-radius:5px;object-fit:contain;opacity:.7;}
          .foot-name{font-size:14px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:-.01em;}
          .foot-dev{font-size:12px;color:rgba(255,255,255,.2);font-weight:500;}
          .foot-dev strong{color:rgba(255,255,255,.38);font-weight:700;}
          .foot-links{
            display:flex;align-items:center;justify-content:center;
            gap:20px;margin-top:12px;
          }
          .foot-links a{font-size:12px;color:rgba(255,255,255,.22);font-weight:500;}
          .foot-links a:hover{color:rgba(255,255,255,.5);}

          /* ── Responsive ── */
          @media(max-width:480px){
            nav{padding:0 14px;}
            .hero-section{padding:72px 16px 48px;}
            .section{padding:60px 14px;}
            .cta-section{padding:60px 14px 32px;}
            .cta-box{padding:32px 20px;}
            .btn-primary{padding:13px 22px;font-size:14px;}
          }
        `}</style>
      </Head>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-logo">
          <img src="/icon.png" alt="mywebsam"/>
          mywebsam
        </div>
        <a href="/create" className="nav-cta">
          <i className="fas fa-plus" style={{fontSize:11}}/>
          Create Profile
        </a>
      </nav>

      {/* ── HERO ── */}
      <div className={`hero-section ${visible?"vis":""}`}>
        <div className="eyebrow a1">
          <i className="fas fa-link"/>
          Free · No account needed
        </div>
        <h1 className="hero-title a2">
          Your entire internet<br/>presence, <span>one link</span>
        </h1>
        <p className="hero-sub a3">
          Create your personal profile in seconds. Add your photo, badge,
          socials, links, favourite song and an AI-written bio — all at one URL.
        </p>
        <div className="hero-btns a4">
          <a href="/create" className="btn-primary">
            <i className="fas fa-rocket" style={{fontSize:13}}/>
            Create Your Profile
          </a>
          <a href="#features" className="btn-ghost">
            See how it works
            <i className="fas fa-arrow-down" style={{fontSize:12}}/>
          </a>
        </div>

        {/* Profile card mockup */}
        <div className="preview-wrap a5">
          <div className="preview-card">
            <div className="preview-photo">
              <i className="fas fa-user" style={{position:"relative",zIndex:1}}/>
            </div>
            <div className="preview-body">
              <div className="preview-name">Your Name</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                <span className="preview-badge">
                  <i className="fas fa-code" style={{fontSize:9}}/>
                  Coder
                </span>
              </div>
              <div className="preview-icons">
                {[{i:"fab fa-instagram",c:"#E4405F"},{i:"fab fa-youtube",c:"#FF0000"},{i:"fab fa-x-twitter",c:"#ccc"},{i:"fab fa-github",c:"#ccc"},{i:"fab fa-linkedin-in",c:"#0A66C2"}].map((s,i)=>(
                  <div key={i} className="preview-icon" style={{color:s.c}}>
                    <i className={s.i}/>
                  </div>
                ))}
              </div>
              <div className="preview-link">My Portfolio</div>
              <div className="preview-link" style={{marginBottom:0}}>Latest Project</div>
              <div className="preview-url">mywebsam.site/you</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="section">
        <div className="section-label">Everything you need</div>
        <div className="section-title">One profile. All of you.</div>
        <div className="features-grid">
          {features.map((f,i)=>(
            <div key={i} className="feat-card">
              <div className="feat-icon"><i className={f.icon}/></div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{paddingTop:0}}>
        <div className="section-label">Simple process</div>
        <div className="section-title">Live in 3 steps</div>
        <div className="steps-row">
          {steps.map((s,i)=>(
            <div key={i} className="step-item">
              <div className="step-num">{s.n}</div>
              <div>
                <div className="step-t">{s.t}</div>
                <div className="step-d">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-title">Ready to get your<br/>link in bio?</div>
          <div className="cta-sub">
            Free forever. No account, no email — just open on this device
            and your profile is saved here.
          </div>
          <a href="/create" className="btn-primary" style={{display:"inline-flex"}}>
            <i className="fas fa-rocket" style={{fontSize:13}}/>
            Create Your Profile — Free
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="foot-row">
          <img src="/icon.png" alt="mywebsam" className="foot-logo-img"/>
          <span className="foot-name">mywebsam</span>
        </div>
        <div className="foot-dev">
          Developed by <strong>Samartha GS</strong>
        </div>
        <div className="foot-links">
          <a href="/create">Create Profile</a>
          <span style={{color:"rgba(255,255,255,.1)"}}>·</span>
          <a href="#">Privacy</a>
          <span style={{color:"rgba(255,255,255,.1)"}}>·</span>
          <a href="#">Contact</a>
        </div>
      </footer>
    </>
  );
}
