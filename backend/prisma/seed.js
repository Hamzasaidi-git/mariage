// Script de peuplement de la base de données
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/utils/auth');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Fonction helper pour générer des UUIDs
const generateId = () => crypto.randomUUID();

const villesTunisiennes = [
  'Tunis', 'Sfax', 'Sousse', 'Ettadhamen', 'Kairouan', 'Bizerte', 'Gabès', 
  'Ariana', 'Gafsa', 'Kasserine', 'Ben Arous', 'Médenine', 'Nabeul', 
  'Monastir', 'Béja', 'Jendouba', 'Mahdia', 'Sidi Bouzid', 'Manouba',
  'La Marsa', 'Hammamet', 'Djerba'
];

const categories = [
  {
    nom: 'Espaces de fêtes',
    description: 'Salles de réception et espaces pour célébrer votre mariage',
    icon: '🏛️'
  },
  {
    nom: 'Coiffeurs',
    description: 'Coiffeurs spécialisés pour mariées et invités',
    icon: '💇‍♀️'
  },
  {
    nom: 'Maquilleurs',
    description: 'Maquilleurs professionnels pour le jour J',
    icon: '💄'
  },
  {
    nom: 'Traiteurs',
    description: 'Services de restauration pour votre réception',
    icon: '🍽️'
  },
  {
    nom: 'Location de voitures',
    description: 'Location de véhicules de luxe pour les mariés',
    icon: '🚗'
  },
  {
    nom: 'Bijouteries',
    description: 'Bijoux et alliances pour votre mariage',
    icon: '💍'
  },
  {
    nom: 'Tailleurs',
    description: 'Création et retouche de robes et costumes de mariage',
    icon: '👗'
  },
  {
    nom: 'Agences de voyages',
    description: 'Organisation de voyages de noces',
    icon: '✈️'
  }
];

const prestatairesExemples = [
  // Espaces de fêtes
  {
    nom: 'Villa des Roses',
    description: 'Magnifique villa avec jardins pour des réceptions de rêve. Capacité jusqu\'à 200 invités.',
    ville: 'Tunis',
    adresse: 'Route de la Marsa, Sidi Bou Said',
    tel: '+216 71 123 456',
    whatsapp: '+216 20 123 456',
    prix_moyen: 2500,
    services: ['Jardin extérieur', 'Salle climatisée', 'Parking privé', 'Décoration incluse'],
    horaires: { 'ouverture': '09:00', 'fermeture': '02:00' },
    featured: true
  },
  {
    nom: 'Palais El Andalous',
    description: 'Salle de réception de style andalou avec architecture traditionnelle.',
    ville: 'Sousse',
    adresse: 'Zone touristique, Sousse',
    tel: '+216 73 234 567',
    whatsapp: '+216 21 234 567',
    prix_moyen: 3000,
    services: ['Style architectural unique', 'Terrasse avec vue mer', 'Service traiteur'],
    featured: true
  },
  
  // Coiffeurs
  {
    nom: 'Salon Elégance',
    description: 'Salon de coiffure spécialisé dans les coiffures de mariage. 15 ans d\'expérience.',
    ville: 'Tunis',
    adresse: 'Avenue Habib Bourguiba, Centre-ville',
    tel: '+216 71 345 678',
    whatsapp: '+216 22 345 678',
    prix_moyen: 150,
    services: ['Coiffure mariée', 'Maquillage', 'Manucure', 'Extensions'],
    featured: true
  },
  {
    nom: 'Studio Chic',
    description: 'Studio moderne pour tous vos besoins beauté le jour de votre mariage.',
    ville: 'Sfax',
    adresse: 'Rue de la République, Sfax',
    tel: '+216 74 456 789',
    whatsapp: '+216 23 456 789',
    prix_moyen: 120
  },
  
  // Maquilleurs
  {
    nom: 'Maquillage Prestige',
    description: 'Maquilleuse professionnelle spécialisée dans le maquillage de mariée.',
    ville: 'Tunis',
    adresse: 'Les Berges du Lac',
    tel: '+216 71 567 890',
    whatsapp: '+216 24 567 890',
    prix_moyen: 200,
    services: ['Maquillage mariée', 'Essai gratuit', 'Maquillage famille'],
    featured: true
  },
  
  // Traiteurs
  {
    nom: 'Délices du Palais',
    description: 'Traiteur haut de gamme proposant une cuisine raffinée pour vos réceptions.',
    ville: 'Tunis',
    adresse: 'Rue de Marseille, Tunis',
    tel: '+216 71 678 901',
    whatsapp: '+216 25 678 901',
    prix_moyen: 45,
    services: ['Menu traditionnel', 'Menu international', 'Service à table', 'Buffet'],
    featured: true
  },
  {
    nom: 'Saveurs Traditionnelles',
    description: 'Spécialiste de la cuisine tunisienne authentique pour vos événements.',
    ville: 'Kairouan',
    adresse: 'Médina de Kairouan',
    tel: '+216 77 789 012',
    whatsapp: '+216 26 789 012',
    prix_moyen: 35
  },
  
  // Location de voitures
  {
    nom: 'Luxury Cars Wedding',
    description: 'Location de voitures de luxe et décorées pour votre mariage.',
    ville: 'Tunis',
    adresse: 'Avenue de la Liberté',
    tel: '+216 71 890 123',
    whatsapp: '+216 27 890 123',
    prix_moyen: 300,
    services: ['Mercedes', 'BMW', 'Rolls Royce', 'Décoration incluse'],
    featured: true
  },
  
  // Bijouteries
  {
    nom: 'Bijouterie Royale',
    description: 'Création d\'alliances sur mesure et bijoux de mariage exceptionnels.',
    ville: 'Tunis',
    adresse: 'Rue Charles de Gaulle',
    tel: '+216 71 901 234',
    whatsapp: '+216 28 901 234',
    prix_moyen: 800,
    services: ['Alliances sur mesure', 'Or 18 carats', 'Diamants certifiés'],
    featured: true
  },
  
  // Tailleurs
  {
    nom: 'Atelier Couture Prestige',
    description: 'Création et retouche de robes de mariée sur mesure.',
    ville: 'Tunis',
    adresse: 'Rue de Rome, Mutuelleville',
    tel: '+216 71 012 345',
    whatsapp: '+216 29 012 345',
    prix_moyen: 1200,
    services: ['Robe sur mesure', 'Retouches', 'Accessoires', 'Voile'],
    featured: true
  },
  
  // Agences de voyages
  {
    nom: 'Voyages de Rêve',
    description: 'Organisation de lunes de miel inoubliables dans le monde entier.',
    ville: 'Tunis',
    adresse: 'Avenue Mohamed V',
    tel: '+216 71 123 456',
    whatsapp: '+216 30 123 456',
    prix_moyen: 2000,
    services: ['Destinations exotiques', 'Hôtels 5 étoiles', 'Vols inclus'],
    featured: true
  }
];

