// Page de connexion
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      
      if (result.success) {
        toast.success('Connexion réussie !');
        
        // Redirection selon le rôle
        if (result.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion');
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion - Annuaire Mariage Tunisie</title>
        <meta name="description" content="Connectez-vous à votre compte pour accéder à votre dashboard et gérer vos informations." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <FiHeart className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-serif font-bold text-secondary-800">
                Mariage Tunisie
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-secondary-800 mb-2">
              Bon retour !
            </h2>
            <p className="text-secondary-600">
              Connectez-vous à votre compte pour continuer
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Adresse email
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
                  placeholder="exemple@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                  Mot de passe
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
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-secondary-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-secondary-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-secondary-700">
                    Se souvenir de moi
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 relative"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Comptes de test */}
            <div className="mt-8 p-4 bg-secondary-50 rounded-lg">
              <h3 className="text-sm font-medium text-secondary-700 mb-2">
                Comptes de test disponibles :
              </h3>
              <div className="text-xs text-secondary-600 space-y-1">
                <div>
                  <strong>Admin :</strong> admin@wedding-directory.com / AdminSecure123!
                </div>
                <div>
                  <strong>Prestataire :</strong> prestataire1@example.com / prestataire123
                </div>
              </div>
            </div>

            {/* Lien d'inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600">
                Vous n'avez pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Retour à l'accueil */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-secondary-600 hover:text-secondary-800"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;