// pages/index.js — linkitin Landing Page
import Head from "next/head";
import { useEffect, useState, useRef } from "react";

const SITE_URL = "https://linkitin.site";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const WORDS = ["Your links.", "Your story.", "Your brand.", "Your identity.", "Your world."];

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setFade(true); }, 240);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const features = [
    { icon: "fas fa-link",                 title: "Link in Bio",         desc: "One clean URL that holds your photo, socials, links and your story — all in one place." },
    { icon: "fas fa-id-badge",             title: "Professional Badge",  desc: "Coder, Designer, Trader, Doctor — own your role with a clean identity badge." },
    { icon: "fab fa-spotify",             title: "Spotify Widget",      desc: "Pin the song you're listening to right on your profile." },
    { icon: "fas fa-wand-magic-sparkles", title: "AI Bio Writer",       desc: "Write one sentence about yourself. The AI turns it into a full bio, in your voice." },
    { icon: "fas fa-share-nodes",         title: "Share Anywhere",      desc: "WhatsApp, Instagram, Telegram — one link works everywhere." },
    { icon: "fas fa-chart-line",          title: "Simple Analytics",    desc: "See how many people visit your profile and which links they tap." },
  ];

  const steps = [
    { n: "01", t: "Pick your username",  d: "Your profile will live at linkitin.site/yourname" },
    { n: "02", t: "Add your stuff",      d: "Photo, badge, links, Spotify song — and let AI write your bio." },
    { n: "03", t: "Share your link",     d: "Publish and share. No signup, no email, nothing extra." },
  ];

  const faqs = [
    { q: "Is linkitin free?",               a: "Yes, completely free. No hidden plans, no credit card, no catch." },
    { q: "Do I need to make an account?",   a: "No. No account, no email. Your profile is saved on your device." },
    { q: "Does it work on mobile?",         a: "Yes — built for mobile first. Build and share from your phone." },
    { q: "What is a link in bio?",          a: "It's one URL you put in your Instagram or TikTok bio that shows all your important links in one page." },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "linkitin",
      "url": SITE_URL,
      "description": "Create your personal link-in-bio profile page. Add your photo, professional badge, socials, Spotify song and an AI-written bio — all at one URL. Free forever. No account needed.",
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@type": "Person", "name": "Samartha GS" },
      "publisher": { "@type": "Organization", "name": "linkitin", "url": SITE_URL, "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Create Profile", "item": `${SITE_URL}/create` },
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Linkitin — Free Link in Bio | Create Your Profile Page</title>
        <meta name="description" content="Create your free link in bio profile page. Add your photo, badge, social links, Spotify song and AI-written bio — all at one URL. No account needed. Free forever." />
        <meta name="keywords" content="link in bio, free link in bio, linktree alternative, bio link page, personal profile page, linkitin, instagram bio link, link in bio tool, AI bio generator, spotify profile link" />
        <meta name="author" content="Samartha GS" />
        <meta name="creator" content="Samartha GS" />
        <meta name="publisher" content="linkitin" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0c0b09" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <link rel="canonical" href={SITE_URL} />

        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <meta name="msapplication-TileImage" content="/icon.png" />
        <meta name="msapplication-TileColor" content="#0c0b09" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="linkitin" />
        <meta property="og:title" content="linkitin — Free Link in Bio | Create Your Profile Page" />
        <meta property="og:description" content="Create your free link in bio profile. Add socials, Spotify, badge and AI bio — all at one URL. No account needed." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="linkitin — Create your free link in bio page" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@linkitin" />
        <meta name="twitter:title" content="linkitin — Your Free Link in Bio" />
        <meta name="twitter:description" content="One URL for your socials, links, Spotify and AI bio. Free, no account needed." />
        <meta name="twitter:image" content={OG_IMAGE} />

        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
          * { -webkit-tap-highlight-color: transparent; }
          a, button { outline: none; text-decoration: none; color: inherit; cursor: pointer; }

          :root {
            --bg:       #0c0b09;
            --surface:  #141310;
            --surface2: #1a1815;
            --border:   #242018;
            --border2:  #2e2a22;
            --text:     #ede8df;
            --muted:    rgba(237,232,223,0.48);
            --dimmer:   rgba(237,232,223,0.24);
            --warm:     #c8a97a;
            --warm-lt:  #dfc49a;
          }

          body {
            font-family: 'Nunito', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          @keyframes wordIn  { from { opacity:0; transform:translateY(8px); }  to { opacity:1; transform:translateY(0); } }
          @keyframes wordOut { from { opacity:1; transform:translateY(0); }     to { opacity:0; transform:translateY(-8px); } }
          @keyframes glow    { 0%,100% { opacity:.45; } 50% { opacity:1; } }

          .vis .a1 { animation: fadeUp .75s .06s cubic-bezier(.16,1,.3,1) both; }
          .vis .a2 { animation: fadeUp .75s .15s cubic-bezier(.16,1,.3,1) both; }
          .vis .a3 { animation: fadeUp .75s .24s cubic-bezier(.16,1,.3,1) both; }
          .vis .a4 { animation: fadeUp .75s .33s cubic-bezier(.16,1,.3,1) both; }
          .vis .a5 { animation: fadeUp .75s .42s cubic-bezier(.16,1,.3,1) both; }

          /* NAV */
          nav {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            display: flex; align-items: center; justify-content: space-between;
            padding: 22px 40px;
            transition: background .3s, backdrop-filter .3s;
          }
          nav.scrolled {
            background: rgba(12,11,9,0.86);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border);
          }
          .nav-logo {
            font-family: 'Lora', serif;
            font-style: italic;
            font-size: 22px;
            letter-spacing: -.01em;
            color: var(--text);
          }
          .nav-logo b { font-style: normal; color: var(--warm); font-weight: 500; }
          .nav-btn {
            padding: 10px 24px;
            background: var(--warm);
            color: #0c0b09;
            font-family: 'Nunito', sans-serif;
            font-size: 13.5px; font-weight: 700;
            border-radius: 100px;
            transition: opacity .15s, transform .15s;
          }
          .nav-btn:hover { opacity: .84; transform: scale(1.02); }

          /* HERO */
          .hero {
            min-height: 100vh;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 150px 28px 110px;
            text-align: center;
            position: relative;
          }
          .hero::before {
            content: "";
            position: absolute; top: 0; left: 50%; transform: translateX(-50%);
            width: 700px; height: 500px;
            background: radial-gradient(ellipse, rgba(200,169,122,0.05) 0%, transparent 68%);
            pointer-events: none;
          }
          .hero::after {
            content: "";
            position: absolute; bottom: 0; left: 10%; right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border2), transparent);
          }

          .hero-eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 6px 16px;
            border: 1px solid var(--border2);
            border-radius: 100px;
            font-size: 12px; font-weight: 600;
            color: var(--dimmer);
            letter-spacing: .05em; text-transform: uppercase;
            margin-bottom: 48px;
          }
          .dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--warm);
            animation: glow 2.4s ease-in-out infinite;
          }

          .headline {
            font-family: 'Lora', serif;
            font-size: clamp(42px, 9.5vw, 84px);
            font-weight: 500;
            line-height: 1.08;
            letter-spacing: -.035em;
            color: var(--text);
            margin-bottom: 22px;
          }
          .headline em { font-style: italic; color: var(--warm); }

          .word-row {
            font-family: 'Lora', serif;
            font-size: clamp(34px, 7vw, 66px);
            font-style: italic;
            font-weight: 400;
            line-height: 1.1;
            letter-spacing: -.028em;
            margin-bottom: 44px;
            color: var(--muted);
          }
          .word-wrap { display: inline-block; min-width: 220px; }
          .changing-word {
            display: inline-block;
            background: linear-gradient(90deg, var(--warm) 0%, var(--warm-lt) 50%, var(--warm) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3.8s linear infinite;
          }
          .changing-word.fade-in  { animation: wordIn  .22s ease forwards, shimmer 3.8s linear infinite; }
          .changing-word.fade-out { animation: wordOut .22s ease forwards; }

          .hero-sub {
            font-size: clamp(15px, 2vw, 18px);
            color: var(--muted);
            font-weight: 300;
            max-width: 460px;
            margin: 0 auto 24px;
            line-height: 1.8;
          }

          .pills {
            display: flex; flex-wrap: wrap;
            align-items: center; justify-content: center;
            gap: 8px; margin-bottom: 56px;
          }
          .pill {
            padding: 5px 13px;
            border: 1px solid var(--border2);
            border-radius: 100px;
            font-size: 12px; font-weight: 600;
            color: var(--dimmer);
            display: flex; align-items: center; gap: 5px;
          }
          .pill i { font-size: 9px; color: var(--warm); }

          .cta-row {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 12px;
            margin-bottom: 80px;
          }
          .btn-main {
            display: inline-flex; align-items: center; gap: 9px;
            padding: 16px 34px;
            background: var(--text);
            color: #0c0b09;
            font-family: 'Nunito', sans-serif;
            font-size: 15px; font-weight: 700;
            border-radius: 100px;
            transition: opacity .15s, transform .15s, box-shadow .15s;
          }
          .btn-main:hover { opacity: .9; transform: scale(1.025); box-shadow: 0 8px 28px rgba(237,232,223,.1); }
          .btn-ghost {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 15px 28px;
            background: transparent;
            color: var(--muted);
            font-family: 'Nunito', sans-serif;
            font-size: 14px; font-weight: 600;
            border-radius: 100px;
            border: 1px solid var(--border2);
            transition: border-color .15s, color .15s, transform .15s;
          }
          .btn-ghost:hover { border-color: rgba(237,232,223,.28); color: var(--text); transform: scale(1.02); }

          /* profile card */
          .profile-card {
            display: flex; align-items: center; gap: 16px;
            padding: 18px 24px;
            background: var(--surface);
            border: 1px solid var(--border2);
            border-radius: 22px;
            max-width: 340px; margin: 0 auto;
            text-align: left;
          }
          .p-avatar {
            width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
            background: linear-gradient(135deg, var(--warm) 0%, #8c6230 100%);
            display: flex; align-items: center; justify-content: center;
            font-family: 'Lora', serif; font-style: italic;
            font-size: 20px; color: #fff;
          }
          .p-url  { font-size: 11.5px; color: var(--dimmer); margin-bottom: 3px; }
          .p-name { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -.01em; }
          .p-badge {
            display: inline-flex; align-items: center; gap: 4px;
            margin-top: 6px; padding: 3px 10px;
            background: rgba(200,169,122,.1);
            border: 1px solid rgba(200,169,122,.2);
            border-radius: 100px;
            font-size: 10px; color: var(--warm-lt); font-weight: 700;
          }
          .p-icons { display: flex; gap: 6px; margin-top: 10px; }
          .p-icon {
            width: 26px; height: 26px; border-radius: 8px;
            background: var(--surface2); border: 1px solid var(--border);
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; color: var(--dimmer);
          }

          /* LAYOUT */
          .section {
            max-width: 980px; margin: 0 auto;
            padding: 108px 28px;
            position: relative; z-index: 1;
          }
          .divider {
            max-width: 980px; margin: 0 auto;
            height: 1px; background: var(--border);
          }
          .sec-eye {
            text-align: center;
            font-size: 11px; font-weight: 700;
            letter-spacing: .13em; text-transform: uppercase;
            color: var(--warm); margin-bottom: 16px;
          }
          .sec-h {
            text-align: center;
            font-family: 'Lora', serif;
            font-size: clamp(28px, 5vw, 42px);
            font-weight: 500;
            letter-spacing: -.035em; line-height: 1.15;
            color: var(--text); margin-bottom: 14px;
          }
          .sec-h em { font-style: italic; color: var(--warm); }
          .sec-sub {
            text-align: center;
            font-size: 15px; color: var(--muted);
            font-weight: 300; line-height: 1.75;
            max-width: 440px; margin: 0 auto 60px;
          }

          /* FEAT GRID */
          .feat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(278px, 1fr));
            gap: 1px;
            background: var(--border);
            border: 1px solid var(--border);
            border-radius: 24px; overflow: hidden;
          }
          .feat-card {
            background: var(--surface);
            padding: 36px 30px;
            transition: background .2s;
          }
          .feat-card:hover { background: var(--surface2); }
          .feat-icon {
            width: 48px; height: 48px; border-radius: 14px;
            background: var(--bg);
            border: 1px solid var(--border2);
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; color: var(--warm);
            margin-bottom: 20px;
          }
          .feat-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 9px; letter-spacing: -.01em; }
          .feat-desc  { font-size: 13.5px; color: var(--muted); line-height: 1.8; font-weight: 300; }

          /* STEPS */
          .steps-wrap {
            max-width: 560px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 14px;
          }
          .step {
            display: flex; align-items: flex-start; gap: 24px;
            padding: 28px 30px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            transition: border-color .2s, transform .2s;
          }
          .step:hover { border-color: var(--border2); transform: translateX(5px); }
          .step-n {
            font-family: 'Lora', serif; font-style: italic;
            font-size: 38px; color: rgba(200,169,122,.13);
            line-height: 1; flex-shrink: 0; width: 42px; text-align: center;
            margin-top: -4px;
          }
          .step-t { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; letter-spacing: -.01em; }
          .step-d { font-size: 13.5px; color: var(--muted); line-height: 1.75; font-weight: 300; }

          /* FAQ */
          .faq-list {
            max-width: 620px; margin: 0 auto;
            display: flex; flex-direction: column; gap: 10px;
          }
          .faq-item {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 18px; overflow: hidden;
          }
          .faq-q {
            padding: 22px 26px;
            font-size: 15px; font-weight: 600; color: var(--text);
            letter-spacing: -.01em;
            display: flex; align-items: center; justify-content: space-between; gap: 12px;
          }
          .faq-q i { font-size: 11px; color: var(--warm); flex-shrink: 0; }
          .faq-a {
            padding: 0 26px 20px;
            font-size: 14px; color: var(--muted);
            line-height: 1.8; font-weight: 300;
          }

          /* BOTTOM CTA */
          .cta-box {
            max-width: 600px; margin: 0 auto;
            padding: 72px 48px;
            background: var(--surface);
            border: 1px solid var(--border2);
            border-radius: 30px;
            text-align: center;
            position: relative; overflow: hidden;
          }
          .cta-box::before {
            content: "";
            position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
            width: 300px; height: 180px;
            background: radial-gradient(circle, rgba(200,169,122,.06) 0%, transparent 70%);
          }
          .cta-serif {
            font-family: 'Lora', serif;
            font-size: 56px; font-style: italic;
            color: rgba(200,169,122,.1);
            line-height: 1; margin-bottom: 8px;
          }
          .cta-t {
            font-family: 'Lora', serif;
            font-size: clamp(28px, 5vw, 38px);
            font-weight: 500; letter-spacing: -.035em;
            line-height: 1.15; margin-bottom: 16px;
          }
          .cta-t em { font-style: italic; color: var(--warm); }
          .cta-d {
            font-size: 15px; color: var(--muted);
            font-weight: 300; line-height: 1.8;
            max-width: 380px; margin: 0 auto 36px;
          }
          .cta-url {
            display: inline-block;
            padding: 7px 18px; margin-bottom: 30px;
            background: rgba(200,169,122,.08);
            border: 1px solid rgba(200,169,122,.18);
            border-radius: 100px;
            font-size: 13.5px; color: var(--warm-lt); font-weight: 600;
          }

          /* FOOTER */
          footer {
            text-align: center;
            padding: 36px 24px 48px;
            border-top: 1px solid var(--border);
            position: relative; z-index: 1;
          }
          .ft-logo {
            font-family: 'Lora', serif; font-style: italic;
            font-size: 21px; color: var(--dimmer); margin-bottom: 8px;
          }
          .ft-logo b { font-style: normal; color: rgba(200,169,122,.4); font-weight: 500; }
          .ft-dev { font-size: 13px; color: var(--dimmer); }
          .ft-dev strong { color: rgba(237,232,223,.3); font-weight: 600; }
          .ft-links {
            display: flex; align-items: center; justify-content: center;
            flex-wrap: wrap; gap: 20px; margin-top: 14px;
          }
          .ft-links a { font-size: 12px; color: var(--dimmer); font-weight: 500; transition: color .15s; }
          .ft-links a:hover { color: rgba(237,232,223,.45); }
          .ft-sep { color: var(--border2); }

          @media (max-width: 600px) {
            nav { padding: 16px 22px; }
            .hero { padding: 120px 22px 90px; }
            .section { padding: 80px 22px; }
            .cta-box { padding: 44px 26px; }
            .feat-grid { border-radius: 18px; }
            .word-wrap { min-width: 170px; }
            .feat-card { padding: 28px 22px; }
          }
        `}</style>
      </Head>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""} aria-label="Main navigation">
        <div className="nav-logo">link<b>i</b>tin</div>
        <a href="/create" className="nav-btn">Create Profile</a>
      </nav>

      <main>
        {/* HERO */}
        <div className={`hero ${visible ? "vis" : ""}`} role="banner">

          <div className="hero-eyebrow a1">
            <span className="dot" aria-hidden="true" />
            Free · No account needed
          </div>

          <h1 className="headline a2">
            One link for<br /><em>everything you are</em>
          </h1>

          <div className="word-row a2" aria-live="polite" aria-atomic="true">
            <span className="word-wrap">
              <span className={`changing-word ${fade ? "fade-in" : "fade-out"}`}>
                {WORDS[wordIdx]}
              </span>
            </span>
          </div>

          <p className="hero-sub a3">
            Build your personal profile page and put all your links in one place.
            Share it on Instagram, WhatsApp, anywhere.
          </p>

          <div className="pills a3">
            {["Free forever", "No account", "No email", "Works on mobile", "AI bio"].map((t, i) => (
              <span key={i} className="pill">
                <i className="fas fa-check" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>

          <div className="cta-row a4">
            <a href="/create" className="btn-main">
              <i className="fas fa-rocket" style={{ fontSize: 13 }} aria-hidden="true" />
              Create Your Profile — Free
            </a>
            <a href="#features" className="btn-ghost">
              See what's included
              <i className="fas fa-arrow-down" style={{ fontSize: 11 }} aria-hidden="true" />
            </a>
          </div>

          <div className="profile-card a5" aria-label="Example profile">
            <div className="p-avatar" aria-hidden="true">S</div>
            <div>
              <div className="p-url">linkitin.site/samarthags</div>
              <div className="p-name">Samartha GS</div>
              <div className="p-badge">
                <i className="fas fa-code" style={{ fontSize: 9 }} aria-hidden="true" />
                Full-Stack Developer
              </div>
              <div className="p-icons" aria-hidden="true">
                {["fab fa-github","fab fa-instagram","fab fa-linkedin","fab fa-spotify"].map((ic,i)=>(
                  <div key={i} className="p-icon"><i className={ic} /></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" className="section" aria-labelledby="feat-h">
          <div className="sec-eye">What you get</div>
          <h2 className="sec-h" id="feat-h">Everything in <em>one profile</em></h2>
          <p className="sec-sub">All the tools to show the world who you are — wrapped in a single, shareable link.</p>
          <div className="feat-grid" role="list">
            {features.map((f, i) => (
              <article key={i} className="feat-card" role="listitem">
                <div className="feat-icon" aria-hidden="true"><i className={f.icon} /></div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* STEPS */}
        <section className="section" aria-labelledby="steps-h">
          <div className="sec-eye">How it works</div>
          <h2 className="sec-h" id="steps-h">Up and running in <em>3 steps</em></h2>
          <p className="sec-sub">No form to fill. No email to confirm. Just build and share.</p>
          <div className="steps-wrap" role="list">
            {steps.map((s, i) => (
              <div key={i} className="step" role="listitem">
                <div className="step-n" aria-hidden="true">{s.n}</div>
                <div>
                  <h3 className="step-t">{s.t}</h3>
                  <p className="step-d">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* FAQ */}
        <section className="section" aria-labelledby="faq-h">
          <div className="sec-eye">FAQ</div>
          <h2 className="sec-h" id="faq-h">Common <em>questions</em></h2>
          <p className="sec-sub">Straight answers, no fluff.</p>
          <div className="faq-list" role="list">
            {faqs.map((f, i) => (
              <div key={i} className="faq-item" role="listitem"
                itemScope itemType="https://schema.org/Question">
                <div className="faq-q" itemProp="name">
                  {f.q}
                  <i className="fas fa-plus" aria-hidden="true" />
                </div>
                <div className="faq-a"
                  itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <span itemProp="text">{f.a}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" aria-hidden="true" />

        {/* BOTTOM CTA */}
        <section className="section" aria-labelledby="cta-h">
          <div className="cta-box">
            <div className="cta-serif" aria-hidden="true">&ldquo;</div>
            <h2 className="cta-t" id="cta-h">
              Your profile,<br /><em>your way</em>
            </h2>
            <p className="cta-d">
              No account. No email. Open on any device, build your page, and share your link — done.
            </p>
            <div className="cta-url">linkitin.site/<strong>you</strong></div>
            <br />
            <a href="/create" className="btn-main" style={{ display: "inline-flex" }}>
              <i className="fas fa-rocket" style={{ fontSize: 13 }} aria-hidden="true" />
              Create for Free
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer role="contentinfo">
        <div className="ft-logo">link<b>i</b>tin</div>
        <div className="ft-dev">Developed by <strong>Samartha GS</strong></div>
        <div className="ft-links">
          <a href="/">© {new Date().getFullYear()} linkitin</a>
          <span className="ft-sep">·</span>
          <a href="https://linkitin.site/samarthags">Demo profile</a>
          <span className="ft-sep">·</span>
          <a href="/create">Create Profile</a>
        </div>
      </footer>
    </>
  );
}
