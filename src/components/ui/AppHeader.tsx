import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AppHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="py-4 px-6 fixed top-0 left-0 right-0 bg-slate-900/50 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
          Controla+
        </Link>
        <nav className="flex items-center space-x-6">
          {currentUser ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/meu-dinheiro" className="text-slate-300 hover:text-white transition-colors">Meu Dinheiro</Link>
                <Link to="/business-money" className="text-slate-300 hover:text-white transition-colors">Business Money</Link>
                <Link to="/brasil" className="text-slate-300 hover:text-white transition-colors">Brasil</Link>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-slate-400 text-sm">{currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};