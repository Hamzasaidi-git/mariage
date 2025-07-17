// Composant principal de l'application
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages principales (lazy loading)
const Home = React.lazy(() => import('./pages/Home'));
const Prestataires = React.lazy(() => import('./pages/Prestataires'));
const PrestataireDetail = React.lazy(() => import('./pages/PrestataireDetail'));
const Categories = React.lazy(() => import('./pages/Categories'));
const CategoryDetail = React.lazy(() => import('./pages/CategoryDetail'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));

// Pages protégées
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const Profile = React.lazy(() => import('./pages/auth/Profile'));

// Pages d'erreur
const NotFound = React.lazy(() => import('./pages/errors/NotFound'));

// Composant de protection des routes
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  if (requireAdmin && !isAdmin()) {
    window.location.href = '/';
    return null;
  }

  return children;
};

// Composant de redirection des utilisateurs connectés
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return children;
};

// Composant de layout principal
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Composant de fallback pour le Suspense
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/prestataires" element={<Prestataires />} />
          <Route path="/prestataires/:id" element={<PrestataireDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryName" element={<CategoryDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Routes d'authentification (uniquement pour non-connectés) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Routes protégées (connectés seulement) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Routes admin (admin seulement) */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;