// pages/api/check-username.js
// GET /api/check-username?username=xxx
// Returns { available: true/false }
// Called live as user types username in the form.

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { username } = req.query;
  if (!username || username.length < 3) {
    return res.status(200).json({ available: false });
  }

  const uname = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!uname) return res.status(200).json({ available: false });

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const existing = await db.collection("users").findOne(
      { username: uname },
      { projection: { _id: 1 } }  // only fetch _id — fastest possible query
    );

    return res.status(200).json({ available: !existing });
  } catch (err) {
    console.error("[/api/check-username]", err);
    // On error, don't block the user — return available so they can proceed
    return res.status(200).json({ available: true });
  }
}
