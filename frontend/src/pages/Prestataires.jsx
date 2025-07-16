import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiFilter, FiGrid, FiList, FiMapPin, FiEuro } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PrestataireCard from '../components/ui/PrestataireCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { prestataireService, categoryService } from '../services/api';

const Prestataires = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [prestataires, setPrestataires] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    hasNext: false
  });

  // États des filtres
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categorie: searchParams.get('categorie') || '',
    ville: searchParams.get('ville') || '',
    prixMin: searchParams.get('prixMin') || '',
    prixMax: searchParams.get('prixMax') || '',
    note: searchParams.get('note') || ''
  });

  // Villes populaires en Tunisie
  const villesPopulaires = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 
    'Ariana', 'Gafsa', 'Monastir', 'Ben Arous', 'Kasserine', 'Mahdia'
  ];

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    loadCategories();
  }, []);

  // Charger les prestataires
  useEffect(() => {
    loadPrestataires(1);
  }, [filters]);

  const loadPrestataires = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page,
        limit: pagination.limit,
        search: filters.search || undefined,
        categorieId: filters.categorie || undefined,
        ville: filters.ville || undefined,
        prixMin: filters.prixMin || undefined,
        prixMax: filters.prixMax || undefined,
        noteMin: filters.note || undefined
      };

      // Nettoyer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const data = await prestataireService.getAll(params);
      
      if (append) {
        setPrestataires(prev => [...prev, ...data.prestataires]);
      } else {
        setPrestataires(data.prestataires);
      }

      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        hasNext: data.hasNext
      });

      // Mettre à jour l'URL
      const newSearchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        }
      });
      setSearchParams(newSearchParams);

    } catch (error) {
      console.error('Erreur lors du chargement des prestataires:', error);
      toast.error('Erreur lors du chargement des prestataires');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categorie: '',
      ville: '',
      prixMin: '',
      prixMax: '',
      note: ''
    });
  };

  const loadMore = () => {
    if (pagination.hasNext && !loadingMore) {
      loadPrestataires(pagination.page + 1, true);
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <>
      <Helmet>
        <title>Prestataires - Annuaire Mariage Tunisie</title>
        <meta name="description" content="Découvrez tous nos prestataires de mariage en Tunisie. Trouvez les meilleurs professionnels pour votre grand jour." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Header avec recherche */}
        <div className="bg-white shadow-sm border-b">
          <div className="container-custom py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Nos Prestataires
                </h1>
                <p className="text-gray-600 mt-1">
                  {pagination.total} prestataire{pagination.total > 1 ? 's' : ''} disponible{pagination.total > 1 ? 's' : ''}
                </p>
              </div>

              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un prestataire..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar avec filtres */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Effacer tout
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Catégorie
                    </label>
                    <select
                      value={filters.categorie}
                      onChange={(e) => handleFilterChange('categorie', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ville */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <FiMapPin className="inline w-4 h-4 mr-1" />
                      Ville
                    </label>
                    <select
                      value={filters.ville}
                      onChange={(e) => handleFilterChange('ville', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Toutes les villes</option>
                      {villesPopulaires.map(ville => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <FiEuro className="inline w-4 h-4 mr-1" />
                      Fourchette de prix (DT)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.prixMin}
                        onChange={(e) => handleFilterChange('prixMin', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.prixMax}
                        onChange={(e) => handleFilterChange('prixMax', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Note minimale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Note minimale
                    </label>
                    <select
                      value={filters.note}
                      onChange={(e) => handleFilterChange('note', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Toutes les notes</option>
                      <option value="4">4 étoiles et plus</option>
                      <option value="3">3 étoiles et plus</option>
                      <option value="2">2 étoiles et plus</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1">
              {/* Barre d'outils */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-secondary flex items-center"
                >
                  <FiFilter className="w-4 h-4 mr-2" />
                  Filtres
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Vue :</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Liste des prestataires */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : prestataires.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiSearch className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun prestataire trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="btn-primary"
                    >
                      Effacer les filtres
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                      : 'space-y-4'
                  }`}>
                    {prestataires.map(prestataire => (
                      <PrestataireCard
                        key={prestataire.id}
                        prestataire={prestataire}
                        showCategory={!filters.categorie}
                      />
                    ))}
                  </div>

                  {/* Bouton charger plus */}
                  {pagination.hasNext && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="btn-primary"
                      >
                        {loadingMore ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Chargement...
                          </>
                        ) : (
                          'Charger plus'
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prestataires;