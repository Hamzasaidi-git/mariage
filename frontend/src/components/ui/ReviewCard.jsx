import React from 'react';
import { FiUser, FiCalendar, FiThumbsUp } from 'react-icons/fi';
import StarRating from './StarRating';

const ReviewCard = ({ avis, showPrestataire = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      {/* Header avec informations utilisateur */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <FiUser className="w-5 h-5 text-primary-600" />
            <span className="sr-only">
              {getInitials(avis.utilisateur?.nom || 'Utilisateur')}
            </span>
          </div>
          
          {/* Nom et date */}
          <div>
            <h4 className="font-medium text-gray-900">
              {avis.utilisateur?.nom || 'Utilisateur anonyme'}
            </h4>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FiCalendar className="w-4 h-4 mr-1" />
              {formatDate(avis.createdAt)}
            </div>
          </div>
        </div>

        {/* Note */}
        <StarRating rating={avis.note} size="sm" />
      </div>

      {/* Titre de l'avis */}
      {avis.titre && (
        <h5 className="font-medium text-gray-900 mb-2">
          {avis.titre}
        </h5>
      )}

      {/* Commentaire */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {avis.commentaire}
      </p>

      {/* Prestataire (si affiché) */}
      {showPrestataire && avis.prestataire && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Avis pour{' '}
            <span className="font-medium text-gray-900">
              {avis.prestataire.nom}
            </span>
          </p>
        </div>
      )}

      {/* Footer avec actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {/* Recommandation */}
          {avis.recommande && (
            <div className="flex items-center text-green-600 text-sm">
              <FiThumbsUp className="w-4 h-4 mr-1" />
              Recommande
            </div>
          )}
        </div>

        {/* Statut de modération (pour admin) */}
        {avis.statut && (
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                avis.statut === 'APPROUVE'
                  ? 'bg-green-100 text-green-800'
                  : avis.statut === 'REJETE'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {avis.statut === 'APPROUVE' && 'Approuvé'}
              {avis.statut === 'REJETE' && 'Rejeté'}
              {avis.statut === 'EN_ATTENTE' && 'En attente'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;