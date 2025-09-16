import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";   
import Footer from "./components/Footer";   

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ paddingTop: "80px", minHeight: "calc(100vh - 160px)" }}>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ---------- Protected Routes ---------- */}
          <Route
            path="/candidate-dashboard"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter-dashboard"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* ---------- Fallback (404) ---------- */}
          <Route path="*" element={<h2 className="text-center mt-5">404 – Page Not Found</h2>} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
