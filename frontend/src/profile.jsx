import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [editBio, setEditBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  // 🔄 Load profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/profile/me", {
        withCredentials: true,
      });
      setProfile(res.data);
      setEditBio(res.data.bio || "");
    } catch (err) {
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ➕ Add Platform
  const handleAddPlatform = async () => {
    if (!platform || !username) return alert("Fill all fields");

    try {
      await axios.post(
        "http://localhost:5000/profile/add-platform",
        { platform, username },
        { withCredentials: true }
      );

      setPlatform("");
      setUsername("");
      fetchProfile();
    } catch {
      alert("Failed to add platform");
    }
  };

  // 🔄 Sync Platforms
  const handleSync = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/profile/sync-platforms",
        {},
        { withCredentials: true }
      );
      fetchProfile();
    } catch {
      alert("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Update Bio
  const handleUpdateBio = async () => {
    try {
      await axios.put(
        "http://localhost:5000/profile/update-bio",
        { bio: editBio },
        { withCredentials: true }
      );
      alert("Bio updated");
      fetchProfile();
    } catch {
      alert("Failed to update bio");
    }
  };

  // 🖼 Upload Profile Picture
  const handleProfilePicUpload = async () => {
    if (!profilePic) return alert("Select an image first");

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const res = await axios.post(
        "http://localhost:5000/profile/upload-pic",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile picture updated");

      // 👇 update UI instantly
      setProfile(res.data.user);
      
    } catch {
      alert("Failed to upload image");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* 🔷 HEADER */}
      <div className="profile-header">
        <div className="profile-pic-section">
          <img
            src={
              profile.profilePic
                ? `http://localhost:5000/${profile.profilePic}?t=${Date.now()}`
                : "/default-avatar.png"
            }
            alt="profile"
            className="profile-pic"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
          <button onClick={handleProfilePicUpload}>Update Picture</button>
        </div>

        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="email">{profile.email}</p>
          <p className="college">{profile.college || "Student"}</p>
          <p className="about">{profile.about}</p>

          {/* ✏️ Edit Bio */}
          <textarea
            className="bio-input"
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="Write something about yourself..."
          />
          <button className="save-btn" onClick={handleUpdateBio}>
            Save Bio
          </button>

          <button className="sync-btn" onClick={handleSync}>
            {loading ? "Syncing..." : "Sync Platforms"}
          </button>
        </div>
      </div>

      {/* 🔷 PLATFORMS */}
      <div className="platform-section">
        <h2>My Platforms</h2>

        <div className="platform-grid">
          {profile.platforms.map((p, i) => (
            <div key={i} className="platform-card">
              <h3>{p.platform.toUpperCase()}</h3>
              <p>@{p.username}</p>

              <div className="stats">
                {p.stats?.solved !== 0 && (
                  <p>
                    <b>Solved:</b> {p.stats.solved}
                  </p>
                )}
                {p.stats?.rating !== 0 && (
                  <p>
                    <b>Rating:</b> {p.stats.rating}
                  </p>
                )}
                {p.stats?.rank !== undefined && (
                  <p>
                    <b>Ranking:</b> {p.stats.rank}
                  </p>
                )}
                {p.repos !== 0 && (
                  <p>
                    <b>Repos:</b> {p.repos}
                  </p>
                )}
                {p.followers !== 0 && (
                  <p>
                    <b>Followers:</b> {p.followers}
                  </p>
                )}
              </div>

              {p.badges?.length > 0 && (
                <div className="badges">
                  {p.badges.map((b, idx) => (
                    <span key={idx} className="badge">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ➕ ADD PLATFORM */}
      <div className="add-platform">
        <h2>Add Platform</h2>

        <div className="add-form">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Select Platform</option>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
            <option value="github">GitHub</option>
            <option value="codechef">CodeChef</option>
          </select>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button onClick={handleAddPlatform}>Add</button>
        </div>
      </div>
    </div>
  );
}
