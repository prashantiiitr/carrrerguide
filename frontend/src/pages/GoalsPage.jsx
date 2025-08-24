import { useEffect, useState } from "react";
import API from "../api/api";
import Loader from "../components/Loader";
import Empty from "../components/Empty";
import toast from "react-hot-toast";

function GoalItem({ g, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: g.title,
    description: g.description || "",
    targetDate: g.targetDate ? g.targetDate.slice(0, 10) : ""
  });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    try {
      const { data } = await API.put(`/goals/${g._id}`, form);
      onUpdated(data);
      setEditing(false);
      toast.success("Goal updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const remove = async () => {
    try {
      await API.delete(`/goals/${g._id}`);
      onDeleted(g._id);
      toast.success("Goal deleted");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  if (editing) {
    return (
      <div className="card grid gap-3">
        <div className="grid md:grid-cols-3 gap-3">
          <input className="input" name="title" value={form.title} onChange={onChange} />
          <input className="input" type="date" name="targetDate" value={form.targetDate} onChange={onChange} />
          <input className="input" name="description" value={form.description} onChange={onChange} placeholder="Description" />
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
        <div className="font-medium">{g.title}</div>
        <div className="subtle">
          {new Date(g.targetDate).toLocaleDateString()}
          {g.description ? ` • ${g.description}` : ""}
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn" onClick={remove}>Delete</button>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState({ title: "", description: "", targetDate: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await API.get("/goals");
      setGoals(data);
    } catch (e) {
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onChange = (e) => setGoal((g) => ({ ...g, [e.target.name]: e.target.value }));

  const add = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/goals", goal);
      setGoals((list) => [...list, data]);
      setGoal({ title: "", description: "", targetDate: "" });
      toast.success("Goal added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Add failed");
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="heading">Goals</h2>
        <div className="subtle">Set outcomes and deadlines.</div>
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
            <input className="input mt-1" name="description" value={goal.description} onChange={onChange} placeholder="Plan, resources, milestones..." />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="btn" type="submit">Add Goal</button>
          </div>
        </form>
      </div>

      {loading ? (
        <Loader text="Loading goals..." />
      ) : goals.length ? (
        <div className="grid gap-3">
          {goals.map((g) => (
            <GoalItem
              key={g._id}
              g={g}
              onUpdated={(updated) => setGoals((list) => list.map((x) => x._id === updated._id ? updated : x))}
              onDeleted={(id) => setGoals((list) => list.filter((x) => x._id !== id))}
            />
          ))}
        </div>
      ) : (
        <Empty title="No goals yet" hint="Set a target with a due date to get started." />
      )}
    </div>
  );
}
