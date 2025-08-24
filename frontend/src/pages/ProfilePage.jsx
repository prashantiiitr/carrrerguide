import { useEffect, useState } from "react";
import API from "../api/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [form, setForm] = useState({ bio: "", location: "", website: "" });
  const [initializing, setInitializing] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profiles");
      if (data) setForm({ bio: data.bio ?? "", location: data.location ?? "", website: data.website ?? "" });
    } catch {}
    finally { setInitializing(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let exists = false;
      try { const { data } = await API.get("/profiles"); exists = !!data?._id; } catch {}
      if (exists) await API.put("/profiles", form);
      else await API.post("/profiles", form);
      await fetchProfile();
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="heading">Profile</h2>
        <div className="subtle">Tell us a bit about you.</div>
      </div>

      {initializing && <div className="mb-2"><Loader text="Loading profile..." /></div>}

      <div className="card">
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="subtle">Bio</label>
            <textarea className="textarea mt-1" rows="4" name="bio" value={form.bio} onChange={onChange} />
          </div>
          <div>
            <label className="subtle">Location</label>
            <input className="input mt-1" name="location" value={form.location} onChange={onChange} placeholder="City, Country" />
          </div>
          <div>
            <label className="subtle">Website</label>
            <input className="input mt-1" name="website" value={form.website} onChange={onChange} placeholder="https://..." />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
