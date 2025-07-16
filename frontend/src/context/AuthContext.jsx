// Contexte d'authentification
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

// Actions du reducer
const AuthActions = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
};

// État initial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case AuthActions.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case AuthActions.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    
    case AuthActions.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case AuthActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

// Création du contexte
const AuthContext = createContext();

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token');
      const userData = Cookies.get('user');

      if (token && userData) {
        try {
          // Vérifier que le token est toujours valide
          const response = await authAPI.getProfile();
          dispatch({
            type: AuthActions.LOGIN_SUCCESS,
            payload: {
              user: response.data.user,
              token,
            },
          });
        } catch (error) {
          // Token invalide, nettoyer
          Cookies.remove('token');
          Cookies.remove('user');
          dispatch({ type: AuthActions.LOGOUT });
        }
      } else {
        dispatch({ type: AuthActions.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    dispatch({ type: AuthActions.LOGIN_START });
    
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;

      // Stocker dans les cookies
      Cookies.set('token', token, { expires: 7 }); // 7 jours
      Cookies.set('user', JSON.stringify(user), { expires: 7 });

      dispatch({
        type: AuthActions.LOGIN_SUCCESS,
        payload: { user, token },
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur de connexion';
      dispatch({
        type: AuthActions.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    dispatch({ type: AuthActions.LOGIN_START });
    
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      // Stocker dans les cookies
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });

      dispatch({
        type: AuthActions.LOGIN_SUCCESS,
        payload: { user, token },
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur d\'inscription';
      dispatch({
        type: AuthActions.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    dispatch({ type: AuthActions.LOGOUT });
  };

  // Fonction de mise à jour du profil
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.user;

      // Mettre à jour le cookie
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });

      dispatch({
        type: AuthActions.UPDATE_USER,
        payload: updatedUser,
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur de mise à jour';
      return { success: false, error: errorMessage };
    }
  };

  // Fonction de changement de mot de passe
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur de changement de mot de passe';
      return { success: false, error: errorMessage };
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => hasRole('ADMIN');

  // Vérifier si l'utilisateur est prestataire
  const isPrestataire = () => hasRole('PRESTATAIRE');

  // Vérifier si l'utilisateur peut modifier une ressource
  const canEdit = (resourceUserId) => {
    if (!state.user) return false;
    return state.user.role === 'ADMIN' || state.user.id === resourceUserId;
  };

  const value = {
    // État
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    
    // Utilitaires
    hasRole,
    isAdmin,
    isPrestataire,
    canEdit,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

// Hook pour protéger les routes
export const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading };
};

// Hook pour protéger les routes admin
export const useRequireAdmin = (redirectTo = '/') => {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, isAdmin, redirectTo]);
  
  return { isAdmin: isAdmin(), isLoading };
};

// HOC pour protéger les composants
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    const { requireAdmin = false, redirectTo = '/login' } = options;
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      window.location.href = redirectTo;
      return null;
    }
    
    if (requireAdmin && !isAdmin()) {
      window.location.href = '/';
      return null;
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;