// pages/[username].js
import Head from "next/head";
import clientPromise from "../lib/mongodb";

const PLATFORMS = {
  email:        { icon:"fas fa-envelope",      color:"#EA4335", bg:"rgba(234,67,53,0.12)",  url:(v)=>`mailto:${v}`,                                    label:"Email" },
  whatsapp:     { icon:"fab fa-whatsapp",       color:"#25D366", bg:"rgba(37,211,102,0.12)", url:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,            label:"WhatsApp" },
  instagram:    { icon:"fab fa-instagram",      color:"#E4405F", bg:"rgba(228,64,95,0.12)",  url:(v)=>`https://instagram.com/${v.replace("@","")}`,      label:"Instagram" },
  facebook:     { icon:"fab fa-facebook-f",     color:"#1877F2", bg:"rgba(24,119,242,0.12)", url:(v)=>`https://facebook.com/${v}`,                       label:"Facebook" },
  github:       { icon:"fab fa-github",         color:"#24292e", bg:"rgba(36,41,46,0.1)",    url:(v)=>`https://github.com/${v}`,                         label:"GitHub" },
  snapchat:     { icon:"fab fa-snapchat",       color:"#b8a000", bg:"rgba(255,252,0,0.15)",  url:(v)=>`https://snapchat.com/add/${v}`,                   label:"Snapchat" },
  youtube:      { icon:"fab fa-youtube",        color:"#FF0000", bg:"rgba(255,0,0,0.1)",     url:(v)=>`https://youtube.com/${v}`,                        label:"YouTube" },
  twitter:      { icon:"fab fa-x-twitter",      color:"#000",    bg:"rgba(0,0,0,0.08)",      url:(v)=>`https://twitter.com/${v.replace("@","")}`,        label:"Twitter" },
  linkedin:     { icon:"fab fa-linkedin-in",    color:"#0A66C2", bg:"rgba(10,102,194,0.12)", url:(v)=>`https://linkedin.com/in/${v}`,                    label:"LinkedIn" },
  tiktok:       { icon:"fab fa-tiktok",         color:"#010101", bg:"rgba(0,0,0,0.08)",      url:(v)=>`https://tiktok.com/@${v.replace("@","")}`,        label:"TikTok" },
  discord:      { icon:"fab fa-discord",        color:"#5865F2", bg:"rgba(88,101,242,0.12)", url:(v)=>`https://discord.com/users/${v}`,                  label:"Discord" },
  telegram:     { icon:"fab fa-telegram",       color:"#26A5E4", bg:"rgba(38,165,228,0.12)", url:(v)=>`https://t.me/${v.replace("@","")}`,               label:"Telegram" },
  twitch:       { icon:"fab fa-twitch",         color:"#9146FF", bg:"rgba(145,70,255,0.12)", url:(v)=>`https://twitch.tv/${v}`,                          label:"Twitch" },
  spotify:      { icon:"fab fa-spotify",        color:"#1DB954", bg:"rgba(29,185,84,0.12)",  url:(v)=>`https://open.spotify.com/user/${v}`,              label:"Spotify" },
  pinterest:    { icon:"fab fa-pinterest",      color:"#E60023", bg:"rgba(230,0,35,0.1)",    url:(v)=>`https://pinterest.com/${v}`,                      label:"Pinterest" },
  reddit:       { icon:"fab fa-reddit-alien",   color:"#FF4500", bg:"rgba(255,69,0,0.1)",    url:(v)=>`https://reddit.com/user/${v}`,                    label:"Reddit" },
  medium:       { icon:"fab fa-medium",         color:"#000",    bg:"rgba(0,0,0,0.08)",      url:(v)=>`https://medium.com/${v.replace("@","")}`,         label:"Medium" },
  devto:        { icon:"fab fa-dev",            color:"#0a0a0a", bg:"rgba(0,0,0,0.08)",      url:(v)=>`https://dev.to/${v}`,                             label:"DEV.to" },
  behance:      { icon:"fab fa-behance",        color:"#1769FF", bg:"rgba(23,105,255,0.12)", url:(v)=>`https://behance.net/${v}`,                        label:"Behance" },
  dribbble:     { icon:"fab fa-dribbble",       color:"#ea4c89", bg:"rgba(234,76,137,0.12)", url:(v)=>`https://dribbble.com/${v}`,                       label:"Dribbble" },
  threads:      { icon:"fab fa-threads",        color:"#000",    bg:"rgba(0,0,0,0.08)",      url:(v)=>`https://threads.net/${v.replace("@","")}`,        label:"Threads" },
  bluesky:      { icon:"fas fa-cloud",          color:"#1185FE", bg:"rgba(17,133,254,0.12)", url:(v)=>`https://bsky.app/profile/${v.replace("@","")}`,   label:"Bluesky" },
  npm:          { icon:"fab fa-npm",            color:"#CC3534", bg:"rgba(204,53,52,0.1)",   url:(v)=>`https://npmjs.com/~${v.replace("~","")}`,         label:"npm" },
  codepen:      { icon:"fab fa-codepen",        color:"#111",    bg:"rgba(0,0,0,0.08)",      url:(v)=>`https://codepen.io/${v}`,                         label:"CodePen" },
  stackoverflow:{ icon:"fab fa-stack-overflow", color:"#F58025", bg:"rgba(245,128,37,0.12)", url:(v)=>`https://stackoverflow.com/users/${v}`,            label:"Stack Overflow" },
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
          <style>{`body{margin:0;font-family:'Plus Jakarta Sans',sans-serif;background:#f4f5f9;}`}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#fef2f2,#fff0f0)",border:"2px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash" />
          </div>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,fontSize:15,lineHeight:1.6}}>This username doesn't exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"12px 28px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:15,display:"inline-flex",alignItems:"center",gap:9,boxShadow:"0 4px 18px rgba(108,99,255,0.3)"}}>
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

  return (
    <>
      <Head>
        <title>{user.name} (@{user.username})</title>
        <meta name="description" content={user.aboutme || user.bio || `${user.name}'s profile`} />
        {user.avatar && <meta property="og:image" content={user.avatar} />}
        <meta property="og:title"       content={`${user.name} — mywebsam`} />
        <meta property="og:description" content={user.aboutme || user.bio || ""} />
        <meta name="twitter:card"       content="summary" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html{scroll-behavior:smooth;}
          body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f2f7;color:#111827;-webkit-font-smoothing:antialiased;min-height:100vh;}
          a{text-decoration:none;}

          @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
          @keyframes scaleIn{from{opacity:0;transform:scale(0.9);}to{opacity:1;transform:scale(1);}}
          @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}

          /* ── Layout ── */
          .page{max-width:480px;margin:0 auto;padding:0 0 60px;}

          /* ── Hero section ── */
          .hero{position:relative;margin-bottom:0;}
          .banner{height:160px;background:linear-gradient(135deg,#6C63FF 0%,#a78bfa 50%,#10b981 100%);position:relative;overflow:hidden;}
          .banner::after{content:"";position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
          .banner img{width:100%;height:100%;object-fit:cover;display:block;}

          /* ── Profile card ── */
          .profile-card{background:#fff;border-radius:0 0 24px 24px;padding:0 20px 24px;position:relative;box-shadow:0 4px 24px rgba(0,0,0,0.07);}

          /* ── Avatar ── */
          .av-wrap{display:flex;justify-content:space-between;align-items:flex-end;padding-top:0;margin-top:-52px;margin-bottom:14px;}
          .av-img{width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 4px 20px rgba(0,0,0,0.15);flex-shrink:0;}
          .av-ph{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#a78bfa);border:4px solid #fff;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff;font-weight:800;flex-shrink:0;}

          /* ── Create profile button (top right of avatar row) ── */
          .create-btn{background:#f4f5f9;border:1.5px solid #e9eaf0;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;color:#6b7280;display:flex;align-items:center;gap:6px;cursor:pointer;transition:all .15s;font-family:inherit;}
          .create-btn:hover{background:#f0edff;border-color:#6C63FF;color:#6C63FF;}

          /* ── Info ── */
          .name{font-size:22px;font-weight:800;color:#111827;margin-bottom:2px;line-height:1.2;}
          .handle{font-size:13px;color:#6C63FF;font-weight:600;margin-bottom:10px;}
          .meta-row{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px;}
          .meta-item{font-size:12.5px;color:#6b7280;display:flex;align-items:center;gap:5px;}
          .bio{font-size:14px;color:#374151;line-height:1.75;}

          /* ── Section ── */
          .section{padding:20px 20px 0;}
          .section-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9ca3af;margin-bottom:14px;display:flex;align-items:center;gap:7px;}
          .section-title::after{content:"";flex:1;height:1px;background:#f0f0f5;}

          /* ── Social grid ── */
          .soc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:10px;}
          .soc-item{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;text-decoration:none;transition:transform .15s;}
          .soc-item:hover{transform:translateY(-3px);}
          .soc-item:hover .soc-icon{box-shadow:0 6px 18px rgba(0,0,0,0.14);}
          .soc-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;transition:box-shadow .15s;}
          .soc-label{font-size:10px;font-weight:600;color:#9ca3af;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:56px;}

          /* ── Links ── */
          .links-list{display:flex;flex-direction:column;gap:10px;}
          .link-item{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#fff;border:1.5px solid #e9eaf0;border-radius:14px;color:#111827;font-weight:600;font-size:14px;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
          .link-item:hover{border-color:#c4b5fd;background:#f8f7ff;transform:translateY(-2px);box-shadow:0 6px 20px rgba(108,99,255,0.12);}
          .link-ico{width:36px;height:36px;border-radius:10px;background:#f0edff;color:#6C63FF;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
          .link-arrow{margin-left:auto;color:#c4b5fd;font-size:13px;transition:transform .15s;}
          .link-item:hover .link-arrow{transform:translateX(3px);color:#6C63FF;}

          /* ── Footer ── */
          .page-footer{text-align:center;padding:28px 0 0;font-size:12px;color:#b0b7c3;}
          .page-footer a{color:#6C63FF;font-weight:700;}
          .page-footer a:hover{text-decoration:underline;}

          /* ── Interests tags ── */
          .tags-wrap{display:flex;flex-wrap:wrap;gap:7px;}
          .int-tag{display:inline-flex;align-items:center;padding:5px 12px;background:#f4f5f9;border-radius:999px;font-size:12px;font-weight:600;color:#6b7280;}

          @keyframes fadeUpCard{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
          .profile-card{animation:fadeUpCard .4s ease both;}
          .section{animation:fadeUpCard .45s ease both;}

          @media(max-width:480px){
            .page{padding:0 0 48px;}
            .banner{height:130px;}
            .av-img,.av-ph{width:86px;height:86px;font-size:34px;}
            .soc-icon{width:44px;height:44px;font-size:18px;border-radius:12px;}
            .soc-label{font-size:9px;max-width:48px;}
            .section{padding:16px 16px 0;}
            .profile-card{padding:0 16px 20px;}
          }
        `}</style>
      </Head>

      <div className="page">
        <div className="hero">
          {/* Banner */}
          <div className="banner">
            {user.banner && <img src={user.banner} alt="" />}
          </div>

          {/* Profile card */}
          <div className="profile-card">
            {/* Avatar row */}
            <div className="av-wrap">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="av-img" />
                : <div className="av-ph">{user.name?.charAt(0)?.toUpperCase() || "?"}</div>}
              <a href="/" className="create-btn">
                <i className="fas fa-plus" /> Get yours
              </a>
            </div>

            {/* Name & handle */}
            <div className="name">{user.name}</div>
            <div className="handle">@{user.username}</div>

            {/* Meta */}
            {(user.location || age) && (
              <div className="meta-row">
                {user.location && (
                  <span className="meta-item">
                    <i className="fas fa-location-dot" style={{color:"#6C63FF"}} />
                    {user.location}
                  </span>
                )}
                {age && (
                  <span className="meta-item">
                    <i className="fas fa-cake-candles" style={{color:"#f59e0b"}} />
                    {age} years old
                  </span>
                )}
              </div>
            )}

            {/* Bio */}
            {(user.aboutme || user.bio) && (
              <p className="bio">{user.aboutme || user.bio}</p>
            )}
          </div>
        </div>

        {/* Social icons */}
        {filledSocials.length > 0 && (
          <div className="section">
            <div className="section-title">
              <i className="fas fa-share-nodes" style={{color:"#6C63FF"}} />
              Find me on
            </div>
            <div className="soc-grid">
              {filledSocials.map(([platform, value]) => {
                const p = PLATFORMS[platform];
                return (
                  <a key={platform}
                    href={p.url(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soc-item"
                    title={p.label}>
                    <div className="soc-icon" style={{background:p.bg, color:p.color}}>
                      <i className={p.icon} />
                    </div>
                    <span className="soc-label">{p.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom links */}
        {(user.links || []).length > 0 && (
          <div className="section">
            <div className="section-title">
              <i className="fas fa-link" style={{color:"#6C63FF"}} />
              My Links
            </div>
            <div className="links-list">
              {user.links.map((link, i) => (
                <a key={link.id || i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-item">
                  <div className="link-ico">
                    <i className={link.icon || "fas fa-link"} />
                  </div>
                  <span>{link.title}</span>
                  <i className="fas fa-arrow-right link-arrow" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {user.interests && Object.values(user.interests).flat().filter(Boolean).length > 0 && (
          <div className="section">
            <div className="section-title">
              <i className="fas fa-heart" style={{color:"#ef4444"}} />
              Interests
            </div>
            <div className="tags-wrap">
              {Object.values(user.interests).flat().filter(v => v && typeof v === "string").slice(0, 20).map((tag, i) => (
                <span key={i} className="int-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="page-footer">
          <div style={{marginBottom:8}}>
            <a href={`https://mywebsammu.vercel.app`}>
              <span style={{fontWeight:800,fontSize:14,color:"#6C63FF"}}>mywebsam</span>
            </a>
          </div>
          Your link in bio — <a href="/">Create yours free</a>
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
