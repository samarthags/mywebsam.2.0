// pages/api/roast-profile.js
// Roasts a user's profile using Groq AI.
// Reads GROQ_API_KEY from environment — never exposed to client.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, role, bio, socials, links, tags, hasAvatar } = req.body || {};

  const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!groqKey) return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  const profileSummary = [
    `Name: ${name || "Unknown"}`,
    role ? `Role: ${role}` : "Role: not set",
    bio  ? `Bio: "${bio.slice(0, 100)}"` : "Bio: empty",
    `Socials connected: ${socials || "none"}`,
    `Custom links: ${links || 0}`,
    `Interest tags: ${tags || 0}`,
    `Profile photo: ${hasAvatar ? "yes" : "no — they're a ghost"}`,
  ].join("\n");

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are a savage but funny profile roaster. Given a user's link-in-bio profile data, write ONE sharp, witty roast — 2-3 sentences max. Be funny, punchy and a little mean but not offensive. Focus on what's missing or weak. No hashtags, no emojis, no intro fluff. Just the roast.`,
          },
          {
            role: "user",
            content: `Roast this profile:\n${profileSummary}`,
          },
        ],
        max_tokens: 120,
        temperature: 0.92,
      }),
    });

    if (!groqRes.ok) throw new Error(`Groq ${groqRes.status}`);
    const data = await groqRes.json();
    const roast = (data?.choices?.[0]?.message?.content || "").trim();
    return res.status(200).json({ roast: roast || "Your profile is so empty even AI has nothing to say." });
  } catch (err) {
    return res.status(500).json({ roast: "The AI tried to roast you but your profile was too boring to even process." });
  }
}
