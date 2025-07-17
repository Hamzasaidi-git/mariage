import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { 
  FiPhone, FiMail, FiMapPin, FiClock, FiSend, 
  FiMessageSquare, FiHelpCircle, FiUser 
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { APP_CONFIG, SOCIAL_MEDIA } from '../utils/constants';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi de message (remplacer par votre logique d'envoi)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      reset();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Téléphone',
      value: APP_CONFIG.contact.phone,
      description: 'Lun - Ven, 9h - 18h',
      href: `tel:${APP_CONFIG.contact.phone}`
    },
    {
      icon: FiMail,
      title: 'Email',
      value: APP_CONFIG.contact.email,
      description: 'Réponse sous 24h',
      href: `mailto:${APP_CONFIG.contact.email}`
    },
    {
      icon: FiMapPin,
      title: 'Adresse',
      value: APP_CONFIG.contact.address,
      description: 'Siège social',
      href: null
    },
    {
      icon: FiClock,
      title: 'Horaires',
      value: 'Lun - Ven : 9h - 18h',
      description: 'Sam : 9h - 13h',
      href: null
    }
  ];

  const faqItems = [
    {
      question: 'Comment puis-je contacter un prestataire ?',
      answer: 'Vous pouvez contacter directement les prestataires via WhatsApp, téléphone ou email depuis leur page de profil.'
    },
    {
      question: 'Les avis sont-ils authentiques ?',
      answer: 'Oui, tous les avis sont vérifiés et modérés par notre équipe avant publication.'
    },
    {
      question: 'Comment devenir prestataire partenaire ?',
      answer: 'Vous pouvez créer votre compte prestataire via notre page d\'inscription ou nous contacter directement.'
    },
    {
      question: 'Y a-t-il des frais pour utiliser la plateforme ?',
      answer: 'L\'utilisation de notre plateforme est entièrement gratuite pour les futurs mariés.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact - {APP_CONFIG.name}</title>
        <meta name="description" content="Contactez-nous pour toute question concernant votre mariage ou nos services. Notre équipe est là pour vous aider." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white shadow-sm">
          <div className="container-custom py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-6">
                <FiMessageSquare className="w-8 h-8" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Contactez-Nous
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Une question ? Un projet de mariage ? Notre équipe est là pour vous accompagner 
                dans la réalisation de votre jour J parfait.
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Informations de contact */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Nos Coordonnées
              </h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-gray-700 hover:text-primary-600 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-700">{info.value}</p>
                      )}
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Réseaux sociaux */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={SOCIAL_MEDIA.FACEBOOK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <FaFacebook className="w-5 h-5" />
                  </a>
                  <a
                    href={SOCIAL_MEDIA.INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href={SOCIAL_MEDIA.TWITTER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                  >
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://wa.me/21698123456`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Envoyez-nous un message
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nom et prénom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        id="prenom"
                        type="text"
                        {...register('prenom', { required: 'Le prénom est requis' })}
                        className={`input ${errors.prenom ? 'input-error' : ''}`}
                        placeholder="Votre prénom"
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
                        placeholder="Votre nom"
                      />
                      {errors.nom && (
                        <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email et téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
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
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        id="telephone"
                        type="tel"
                        {...register('telephone')}
                        className="input"
                        placeholder="98 123 456"
                      />
                    </div>
                  </div>

                  {/* Sujet */}
                  <div>
                    <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select
                      id="sujet"
                      {...register('sujet', { required: 'Le sujet est requis' })}
                      className={`input ${errors.sujet ? 'input-error' : ''}`}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="question-generale">Question générale</option>
                      <option value="aide-recherche">Aide pour la recherche</option>
                      <option value="devenir-prestataire">Devenir prestataire</option>
                      <option value="probleme-technique">Problème technique</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.sujet && (
                      <p className="mt-1 text-sm text-red-600">{errors.sujet.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message', {
                        required: 'Le message est requis',
                        minLength: {
                          value: 10,
                          message: 'Le message doit contenir au moins 10 caractères'
                        }
                      })}
                      className={`input ${errors.message ? 'input-error' : ''}`}
                      placeholder="Décrivez votre demande en détail..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Bouton d'envoi */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="bg-white py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FiHelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Questions Fréquentes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trouvez rapidement les réponses aux questions les plus courantes
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Contact rapide */}
        <div className="py-16 bg-primary-600 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Besoin d'une réponse rapide ?
                </h2>
                <p className="text-xl text-primary-100 mb-6">
                  Contactez-nous directement par WhatsApp pour une assistance immédiate.
                </p>
              </div>
              <div className="text-center md:text-right">
                <a
                  href="https://wa.me/21698123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
                >
                  <FaWhatsapp className="w-6 h-6 mr-3" />
                  Contacter via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;