import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="border-b border-neutral-800">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-lg font-bold">CareerMentor</h1>
          <nav className="flex gap-6">
            <NavLink to="/profile" className={({isActive}) => isActive ? "navactive" : "navlink"}>Profile</NavLink>
            <NavLink to="/skills"  className={({isActive}) => isActive ? "navactive" : "navlink"}>Skills</NavLink>
            <NavLink to="/goals"   className={({isActive}) => isActive ? "navactive" : "navlink"}>Goals</NavLink>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <Outlet />
      </main>
    </>
  );
}
