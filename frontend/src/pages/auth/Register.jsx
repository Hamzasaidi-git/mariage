// Page d'inscription
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHeart } from 'react-icons/fi';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Inscription - Annuaire Mariage Tunisie</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <FiHeart className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-serif font-bold text-secondary-800">
                Mariage Tunisie
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-secondary-800 mb-2">
              Page en construction
            </h2>
            <p className="text-secondary-600">
              La page d'inscription sera bientôt disponible.
            </p>
          </div>

          <div className="text-center">
            <Link to="/login" className="btn-primary">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;