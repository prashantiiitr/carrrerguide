import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      toast.success("Account created. Please log in.");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="card max-w-md mx-auto grid gap-4">
        <h2 className="heading">Sign up</h2>
        <form onSubmit={submit} className="grid gap-3">
          <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button className="btn" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
        </form>
        <div className="subtle">Already have an account? <Link to="/login" className="navlink">Log in</Link></div>
      </div>
    </div>
  );
}
