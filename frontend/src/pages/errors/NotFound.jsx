import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome } from 'react-icons/fi';

const NotFound = () => (
  <>
    <Helmet><title>Page non trouvée - Annuaire Mariage Tunisie</title></Helmet>
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
        <h1 className="text-3xl font-bold text-secondary-800 mb-4">Page non trouvée</h1>
        <p className="text-secondary-600 mb-8">La page que vous recherchez n'existe pas.</p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <FiHome className="mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  </>
);

export default NotFound;