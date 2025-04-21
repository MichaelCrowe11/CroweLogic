import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, QrCode, ExternalLink, Sparkle, Bot } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-2 border-b border-gray-100" 
          : "bg-white/80 backdrop-blur-sm py-4"
      }`}
    >
      {/* Brand Relationship Banner - Only visible when not scrolled */}
      {!isScrolled && (
        <div className="bg-gradient-to-r from-amber-50/80 to-blue-50/80 backdrop-blur-sm border-b border-gray-100/70 py-2 hidden sm:block animate-fadeIn">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 opacity-90 hover:opacity-100 transition-opacity">
                <img 
                  src="/images/sw-logo-color.png" 
                  alt="Southwest Mushrooms" 
                  className="h-6 w-6 rounded-full object-contain shadow-sm" 
                />
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  Southwest Mushrooms
                </span>
              </div>
              
              <div className="h-5 w-px bg-gradient-to-b from-transparent via-amber-200/70 to-transparent"></div>
              
              <div className="opacity-90 hover:opacity-100 transition-opacity">
                <p className="text-xs text-gray-700">
                  <span className="font-medium text-gray-800">Official Family of Brands</span>
                </p>
              </div>
              
              <div className="h-5 w-px bg-gradient-to-b from-transparent via-amber-200/70 to-transparent"></div>
              
              <div className="opacity-90 hover:opacity-100 transition-opacity">
                <p className="text-xs text-gray-700 italic">
                  <span className="text-gray-600">From culture to extract</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand - On left side on mobile, centered on desktop */}
          <div className="md:absolute md:left-4 lg:left-6 flex items-center z-10">
            <Link href="/" className="flex items-center opacity-90 hover:opacity-100 transition-opacity">
              <img 
                src="/images/sw-logo-color.png" 
                alt="Southwest Mushrooms" 
                className={`transition-all md:hidden ${isScrolled ? 'h-8' : 'h-10'} rounded-full object-contain mr-2 shadow-sm`} 
              />
            </Link>
          </div>

          {/* Centered Logo for non-mobile */}
          <div className="hidden md:flex flex-1 justify-center">
            <Link href="/" className="flex flex-col items-center group">
              <div 
                className={`transition-all duration-500 ${isScrolled ? 'scale-75' : 'scale-100'}`}
                style={{ 
                  filter: 'drop-shadow(0 4px 12px rgba(205, 162, 50, 0.05))',
                  transform: `scale(${isScrolled ? 0.75 : 1}) translateY(${isScrolled ? '-5px' : '0'})` 
                }}
              >
                <img 
                  src="/images/brand/crowe-logic-transparent.png" 
                  alt="CROWE LOGIC FORMULATIONS" 
                  className={`transition-all ${isScrolled ? 'h-16' : 'h-24'} w-auto object-contain mx-auto group-hover:transform group-hover:scale-102 transition-transform duration-300`} 
                />
                <div className={`h-0.5 w-0 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent mx-auto transition-all duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100 w-40 group-hover:w-48'}`}></div>
                <p className={`text-center text-gray-700 transition-all ${isScrolled ? 'text-xs mt-0.5 opacity-80' : 'text-sm mt-2 opacity-100'}`}>
                  <span className="font-medium text-gray-800">Premium Medicinal Mushroom Formulations</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Mobile-only centered logo */}
          <div className="md:hidden flex-1 flex justify-center">
            <Link href="/">
              <div className="flex flex-col items-center">
                <img 
                  src="/images/brand/crowe-logic-transparent.png" 
                  alt="CROWE LOGIC FORMULATIONS" 
                  className={`transition-all ${isScrolled ? 'h-11' : 'h-14'} w-auto object-contain mx-auto`} 
                />
                <p className={`text-center text-gray-700 transition-all text-[9px] mt-0.5 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="font-medium text-gray-600">Premium Medicinal Formulations</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-full py-1.5 px-1.5 shadow-sm border border-gray-100/60 flex items-center space-x-1">
              <Link href="/#product-discovery" className="px-3 py-1.5 text-gray-800 hover:text-black font-medium text-sm rounded-full hover:bg-white/80 transition-colors">
                Products
              </Link>
              <Link href="/#batch-transparency" className="px-3 py-1.5 text-gray-800 hover:text-black font-medium text-sm rounded-full hover:bg-white/80 transition-colors">
                Transparency
              </Link>
              <Link href="/recommendation-quiz" className="px-3 py-1.5 text-gray-800 hover:text-black font-medium text-sm rounded-full hover:bg-white/80 transition-colors flex items-center">
                Find Formula <Sparkle className="ml-1 h-3 w-3 text-amber-500" />
              </Link>
              <Link href="/digital-michael" className="px-3 py-1.5 text-gray-800 hover:text-black font-medium text-sm rounded-full hover:bg-white/80 transition-colors flex items-center">
                Digital Michael <Bot className="ml-1 h-3 w-3 text-amber-500" />
              </Link>
              <Link href="/user-dashboard" className="px-3 py-1.5 text-gray-800 hover:text-black font-medium text-sm rounded-full hover:bg-white/80 transition-colors">
                My Wellness
              </Link>
              <a href="https://southwestmushrooms.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-gray-800 hover:text-black font-medium text-sm rounded-full hover:bg-white/80 transition-colors flex items-center">
                Shop <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <div className="h-5 mx-1 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
              <Link href="/admin" className="px-3 py-1.5 text-gray-500 hover:text-gray-700 font-medium text-sm rounded-full hover:bg-white/80 transition-colors">
                Admin
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800 bg-white/70 p-2 rounded-full shadow-sm border border-gray-100/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 mt-2 py-4 shadow-sm">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/#product-discovery" className="text-gray-900 hover:text-black font-medium py-2">
                Products
              </Link>
              <Link href="/#batch-transparency" className="text-gray-900 hover:text-black font-medium py-2">
                Transparency
              </Link>
              <Link href="/recommendation-quiz" className="text-gray-900 hover:text-black font-medium py-2 flex items-center">
                Find Your Formula <Sparkle className="ml-1 h-4 w-4 text-gray-500" />
              </Link>
              <Link href="/digital-michael" className="text-gray-900 hover:text-black font-medium py-2 flex items-center">
                Digital Michael <Bot className="ml-1 h-4 w-4 text-gray-500" />
              </Link>
              <Link href="/user-dashboard" className="text-gray-900 hover:text-black font-medium py-2">
                My Wellness
              </Link>
              <a href="https://southwestmushrooms.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black font-medium py-2 flex items-center">
                Shop <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <Link href="/admin" className="text-gray-600 hover:text-black font-medium py-2">
                Admin
              </Link>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <Button 
                  className="w-full justify-center premium-button"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan Batch QR
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}