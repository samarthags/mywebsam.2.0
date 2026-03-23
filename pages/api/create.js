// pages/api/create.js
import clientPromise from "../../lib/mongodb";
import crypto from "crypto";

async function uploadToCloudinary(base64DataUri, folder) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn("[Cloudinary] env vars missing — skipping upload");
    return base64DataUri;
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Sort params alphabetically — Cloudinary requires strict alphabetical order
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHmac("sha256", CLOUDINARY_API_SECRET.trim())
    .update(paramsToSign)
    .digest("hex");

  const body = new URLSearchParams();
  body.append("file",      base64DataUri);
  body.append("timestamp", String(timestamp));
  body.append("api_key",   CLOUDINARY_API_KEY.trim());
  body.append("signature", signature);
  body.append("folder",    folder);

  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME.trim()}/image/upload`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }
  );
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || "Cloudinary upload failed");
  return json.secure_url;
}

async function maybeUpload(value, folder) {
  if (value && value.startsWith("data:image/")) {
    return await uploadToCloudinary(value, folder);
  }
  return value || "";
}

export const config = {
  api: { bodyParser: { sizeLimit: "8mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    username, name, dob, location, bio, aboutme,
    avatar, socialProfiles, links, interests,
    favSong, favArtist, favSongUrl, favSongTrackId,
    _isEditing,
  } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res.status(400).json({ error: "Username can only contain letters, numbers, _ and -" });
  }

  const uname = username.toLowerCase();

  try {
    // Use simple folder names — no slashes to avoid signature issues
    const safeAvatar = await maybeUpload(avatar, "linkitin_avatars");

    const safeLinks = await Promise.all(
      (links || []).map(async (lnk) => ({
        ...lnk,
        icon: await maybeUpload(lnk.icon, "linkitin_icons"),
      }))
    );

    const client = await clientPromise;
    const db     = client.db(process.env.DB_NAME);

    const existing = await db.collection("users").findOne({ username: uname });

    if (existing && !_isEditing) {
      return res.status(400).json({ error: "Username already taken. Please choose a different one." });
    }

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
          avatar:         safeAvatar,
          socialProfiles: socialProfiles || {},
          links:          safeLinks,
          interests:      interests      || {},
          favSong:        favSong        || "",
          favArtist:      favArtist      || "",
          favSongUrl:     favSongUrl     || "",
          favSongTrackId: favSongTrackId || "",
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
    if (err.message?.includes("Cloudinary") || err.message?.includes("cloudinary")) {
      return res.status(500).json({ error: "Image upload failed. Please try again." });
    }
    return res.status(500).json({ error: "Database error" });
  }
}
