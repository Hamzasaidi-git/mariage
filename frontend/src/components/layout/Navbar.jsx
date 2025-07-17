// Composant de navigation principal
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiHeart, 
  FiUser, 
  FiLogOut,
  FiSettings,
  FiMessageCircle
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Prestataires', href: '/prestataires' },
    { name: 'Catégories', href: '/categories' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FiHeart className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-serif font-bold text-secondary-800">
              Mariage Tunisie
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  <FiUser className="h-5 w-5" />
                  <span className="font-medium">{user?.nom}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiUser className="h-4 w-4 mr-3" />
                      Mon profil
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiSettings className="h-4 w-4 mr-3" />
                      Dashboard
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="h-4 w-4 mr-3" />
                        Administration
                      </Link>
                    )}

                    <hr className="my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4 mr-3" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary btn-sm"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <hr className="border-secondary-200" />

              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <span className="text-sm font-medium text-secondary-800">
                    Bonjour, {user?.nom}
                  </span>
                  
                  <Link
                    to="/profile"
                    className="flex items-center text-secondary-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="h-4 w-4 mr-3" />
                    Mon profil
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className="flex items-center text-secondary-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiSettings className="h-4 w-4 mr-3" />
                    Dashboard
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="flex items-center text-secondary-600 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiSettings className="h-4 w-4 mr-3" />
                      Administration
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-red-600"
                  >
                    <FiLogOut className="h-4 w-4 mr-3" />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="text-base font-medium text-secondary-600 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary w-fit"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer les menus */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;