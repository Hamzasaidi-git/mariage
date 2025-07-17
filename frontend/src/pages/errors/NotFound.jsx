import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page non trouvée - Annuaire Mariage Tunisie</title>
        <meta name="description" content="La page que vous cherchez n'existe pas ou a été déplacée." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Illustration 404 */}
          <div className="mb-8">
            <div className="text-6xl md:text-8xl font-bold text-primary-600 mb-4">
              404
            </div>
            <div className="w-64 h-32 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.1-5.5-2.709"
                />
              </svg>
            </div>
          </div>

          {/* Titre et description */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>

          {/* Suggestions */}
          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Que pouvez-vous faire ?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vérifiez l'URL dans la barre d'adresse</li>
                <li>• Retournez à la page d'accueil</li>
                <li>• Utilisez la recherche pour trouver des prestataires</li>
                <li>• Consultez nos catégories de services</li>
              </ul>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center"
            >
              <FiHome className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Link>
            
            <Link
              to="/prestataires"
              className="btn-secondary flex items-center justify-center"
            >
              <FiSearch className="w-5 h-5 mr-2" />
              Rechercher des prestataires
            </Link>
          </div>

          {/* Liens utiles */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Liens utiles :
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                to="/categories" 
                className="text-primary-600 hover:text-primary-700"
              >
                Catégories
              </Link>
              <Link 
                to="/about" 
                className="text-primary-600 hover:text-primary-700"
              >
                À propos
              </Link>
              <Link 
                to="/contact" 
                className="text-primary-600 hover:text-primary-700"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;