import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiHeart, FiUsers, FiStar, FiAward, FiShield, FiTrendingUp,
  FiMapPin, FiClock, FiPhone, FiMail 
} from 'react-icons/fi';
import { APP_CONFIG } from '../utils/constants';

const About = () => {
  const stats = [
    { icon: FiUsers, label: 'Prestataires partenaires', value: '200+' },
    { icon: FiStar, label: 'Avis clients', value: '1500+' },
    { icon: FiHeart, label: 'Mariages organisés', value: '800+' },
    { icon: FiMapPin, label: 'Villes couvertes', value: '24' }
  ];

  const values = [
    {
      icon: FiShield,
      title: 'Confiance',
      description: 'Tous nos prestataires sont vérifiés et sélectionnés avec soin pour garantir la qualité de leurs services.'
    },
    {
      icon: FiHeart,
      title: 'Passion',
      description: 'Nous partageons votre passion pour les mariages parfaits et mettons tout en œuvre pour réaliser vos rêves.'
    },
    {
      icon: FiAward,
      title: 'Excellence',
      description: 'Nous collaborons uniquement avec les meilleurs prestataires pour vous offrir des services d\'exception.'
    },
    {
      icon: FiTrendingUp,
      title: 'Innovation',
      description: 'Notre plateforme évolue constamment pour vous proposer les outils les plus modernes et efficaces.'
    }
  ];

  const team = [
    {
      name: 'Sarah Ben Ahmed',
      role: 'Fondatrice & CEO',
      description: 'Passionnée par les mariages depuis toujours, Sarah a créé cette plateforme pour simplifier l\'organisation des mariages en Tunisie.',
      image: '/images/team-sarah.jpg'
    },
    {
      name: 'Mohamed Karray',
      role: 'Directeur Technique',
      description: 'Expert en développement web, Mohamed s\'assure que notre plateforme reste à la pointe de la technologie.',
      image: '/images/team-mohamed.jpg'
    },
    {
      name: 'Amina Trabelsi',
      role: 'Responsable Partenariats',
      description: 'Amina travaille étroitement avec nos prestataires partenaires pour maintenir la qualité de nos services.',
      image: '/images/team-amina.jpg'
    }
  ];

  return (
    <>
      <Helmet>
        <title>À propos - {APP_CONFIG.name}</title>
        <meta name="description" content="Découvrez l'histoire et la mission d'Annuaire Mariage Tunisie, votre partenaire de confiance pour organiser le mariage de vos rêves." />
      </Helmet>

      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-50 to-secondary-100">
          <div className="container-custom py-16 lg:py-24">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-6">
                <FiHeart className="w-8 h-8" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Nous rendons l'organisation de votre mariage simple, agréable et mémorable en vous connectant 
                avec les meilleurs prestataires de Tunisie.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Notre Histoire
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Tout a commencé en 2020, quand notre fondatrice Sarah a vécu les difficultés 
                    de l'organisation de son propre mariage. Trouver les bons prestataires, 
                    comparer les prix et les services était un véritable défi.
                  </p>
                  <p>
                    C'est de cette expérience qu'est née l'idée de créer une plateforme qui 
                    centraliserait tous les prestataires de mariage en Tunisie, avec des avis 
                    authentiques et des informations transparentes.
                  </p>
                  <p>
                    Aujourd'hui, nous sommes fiers d'avoir aidé plus de 800 couples à organiser 
                    le mariage de leurs rêves, en les connectant avec plus de 200 prestataires 
                    de confiance à travers la Tunisie.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src="/images/about-story.jpg"
                    alt="Notre histoire"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Nos Valeurs
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Les principes qui guident notre travail au quotidien
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Notre Équipe
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Des professionnels passionnés dédiés à votre réussite
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=ec4899&color=fff&size=256`;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src="/images/about-why-choose.jpg"
                    alt="Pourquoi nous choisir"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Pourquoi Nous Choisir ?
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <FiShield className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Prestataires Vérifiés</h3>
                      <p className="text-gray-600">Tous nos partenaires sont soigneusement sélectionnés et vérifiés.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <FiClock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Gain de Temps</h3>
                      <p className="text-gray-600">Trouvez rapidement les prestataires qui correspondent à vos besoins.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <FiStar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Avis Authentiques</h3>
                      <p className="text-gray-600">Consultez les avis réels de couples qui ont utilisé ces services.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Support Gratuit</h3>
                      <p className="text-gray-600">Notre équipe vous accompagne gratuitement dans votre recherche.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Prêt à Organiser Votre Mariage de Rêve ?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines de couples qui nous font confiance pour organiser leur grand jour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prestataires" className="btn-secondary">
                Découvrir nos prestataires
              </Link>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;