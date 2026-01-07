
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Wallet, Briefcase, MapPin } from 'lucide-react';

const Layout: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30 shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Controla+
              </NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" className={navLinkClasses}>
                <Home size={18} /> Home
              </NavLink>
              <NavLink to="/meu-dinheiro" className={navLinkClasses}>
                <Wallet size={18} /> Meu Dinheiro
              </NavLink>
              <NavLink to="/business-money" className={navLinkClasses}>
                <Briefcase size={18} /> Business Money
              </NavLink>
              <NavLink to="/brasil" className={navLinkClasses}>
                <MapPin size={18} /> Brasil
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
