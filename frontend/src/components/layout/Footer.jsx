// Composant Footer
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FiHeart className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-serif font-bold">
                Mariage Tunisie
              </span>
            </Link>
            <p className="text-secondary-300 mb-6 max-w-md">
              L'annuaire de référence pour organiser votre mariage de rêve en Tunisie. 
              Trouvez les meilleurs prestataires pour votre jour J.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/prestataires" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Prestataires
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Catégories
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories populaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/categories/Espaces de fêtes" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Espaces de fêtes
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/Traiteurs" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Traiteurs
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/Coiffeurs" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Coiffeurs
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/Maquilleurs" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Maquilleurs
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/Bijouteries" 
                  className="text-secondary-300 hover:text-white transition-colors"
                >
                  Bijouteries
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-secondary-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <FiMail className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-300">
                contact@mariage-tunisie.com
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-300">
                +216 XX XXX XXX
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMapPin className="h-5 w-5 text-primary-400" />
              <span className="text-secondary-300">
                Tunis, Tunisie
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-secondary-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              © {currentYear} Mariage Tunisie. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <a 
                href="#" 
                className="text-secondary-400 hover:text-white transition-colors"
              >
                Conditions d'utilisation
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-white transition-colors"
              >
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;