import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/authContext";
import { AuthModal } from "../components/auth/AuthModal";
import { 
  MapPinIcon, 
  ArrowRightIcon, 
  CheckCircleIcon
} from "lucide-react";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Popular destinations showcased on the homepage
  const popularDestinations = [
    {
      name: "Maldives Beach Resort",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: "$1,299",
      description: "Crystal clear waters and white sandy beaches"
    },
    {
      name: "Great Wall of China",
      location: "Beijing, China",
      image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: "$1,699",
      description: "Walk the ancient wonder of the world"
    },
    {
      name: "New York City",
      location: "USA",
      image: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: "$1,499",
      description: "Explore the city that never sleeps"
    },
    {
      name: "Santorini",
      location: "Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
      price: "$1,599",
      description: "Beautiful white buildings and blue domes"
    },
    {
      name: "Italian Coast",
      location: "Italy",
      image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300", 
      price: "$1,399",
      description: "Stunning Mediterranean coastline views"
    }
  ];

  // Benefits for why choose us section
  const benefits = [
    {
      title: "Professional Guide",
      description: "Experienced guides to lead your journey safely and comfortably",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
    },
    {
      title: "Affordable Price",
      description: "Competitive pricing with no hidden fees and great value",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
    },
    {
      title: "Easy Booking",
      description: "Simple, user-friendly booking process with instant confirmation",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
    }
  ];

  // Customer testimonials
  const testimonials = [
    {
      name: "Brian Santos",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      rating: 5,
      comment: "Incredible experience! The platform made it super easy to find and book my dream vacation. The follow feature helped me keep track of deals.",
    },
    {
      name: "Lisa Hawkins",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment: "The personalized recommendations were spot on. I found places I never would have discovered on my own. Booking was seamless.",
    },
    {
      name: "Courtney Henry",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 5,
      comment: "As a frequent traveler, I appreciate how well-organized the vacation options are. The filtering system makes it easy to find exactly what I want.",
    }
  ];

  // Blog posts
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
      {/* Hero Section with Search Bar */}
      <section className="relative">
        <div 
          className="h-[600px] w-full bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40"></div>
          
          <div className="relative container mx-auto h-full flex flex-col justify-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-3xl">
              Discover Your Next Great Adventure
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mb-10">
              Explore yourself in the adventures across lands, oceans, mountains, and hidden gems worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recommended Popular Destinations</h2>
          <p className="text-gray-600">Find the beauty of the world and explore what cities have to offer</p>
        </div>
        
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 gap-6 snap-x scrollbar-hide">
            {popularDestinations.map((destination, index) => (
              <div 
                key={index} 
                className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0 overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all group"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{destination.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center mb-2">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {destination.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">{destination.price}</span>
                    {isAuthenticated ? (
                      <Link to="/vacations">
                        <Button variant="outline" size="sm" className="text-xs px-3">
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs px-3"
                        onClick={() => setIsLoginModalOpen(true)}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
            <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0 hidden md:flex items-center justify-center">
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
            </Button>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
            <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0 hidden md:flex items-center justify-center">
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why should Trip With Us?</h2>
            <p className="text-gray-600">You should choose us because we provide the best accommodation and we have sorted all the hotels based on their quality</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-xl mb-4">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <p className="flex items-center text-gray-600 text-sm">
                  {benefit.icon}
                  <span className="ml-2">Safe and comfortable</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join our community of travelers today and discover amazing destinations around the world. Your perfect vacation is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/vacations">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full">
                  Explore Destinations
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full"
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  Create Free Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg border-2 border-white text-white rounded-full hover:bg-blue-700 bg-blue-600"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <span className="text-white font-medium">Sign In</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">Vacay</h3>
              <p className="text-gray-400 max-w-xs">Explore the world's most beautiful destinations and plan your perfect vacation.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-gray-400 hover:text-white">About</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white">Careers</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white">Terms</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Explore</h4>
                <ul className="space-y-2">
                  <li><Link to="/vacations" className="text-gray-400 hover:text-white">Destinations</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white">Packages</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Vacay Inc. All Rights Reserved Yossi Akerman.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
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

export default Home;
