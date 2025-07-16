import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiEuro, 
  FiArrowLeft, FiShare2, FiHeart, FiChevronLeft, FiChevronRight,
  FiX, FiMessageSquare
} from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import StarRating from '../components/ui/StarRating';
import ReviewCard from '../components/ui/ReviewCard';
import ReviewForm from '../components/ui/ReviewForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { prestataireService, avisService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PrestataireDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [prestataire, setPrestataire] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvis, setLoadingAvis] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const baseImageUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    loadPrestataire();
    loadAvis();
  }, [id]);

  const loadPrestataire = async () => {
    try {
      setLoading(true);
      const data = await prestataireService.getById(id);
      setPrestataire(data);
    } catch (error) {
      console.error('Erreur lors du chargement du prestataire:', error);
      toast.error('Prestataire non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const loadAvis = async () => {
    try {
      setLoadingAvis(true);
      const data = await avisService.getByPrestataire(id);
      setAvis(data);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoadingAvis(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-service.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseImageUrl}${imagePath}`;
  };

  const formatPhone = (phone) => {
    if (!phone) return null;
    return phone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const getWhatsappLink = (phone) => {
    const cleanPhone = phone?.replace(/\D/g, '');
    return `https://wa.me/216${cleanPhone}`;
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    loadAvis();
  };

  const sharePrestataire = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prestataire.nom,
          text: `Découvrez ${prestataire.nom} sur notre annuaire mariage`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const nextImage = () => {
    if (prestataire?.gallery) {
      setCurrentImageIndex((prev) => 
        prev === prestataire.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (prestataire?.gallery) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? prestataire.gallery.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!prestataire) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Prestataire non trouvé
          </h2>
          <Link to="/prestataires" className="btn-primary">
            Retour aux prestataires
          </Link>
        </div>
      </div>
    );
  }

  const mockGallery = [
    prestataire.image,
    '/images/wedding-gallery-1.jpg',
    '/images/wedding-gallery-2.jpg',
    '/images/wedding-gallery-3.jpg',
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{prestataire.nom} - Annuaire Mariage Tunisie</title>
        <meta name="description" content={prestataire.description || `Découvrez ${prestataire.nom}, prestataire de mariage en Tunisie.`} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/prestataires"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Retour aux prestataires
              </Link>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={sharePrestataire}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                  title="Partager"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
                  title="Ajouter aux favoris"
                >
                  <FiHeart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-64 md:h-80">
                  <img
                    src={getImageUrl(prestataire.image)}
                    alt={prestataire.nom}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openGallery(0)}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-service.jpg';
                    }}
                  />
                  {mockGallery.length > 1 && (
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={() => openGallery(0)}
                        className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Voir les {mockGallery.length} photos
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations principales */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {prestataire.nom}
                    </h1>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {prestataire.categorie?.nom}
                      </span>
                      {prestataire.ville && (
                        <div className="flex items-center text-gray-600">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {prestataire.ville}
                        </div>
                      )}
                    </div>
                    <StarRating rating={prestataire.notemoyenne || 0} size="md" />
                  </div>
                  
                  {prestataire.prixBase && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {prestataire.prixBase} DT
                      </p>
                      <p className="text-sm text-gray-600">À partir de</p>
                    </div>
                  )}
                </div>

                {prestataire.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {prestataire.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Services et détails */}
              {(prestataire.services || prestataire.specialites) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Services proposés
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prestataire.services && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Services</h3>
                        <ul className="space-y-1 text-gray-600">
                          {prestataire.services.split(',').map((service, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                              {service.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {prestataire.specialites && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Spécialités</h3>
                        <ul className="space-y-1 text-gray-600">
                          {prestataire.specialites.split(',').map((specialite, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                              {specialite.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Avis */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Avis clients ({avis.length})
                  </h2>
                  {user && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn-primary"
                    >
                      <FiMessageSquare className="w-4 h-4 mr-2" />
                      Laisser un avis
                    </button>
                  )}
                </div>

                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm
                      prestataireId={id}
                      onSuccess={handleReviewSuccess}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}

                {loadingAvis ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : avis.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Aucun avis pour le moment. Soyez le premier à laisser votre avis !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {avis.map(avisSingle => (
                      <ReviewCard key={avisSingle.id} avis={avisSingle} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar contact */}
            <div className="space-y-6">
              {/* Contact rapide */}
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contacter {prestataire.nom}
                </h3>
                
                <div className="space-y-4">
                  {prestataire.telephone && (
                    <a
                      href={getWhatsappLink(prestataire.telephone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaWhatsapp className="w-5 h-5 mr-2" />
                      WhatsApp
                    </a>
                  )}

                  {prestataire.telephone && (
                    <a
                      href={`tel:${prestataire.telephone}`}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FiPhone className="w-5 h-5 mr-2" />
                      {formatPhone(prestataire.telephone)}
                    </a>
                  )}

                  {prestataire.email && (
                    <a
                      href={`mailto:${prestataire.email}`}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FiMail className="w-5 h-5 mr-2" />
                      Email
                    </a>
                  )}

                  {prestataire.instagram && (
                    <a
                      href={prestataire.instagram.startsWith('http') 
                        ? prestataire.instagram 
                        : `https://instagram.com/${prestataire.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaInstagram className="w-5 h-5 mr-2" />
                      Instagram
                    </a>
                  )}

                  {prestataire.siteWeb && (
                    <a
                      href={prestataire.siteWeb.startsWith('http') 
                        ? prestataire.siteWeb 
                        : `https://${prestataire.siteWeb}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FiGlobe className="w-5 h-5 mr-2" />
                      Site web
                    </a>
                  )}
                </div>

                {/* Informations supplémentaires */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Informations</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {prestataire.ville && (
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        {prestataire.ville}, {prestataire.region || 'Tunisie'}
                      </div>
                    )}
                    {prestataire.horaires && (
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-2" />
                        {prestataire.horaires}
                      </div>
                    )}
                    {prestataire.prixBase && (
                      <div className="flex items-center">
                        <FiEuro className="w-4 h-4 mr-2" />
                        À partir de {prestataire.prixBase} DT
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal galerie */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FiX className="w-8 h-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
            >
              <FiChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
            >
              <FiChevronRight className="w-8 h-8" />
            </button>

            <img
              src={getImageUrl(mockGallery[currentImageIndex])}
              alt={`Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = '/images/placeholder-service.jpg';
              }}
            />

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {currentImageIndex + 1} / {mockGallery.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrestataireDetail;