import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Vacations from "../pages/Vacations";
import AdminPanel from "../pages/AdminPanel";
import Dashboard from "../pages/Dashboard";
import VacationDetails from "../pages/VacationDetails";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Blog from "../pages/Blog";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blog" element={<Blog />} />

      <Route
        path="/vacations"
        element={
          <ProtectedRoute>
            <Vacations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/vacations/:id"
        element={
          <ProtectedRoute requiredRole="admin">
            <VacationDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
