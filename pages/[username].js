import clientPromise from "../lib/mongodb";

export default function Profile({ user }) {
  if (!user) return <h1 style={{ textAlign: "center", marginTop: 50 }}>User not found</h1>;

  const socialUrls = {
    email: user.socialProfiles?.email ? `mailto:${user.socialProfiles.email}` : null,
    whatsapp: user.socialProfiles?.whatsapp ? `https://wa.me/${user.socialProfiles.whatsapp.replace(/[^0-9]/g, '')}` : null,
    instagram: user.socialProfiles?.instagram ? `https://instagram.com/${user.socialProfiles.instagram.replace('@', '')}` : null,
    facebook: user.socialProfiles?.facebook ? `https://facebook.com/${user.socialProfiles.facebook}` : null,
    github: user.socialProfiles?.github ? `https://github.com/${user.socialProfiles.github}` : null,
    snapchat: user.socialProfiles?.snapchat ? `https://snapchat.com/add/${user.socialProfiles.snapchat}` : null,
    youtube: user.socialProfiles?.youtube ? `https://youtube.com/${user.socialProfiles.youtube.replace('@', '')}` : null,
    twitter: user.socialProfiles?.twitter ? `https://twitter.com/${user.socialProfiles.twitter.replace('@', '')}` : null,
    linkedin: user.socialProfiles?.linkedin ? `https://linkedin.com/in/${user.socialProfiles.linkedin}` : null,
    tiktok: user.socialProfiles?.tiktok ? `https://tiktok.com/${user.socialProfiles.tiktok.replace('@', '')}` : null,
    discord: user.socialProfiles?.discord ? `https://discord.com/users/${user.socialProfiles.discord}` : null,
    telegram: user.socialProfiles?.telegram ? `https://t.me/${user.socialProfiles.telegram.replace('@', '')}` : null,
    twitch: user.socialProfiles?.twitch ? `https://twitch.tv/${user.socialProfiles.twitch}` : null,
    spotify: user.socialProfiles?.spotify ? `https://open.spotify.com/user/${user.socialProfiles.spotify}` : null,
    medium: user.socialProfiles?.medium ? `https://medium.com/${user.socialProfiles.medium.replace('@', '')}` : null,
    devto: user.socialProfiles?.devto ? `https://dev.to/${user.socialProfiles.devto}` : null,
    behance: user.socialProfiles?.behance ? `https://behance.net/${user.socialProfiles.behance}` : null,
    dribbble: user.socialProfiles?.dribbble ? `https://dribbble.com/${user.socialProfiles.dribbble}` : null,
    pinterest: user.socialProfiles?.pinterest ? `https://pinterest.com/${user.socialProfiles.pinterest}` : null,
    reddit: user.socialProfiles?.reddit ? `https://reddit.com/user/${user.socialProfiles.reddit}` : null,
    threads: user.socialProfiles?.threads ? `https://threads.net/${user.socialProfiles.threads.replace('@', '')}` : null,
    bluesky: user.socialProfiles?.bluesky ? `https://bsky.app/profile/${user.socialProfiles.bluesky.replace('@', '')}` : null
  };

  const platformColors = {
    email: "#EA4335",
    whatsapp: "#25D366",
    instagram: "#E4405F",
    facebook: "#1877F2",
    github: "#333",
    snapchat: "#FFFC00",
    youtube: "#FF0000",
    twitter: "#1DA1F2",
    linkedin: "#0077B5",
    tiktok: "#000000",
    discord: "#5865F2",
    telegram: "#26A5E4",
    twitch: "#9146FF",
    spotify: "#1DB954",
    medium: "#000000",
    devto: "#0A0A0A",
    behance: "#1769FF",
    dribbble: "#EA4C89",
    pinterest: "#BD081C",
    reddit: "#FF4500",
    threads: "#000000",
    bluesky: "#1185FE"
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.dob);

  return (
    <div style={{ 
      minHeight: "100vh",
      backgroundColor: "#fafafa",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      {/* Banner */}
      {user.banner && (
        <div style={{
          height: "200px",
          backgroundImage: `url(${user.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
      )}
      
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px", position: "relative" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginTop: user.banner ? "-50px" : "20px" }}>
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "4px solid white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                objectFit: "cover"
              }}
            />
          ) : (
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#0070f3",
              border: "4px solid white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              color: "white"
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h1 style={{ margin: "10px 0 5px" }}>{user.name}</h1>
          <p style={{ color: "#666", marginTop: 0 }}>@{user.username}</p>
          
          {user.location && (
            <p style={{ color: "#888", fontSize: "0.9em", margin: "5px 0" }}>📍 {user.location}</p>
          )}
          
          {age && (
            <p style={{ color: "#888", fontSize: "0.9em", margin: "5px 0" }}>🎂 {age} years old</p>
          )}
          
          {user.aboutme && (
            <div style={{ 
              margin: "20px 0", 
              padding: "0 20px",
              lineHeight: "1.6",
              color: "#333"
            }}>
              <p>{user.aboutme}</p>
            </div>
          )}
        </div>

        {/* Social Icons Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
          gap: "15px",
          margin: "30px 0",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          {Object.entries(socialUrls).map(([platform, url]) => {
            if (!url) return null;
            
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textDecoration: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  transition: "transform 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  backgroundColor: platformColors[platform] || "#666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "5px",
                  color: "white",
                  fontSize: "20px"
                }}>
                  {getPlatformIcon(platform)}
                </div>
                <span style={{ fontSize: "12px", color: "#666", textTransform: "capitalize" }}>
                  {platform}
                </span>
              </a>
            );
          })}
        </div>

        {/* Custom Links (Linktree Style) */}
        {user.links && user.links.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            {user.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  backgroundColor: "white",
                  color: "#333",
                  textDecoration: "none",
                  padding: "15px 20px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontWeight: "500",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPlatformIcon(platform) {
  const icons = {
    email: "📧",
    whatsapp: "💬",
    instagram: "📷",
    facebook: "👍",
    github: "🐙",
    snapchat: "👻",
    youtube: "▶️",
    twitter: "🐦",
    linkedin: "🔗",
    tiktok: "🎵",
    discord: "🎮",
    telegram: "✈️",
    twitch: "🎮",
    spotify: "🎵",
    medium: "📝",
    devto: "💻",
    behance: "🎨",
    dribbble: "⚽",
    pinterest: "📌",
    reddit: "🤖",
    threads: "🧵",
    bluesky: "🦋"
  };
  return icons[platform] || "🔗";
}

export async function getServerSideProps({ params }) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const user = await db.collection("users").findOne({ 
    username: params.username.toLowerCase() 
  });

  if (!user) {
    return { props: { user: null } };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify({
        username: user.username,
        name: user.name,
        dob: user.dob || null,
        location: user.location || "",
        aboutme: user.aboutme || "",
        avatar: user.avatar || "",
        banner: user.banner || "",
        socialProfiles: user.socialProfiles || {},
        links: user.links || []
      }))
    }
  };
}