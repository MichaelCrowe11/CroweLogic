import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, MapPin, Headphones, Bot, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dot-pattern"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {/* Southwest Mushrooms Logo - now using the white version */}
                <img 
                  src="/images/sw-logo-white.png" 
                  alt="Southwest Mushrooms" 
                  className="h-14 w-14 mr-3 rounded-full object-contain"
                />
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {/* Updated with full brand logo */}
                    <img 
                      src="/images/brand/crowe-logic-transparent.png" 
                      alt="Crowe Logic Formulations" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <p className="text-gray-400 text-xs font-medium">
                    Crowe Logic Formulations - Extraction Division
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Precision-crafted medicinal mushroom formulations backed by scientific research.
              From cultivation to extraction, we ensure quality at every step.
            </p>
            
            <p className="text-gray-400 text-sm mb-6 border-l border-gray-700 pl-4 italic">
              <span className="font-medium text-white">Michael Crowe Mycology</span> manages the genetics,
              <span className="font-medium text-white"> Southwest Mushrooms</span> cultivates the mushrooms,
              and <span className="font-medium text-white">Crowe Logic</span> develops the formulations.
            </p>
            
            <div className="flex space-x-5">
              <a href="https://instagram.com/michaelcrowemycology" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-5 display-text">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#product-discovery" className="text-gray-300 hover:text-white transition-colors">
                  Product Discovery
                </Link>
              </li>
              <li>
                <Link href="/#batch-transparency" className="text-gray-300 hover:text-white transition-colors">
                  Batch Transparency
                </Link>
              </li>
              <li>
                <Link href="/recommendation-quiz" className="text-gray-300 hover:text-white transition-colors">
                  Find Your Formula
                </Link>
              </li>
              <li>
                <Link href="/digital-michael" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Bot className="h-4 w-4 mr-1" />
                  Digital Michael AI
                </Link>
              </li>
              <li>
                <Link href="/user-dashboard" className="text-gray-300 hover:text-white transition-colors">
                  My Wellness
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-5 display-text">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <span>info@crowelogic.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <span>Phoenix, Arizona</span>
              </li>
              <li className="flex items-start">
                <Headphones className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <Link href="/digital-michael" className="text-gray-300 hover:text-white transition-colors">
                  Ask Digital Michael
                </Link>
              </li>
            </ul>
            
            <div className="mt-8">
              <a 
                href="https://michaelcrowemycology.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center border border-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-sm hover:border-gray-500 transition-colors"
              >
                Visit Michael Crowe Mycology
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Southwest Mushrooms - Crowe Logic™ Formulations Division. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}