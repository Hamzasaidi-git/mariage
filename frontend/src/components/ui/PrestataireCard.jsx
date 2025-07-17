import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiExternalLink, FiHeart, FiEuro } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import StarRating from './StarRating';

const PrestataireCard = ({ prestataire, showCategory = true }) => {
  const baseImageUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-service.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseImageUrl}${imagePath}`;
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix sur demande';
    return `À partir de ${price} DT`;
  };

  const formatPhone = (phone) => {
    if (!phone) return null;
    return phone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const getWhatsappLink = (phone) => {
    const cleanPhone = phone?.replace(/\D/g, '');
    return `https://wa.me/216${cleanPhone}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(prestataire.image)}
          alt={prestataire.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/placeholder-service.jpg';
          }}
        />
        
        {/* Badge catégorie */}
        {showCategory && prestataire.categorie && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {prestataire.categorie.nom}
            </span>
          </div>
        )}

        {/* Bouton favoris */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200">
          <FiHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Overlay avec lien */}
        <Link
          to={`/prestataires/${prestataire.id}`}
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
        >
          <FiExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Nom et rating */}
        <div className="mb-3">
          <Link to={`/prestataires/${prestataire.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 mb-1">
              {prestataire.nom}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <StarRating 
              rating={prestataire.notemoyenne || 0} 
              size="sm" 
            />
            {prestataire._count?.avis > 0 && (
              <span className="text-sm text-gray-500">
                {prestataire._count.avis} avis
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {prestataire.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {prestataire.description}
          </p>
        )}

        {/* Localisation */}
        {prestataire.ville && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <FiMapPin className="w-4 h-4 mr-2" />
            {prestataire.ville}, {prestataire.region || 'Tunisie'}
          </div>
        )}

        {/* Prix */}
        {prestataire.prixBase && (
          <div className="flex items-center text-primary-600 font-medium text-sm mb-4">
            <FiEuro className="w-4 h-4 mr-1" />
            {formatPrice(prestataire.prixBase)}
          </div>
        )}

        {/* Contact rapide */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {/* WhatsApp */}
            {prestataire.telephone && (
              <a
                href={getWhatsappLink(prestataire.telephone)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                title="Contacter via WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            )}

            {/* Instagram */}
            {prestataire.instagram && (
              <a
                href={prestataire.instagram.startsWith('http') 
                  ? prestataire.instagram 
                  : `https://instagram.com/${prestataire.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-200"
                title="Voir sur Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            )}

            {/* Téléphone */}
            {prestataire.telephone && (
              <a
                href={`tel:${prestataire.telephone}`}
                className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                title={formatPhone(prestataire.telephone)}
              >
                <FiPhone className="w-4 h-4" />
              </a>
            )}

            {/* Email */}
            {prestataire.email && (
              <a
                href={`mailto:${prestataire.email}`}
                className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200"
                title="Envoyer un email"
              >
                <FiMail className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Bouton voir plus */}
          <Link
            to={`/prestataires/${prestataire.id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
          >
            Voir plus →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrestataireCard;