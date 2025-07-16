// Page d'accueil
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiSearch, 
  FiMapPin, 
  FiStar,
  FiHeart,
  FiUsers,
  FiAward
} from 'react-icons/fi';

const Home = () => {
  const categories = [
    { name: 'Espaces de fêtes', icon: '🏛️', count: '25+' },
    { name: 'Traiteurs', icon: '🍽️', count: '30+' },
    { name: 'Coiffeurs', icon: '💇‍♀️', count: '20+' },
    { name: 'Maquilleurs', icon: '💄', count: '15+' },
    { name: 'Location de voitures', icon: '🚗', count: '12+' },
    { name: 'Bijouteries', icon: '💍', count: '18+' },
    { name: 'Tailleurs', icon: '👗', count: '22+' },
    { name: 'Agences de voyages', icon: '✈️', count: '8+' }
  ];

  const stats = [
    { icon: FiUsers, value: '500+', label: 'Prestataires' },
    { icon: FiHeart, value: '1000+', label: 'Mariages organisés' },
    { icon: FiStar, value: '4.8/5', label: 'Note moyenne' },
    { icon: FiAward, value: '99%', label: 'Satisfaction client' }
  ];

  return (
    <>
      <Helmet>
        <title>Annuaire Mariage Tunisie - Trouvez les meilleurs prestataires</title>
        <meta name="description" content="Découvrez les meilleurs prestataires de mariage en Tunisie. Espaces de fêtes, traiteurs, coiffeurs, maquilleurs et plus encore." />
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-secondary-800 mb-6">
              Votre mariage de rêve en{' '}
              <span className="text-gradient">Tunisie</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Découvrez les meilleurs prestataires pour organiser un mariage inoubliable. 
              De l'espace de fête au traiteur, tout en un seul endroit.
            </p>
            
            {/* Barre de recherche */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Que recherchez-vous ?"
                      className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
                    <select className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none">
                      <option>Toutes les villes</option>
                      <option>Tunis</option>
                      <option>Sfax</option>
                      <option>Sousse</option>
                      <option>Kairouan</option>
                      <option>Monastir</option>
                    </select>
                  </div>
                </div>
                <Link
                  to="/prestataires"
                  className="btn-primary px-8 py-3"
                >
                  Rechercher
                </Link>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prestataires" className="btn-primary btn-lg">
                Voir tous les prestataires
              </Link>
              <Link to="/categories" className="btn-outline btn-lg">
                Parcourir par catégorie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-secondary-800 mb-4">
              Tous vos prestataires de mariage
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explorez notre sélection de prestataires de qualité dans toutes les catégories 
              essentielles pour votre mariage.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/categories/${encodeURIComponent(category.name)}`}
                className="card-hover p-6 text-center group"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-secondary-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-secondary-500">{category.count} prestataires</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-spacing bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-secondary-800 mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Des milliers de couples nous font confiance pour organiser leur mariage parfait.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-secondary-800 mb-2">
                  {stat.value}
                </div>
                <p className="text-secondary-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-secondary-800 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Organisez votre mariage en 3 étapes simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                Recherchez
              </h3>
              <p className="text-secondary-600">
                Parcourez notre annuaire et filtrez les prestataires selon vos critères 
                (ville, budget, note, etc.)
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                Comparez
              </h3>
              <p className="text-secondary-600">
                Consultez les profils détaillés, les photos, les avis clients et 
                les tarifs pour faire votre choix.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                Contactez
              </h3>
              <p className="text-secondary-600">
                Envoyez votre demande directement aux prestataires via notre 
                formulaire ou contactez-les sur WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
            Prêt à organiser votre mariage ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de couples qui ont trouvé leurs prestataires idéaux 
            grâce à notre plateforme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/prestataires" className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg">
              Commencer ma recherche
            </Link>
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
              Créer mon compte
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;