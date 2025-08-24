import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SkillsPage from "./pages/SkillsPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Route>
    </Routes>
  );
}
