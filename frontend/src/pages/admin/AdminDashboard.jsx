import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FiUsers, FiStar, FiMessageSquare, FiBarChart3, 
  FiSettings, FiEye, FiEdit3, FiTrash2, FiCheck, FiX,
  FiPlus, FiFilter, FiDownload
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import StarRating from '../../components/ui/StarRating';
import ReviewCard from '../../components/ui/ReviewCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  prestataireService, 
  avisService, 
  categoryService, 
  statsService,
  authService 
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [prestataires, setPrestataires] = useState([]);
  const [avis, setAvis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalPrestataires: 0,
    totalAvis: 0,
    totalUsers: 0,
    avisEnAttente: 0
  });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [
        prestataireData,
        avisData,
        categoriesData,
        usersData
      ] = await Promise.all([
        prestataireService.getAll(),
        avisService.getAll(),
        categoryService.getAll(),
        authService.getCurrentUser().catch(() => ({ users: [] })) // Fallback si pas d'API users
      ]);

      setPrestataires(prestataireData.prestataires || prestataireData);
      setAvis(avisData);
      setCategories(categoriesData);
      setUsers(usersData.users || []);

      // Calculer les statistiques
      const avisEnAttente = avisData.filter(a => a.statut === 'EN_ATTENTE').length;
      
      setStats({
        totalPrestataires: prestataireData.prestataires?.length || prestataireData.length || 0,
        totalAvis: avisData.length,
        totalUsers: usersData.users?.length || 0,
        avisEnAttente: avisEnAttente
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données admin:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrestataire = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prestataire ?')) return;

    try {
      await prestataireService.delete(id);
      setPrestataires(prev => prev.filter(p => p.id !== id));
      toast.success('Prestataire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleApproveAvis = async (id) => {
    try {
      await avisService.approve(id);
      setAvis(prev => prev.map(a => 
        a.id === id ? { ...a, statut: 'APPROUVE' } : a
      ));
      toast.success('Avis approuvé');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleRejectAvis = async (id) => {
    try {
      await avisService.reject(id);
      setAvis(prev => prev.map(a => 
        a.id === id ? { ...a, statut: 'REJETE' } : a
      ));
      toast.success('Avis rejeté');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const handleDeleteAvis = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;

    try {
      await avisService.delete(id);
      setAvis(prev => prev.filter(a => a.id !== id));
      toast.success('Avis supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès refusé
          </h2>
          <p className="text-gray-600">
            Cette page est réservée aux administrateurs.
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
    { id: 'overview', label: 'Vue d\'ensemble', icon: FiBarChart3 },
    { id: 'prestataires', label: 'Prestataires', icon: FiUsers },
    { id: 'avis', label: 'Modération Avis', icon: FiStar },
    { id: 'categories', label: 'Catégories', icon: FiSettings },
    { id: 'users', label: 'Utilisateurs', icon: FiUsers }
  ];

  return (
    <>
      <Helmet>
        <title>Administration - Annuaire Mariage Tunisie</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel d'Administration
            </h1>
            <p className="text-gray-600">
              Gérez votre plateforme et modérez le contenu
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPrestataires}</p>
                  <p className="text-gray-600 text-sm">Prestataires</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FiStar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAvis}</p>
                  <p className="text-gray-600 text-sm">Avis clients</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-gray-600 text-sm">Utilisateurs</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FiMessageSquare className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.avisEnAttente}</p>
                  <p className="text-gray-600 text-sm">En attente</p>
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
                    {tab.id === 'avis' && stats.avisEnAttente > 0 && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {stats.avisEnAttente}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Onglet Vue d'ensemble */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Vue d'ensemble de la plateforme
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activité récente */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Activité récente</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Nouveaux prestataires cette semaine</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Avis publiés cette semaine</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
                          <span className="font-medium">8</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-4">Actions rapides</h3>
                      <div className="space-y-3">
                        {stats.avisEnAttente > 0 && (
                          <button
                            onClick={() => setActiveTab('avis')}
                            className="w-full text-left bg-red-50 border border-red-200 rounded-lg p-3 hover:bg-red-100 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-red-800 font-medium">
                                {stats.avisEnAttente} avis en attente
                              </span>
                              <span className="text-red-600">→</span>
                            </div>
                          </button>
                        )}
                        
                        <button
                          onClick={() => setActiveTab('prestataires')}
                          className="w-full text-left bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-blue-800 font-medium">
                              Gérer les prestataires
                            </span>
                            <span className="text-blue-600">→</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveTab('categories')}
                          className="w-full text-left bg-green-50 border border-green-200 rounded-lg p-3 hover:bg-green-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-green-800 font-medium">
                              Gérer les catégories
                            </span>
                            <span className="text-green-600">→</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Prestataires */}
              {activeTab === 'prestataires' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Gestion des prestataires ({prestataires.length})
                    </h2>
                    <div className="flex space-x-3">
                      <button className="btn-secondary flex items-center">
                        <FiFilter className="w-4 h-4 mr-2" />
                        Filtrer
                      </button>
                      <button className="btn-secondary flex items-center">
                        <FiDownload className="w-4 h-4 mr-2" />
                        Exporter
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prestataire
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Catégorie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ville
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Note
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prestataires.map(prestataire => (
                            <tr key={prestataire.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    src={prestataire.image || '/images/placeholder-service.jpg'}
                                    alt={prestataire.nom}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {prestataire.nom}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {prestataire.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {prestataire.categorie?.nom || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {prestataire.ville}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StarRating rating={prestataire.notemoyenne || 0} size="sm" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Actif
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Voir"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="text-gray-600 hover:text-gray-900"
                                    title="Modifier"
                                  >
                                    <FiEdit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePrestataire(prestataire.id)}
                                    className="text-red-600 hover:text-red-900"
                                    title="Supprimer"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Modération Avis */}
              {activeTab === 'avis' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Modération des avis ({avis.length})
                    </h2>
                    <div className="flex space-x-2">
                      <span className="text-sm text-gray-600">
                        {stats.avisEnAttente} en attente de modération
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {avis.map(avisSingle => (
                      <div key={avisSingle.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <ReviewCard avis={avisSingle} showPrestataire={true} />
                          </div>
                          
                          {avisSingle.statut === 'EN_ATTENTE' && (
                            <div className="ml-4 flex flex-col space-y-2">
                              <button
                                onClick={() => handleApproveAvis(avisSingle.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center text-sm"
                              >
                                <FiCheck className="w-4 h-4 mr-1" />
                                Approuver
                              </button>
                              <button
                                onClick={() => handleRejectAvis(avisSingle.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm"
                              >
                                <FiX className="w-4 h-4 mr-1" />
                                Rejeter
                              </button>
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleDeleteAvis(avisSingle.id)}
                            className="ml-2 text-red-600 hover:text-red-900"
                            title="Supprimer définitivement"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {avis.length === 0 && (
                      <div className="text-center py-8">
                        <FiStar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun avis à modérer
                        </h3>
                        <p className="text-gray-600">
                          Les nouveaux avis apparaîtront ici pour modération.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Onglet Catégories */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Gestion des catégories ({categories.length})
                    </h2>
                    <button className="btn-primary flex items-center">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Ajouter une catégorie
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(category => (
                      <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {category.nom}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              title="Modifier"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {category.description && (
                          <p className="text-gray-600 mb-4">
                            {category.description}
                          </p>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          {category._count?.prestataires || 0} prestataire(s)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Onglet Utilisateurs */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Gestion des utilisateurs ({stats.totalUsers})
                    </h2>
                  </div>

                  <div className="text-center py-8">
                    <FiUsers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Gestion des utilisateurs
                    </h3>
                    <p className="text-gray-600">
                      Cette fonctionnalité sera bientôt disponible.
                    </p>
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

export default AdminDashboard;