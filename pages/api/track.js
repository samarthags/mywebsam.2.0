// pages/api/track.js
// POST /api/track
// Records profile events: view, link_click, spotify_play
// Stores counters in MongoDB under user document

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, event, linkId } = req.body;
  if (!username || !event) return res.status(400).end();

  const allowed = ["view","link_click","spotify_play","share"];
  if (!allowed.includes(event)) return res.status(400).end();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);
    const inc    = {};
    if (event === "view")         inc["analytics.views"]       = 1;
    if (event === "spotify_play") inc["analytics.spotifyPlays"] = 1;
    if (event === "share")         inc["analytics.shares"]       = 1;
    if (event === "link_click")   inc["analytics.linkClicks"]   = 1;

    await db.collection("users").updateOne(
      { username: username.toLowerCase() },
      { $inc: inc }
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).end();
  }
}
