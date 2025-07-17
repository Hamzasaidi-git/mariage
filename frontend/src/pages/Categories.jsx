import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiGrid, FiUsers, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PrestataireCard from '../components/ui/PrestataireCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { categoryService, prestataireService } from '../services/api';

const Categories = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrestataires, setLoadingPrestataires] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      loadCategoryPrestataires(categoryId);
    }
  }, [categoryId]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      
      // Si on a un categoryId dans l'URL, trouver la catégorie correspondante
      if (categoryId) {
        const category = data.find(cat => cat.id === categoryId);
        setSelectedCategory(category);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryPrestataires = async (catId) => {
    try {
      setLoadingPrestataires(true);
      const data = await prestataireService.getByCategory(catId);
      setPrestataires(data);
    } catch (error) {
      console.error('Erreur lors du chargement des prestataires:', error);
      toast.error('Erreur lors du chargement des prestataires');
    } finally {
      setLoadingPrestataires(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    loadCategoryPrestataires(category.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory 
            ? `${selectedCategory.nom} - Catégories` 
            : 'Catégories'} - Annuaire Mariage Tunisie
        </title>
        <meta 
          name="description" 
          content={selectedCategory 
            ? `Découvrez tous nos prestataires dans la catégorie ${selectedCategory.nom}` 
            : 'Explorez toutes nos catégories de prestataires de mariage en Tunisie'
          } 
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container-custom py-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {selectedCategory ? selectedCategory.nom : 'Nos Catégories'}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {selectedCategory 
                  ? `Découvrez tous nos prestataires spécialisés en ${selectedCategory.nom.toLowerCase()}`
                  : 'Explorez toutes nos catégories de prestataires pour votre mariage de rêve'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {!selectedCategory ? (
            /* Vue des catégories */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  {/* Image de la catégorie */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiGrid className="w-16 h-16 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Badge nombre de prestataires */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <FiUsers className="w-3 h-3 mr-1" />
                        {category._count?.prestataires || 0}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {category.nom}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category._count?.prestataires || 0} prestataire{(category._count?.prestataires || 0) > 1 ? 's' : ''}
                      </span>
                      
                      <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                        Voir tout
                        <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Vue des prestataires de la catégorie */
            <div>
              {/* Breadcrumb */}
              <div className="mb-6">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                  <Link 
                    to="/categories" 
                    className="hover:text-primary-600 transition-colors"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Catégories
                  </Link>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{selectedCategory.nom}</span>
                </nav>
              </div>

              {/* Stats et filtres */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                  <p className="text-gray-600">
                    {prestataires.length} prestataire{prestataires.length > 1 ? 's' : ''} trouvé{prestataires.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="btn-secondary"
                  >
                    ← Retour aux catégories
                  </button>
                  
                  <Link
                    to={`/prestataires?categorie=${selectedCategory.id}`}
                    className="btn-primary"
                  >
                    Recherche avancée
                  </Link>
                </div>
              </div>

              {/* Liste des prestataires */}
              {loadingPrestataires ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : prestataires.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FiUsers className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun prestataire dans cette catégorie
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Il n'y a pas encore de prestataires dans la catégorie "{selectedCategory.nom}".
                  </p>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="btn-primary"
                  >
                    Explorer d'autres catégories
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prestataires.map(prestataire => (
                    <PrestataireCard
                      key={prestataire.id}
                      prestataire={prestataire}
                      showCategory={false}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section CTA */}
        {!selectedCategory && (
          <div className="bg-primary-600 text-white py-16">
            <div className="container-custom text-center">
              <h2 className="text-3xl font-bold mb-4">
                Vous êtes un prestataire ?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Rejoignez notre plateforme et développez votre activité
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-secondary">
                  Créer mon profil prestataire
                </Link>
                <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;