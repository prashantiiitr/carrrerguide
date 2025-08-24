import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SkillsPage from "./pages/SkillsPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* protected */}
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/skills"  element={<RequireAuth><SkillsPage /></RequireAuth>} />
        <Route path="/goals"   element={<RequireAuth><GoalsPage /></RequireAuth>} />
      </Route>
    </Routes>
  );
}
