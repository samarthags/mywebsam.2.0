import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    dob: "",
    location: "",
    aboutme: "",
    avatar: "",
    banner: "",
    socialProfiles: {
      email: "",
      whatsapp: "",
      instagram: "",
      facebook: "",
      github: "",
      snapchat: "",
      youtube: "",
      twitter: "",
      linkedin: "",
      tiktok: "",
      discord: "",
      telegram: "",
      twitch: "",
      spotify: "",
      medium: "",
      devto: "",
      behance: "",
      dribbble: "",
      pinterest: "",
      reddit: "",
      threads: "",
      bluesky: ""
    },
    links: []
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleSocialChange = (platform, value) => {
    setForm({
      ...form,
      socialProfiles: {
        ...form.socialProfiles,
        [platform]: value
      }
    });
  };

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setForm({
        ...form,
        links: [...form.links, { ...newLink, id: Date.now() }]
      });
      setNewLink({ title: "", url: "" });
    }
  };

  const removeLink = (id) => {
    setForm({
      ...form,
      links: form.links.filter(link => link.id !== id)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error);
    }
  };

  const socialCategories = [
    {
      name: "Contact",
      platforms: ["email", "whatsapp"]
    },
    {
      name: "Social Media",
      platforms: ["instagram", "facebook", "twitter", "tiktok", "snapchat", "threads", "bluesky"]
    },
    {
      name: "Professional",
      platforms: ["github", "linkedin", "medium", "devto", "behance", "dribbble"]
    },
    {
      name: "Communication",
      platforms: ["discord", "telegram", "reddit"]
    },
    {
      name: "Content",
      platforms: ["youtube", "twitch", "spotify", "pinterest"]
    }
  ];

  const platformLabels = {
    email: "Email",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    github: "GitHub",
    snapchat: "Snapchat",
    youtube: "YouTube",
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    discord: "Discord",
    telegram: "Telegram",
    twitch: "Twitch",
    spotify: "Spotify",
    medium: "Medium",
    devto: "Dev.to",
    behance: "Behance",
    dribbble: "Dribbble",
    pinterest: "Pinterest",
    reddit: "Reddit",
    threads: "Threads",
    bluesky: "Bluesky"
  };

  const platformPlaceholders = {
    email: "your@email.com",
    whatsapp: "+1234567890",
    instagram: "@username",
    facebook: "username",
    github: "username",
    snapchat: "username",
    youtube: "@username",
    twitter: "@username",
    linkedin: "username",
    tiktok: "@username",
    discord: "username#0000",
    telegram: "@username",
    twitch: "username",
    spotify: "username",
    medium: "@username",
    devto: "username",
    behance: "username",
    dribbble: "username",
    pinterest: "username",
    reddit: "username",
    threads: "@username",
    bluesky: "@username"
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Create Your Linktree Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div style={{ marginBottom: 20, padding: 20, border: "1px solid #eaeaea", borderRadius: 10, background: "white" }}>
          <h2>Basic Information</h2>
          
          <div style={{ marginBottom: 15 }}>
            <label>Username *</label>
            <input
              placeholder="username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
            <small>Letters, numbers, underscores, and hyphens only</small>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Full Name *</label>
            <input
              placeholder="John Doe"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Date of Birth</label>
            <input
              type="date"
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Location</label>
            <input
              placeholder="New York, USA"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>About Me</label>
            <textarea
              placeholder="Tell us about yourself..."
              rows="4"
              onChange={(e) => setForm({ ...form, aboutme: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Avatar URL (optional)</label>
            <input
              placeholder="https://example.com/avatar.jpg"
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Banner URL (optional)</label>
            <input
              placeholder="https://example.com/banner.jpg"
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
            />
          </div>
        </div>

        {/* Social Profiles */}
        {socialCategories.map((category) => (
          <div key={category.name} style={{ marginBottom: 20, padding: 20, border: "1px solid #eaeaea", borderRadius: 10, background: "white" }}>
            <h2>{category.name}</h2>
            
            {category.platforms.map((platform) => (
              <div key={platform} style={{ marginBottom: 15 }}>
                <label>{platformLabels[platform]}</label>
                <input
                  placeholder={platformPlaceholders[platform]}
                  value={form.socialProfiles[platform]}
                  onChange={(e) => handleSocialChange(platform, e.target.value)}
                  style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 5 }}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Custom Links */}
        <div style={{ marginBottom: 20, padding: 20, border: "1px solid #eaeaea", borderRadius: 10, background: "white" }}>
          <h2>Custom Links</h2>
          
          <div style={{ marginBottom: 15 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <input
                placeholder="Link Title (e.g., My Portfolio)"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                style={{ flex: 1, padding: 8, border: "1px solid #ddd", borderRadius: 5 }}
              />
              <input
                placeholder="URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                style={{ flex: 2, padding: 8, border: "1px solid #ddd", borderRadius: 5 }}
              />
              <button 
                type="button"
                onClick={addLink}
                style={{ padding: "8px 20px", cursor: "pointer", background: "#0070f3", color: "white", border: "none", borderRadius: 5 }}
              >
                Add
              </button>
            </div>
          </div>

          {form.links.length > 0 && (
            <div>
              <h3>Your Links:</h3>
              {form.links.map((link) => (
                <div key={link.id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "5px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "5px"
                }}>
                  <div>
                    <strong>{link.title}</strong>
                    <br />
                    <small style={{ color: "#666" }}>{link.url}</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    style={{ 
                      padding: "5px 10px", 
                      backgroundColor: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Create Profile
        </button>
      </form>
    </div>
  );
}