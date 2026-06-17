import { Leaf } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Dashboard', path: '/results' },
    { name: 'History', path: '/history' },
    { name: 'Roadmap', path: '/roadmap' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <Leaf className="w-8 h-8 fill-primary" />
            <div>
              <h1 className="font-bold text-xl leading-tight">CarbonSaathi</h1>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Your Carbon Companion</p>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