async function main() {
  console.log('🌱 Début du peuplement de la base de données...');

  try {
    // Supprimer les données existantes
    console.log('🗑️ Suppression des données existantes...');
    await prisma.avis.deleteMany();
    await prisma.message.deleteMany();
    await prisma.prestataire.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    // Créer l'admin par défaut
    console.log('👤 Création de l\'utilisateur admin...');
    const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
    const admin = await prisma.user.create({
      data: {
        nom: 'Administrateur',
        email: process.env.ADMIN_EMAIL || 'admin@wedding-directory.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });
    console.log(`✅ Admin créé: ${admin.email}`);

    // Créer quelques utilisateurs prestataires
    console.log('👥 Création des utilisateurs prestataires...');
    const prestataireUsers = [];
    for (let i = 0; i < 5; i++) {
      const password = await hashPassword('prestataire123');
      const user = await prisma.user.create({
        data: {
          nom: `Prestataire ${i + 1}`,
          email: `prestataire${i + 1}@example.com`,
          password,
          role: 'PRESTATAIRE',
          tel: `+216 ${20 + i} 123 45${i}`
        }
      });
      prestataireUsers.push(user);
    }

    // Créer les catégories
    console.log('📁 Création des catégories...');
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData
      });
      createdCategories.push(category);
      console.log(`✅ Catégorie créée: ${category.nom}`);
    }

    // Créer les prestataires
    console.log('🏢 Création des prestataires...');
    const createdPrestataires = [];
    for (let i = 0; i < prestatairesExemples.length; i++) {
      const prestataireData = prestatairesExemples[i];
      
      // Associer à une catégorie selon le type
      let categoryId;
      if (prestataireData.nom.includes('Villa') || prestataireData.nom.includes('Palais')) {
        categoryId = createdCategories.find(c => c.nom === 'Espaces de fêtes').id;
      } else if (prestataireData.nom.includes('Salon') || prestataireData.nom.includes('Studio')) {
        categoryId = createdCategories.find(c => c.nom === 'Coiffeurs').id;
      } else if (prestataireData.nom.includes('Maquillage')) {
        categoryId = createdCategories.find(c => c.nom === 'Maquilleurs').id;
      } else if (prestataireData.nom.includes('Délices') || prestataireData.nom.includes('Saveurs')) {
        categoryId = createdCategories.find(c => c.nom === 'Traiteurs').id;
      } else if (prestataireData.nom.includes('Cars')) {
        categoryId = createdCategories.find(c => c.nom === 'Location de voitures').id;
      } else if (prestataireData.nom.includes('Bijouterie')) {
        categoryId = createdCategories.find(c => c.nom === 'Bijouteries').id;
      } else if (prestataireData.nom.includes('Atelier') || prestataireData.nom.includes('Couture')) {
        categoryId = createdCategories.find(c => c.nom === 'Tailleurs').id;
      } else if (prestataireData.nom.includes('Voyages')) {
        categoryId = createdCategories.find(c => c.nom === 'Agences de voyages').id;
      }

      const prestataire = await prisma.prestataire.create({
        data: {
          ...prestataireData,
          categoryId,
          // Associer certains prestataires à des users
          userId: i < prestataireUsers.length ? prestataireUsers[i].id : null,
          // Générer une note aléatoire
          note: Math.round((Math.random() * 2 + 3) * 10) / 10, // Entre 3.0 et 5.0
          nombre_avis: Math.floor(Math.random() * 20) + 5, // Entre 5 et 24 avis
          images: [
            '/uploads/placeholder1.jpg',
            '/uploads/placeholder2.jpg',
            '/uploads/placeholder3.jpg'
          ]
        }
      });
      createdPrestataires.push(prestataire);
      console.log(`✅ Prestataire créé: ${prestataire.nom}`);
    }

    // Créer quelques avis d'exemple
    console.log('⭐ Création des avis...');
    const nomsClients = [
      'Amira Ben Ali', 'Mohamed Trabelsi', 'Fatma Khelifi', 'Ahmed Bouazizi',
      'Leila Mahjoub', 'Karim Sassi', 'Nour Benaissa', 'Youssef Gharbi',
      'Sonia Rezgui', 'Hatem Jemaa'
    ];

    const commentairesPositifs = [
      'Service exceptionnel, je recommande vivement !',
      'Très professionnel et à l\'écoute de nos besoins.',
      'Parfait pour notre mariage, tout était magnifique.',
      'Excellent rapport qualité-prix.',
      'Équipe très sympathique et compétente.',
      'Résultat au-delà de nos attentes !',
      'Je ne regrette pas mon choix, c\'était parfait.',
      'Service impeccable du début à la fin.',
      'Très belle prestation, merci beaucoup !',
      'À recommander sans hésitation.'
    ];

    for (const prestataire of createdPrestataires) {
      const nombreAvis = Math.floor(Math.random() * 8) + 3; // 3 à 10 avis
      
      for (let i = 0; i < nombreAvis; i++) {
        await prisma.avis.create({
          data: {
            prestataireId: prestataire.id,
            note: Math.floor(Math.random() * 2) + 4, // Note entre 4 et 5
            commentaire: commentairesPositifs[Math.floor(Math.random() * commentairesPositifs.length)],
            nom_client: nomsClients[Math.floor(Math.random() * nomsClients.length)]
          }
        });
      }
    }

    // Créer quelques messages d'exemple
    console.log('💬 Création des messages...');
    for (let i = 0; i < 15; i++) {
      const prestataire = createdPrestataires[Math.floor(Math.random() * createdPrestataires.length)];
      const client = nomsClients[Math.floor(Math.random() * nomsClients.length)];
      
      await prisma.message.create({
        data: {
          prestataireId: prestataire.id,
          nom: client,
          email: `${client.toLowerCase().replace(' ', '.')}@example.com`,
          tel: `+216 ${Math.floor(Math.random() * 10) + 20} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
          message: `Bonjour, je suis intéressé(e) par vos services pour mon mariage prévu en ${Math.random() > 0.5 ? 'été' : 'automne'}. Pourriez-vous me contacter pour discuter des détails ?`,
          date_event: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000), // Date future aléatoire
          budget: Math.floor(Math.random() * 5000) + 1000,
          lu: Math.random() > 0.7 // 30% non lus
        }
      });
    }

    console.log('✅ Peuplement terminé avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - ${createdCategories.length} catégories`);
    console.log(`   - ${createdPrestataires.length} prestataires`);
    console.log(`   - ${prestataireUsers.length + 1} utilisateurs (${prestataireUsers.length} prestataires + 1 admin)`);
    console.log(`   - Avis et messages générés`);
    console.log(`\n🔑 Compte admin:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mot de passe: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });