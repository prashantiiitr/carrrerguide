import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState({ title: "", description: "", targetDate: "" });

  const load = async () => {
    const { data } = await API.get("/goals");
    setGoals(data);
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setGoal((g) => ({ ...g, [e.target.name]: e.target.value }));

  const add = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/goals", goal);
    setGoals((list) => [...list, data]);
    setGoal({ title: "", description: "", targetDate: "" });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="heading">Goals</h2>
          <p className="subtle">Set outcomes and deadlines.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={add} className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="subtle">Title</label>
            <input className="input mt-1" name="title" value={goal.title} onChange={onChange} placeholder="Crack Frontend Role" required />
          </div>
          <div>
            <label className="subtle">Target Date</label>
            <input className="input mt-1" type="date" name="targetDate" value={goal.targetDate} onChange={onChange} required />
          </div>
          <div className="md:col-span-3">
            <label className="subtle">Description</label>
            <textarea className="textarea mt-1" rows="3" name="description" value={goal.description} onChange={onChange} placeholder="Plan, resources, milestones..." />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="btn" type="submit">Add Goal</button>
          </div>
        </form>
      </div>

      <div className="grid gap-3">
        {goals.map((g) => (
          <div key={g._id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{g.title}</div>
                <div className="subtle">
                  {new Date(g.targetDate).toLocaleDateString()} {g.description ? `• ${g.description}` : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
        {!goals.length && <div className="subtle">No goals yet—add one above.</div>}
      </div>
    </div>
  );
}
