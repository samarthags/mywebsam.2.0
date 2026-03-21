// pages/[username].js
import Head from "next/head";
import clientPromise from "../lib/mongodb";

const PLATFORMS = {
  email:        { icon:"fas fa-envelope",      color:"#EA4335", bg:"rgba(234,67,53,0.1)",   url:(v)=>`mailto:${v}` },
  whatsapp:     { icon:"fab fa-whatsapp",       color:"#25D366", bg:"rgba(37,211,102,0.1)",  url:(v)=>`https://wa.me/${v.replace(/\D/g,"")}` },
  instagram:    { icon:"fab fa-instagram",      color:"#E4405F", bg:"rgba(228,64,95,0.1)",   url:(v)=>`https://instagram.com/${v.replace("@","")}` },
  facebook:     { icon:"fab fa-facebook-f",     color:"#1877F2", bg:"rgba(24,119,242,0.1)",  url:(v)=>`https://facebook.com/${v}` },
  github:       { icon:"fab fa-github",         color:"#24292e", bg:"rgba(36,41,46,0.08)",   url:(v)=>`https://github.com/${v}` },
  snapchat:     { icon:"fab fa-snapchat",       color:"#c9a800", bg:"rgba(255,252,0,0.12)",  url:(v)=>`https://snapchat.com/add/${v}` },
  youtube:      { icon:"fab fa-youtube",        color:"#FF0000", bg:"rgba(255,0,0,0.1)",     url:(v)=>`https://youtube.com/${v}` },
  twitter:      { icon:"fab fa-x-twitter",      color:"#000",    bg:"rgba(0,0,0,0.07)",      url:(v)=>`https://twitter.com/${v.replace("@","")}` },
  linkedin:     { icon:"fab fa-linkedin-in",    color:"#0A66C2", bg:"rgba(10,102,194,0.1)",  url:(v)=>`https://linkedin.com/in/${v}` },
  tiktok:       { icon:"fab fa-tiktok",         color:"#010101", bg:"rgba(0,0,0,0.07)",      url:(v)=>`https://tiktok.com/@${v.replace("@","")}` },
  discord:      { icon:"fab fa-discord",        color:"#5865F2", bg:"rgba(88,101,242,0.1)",  url:(v)=>`https://discord.com/users/${v}` },
  telegram:     { icon:"fab fa-telegram",       color:"#26A5E4", bg:"rgba(38,165,228,0.1)",  url:(v)=>`https://t.me/${v.replace("@","")}` },
  twitch:       { icon:"fab fa-twitch",         color:"#9146FF", bg:"rgba(145,70,255,0.1)",  url:(v)=>`https://twitch.tv/${v}` },
  spotify:      { icon:"fab fa-spotify",        color:"#1DB954", bg:"rgba(29,185,84,0.1)",   url:(v)=>`https://open.spotify.com/user/${v}` },
  medium:       { icon:"fab fa-medium",         color:"#000",    bg:"rgba(0,0,0,0.07)",      url:(v)=>`https://medium.com/${v.replace("@","")}` },
  devto:        { icon:"fab fa-dev",            color:"#0a0a0a", bg:"rgba(0,0,0,0.07)",      url:(v)=>`https://dev.to/${v}` },
  behance:      { icon:"fab fa-behance",        color:"#1769FF", bg:"rgba(23,105,255,0.1)",  url:(v)=>`https://behance.net/${v}` },
  dribbble:     { icon:"fab fa-dribbble",       color:"#ea4c89", bg:"rgba(234,76,137,0.1)",  url:(v)=>`https://dribbble.com/${v}` },
  pinterest:    { icon:"fab fa-pinterest",      color:"#E60023", bg:"rgba(230,0,35,0.1)",    url:(v)=>`https://pinterest.com/${v}` },
  reddit:       { icon:"fab fa-reddit-alien",   color:"#FF4500", bg:"rgba(255,69,0,0.1)",    url:(v)=>`https://reddit.com/user/${v}` },
  threads:      { icon:"fab fa-threads",        color:"#000",    bg:"rgba(0,0,0,0.07)",      url:(v)=>`https://threads.net/${v.replace("@","")}` },
  bluesky:      { icon:"fas fa-cloud",          color:"#1185FE", bg:"rgba(17,133,254,0.1)",  url:(v)=>`https://bsky.app/profile/${v.replace("@","")}` },
  npm:          { icon:"fab fa-npm",            color:"#CC3534", bg:"rgba(204,53,52,0.1)",   url:(v)=>`https://npmjs.com/~${v.replace("~","")}` },
  codepen:      { icon:"fab fa-codepen",        color:"#111",    bg:"rgba(0,0,0,0.07)",      url:(v)=>`https://codepen.io/${v}` },
  stackoverflow:{ icon:"fab fa-stack-overflow", color:"#F58025", bg:"rgba(245,128,37,0.1)",  url:(v)=>`https://stackoverflow.com/users/${v}` },
};

