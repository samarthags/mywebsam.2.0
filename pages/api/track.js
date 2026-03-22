// pages/api/track.js
// POST /api/track — records events with deduplication
// Uses IP + user-agent as fingerprint — same device/session only counts once per event per day

import clientPromise from "../../lib/mongodb";

function makeKey(req, username, event) {
  const ip = (req.headers["x-forwarded-for"]||"").split(",")[0].trim()
           || req.headers["x-real-ip"]
           || req.socket?.remoteAddress
           || "unknown";
  const ua = (req.headers["user-agent"]||"").slice(0,80);
  const day = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  // Simple hash — combine ip + ua + day + event + username
  let h = 0;
  const s = `${ip}|${ua}|${day}|${event}|${username}`;
  for (let i=0;i<s.length;i++) h = ((h<<5)-h)+s.charCodeAt(i), h|=0;
  return `dedup:${Math.abs(h).toString(36)}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, event, linkId } = req.body||{};
  if (!username || !event) return res.status(400).end();

  const allowed = ["view","link_click","spotify_play","share"];
  if (!allowed.includes(event)) return res.status(400).end();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    // Dedup: check if this exact fingerprint already recorded this event today
    const key = makeKey(req, username, event);
    const dedup = db.collection("dedup");
    const already = await dedup.findOne({ _id: key });
    if (already) return res.status(200).json({ ok:true, deduped:true });

    // Mark as seen (TTL: 24h expressed in seconds via expireAfterSeconds index)
    // Insert with expiresAt so MongoDB auto-cleans via TTL index
    const expiresAt = new Date(Date.now() + 86400*1000);
    await dedup.insertOne({ _id: key, expiresAt });

    // Create TTL index if not exists (no-op if already created)
    await dedup.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, background: true });

    // Increment the counter
    const inc = {};
    if (event === "view")         inc["analytics.views"]       = 1;
    if (event === "link_click")   inc["analytics.linkClicks"]  = 1;
    if (event === "spotify_play") inc["analytics.spotifyPlays"]= 1;
    if (event === "share")        inc["analytics.shares"]      = 1;

    await db.collection("users").updateOne(
      { username: username.toLowerCase() },
      { $inc: inc }
    );
    return res.status(200).json({ ok:true, deduped:false });
  } catch (err) {
    console.error("[track]", err);
    return res.status(500).end();
  }
}
