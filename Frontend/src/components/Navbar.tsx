import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { AdminPanelSettings, FlightTakeoff, Home as HomeIcon, Article as BlogIcon, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const navLinks = (
    <>
      <Link
        to="/"
        className="font-medium text-gray-800 hover:text-blue-600 text-lg md:text-xl flex items-center gap-2 px-2 py-1 rounded transition-colors duration-200"
        onClick={() => setMenuOpen(false)}
      >
        <HomeIcon className="w-5 h-5" /> Home
      </Link>
      <Link
        to="/vacations"
        className="font-medium text-gray-800 hover:text-blue-600 text-lg md:text-xl flex items-center gap-2 px-2 py-1 rounded transition-colors duration-200"
        onClick={() => setMenuOpen(false)}
      >
        <FlightTakeoff className="w-5 h-5" /> Destinations
      </Link>
      <Link
        to="/blog"
        className="font-medium text-gray-800 hover:text-blue-600 text-lg md:text-xl flex items-center gap-2 px-2 py-1 rounded transition-colors duration-200"
        onClick={() => setMenuOpen(false)}
      >
        <BlogIcon className="w-5 h-5" /> Blog
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl md:text-3xl font-bold text-blue-600 select-none cursor-pointer" onClick={() => navigate("/")}>Vacay</div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-6 lg:space-x-12">
            {navLinks}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 text-base md:text-lg whitespace-nowrap">Welcome, {name}</span>
                {role === "admin" && (
                  <Button
                    variant="default"
                    onClick={() => navigate("/admin")}
                    className="text-base px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <AdminPanelSettings className="w-5 h-5" /> Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-base text-gray-600 hover:text-white hover:bg-red-500 border border-gray-300 rounded-lg px-4 py-2 transition-colors duration-200 ml-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  onClick={() => navigate("/login")}
                  className="text-base text-white bg-blue-600 hover:bg-blue-700 px-4 py-2"
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/register")}
                  className="text-base px-4 py-2"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {menuOpen ? <CloseIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 absolute top-20 left-0 w-full z-50 animate-fade-in">
          <div className="flex flex-col items-center py-4 space-y-4">
            {navLinks}
            <div className="flex flex-col items-center gap-2 w-full">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700 text-base">Welcome, {name}</span>
                  {role === "admin" && (
                    <Button
                      variant="default"
                      onClick={() => { setMenuOpen(false); navigate("/admin"); }}
                      className="text-base px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-40 justify-center"
                    >
                      <AdminPanelSettings className="w-5 h-5" /> Admin Panel
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="text-base text-gray-600 hover:text-white hover:bg-red-500 border border-gray-300 rounded-lg px-4 py-2 transition-colors duration-200 w-40"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="default"
                    onClick={() => { setMenuOpen(false); navigate("/login"); }}
                    className="text-base text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 w-40"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setMenuOpen(false); navigate("/register"); }}
                    className="text-base px-4 py-2 w-40"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
