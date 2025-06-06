import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MailIcon, LockIcon } from "lucide-react";
import { useAuth } from "../lib/authContext";

const travelImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleBackButton = () => {
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const validateForm = (): boolean => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      await login(form.email, form.password);
      const role = localStorage.getItem("role");
      
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/vacations");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16a2e5] px-4">
      <div className="w-full max-w-5xl flex rounded-3xl shadow-2xl overflow-hidden bg-white/0">
        {/* Left Panel: Travel Image with Overlay */}
        <div className="relative w-1/2 min-h-[600px] flex items-center justify-center bg-black" onClick={() => navigate('/', { replace: true })}>
          <img
            src={travelImage}
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
          />
          <div className="relative z-10 text-center text-white px-8">
            <h2 className="font-cursive text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Vacay</h2>
            <p className="text-lg md:text-xl font-light drop-shadow">
              Travel is the only purchase that enriches you in ways beyond material wealth
            </p>
          </div>
          <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        {/* Right Panel: Login Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center p-12 relative rounded-r-3xl">
          {/* Airplane and Welcome */}
          <div className="mb-8 text-center relative">
            <h2 className="text-4xl font-bold text-[#16a2e5] mb-2">Welcome</h2>
            <span className="absolute right-8 top-2">
              {/* Airplane SVG */}
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22C10 10 40 10 58 2" stroke="#16a2e5" strokeWidth="2" strokeLinecap="round"/>
                <path d="M58 2L54 6M58 2L56 8" stroke="#16a2e5" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <div className="text-gray-400 text-base mt-2">Login with Email</div>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-base">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={handleKeyDown}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email id</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#16a2e5]">
                  <MailIcon className="w-5 h-5" />
                </span>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full h-12 text-base pl-10 pr-4 border-2 border-[#16a2e5] rounded-lg focus:ring-2 focus:ring-[#16a2e5]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#16a2e5]">
                  <LockIcon className="w-5 h-5" />
                </span>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full h-12 text-base pl-10 pr-4 border-2 border-[#16a2e5] rounded-lg focus:ring-2 focus:ring-[#16a2e5]"
                  required
                />
              </div>
              <div className="text-right text-xs mt-1">
                <Link to="#" className="text-[#16a2e5] hover:underline">Forgot your password?</Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#16a2e5] hover:bg-blue-600 text-white py-3 text-lg font-semibold rounded-lg shadow"
            >
              LOGIN
            </Button>
            <div className="text-center text-base text-gray-600 mt-2">
              Don't have account?{' '}
              <Link to="/register" className="text-[#16a2e5] hover:underline font-medium">
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