function calcAge(dob) {
  if (!dob) return null;
  const today = new Date(), b = new Date(dob);
  let age = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() ||
     (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
  return age > 0 ? age : null;
}

export default function ProfilePage({ user }) {
  if (!user) {
    return (
      <>
        <Head>
          <title>Not found — mywebsam</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",background:"#f4f5f9",
          fontFamily:"'Plus Jakarta Sans',sans-serif",padding:24,textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#fef2f2",display:"flex",
            alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:28,color:"#ef4444"}}>
            <i className="fas fa-user-slash" />
          </div>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:24}}>
            This username hasn't created a profile yet.
          </p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"11px 24px",
            borderRadius:10,textDecoration:"none",fontWeight:600,fontSize:14,
            display:"inline-flex",alignItems:"center",gap:8}}>
            <i className="fas fa-plus" /> Create Your Profile
          </a>
        </div>
      </>
    );
  }

  const age = calcAge(user.dob);
  const filledSocials = Object.entries(user.socialProfiles || {})
    .filter(([, v]) => v?.trim())
    .filter(([k]) => PLATFORMS[k]);

  const host = typeof window !== "undefined" ? window.location.origin : "https://mywebsammu.vercel.app";
  const pageUrl = `${host}/${user.username}`;

  return (
    <>
      <Head>
        <title>{user.name} (@{user.username})</title>
        <meta name="description" content={user.aboutme || user.bio || `${user.name}'s profile`} />
        {user.avatar && <meta property="og:image" content={user.avatar} />}
        <meta property="og:title"       content={`${user.name} — mywebsam`} />
        <meta property="og:description" content={user.aboutme || user.bio || ""} />
        <meta property="og:url"         content={pageUrl} />
        <meta name="twitter:card"       content="summary" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f5f9;color:#111827;-webkit-font-smoothing:antialiased;}
          a{text-decoration:none;}
          @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
          .wrap{max-width:520px;margin:0 auto;padding:28px 14px 56px;animation:fadeUp .4s ease both;}
          .card{background:#fff;border:1.5px solid #e9eaf0;border-radius:20px;overflow:hidden;}
          .banner{height:130px;background:linear-gradient(135deg,#6C63FF 0%,#a78bfa 100%);}
          .banner img{width:100%;height:100%;object-fit:cover;display:block;}
          .av-wrap{display:flex;justify-content:center;margin-top:-50px;padding:0 20px;}
          .av-img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,.12);}
          .av-ph{width:96px;height:96px;border-radius:50%;background:#6C63FF;border:4px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;font-size:38px;color:#fff;font-weight:800;}
          .info{text-align:center;padding:12px 24px 22px;}
          .info-name{font-size:22px;font-weight:800;color:#111827;margin-bottom:3px;}
          .info-handle{font-size:13px;color:#6C63FF;font-weight:600;margin-bottom:10px;}
          .info-meta{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin-bottom:14px;}
          .info-meta span{font-size:12.5px;color:#6b7280;display:flex;align-items:center;gap:5px;}
          .info-bio{font-size:14px;color:#374151;line-height:1.75;max-width:380px;margin:0 auto;}
          .sec{padding:0 20px 20px;}
          .sec-title{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:12px;}
          .soc-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
          .soc-btn{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;transition:transform .15s,box-shadow .15s;}
          .soc-btn:hover{transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,.12);}
          .link-btn{display:flex;align-items:center;gap:12px;padding:13px 16px;background:#f8f7ff;border:1.5px solid #ede9ff;border-radius:12px;color:#111827;font-weight:600;font-size:14px;transition:all .15s;margin-bottom:10px;}
          .link-btn:last-child{margin-bottom:0;}
          .link-btn:hover{background:#f0edff;border-color:#6C63FF;transform:translateY(-1px);box-shadow:0 4px 14px rgba(108,99,255,.14);}
          .link-ico{width:32px;height:32px;border-radius:8px;background:#f0edff;color:#6C63FF;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
          .link-arrow{margin-left:auto;color:#b0b7c3;font-size:12px;}
          .footer{text-align:center;padding:18px 0 0;font-size:12px;color:#9ca3af;}
          .footer a{color:#6C63FF;font-weight:600;}
          @media(max-width:480px){
            .wrap{padding:16px 10px 48px;}
            .info{padding:10px 14px 18px;}
            .soc-btn{width:44px;height:44px;font-size:17px;border-radius:11px;}
          }
        `}</style>
      </Head>

      <div className="wrap">
        <div className="card">

          {/* Banner */}
          <div className="banner">
            {user.banner && <img src={user.banner} alt="" />}
          </div>

          {/* Avatar */}
          <div className="av-wrap">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="av-img" />
              : <div className="av-ph">{user.name?.charAt(0)?.toUpperCase() || "?"}</div>}
          </div>

          {/* Info */}
          <div className="info">
            <div className="info-name">{user.name}</div>
            <div className="info-handle">@{user.username}</div>
            {(user.location || age) && (
              <div className="info-meta">
                {user.location && (
                  <span><i className="fas fa-location-dot" />{user.location}</span>
                )}
                {age && (
                  <span><i className="fas fa-cake-candles" />{age} years old</span>
                )}
              </div>
            )}
            {(user.aboutme || user.bio) && (
              <p className="info-bio">{user.aboutme || user.bio}</p>
            )}
          </div>

          {/* Social icons */}
          {filledSocials.length > 0 && (
            <div className="sec">
              <div className="sec-title">Find me on</div>
              <div className="soc-grid">
                {filledSocials.map(([platform, value]) => {
                  const p = PLATFORMS[platform];
                  return (
                    <a key={platform}
                      href={p.url(value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="soc-btn"
                      style={{background: p.bg, color: p.color}}
                      title={platform}>
                      <i className={p.icon} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom links */}
          {(user.links || []).length > 0 && (
            <div className="sec">
              {filledSocials.length > 0 && (
                <div className="sec-title">My Links</div>
              )}
              {user.links.map((link, i) => (
                <a key={link.id || i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn">
                  <div className="link-ico">
                    <i className={link.icon || "fas fa-link"} />
                  </div>
                  <span>{link.title}</span>
                  <i className="fas fa-arrow-right link-arrow" />
                </a>
              ))}
            </div>
          )}

        </div>

        <div className="footer">
          Powered by <a href="/">mywebsam</a>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne(
      { username: params.username.toLowerCase() },
      { projection: { _id: 0 } }
    );

    if (!user) return { props: { user: null } };

    return {
      props: {
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
        }))
      }
    };
  } catch (err) {
    console.error("[username page]", err);
    return { props: { user: null } };
  }
}
