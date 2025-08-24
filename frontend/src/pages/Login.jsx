import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      toast.success("Welcome back!");
      nav(loc.state?.from?.pathname || "/profile", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="card max-w-md mx-auto grid gap-4">
        <h2 className="heading">Log in</h2>
        <form onSubmit={submit} className="grid gap-3">
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
          <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <div className="subtle">No account? <Link to="/signup" className="navlink">Sign up</Link></div>
      </div>
    </div>
  );
}
