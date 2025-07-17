import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiHeart, FiUser, FiStore } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService, categoryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('CLIENT'); // CLIENT ou PRESTATAIRE
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (userType === 'PRESTATAIRE') {
      loadCategories();
    }
  }, [userType]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const userData = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        role: userType
      };

      // Si c'est un prestataire, ajouter les informations supplémentaires
      if (userType === 'PRESTATAIRE') {
        userData.prestataire = {
          nom: data.nomEntreprise,
          categorieId: data.categorieId,
          ville: data.ville,
          telephone: data.telephone,
          description: data.description
        };
      }

      const result = await authService.register(userData);
      
      if (result.success) {
        toast.success('Compte créé avec succès !');
        
        // Connexion automatique
        const loginResult = await login({
          email: data.email,
          password: data.password
        });
        
        if (loginResult.success) {
          if (userType === 'PRESTATAIRE') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        toast.error(result.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inscription - Annuaire Mariage Tunisie</title>
        <meta name="description" content="Créez votre compte pour accéder à notre annuaire mariage ou rejoindre notre communauté de prestataires." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <FiHeart className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-serif font-bold text-secondary-800">
                Mariage Tunisie
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-secondary-800 mb-2">
              Créer votre compte
            </h2>
            <p className="text-secondary-600">
              Rejoignez notre communauté de mariés et prestataires
            </p>
          </div>

          {/* Sélecteur de type d'utilisateur */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quel type de compte souhaitez-vous créer ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setUserType('CLIENT');
                    reset();
                  }}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    userType === 'CLIENT'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiUser className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Client</div>
                  <div className="text-sm text-gray-600">
                    Je cherche des prestataires pour mon mariage
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserType('PRESTATAIRE');
                    reset();
                  }}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    userType === 'PRESTATAIRE'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FiStore className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-medium">Prestataire</div>
                  <div className="text-sm text-gray-600">
                    Je propose des services de mariage
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Informations personnelles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      {...register('prenom', { required: 'Le prénom est requis' })}
                      className={`input ${errors.prenom ? 'input-error' : ''}`}
                    />
                    {errors.prenom && (
                      <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      id="nom"
                      type="text"
                      {...register('nom', { required: 'Le nom est requis' })}
                      className={`input ${errors.nom ? 'input-error' : ''}`}
                    />
                    {errors.nom && (
                      <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format d\'email invalide'
                    }
                  })}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Mots de passe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Le mot de passe est requis',
                        minLength: {
                          value: 6,
                          message: 'Le mot de passe doit contenir au moins 6 caractères'
                        }
                      })}
                      className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'La confirmation est requise',
                        validate: value => value === password || 'Les mots de passe ne correspondent pas'
                      })}
                      className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Informations prestataire */}
              {userType === 'PRESTATAIRE' && (
                <>
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Informations de votre entreprise
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="nomEntreprise" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom de l'entreprise *
                        </label>
                        <input
                          id="nomEntreprise"
                          type="text"
                          {...register('nomEntreprise', { 
                            required: userType === 'PRESTATAIRE' ? 'Le nom de l\'entreprise est requis' : false 
                          })}
                          className={`input ${errors.nomEntreprise ? 'input-error' : ''}`}
                        />
                        {errors.nomEntreprise && (
                          <p className="mt-1 text-sm text-red-600">{errors.nomEntreprise.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="categorieId" className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie *
                          </label>
                          <select
                            id="categorieId"
                            {...register('categorieId', { 
                              required: userType === 'PRESTATAIRE' ? 'La catégorie est requise' : false 
                            })}
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
                          <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
                            Ville *
                          </label>
                          <input
                            id="ville"
                            type="text"
                            {...register('ville', { 
                              required: userType === 'PRESTATAIRE' ? 'La ville est requise' : false 
                            })}
                            className={`input ${errors.ville ? 'input-error' : ''}`}
                          />
                          {errors.ville && (
                            <p className="mt-1 text-sm text-red-600">{errors.ville.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          id="telephone"
                          type="tel"
                          {...register('telephone', { 
                            required: userType === 'PRESTATAIRE' ? 'Le téléphone est requis' : false 
                          })}
                          className={`input ${errors.telephone ? 'input-error' : ''}`}
                          placeholder="Ex: 98123456"
                        />
                        {errors.telephone && (
                          <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          Description de votre activité
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          {...register('description')}
                          className="input"
                          placeholder="Décrivez brièvement vos services..."
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Conditions d'utilisation */}
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  {...register('acceptTerms', { required: 'Vous devez accepter les conditions d\'utilisation' })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                  J'accepte les{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    conditions d'utilisation
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    politique de confidentialité
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 relative"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  `Créer mon compte ${userType === 'PRESTATAIRE' ? 'prestataire' : 'client'}`
                )}
              </button>
            </form>

            {/* Lien de connexion */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {/* Retour à l'accueil */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;