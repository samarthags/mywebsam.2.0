// pages/[username].js
import Head from "next/head";
import clientPromise from "../lib/mongodb";

const PLATFORMS = {
  email:        { icon:"fas fa-envelope",      color:"#EA4335", url:(v)=>`mailto:${v}`,                                  label:"Email" },
  whatsapp:     { icon:"fab fa-whatsapp",       color:"#25D366", url:(v)=>`https://wa.me/${v.replace(/\D/g,"")}`,        label:"WhatsApp" },
  instagram:    { icon:"fab fa-instagram",      color:"#E4405F", url:(v)=>`https://instagram.com/${v.replace("@","")}`,  label:"Instagram" },
  facebook:     { icon:"fab fa-facebook-f",     color:"#1877F2", url:(v)=>`https://facebook.com/${v}`,                   label:"Facebook" },
  github:       { icon:"fab fa-github",         color:"#e6edf3", url:(v)=>`https://github.com/${v}`,                     label:"GitHub" },
  snapchat:     { icon:"fab fa-snapchat",       color:"#FFFC00", url:(v)=>`https://snapchat.com/add/${v}`,               label:"Snapchat" },
  youtube:      { icon:"fab fa-youtube",        color:"#FF0000", url:(v)=>`https://youtube.com/${v}`,                    label:"YouTube" },
  twitter:      { icon:"fab fa-x-twitter",      color:"#fff",    url:(v)=>`https://twitter.com/${v.replace("@","")}`,    label:"Twitter" },
  linkedin:     { icon:"fab fa-linkedin-in",    color:"#0A66C2", url:(v)=>`https://linkedin.com/in/${v}`,                label:"LinkedIn" },
  tiktok:       { icon:"fab fa-tiktok",         color:"#fff",    url:(v)=>`https://tiktok.com/@${v.replace("@","")}`,   label:"TikTok" },
  discord:      { icon:"fab fa-discord",        color:"#5865F2", url:(v)=>`https://discord.com/users/${v}`,              label:"Discord" },
  telegram:     { icon:"fab fa-telegram",       color:"#26A5E4", url:(v)=>`https://t.me/${v.replace("@","")}`,           label:"Telegram" },
  twitch:       { icon:"fab fa-twitch",         color:"#9146FF", url:(v)=>`https://twitch.tv/${v}`,                      label:"Twitch" },
  spotify:      { icon:"fab fa-spotify",        color:"#1DB954", url:(v)=>`https://open.spotify.com/user/${v}`,          label:"Spotify" },
  pinterest:    { icon:"fab fa-pinterest",      color:"#E60023", url:(v)=>`https://pinterest.com/${v}`,                  label:"Pinterest" },
  reddit:       { icon:"fab fa-reddit-alien",   color:"#FF4500", url:(v)=>`https://reddit.com/user/${v}`,                label:"Reddit" },
  medium:       { icon:"fab fa-medium",         color:"#fff",    url:(v)=>`https://medium.com/${v.replace("@","")}`,     label:"Medium" },
  devto:        { icon:"fab fa-dev",            color:"#fff",    url:(v)=>`https://dev.to/${v}`,                         label:"DEV.to" },
  behance:      { icon:"fab fa-behance",        color:"#1769FF", url:(v)=>`https://behance.net/${v}`,                    label:"Behance" },
  dribbble:     { icon:"fab fa-dribbble",       color:"#ea4c89", url:(v)=>`https://dribbble.com/${v}`,                   label:"Dribbble" },
  threads:      { icon:"fab fa-threads",        color:"#fff",    url:(v)=>`https://threads.net/${v.replace("@","")}`,    label:"Threads" },
  bluesky:      { icon:"fas fa-cloud",          color:"#1185FE", url:(v)=>`https://bsky.app/profile/${v.replace("@","")}`,label:"Bluesky" },
  npm:          { icon:"fab fa-npm",            color:"#CC3534", url:(v)=>`https://npmjs.com/~${v.replace("~","")}`,     label:"npm" },
  codepen:      { icon:"fab fa-codepen",        color:"#fff",    url:(v)=>`https://codepen.io/${v}`,                     label:"CodePen" },
  stackoverflow:{ icon:"fab fa-stack-overflow", color:"#F58025", url:(v)=>`https://stackoverflow.com/users/${v}`,        label:"Stack Overflow" },
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
          <style>{`
            *{box-sizing:border-box;margin:0;padding:0;}
            body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f5f9;color:#111827;}
          `}</style>
        </Head>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"#fef2f2",border:"2px solid #fca5a5",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,fontSize:32,color:"#ef4444"}}>
            <i className="fas fa-user-slash" />
          </div>
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:8,color:"#111827"}}>Profile Not Found</h1>
          <p style={{color:"#6b7280",marginBottom:28,fontSize:15,lineHeight:1.6}}>This username does not exist yet.</p>
          <a href="/" style={{background:"#6C63FF",color:"#fff",padding:"13px 28px",borderRadius:999,fontWeight:700,fontSize:15,display:"inline-flex",alignItems:"center",gap:9,boxShadow:"0 4px 18px rgba(108,99,255,0.3)",textDecoration:"none"}}>
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
  const interestTags = Object.values(user.interests || {})
    .flat().filter(v => v && typeof v === "string").slice(0, 18);

  return (
    <>
      <Head>
        <title>{user.name} (@{user.username})</title>
        <meta name="description" content={user.aboutme || user.bio || `${user.name} on mywebsam`} />
        {user.avatar && <meta property="og:image" content={user.avatar} />}
        <meta property="og:title"       content={`${user.name} — mywebsam`} />
        <meta property="og:description" content={user.aboutme || user.bio || ""} />
        <meta name="viewport"           content="width=device-width,initial-scale=1" />
        <meta name="twitter:card"       content="summary_large_image" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{min-height:100%;-webkit-font-smoothing:antialiased;font-family:'Plus Jakarta Sans',sans-serif;}
          a{text-decoration:none;color:inherit;}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
          @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
          .fu{animation:fadeUp .38s cubic-bezier(.22,.68,0,1.15) both;}
          .fu2{animation:fadeUp .42s .07s cubic-bezier(.22,.68,0,1.15) both;}
          .fu3{animation:fadeUp .46s .14s cubic-bezier(.22,.68,0,1.15) both;}

          /* ── Full-page background ── */
          body{background:linear-gradient(160deg,#12122a 0%,#1a1040 40%,#0d2b4e 100%);color:#fff;}

          /* ── Banner ── */
          .banner{width:100%;height:220px;position:relative;overflow:hidden;}
          .banner img{width:100%;height:100%;object-fit:cover;display:block;}
          .banner-grad{position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(to bottom,transparent,rgba(18,18,42,0.85));}

          /* ── Page wrapper ── */
          .page{max-width:500px;margin:0 auto;padding:0 16px 80px;}

          /* ── Avatar ── */
          .avatar-wrap{display:flex;flex-direction:column;align-items:center;margin-top:-56px;position:relative;z-index:5;margin-bottom:14px;}
          .av{width:112px;height:112px;border-radius:50%;border:4px solid rgba(255,255,255,0.85);box-shadow:0 8px 32px rgba(0,0,0,0.4);overflow:hidden;background:linear-gradient(135deg,#6C63FF,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:800;color:#fff;flex-shrink:0;}
          .av img{width:100%;height:100%;object-fit:cover;display:block;}

          /* ── Identity ── */
          .id-block{text-align:center;margin-bottom:22px;}
          .pname{font-size:26px;font-weight:800;color:#fff;margin-bottom:4px;text-shadow:0 2px 10px rgba(0,0,0,0.4);}
          .phandle{font-size:13px;color:rgba(255,255,255,0.55);font-weight:500;margin-bottom:12px;}
          .meta-pills{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
          .mpill{display:flex;align-items:center;gap:5px;font-size:12px;color:rgba(255,255,255,0.75);background:rgba(255,255,255,0.1);padding:5px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.15);}
          .pbio{font-size:14px;color:rgba(255,255,255,0.78);line-height:1.75;text-align:center;max-width:340px;margin:0 auto;}

          /* ── Social icons — row of circles ── */
          .soc-row{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-bottom:28px;}
          .soc-btn{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);transition:transform .15s,box-shadow .15s,background .15s;}
          .soc-btn:hover{transform:translateY(-3px) scale(1.1);background:rgba(255,255,255,0.22);box-shadow:0 8px 24px rgba(0,0,0,0.3);}

          /* ── Links — full width pill buttons exactly like Linktree ── */
          .links{display:flex;flex-direction:column;gap:12px;margin-bottom:28px;}
          .lpill{
            display:flex;align-items:center;
            width:100%;padding:0;
            background:rgba(255,255,255,0.14);
            border:1.5px solid rgba(255,255,255,0.2);
            border-radius:999px;
            color:#fff;font-weight:700;font-size:15px;
            font-family:'Plus Jakarta Sans',sans-serif;
            cursor:pointer;overflow:hidden;
            transition:transform .16s,background .16s,box-shadow .16s;
            position:relative;
          }
          .lpill:hover{transform:scale(1.025);background:rgba(255,255,255,0.22);box-shadow:0 10px 30px rgba(0,0,0,0.25);}
          .lpill:active{transform:scale(0.98);}
          .lpill-left{width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.12);font-size:16px;flex-shrink:0;}
          .lpill-text{flex:1;text-align:center;padding:0 16px;}
          .lpill-right{width:44px;height:56px;display:flex;align-items:center;justify-content:center;font-size:12px;color:rgba(255,255,255,0.4);flex-shrink:0;}

          /* ── Spotify embed ── */
          .sp-wrap{margin-bottom:28px;}
          .sp-label{text-align:center;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px;}
          .sp-frame{border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.35);}

          /* ── Interests ── */
          .int-wrap{margin-bottom:28px;}
          .int-label{text-align:center;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px;}
          .int-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;}
          .itag{padding:6px 14px;border-radius:999px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.82);background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.16);}

          /* ── Footer ── */
          .pfooter{text-align:center;font-size:12px;color:rgba(255,255,255,0.3);padding:8px 0;}
          .pfooter a{color:rgba(255,255,255,0.55);font-weight:700;}
          .pfooter a:hover{color:#fff;}
          .pfooter-logo{display:inline-flex;align-items:center;gap:6px;margin-bottom:5px;}

          @media(max-width:460px){
            .banner{height:170px;}
            .av{width:96px;height:96px;font-size:36px;}
            .pname{font-size:22px;}
            .lpill-text{font-size:14px;}
          }
        `}</style>
      </Head>

      {/* Banner — full width */}
      {user.banner && (
        <div className="banner">
          <img src={user.banner} alt="" />
          <div className="banner-grad" />
        </div>
      )}

      {/* If no banner, spacer */}
      {!user.banner && <div style={{height:60}} />}

      <div className="page">

        {/* Avatar */}
        <div className="avatar-wrap fu">
          <div className="av">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} />
              : user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        </div>

        {/* Name, handle, meta, bio */}
        <div className="id-block fu2">
          <div className="pname">{user.name}</div>
          <div className="phandle">@{user.username}</div>

          {(user.location || age) && (
            <div className="meta-pills">
              {user.location && (
                <span className="mpill">
                  <i className="fas fa-location-dot" style={{fontSize:10}} />
                  {user.location}
                </span>
              )}
              {age && (
                <span className="mpill">
                  <i className="fas fa-cake-candles" style={{fontSize:10}} />
                  {age} years old
                </span>
              )}
            </div>
          )}

          {(user.aboutme || user.bio) && (
            <p className="pbio">{user.aboutme || user.bio}</p>
          )}
        </div>

        {/* Social icons — circle row */}
        {filledSocials.length > 0 && (
          <div className="soc-row fu3">
            {filledSocials.map(([platform, value]) => {
              const p = PLATFORMS[platform];
              return (
                <a key={platform}
                  href={p.url(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soc-btn"
                  title={p.label}
                  style={{color: p.color}}>
                  <i className={p.icon} />
                </a>
              );
            })}
          </div>
        )}

        {/* Links — full width pill buttons */}
        {(user.links || []).length > 0 && (
          <div className="links fu3">
            {user.links.map((link, i) => (
              <a key={link.id || i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="lpill">
                <div className="lpill-left">
                  <i className={link.icon || "fas fa-link"} />
                </div>
                <div className="lpill-text">{link.title}</div>
                <div className="lpill-right">
                  <i className="fas fa-chevron-right" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Spotify embed */}
        {user.favSongTrackId && (
          <div className="sp-wrap fu3">
            <div className="sp-label">
              <i className="fab fa-spotify" style={{color:"#1DB954",fontSize:14}} />
              Currently Vibing To
            </div>
            <div className="sp-frame">
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
          <div className="int-wrap fu3">
            <div className="int-label">
              <i className="fas fa-heart" style={{color:"#f87171",fontSize:12}} />
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
        <div className="pfooter">
          <div className="pfooter-logo">
            <img src="/icon.png" alt="mywebsam" style={{width:18,height:18,borderRadius:4,verticalAlign:"middle"}} />
            <a href="/"><strong>mywebsam</strong></a>
          </div>
          <div>Your link in bio — <a href="/">Create yours free</a></div>
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
          favSong:        user.favSong        || "",
          favArtist:      user.favArtist      || "",
          favSongUrl:     user.favSongUrl     || "",
          favSongTrackId: user.favSongTrackId || "",
        }))
      }
    };
  } catch (err) {
    console.error("[username page]", err);
    return { props: { user: null } };
  }
}
