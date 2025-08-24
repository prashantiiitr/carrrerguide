import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout() {
  const nav = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("token"));
    // custom event we’ll dispatch on login/logout
    window.addEventListener("auth-changed", sync);
    // also catch real storage events (other tabs) + focus refresh
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    nav("/login", { replace: true });
  };

  return (
    <>
      <header className="border-b border-neutral-800">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-lg font-bold">CareerMentor</h1>
          <nav className="flex items-center gap-6">
            {token ? (
              <>
                <NavLink to="/dashboard" className={({isActive})=>isActive?"navactive":"navlink"}>Dashboard</NavLink>
                <NavLink to="/profile" className={({isActive})=>isActive?"navactive":"navlink"}>Profile</NavLink>
                <NavLink to="/skills"  className={({isActive})=>isActive?"navactive":"navlink"}>Skills</NavLink>
                <NavLink to="/goals"   className={({isActive})=>isActive?"navactive":"navlink"}>Goals</NavLink>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login"  className="navlink">Login</NavLink>
                <NavLink to="/signup" className="navlink">Sign up</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </>
  );
}
