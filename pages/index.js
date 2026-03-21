import { useState, useRef } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    username: "",
    name: "",
    dob: "",
    location: "",
    avatar: "",
    socialProfiles: {},
    links: [],
    interests: {
      role: "",
      hobbies: [],
      music: [],
      gaming: [],
      passions: [],
      skills: []
    }
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [generating, setGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");

  const roles = [
    { value: "student", label: "🎓 Student" },
    { value: "developer", label: "💻 Developer" },
    { value: "designer", label: "🎨 Designer" },
    { value: "creator", label: "📸 Content Creator" },
    { value: "gamer", label: "🎮 Gamer" },
    { value: "traveler", label: "✈️ Traveler" },
    { value: "athlete", label: "⚽ Athlete" },
    { value: "artist", label: "🎭 Artist" },
    { value: "musician", label: "🎵 Musician" },
    { value: "entrepreneur", label: "💼 Entrepreneur" },
    { value: "writer", label: "📚 Writer" },
    { value: "other", label: "✨ Other" }
  ];

  const hobbiesOptions = [
    "Reading", "Gaming", "Coding", "Drawing", "Photography", "Traveling",
    "Cooking", "Sports", "Music", "Dancing", "Writing", "Hiking",
    "Swimming", "Yoga", "Meditation", "Gardening", "Fishing", "Camping"
  ];

  const musicGenres = [
    "Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical",
    "R&B", "Country", "Metal", "Indie", "Latin", "K-Pop", "Folk"
  ];

  const games = [
    "Minecraft", "Fortnite", "Valorant", "League of Legends", "GTA V",
    "Call of Duty", "Apex Legends", "Among Us", "Roblox", "Mario",
    "Zelda", "Pokemon", "Elden Ring", "Skyrim", "The Witcher"
  ];

  const passions = [
    "Technology", "Art", "Music", "Education", "Environment",
    "Social Justice", "Health & Wellness", "Fitness", "Animals",
    "Space", "Science", "History", "Philosophy"
  ];

  const skills = [
    "JavaScript", "Python", "React", "Node.js", "UI/UX Design",
    "Graphic Design", "Video Editing", "Photography", "Writing",
    "Public Speaking", "Leadership", "Project Management", "Data Science"
  ];

  const socialPlatforms = [
    { name: "email", label: "Email", placeholder: "your@email.com", color: "#EA4335" },
    { name: "whatsapp", label: "WhatsApp", placeholder: "+1234567890", color: "#25D366" },
    { name: "instagram", label: "Instagram", placeholder: "@username", color: "#E4405F" },
    { name: "facebook", label: "Facebook", placeholder: "username", color: "#1877F2" },
    { name: "github", label: "GitHub", placeholder: "username", color: "#333" },
    { name: "snapchat", label: "Snapchat", placeholder: "username", color: "#FFFC00" },
    { name: "youtube", label: "YouTube", placeholder: "@username", color: "#FF0000" },
    { name: "twitter", label: "Twitter/X", placeholder: "@username", color: "#1DA1F2" },
    { name: "linkedin", label: "LinkedIn", placeholder: "username", color: "#0077B5" },
    { name: "tiktok", label: "TikTok", placeholder: "@username", color: "#000000" },
    { name: "discord", label: "Discord", placeholder: "username#0000", color: "#5865F2" },
    { name: "telegram", label: "Telegram", placeholder: "@username", color: "#26A5E4" },
    { name: "twitch", label: "Twitch", placeholder: "username", color: "#9146FF" },
    { name: "spotify", label: "Spotify", placeholder: "username", color: "#1DB954" },
    { name: "medium", label: "Medium", placeholder: "@username", color: "#000000" },
    { name: "reddit", label: "Reddit", placeholder: "username", color: "#FF4500" }
  ];

  const handleArraySelect = (category, value) => {
    const current = form.interests[category];
    if (current.includes(value)) {
      setForm({
        ...form,
        interests: {
          ...form.interests,
          [category]: current.filter(item => item !== value)
        }
      });
    } else {
      setForm({
        ...form,
        interests: {
          ...form.interests,
          [category]: [...current, value]
        }
      });
    }
  };

  const handleSocialChange = (platform, value) => {
    setForm({
      ...form,
      socialProfiles: {
        ...form.socialProfiles,
        [platform]: value
      }
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setForm({ ...form, avatar: data.url });
      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
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

  const generateBio = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: form.interests, name: form.name })
      });
      const data = await response.json();
      setGeneratedBio(data.bio);
    } catch (error) {
      console.error("Error generating bio:", error);
      alert("Failed to generate bio. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...form,
      aboutme: generatedBio || "",
      interests: form.interests
    };

    const res = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: "0 auto", 
      padding: 20,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        button {
          transition: all 0.2s ease;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        input, textarea, select {
          transition: all 0.2s ease;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 3px rgba(0,112,243,0.1);
        }
      `}</style>

      {/* Progress Bar */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                backgroundColor: step >= s ? "#0070f3" : "#eaeaea",
                color: step >= s ? "white" : "#999",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                fontWeight: "bold"
              }}>
                {s}
              </div>
              <div style={{ fontSize: 12, color: step >= s ? "#0070f3" : "#999" }}>
                {s === 1 && "Basic"}
                {s === 2 && "Interests"}
                {s === 3 && "Social"}
                {s === 4 && "Links"}
                {s === 5 && "Review"}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 4, backgroundColor: "#eaeaea", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: `${((step - 1) / 4) * 100}%`,
            height: 4,
            backgroundColor: "#0070f3",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="fade-in">
            <h1 style={{ fontSize: 28, marginBottom: 20 }}>Create Your Profile</h1>
            <p style={{ color: "#666", marginBottom: 30 }}>Start by telling us about yourself</p>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>Username *</label>
              <input
                placeholder="e.g., johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                required
                style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 16 }}
              />
              <small style={{ color: "#666", marginTop: 5, display: "block" }}>Letters, numbers, underscores, and hyphens only</small>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>Full Name *</label>
              <input
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 16 }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 16 }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>Location</label>
              <input
                placeholder="New York, USA"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 16 }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>Profile Picture</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ marginBottom: 10 }}
              />
              {uploading && <p style={{ color: "#0070f3" }}>Uploading...</p>}
              {form.avatar && (
                <div style={{ marginTop: 10 }}>
                  <img src={form.avatar} alt="Preview" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            <button 
              type="button" 
              onClick={nextStep} 
              style={{
                width: "100%",
                padding: 14,
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Interests & AI Bio */}
        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ marginBottom: 10 }}>Your Interests</h2>
            <p style={{ color: "#666", marginBottom: 30 }}>Tell us what you love to get a personalized bio</p>

            <div style={{ marginBottom: 25 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 10 }}>I am a...</label>
              <select
                value={form.interests.role}
                onChange={(e) => setForm({
                  ...form,
                  interests: { ...form.interests, role: e.target.value }
                })}
                style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 16 }}
              >
                <option value="">Select your role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 10 }}>Hobbies</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {hobbiesOptions.map(hobby => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => handleArraySelect("hobbies", hobby)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: form.interests.hobbies.includes(hobby) ? "#0070f3" : "#f0f0f0",
                      color: form.interests.hobbies.includes(hobby) ? "white" : "#333",
                      border: "none",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "all 0.2s"
                    }}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 10 }}>Music Genres</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {musicGenres.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleArraySelect("music", genre)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: form.interests.music.includes(genre) ? "#0070f3" : "#f0f0f0",
                      color: form.interests.music.includes(genre) ? "white" : "#333",
                      border: "none",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 14
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 10 }}>Favorite Games</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {games.map(game => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => handleArraySelect("gaming", game)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: form.interests.gaming.includes(game) ? "#0070f3" : "#f0f0f0",
                      color: form.interests.gaming.includes(game) ? "white" : "#333",
                      border: "none",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 14
                    }}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 10 }}>Passions</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {passions.map(passion => (
                  <button
                    key={passion}
                    type="button"
                    onClick={() => handleArraySelect("passions", passion)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: form.interests.passions.includes(passion) ? "#0070f3" : "#f0f0f0",
                      color: form.interests.passions.includes(passion) ? "white" : "#333",
                      border: "none",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 14
                    }}
                  >
                    {passion}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 25 }}>
              <label style={{ fontWeight: 500, display: "block", marginBottom: 10 }}>Skills</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleArraySelect("skills", skill)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: form.interests.skills.includes(skill) ? "#0070f3" : "#f0f0f0",
                      color: form.interests.skills.includes(skill) ? "white" : "#333",
                      border: "none",
                      borderRadius: 20,
                      cursor: "pointer",
                      fontSize: 14
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 25 }}>
              <button
                type="button"
                onClick={generateBio}
                disabled={generating}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: generating ? "not-allowed" : "pointer",
                  fontSize: 16,
                  fontWeight: 500,
                  width: "100%"
                }}
              >
                {generating ? "Generating with AI..." : "✨ Generate AI Bio"}
              </button>
              
              {generatedBio && (
                <div style={{
                  marginTop: 20,
                  padding: 20,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 12,
                  borderLeft: "4px solid #28a745"
                }}>
                  <strong style={{ display: "block", marginBottom: 10 }}>Your AI-Generated Bio:</strong>
                  <p style={{ margin: 0, lineHeight: 1.6, color: "#333" }}>{generatedBio}</p>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={prevStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                ← Back
              </button>
              <button type="button" onClick={nextStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Social Profiles */}
        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ marginBottom: 10 }}>Social Profiles</h2>
            <p style={{ color: "#666", marginBottom: 30 }}>Connect your social media accounts</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {socialPlatforms.map(platform => (
                <div key={platform.name}>
                  <label style={{ fontWeight: 500, display: "block", marginBottom: 8 }}>
                    {platform.label}
                  </label>
                  <input
                    placeholder={platform.placeholder}
                    value={form.socialProfiles[platform.name] || ""}
                    onChange={(e) => handleSocialChange(platform.name, e.target.value)}
                    style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8, fontSize: 14 }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
              <button type="button" onClick={prevStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                ← Back
              </button>
              <button type="button" onClick={nextStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Custom Links */}
        {step === 4 && (
          <div className="fade-in">
            <h2 style={{ marginBottom: 10 }}>Custom Links</h2>
            <p style={{ color: "#666", marginBottom: 30 }}>Add your own links (like Linktree)</p>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 15 }}>
                <input
                  placeholder="Link Title (e.g., My Portfolio)"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                />
                <input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  style={{ flex: 2, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                />
                <button 
                  type="button"
                  onClick={addLink}
                  style={{ padding: "10px 24px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
                >
                  Add
                </button>
              </div>
            </div>

            {form.links.length > 0 && (
              <div>
                <h3 style={{ marginBottom: 15 }}>Your Links ({form.links.length})</h3>
                {form.links.map((link) => (
                  <div key={link.id} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "12px",
                    marginBottom: "8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: 8
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
                        padding: "6px 12px", 
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
              <button type="button" onClick={prevStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                ← Back
              </button>
              <button type="button" onClick={nextStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="fade-in">
            <h2 style={{ marginBottom: 10 }}>Review Your Profile</h2>
            <p style={{ color: "#666", marginBottom: 30 }}">Check everything before publishing</p>
            
            <div style={{ marginBottom: 20, padding: 20, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
              <h3 style={{ marginTop: 0, marginBottom: 15 }}>Basic Info</h3>
              <p><strong>Username:</strong> @{form.username}</p>
              <p><strong>Name:</strong> {form.name}</p>
              {form.dob && <p><strong>Birthday:</strong> {new Date(form.dob).toLocaleDateString()}</p>}
              {form.location && <p><strong>Location:</strong> {form.location}</p>}
              {form.avatar && (
                <div>
                  <strong>Avatar:</strong>
                  <img src={form.avatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: "50%", marginTop: 8 }} />
                </div>
              )}
            </div>

            {generatedBio && (
              <div style={{ marginBottom: 20, padding: 20, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
                <h3 style={{ marginTop: 0, marginBottom: 15 }}>Bio</h3>
                <p style={{ lineHeight: 1.6 }}>{generatedBio}</p>
              </div>
            )}

            {form.interests.role && (
              <div style={{ marginBottom: 20, padding: 20, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
                <h3 style={{ marginTop: 0, marginBottom: 15 }}>Interests</h3>
                <p><strong>Role:</strong> {roles.find(r => r.value === form.interests.role)?.label}</p>
                {form.interests.hobbies.length > 0 && <p><strong>Hobbies:</strong> {form.interests.hobbies.join(", ")}</p>}
                {form.interests.music.length > 0 && <p><strong>Music:</strong> {form.interests.music.join(", ")}</p>}
                {form.interests.gaming.length > 0 && <p><strong>Games:</strong> {form.interests.gaming.join(", ")}</p>}
              </div>
            )}

            {Object.keys(form.socialProfiles).filter(key => form.socialProfiles[key]).length > 0 && (
              <div style={{ marginBottom: 20, padding: 20, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
                <h3 style={{ marginTop: 0, marginBottom: 15 }}>Social Profiles ({Object.keys(form.socialProfiles).filter(key => form.socialProfiles[key]).length})</h3>
                {Object.entries(form.socialProfiles).map(([key, value]) => value && (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </div>
            )}

            {form.links.length > 0 && (
              <div style={{ marginBottom: 20, padding: 20, backgroundColor: "#f8f9fa", borderRadius: 12 }}>
                <h3 style={{ marginTop: 0, marginBottom: 15 }}>Custom Links ({form.links.length})</h3>
                {form.links.map((link, idx) => (
                  <p key={idx}><strong>{link.title}:</strong> {link.url}</p>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={prevStep} style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer"
              }}>
                ← Back
              </button>
              <button type="submit" style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer"
              }}>
                Create Profile ✨
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}