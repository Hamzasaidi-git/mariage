import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiUser, FiCamera, FiStar, FiEye, FiMessageSquare, 
  FiEdit3, FiSave, FiX, FiUpload, FiTrash2, FiBarChart3
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import StarRating from '../../components/ui/StarRating';
import ReviewCard from '../../components/ui/ReviewCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { prestataireService, avisService, uploadService, categoryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(true);
  const [prestataire, setPrestataire] = useState(null);
  const [avis, setAvis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalAvis: 0,
    noteMoyenne: 0,
    totalVues: 0,
    messagesRecus: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (user?.role === 'PRESTATAIRE') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prestataireData, avisData, categoriesData] = await Promise.all([
        prestataireService.getAll({ userId: user.id }),
        avisService.getAll({ prestataireId: user.prestataireId }),
        categoryService.getAll()
      ]);

      if (prestataireData.prestataires.length > 0) {
        const prestataireInfo = prestataireData.prestataires[0];
        setPrestataire(prestataireInfo);
        
        // Pré-remplir le formulaire
        Object.keys(prestataireInfo).forEach(key => {
          if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            setValue(key, prestataireInfo[key]);
          }
        });
      }

      setAvis(avisData);
      setCategories(categoriesData);

      // Calculer les statistiques
      const noteMoyenne = avisData.length > 0 
        ? avisData.reduce((sum, avis) => sum + avis.note, 0) / avisData.length 
        : 0;
      
      setStats({
        totalAvis: avisData.length,
        noteMoyenne: noteMoyenne,
        totalVues: prestataireData.prestataires[0]?.vues || 0,
        messagesRecus: 0 // À implémenter avec l'API des messages
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      if (!prestataire) return;

      const updatedData = await prestataireService.update(prestataire.id, data);
      setPrestataire(updatedData);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      setUploading(true);
      const uploadData = await uploadService.uploadImage(file, 'prestataires');
      
      const updatedData = await prestataireService.update(prestataire.id, {
        image: uploadData.url
      });
      
      setPrestataire(updatedData);
      toast.success('Image mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  if (user?.role !== 'PRESTATAIRE') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600">
            Cette page est réservée aux prestataires.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'profil', label: 'Mon Profil', icon: FiUser },
    { id: 'photos', label: 'Photos', icon: FiCamera },
    { id: 'avis', label: 'Avis Clients', icon: FiStar },
    { id: 'stats', label: 'Statistiques', icon: FiBarChart3 }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard Prestataire - Annuaire Mariage Tunisie</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Prestataire
            </h1>
            <p className="text-gray-600">
              Gérez votre profil et suivez vos performances
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiEye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVues}</p>
                  <p className="text-gray-600 text-sm">Vues du profil</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiStar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.noteMoyenne.toFixed(1)}
                  </p>
                  <p className="text-gray-600 text-sm">Note moyenne</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiMessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAvis}</p>
                  <p className="text-gray-600 text-sm">Avis reçus</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiMessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.messagesRecus}</p>
                  <p className="text-gray-600 text-sm">Messages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Onglet Profil */}
              {activeTab === 'profil' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Informations du profil
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-primary flex items-center"
                    >
                      {isEditing ? (
                        <>
                          <FiX className="w-4 h-4 mr-2" />
                          Annuler
                        </>
                      ) : (
                        <>
                          <FiEdit3 className="w-4 h-4 mr-2" />
                          Modifier
                        </>
                      )}
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'entreprise *
                          </label>
                          <input
                            {...register('nom', { required: 'Le nom est requis' })}
                            className={`input ${errors.nom ? 'input-error' : ''}`}
                          />
                          {errors.nom && (
                            <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie *
                          </label>
                          <select
                            {...register('categorieId', { required: 'La catégorie est requise' })}
                            className={`input ${errors.categorieId ? 'input-error' : ''}`}
                          >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.nom}
                              </option>
                            ))}
                          </select>
                          {errors.categorieId && (
                            <p className="mt-1 text-sm text-red-600">{errors.categorieId.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ville *
                          </label>
                          <input
                            {...register('ville', { required: 'La ville est requise' })}
                            className={`input ${errors.ville ? 'input-error' : ''}`}
                          />
                          {errors.ville && (
                            <p className="mt-1 text-sm text-red-600">{errors.ville.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Région
                          </label>
                          <input
                            {...register('region')}
                            className="input"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone *
                          </label>
                          <input
                            {...register('telephone', { required: 'Le téléphone est requis' })}
                            className={`input ${errors.telephone ? 'input-error' : ''}`}
                          />
                          {errors.telephone && (
                            <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            {...register('email')}
                            className="input"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix de base (DT)
                          </label>
                          <input
                            type="number"
                            {...register('prixBase')}
                            className="input"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instagram
                          </label>
                          <input
                            {...register('instagram')}
                            className="input"
                            placeholder="@username ou URL complète"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className="input"
                          placeholder="Décrivez votre entreprise et vos services..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Services proposés
                        </label>
                        <textarea
                          {...register('services')}
                          rows={3}
                          className="input"
                          placeholder="Listez vos services séparés par des virgules"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button type="submit" className="btn-primary flex items-center">
                          <FiSave className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-900">Nom</h3>
                        <p className="text-gray-600">{prestataire?.nom || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Catégorie</h3>
                        <p className="text-gray-600">{prestataire?.categorie?.nom || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Ville</h3>
                        <p className="text-gray-600">{prestataire?.ville || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Téléphone</h3>
                        <p className="text-gray-600">{prestataire?.telephone || 'Non renseigné'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="font-medium text-gray-900">Description</h3>
                        <p className="text-gray-600">{prestataire?.description || 'Aucune description'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Photos */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Photo de profil
                    </h2>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={prestataire?.image || '/images/placeholder-service.jpg'}
                        alt="Photo de profil"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="btn-primary cursor-pointer flex items-center">
                        <FiUpload className="w-4 h-4 mr-2" />
                        Changer la photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Format accepté: JPG, PNG. Taille max: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Avis */}
              {activeTab === 'avis' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Avis clients ({avis.length})
                    </h2>
                    <div className="flex items-center space-x-4">
                      <StarRating rating={stats.noteMoyenne} size="md" />
                    </div>
                  </div>

                  {avis.length === 0 ? (
                    <div className="text-center py-8">
                      <FiStar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun avis pour le moment
                      </h3>
                      <p className="text-gray-600">
                        Les avis de vos clients apparaîtront ici.
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
              )}

              {/* Onglet Statistiques */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Statistiques de performance
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Aperçu général</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profil créé le:</span>
                          <span className="font-medium">
                            {prestataire?.createdAt ? new Date(prestataire.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dernière mise à jour:</span>
                          <span className="font-medium">
                            {prestataire?.updatedAt ? new Date(prestataire.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut:</span>
                          <span className="font-medium text-green-600">Actif</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Prochaines améliorations</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Statistiques détaillées des vues</li>
                        <li>• Analyse des recherches</li>
                        <li>• Rapports mensuels</li>
                        <li>• Comparaison avec la concurrence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;