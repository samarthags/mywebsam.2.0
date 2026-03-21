// pages/api/create.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    username, name, dob, location, bio, aboutme,
    avatar, socialProfiles, links, interests,
    _isEditing,   // true = user is updating their own profile
  } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ error: "Username can only contain letters, numbers, _ and -" });
  }

  const uname = username.toLowerCase();

  try {
    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const existing = await db.collection("users").findOne({ username: uname });

    if (existing && !_isEditing) {
      // Someone else already owns this username — block it
      return res.status(400).json({ error: "Username already taken. Please choose a different one." });
    }

    if (_isEditing && !existing) {
      // Edge case: profile was deleted externally but user tries to update
      // Treat as a fresh create — just continue below
    }

    // Upsert — creates if new, updates if editing own profile
    await db.collection("users").findOneAndUpdate(
      { username: uname },
      {
        $set: {
          username,
          name:           name           || "",
          dob:            dob            || null,
          location:       location       || "",
          bio:            bio            || "",
          aboutme:        aboutme        || "",
          avatar:         avatar         || "",
          socialProfiles: socialProfiles || {},
          links:          links          || [],
          interests:      interests      || {},
          updatedAt:      new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const host     = req.headers.host || "mywebsammu.vercel.app";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const base     = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    return res.status(200).json({ url: `${base}/${uname}` });

  } catch (err) {
    console.error("[/api/create]", err);
    return res.status(500).json({ error: "Database error" });
  }
}
