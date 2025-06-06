import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/authContext";
import { AuthModal } from "../components/auth/AuthModal";

const Blog: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  
  const blogPosts = [
    {
      title: "Exploring Mount Bromo: A Complete Guide to Your Ultimate Adventure",
      image: "https://images.unsplash.com/photo-1531173927400-95286203f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      date: "September 5, 2023",
      excerpt: "Are you ready for an unforgettable adventure to one of Indonesia's most breathtaking natural wonders? Mount Bromo offers spectacular landscapes, dramatic sunrise views, and more."
    },
    {
      title: "2023 Travel Trends — what you need to know",
      image: "https://images.unsplash.com/photo-1535392432937-a27c36ec97ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      date: "October 15, 2023",
      excerpt: "Discover the hottest destinations and travel styles that are shaping the way we explore the world this year."
    },
    {
      title: "Europe Uncovered: The Top Hidden Gems to Explore",
      image: "https://images.unsplash.com/photo-1526650588709-50310504439b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      date: "February 28, 2024",
      excerpt: "Beyond the famous landmarks lie Europe's best-kept secrets. Discover charming villages and lesser-known destinations that offer authentic experiences."
    }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Travel Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link 
                  to="#"
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  Read More
                  <svg 
                    className="w-4 h-4 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Auth Modals */}
      <AuthModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        type="login"
        onSwitchMode={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <AuthModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        type="register"
        onSwitchMode={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </main>
  );
};

export default Blog; 