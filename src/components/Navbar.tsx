
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">DealFinder</span>
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-md focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 flex flex-col space-y-4 animate-fadeIn">
                <Link to="/" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100 rounded-md">Home</Link>
                <Link to="/preferences" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100 rounded-md">My Preferences</Link>
                <Link to="/properties" onClick={toggleMenu} className="px-4 py-2 hover:bg-gray-100 rounded-md">Properties</Link>
                <Button className="bg-estate-primary hover:bg-estate-secondary">
                  Sign Up
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-6">
            <Link to="/" className="font-medium text-gray-700 hover:text-estate-primary transition-colors">Home</Link>
            <Link to="/preferences" className="font-medium text-gray-700 hover:text-estate-primary transition-colors">My Preferences</Link>
            <Link to="/properties" className="font-medium text-gray-700 hover:text-estate-primary transition-colors">Properties</Link>
            <Button className="bg-estate-primary hover:bg-estate-secondary">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
