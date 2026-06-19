import { useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Dashboard', path: '/results' },
    { name: 'History', path: '/history' },
    { name: 'Roadmap', path: '/roadmap' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
            aria-label="CarbonSaathi — go to home page"
          >
            <Leaf className="w-8 h-8 fill-primary" aria-hidden="true" />
            <div>
              <span className="font-bold text-xl leading-tight block">CarbonSaathi</span>
              <span className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">Your Carbon Companion</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className={`text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1 py-0.5 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-gray-100 bg-white px-4 py-3"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={closeMobileMenu}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    location.pathname === link.path
                      ? 'text-primary bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
