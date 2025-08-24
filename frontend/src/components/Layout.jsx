import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
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
