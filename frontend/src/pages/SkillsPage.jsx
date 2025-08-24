import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState({ name: "", level: "Beginner", goal: "" });

  const load = async () => {
    const { data } = await API.get("/skills");
    setSkills(data);
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setSkill((s) => ({ ...s, [e.target.name]: e.target.value }));

  const add = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/skills", skill);
    setSkills((list) => [...list, data]);
    setSkill({ name: "", level: "Beginner", goal: "" });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="heading">Skills</h2>
          <p className="subtle">Track your current skills and targets.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={add} className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="subtle">Skill Name</label>
            <input className="input mt-1" name="name" value={skill.name} onChange={onChange} placeholder="React" required />
          </div>
          <div className="md:col-span-1">
            <label className="subtle">Level</label>
            <select className="select mt-1" name="level" value={skill.level} onChange={onChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="subtle">Goal (optional)</label>
            <input className="input mt-1" name="goal" value={skill.goal} onChange={onChange} placeholder="Build 3 projects" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="btn" type="submit">Add Skill</button>
          </div>
        </form>
      </div>

      <div className="grid gap-3">
        {skills.map((s) => (
          <div key={s._id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="subtle">{s.level}{s.goal ? ` • ${s.goal}` : ""}</div>
            </div>
          </div>
        ))}
        {!skills.length && <div className="subtle">No skills yet—add your first one above.</div>}
      </div>
    </div>
  );
}
