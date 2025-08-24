import { useEffect, useState } from "react";
import API from "../api/api";
import Loader from "../components/Loader";
import Empty from "../components/Empty";
import toast from "react-hot-toast";

function SkillItem({ s, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: s.name, level: s.level, goal: s.goal || "" });
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    try {
      const { data } = await API.put(`/skills/${s._id}`, form);
      onUpdated(data);
      setEditing(false);
      toast.success("Skill updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const remove = async () => {
    try {
      await API.delete(`/skills/${s._id}`);
      onDeleted(s._id);
      toast.success("Skill deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  if (editing) {
    return (
      <div className="card grid gap-3">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="input" name="name" value={form.name} onChange={onChange} />
          <select className="select" name="level" value={form.level} onChange={onChange}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input className="input" name="goal" value={form.goal} onChange={onChange} placeholder="Goal (optional)" />
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn" onClick={save}>Save</button>
          <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="font-medium">{s.name}</div>
        <div className="subtle">{s.level}{s.goal ? ` • ${s.goal}` : ""}</div>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn" onClick={remove}>Delete</button>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState({ name: "", level: "Beginner", goal: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await API.get("/skills");
      setSkills(data);
    } catch (e) {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onChange = (e) => setSkill((s) => ({ ...s, [e.target.name]: e.target.value }));

  const add = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/skills", skill);
      setSkills((list) => [...list, data]);
      setSkill({ name: "", level: "Beginner", goal: "" });
      toast.success("Skill added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Add failed");
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="heading">Skills</h2>
        <div className="subtle">Track your skills and targets.</div>
      </div>

      <div className="card">
        <form onSubmit={add} className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="subtle">Skill Name</label>
            <input className="input mt-1" name="name" value={skill.name} onChange={onChange} placeholder="React" required />
          </div>
          <div>
            <label className="subtle">Level</label>
            <select className="select mt-1" name="level" value={skill.level} onChange={onChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="subtle">Goal</label>
            <input className="input mt-1" name="goal" value={skill.goal} onChange={onChange} placeholder="Build 3 projects" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="btn" type="submit">Add Skill</button>
          </div>
        </form>
      </div>

      {loading ? (
        <Loader text="Loading skills..." />
      ) : skills.length ? (
        <div className="grid gap-3">
          {skills.map((s) => (
            <SkillItem
              key={s._id}
              s={s}
              onUpdated={(updated) => setSkills((list) => list.map((x) => x._id === updated._id ? updated : x))}
              onDeleted={(id) => setSkills((list) => list.filter((x) => x._id !== id))}
            />
          ))}
        </div>
      ) : (
        <Empty title="No skills yet" hint="Add your first skill using the form above." />
      )}
    </div>
  );
}
