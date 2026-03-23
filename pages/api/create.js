// pages/api/create.js
import clientPromise from "../../lib/mongodb";

async function uploadToCloudinary(base64DataUri) {
  const cloud  = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloud || !preset) {
    console.warn("[Cloudinary] CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET missing");
    return base64DataUri; // fallback — store as-is
  }

  const body = new URLSearchParams();
  body.append("file",           base64DataUri);
  body.append("upload_preset",  preset);

  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body }
  );
  const json = await res.json();

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || "Cloudinary upload failed");
  }
  return json.secure_url;
}

async function maybeUpload(value) {
  if (value && value.startsWith("data:image/")) {
    return await uploadToCloudinary(value);
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
    // Upload any base64 images to Cloudinary before saving to DB
    const safeAvatar = await maybeUpload(avatar);

    const safeLinks = await Promise.all(
      (links || []).map(async (lnk) => ({
        ...lnk,
        icon: await maybeUpload(lnk.icon),
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
