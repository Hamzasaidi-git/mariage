# 📋 Guide Complet - Annuaire Mariage Tunisie

## 🎉 Projet Complètement Terminé !

**Application web complète pour un annuaire de prestataires de mariage en Tunisie**

- ✅ **Frontend React** complet avec toutes les pages
- ✅ **Backend Node.js** avec API complète  
- ✅ **Base de données** MySQL/XAMPP avec données d'exemple
- ✅ **Interface utilisateur** moderne et responsive
- ✅ **Système d'authentification** complet (3 rôles)
- ✅ **Panel d'administration** fonctionnel
- ✅ **Système d'avis** avec modération
- ✅ **Toutes les fonctionnalités** demandées

---

## 🚀 Installation Rapide

### 1. Prérequis
- **XAMPP** (Apache + MySQL + PHP)
- **Node.js** v16+ et npm
- **Git** (optionnel)

### 2. Installation XAMPP
1. Télécharger XAMPP depuis [apachefriends.org](https://www.apachefriends.org/)
2. Installer et démarrer **Apache** et **MySQL**
3. Accéder à phpMyAdmin : `http://localhost/phpmyadmin`

### 3. Configuration Base de Données
```sql
-- Créer la base de données
CREATE DATABASE wedding_directory;
```

### 4. Installation du Backend
```bash
cd backend
npm install
```

Créer le fichier `.env` :
```env
DATABASE_URL="mysql://root:@localhost:3306/wedding_directory"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

Initialiser la base de données :
```bash
npx prisma generate
npx prisma db push
npm run seed
```

Démarrer le backend :
```bash
npm run dev
```

### 5. Installation du Frontend
```bash
cd frontend
npm install
```

Créer le fichier `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

Démarrer le frontend :
```bash
npm run dev
```

### 6. Accès à l'Application
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000/api
- **phpMyAdmin** : http://localhost/phpmyadmin

---

## 👥 Comptes de Test

### Administrateur
- **Email** : admin@wedding-directory.com
- **Mot de passe** : AdminSecure123!

### Prestataire  
- **Email** : prestataire1@example.com
- **Mot de passe** : prestataire123

### Client
- **Email** : client1@example.com  
- **Mot de passe** : client123

---

## 📱 Fonctionnalités Principales

### 🏠 Page d'Accueil
- Hero section attrayante
- Barre de recherche
- Catégories de services
- Prestataires populaires
- Statistiques
- Étapes d'utilisation

### 🔍 Recherche et Navigation
- **Page Prestataires** avec filtres avancés
- **Filtrage par** : ville, catégorie, prix, note
- **Vue grille/liste** avec pagination
- **Recherche en temps réel**

### 👤 Pages Prestataires
- **Profils détaillés** avec galeries photos
- **Informations complètes** : services, prix, contact
- **Avis clients** avec système d'étoiles
- **Contact direct** : WhatsApp, téléphone, email

### 📝 Système d'Avis
- **Notation** de 1 à 5 étoiles
- **Commentaires** détaillés
- **Modération** par l'admin
- **Statuts** : en attente, approuvé, rejeté

### 🔐 Authentification
- **3 rôles** : Client, Prestataire, Admin
- **Inscription complète** selon le type
- **JWT** sécurisé
- **Gestion des sessions**

### 📊 Dashboard Prestataire
- **Gestion du profil** complet
- **Upload de photos**
- **Statistiques** : vues, avis, note moyenne
- **Visualisation des avis** reçus

### ⚙️ Panel d'Administration
- **Gestion des prestataires**
- **Modération des avis**
- **Statistiques globales**
- **Gestion des catégories**

---

## 🗂️ Structure du Projet

```
wedding-directory/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middlewares
│   │   └── utils/          # Utilitaires
│   ├── prisma/            # Base de données
│   │   ├── schema.prisma   # Schéma DB
│   │   └── seed.js        # Données d'exemple
│   └── uploads/           # Fichiers uploadés
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── pages/         # Pages principales
│   │   ├── components/    # Composants UI
│   │   ├── context/       # Contextes React
│   │   ├── services/      # Services API
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── utils/         # Utilitaires
│   └── public/            # Assets statiques
│
├── docs/                  # Documentation
├── XAMPP_SETUP.md        # Guide XAMPP
├── INSTALL_QUICK.md      # Installation rapide
└── README.md             # Documentation principale
```

---

## 🎨 Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM pour base de données
- **MySQL** - Base de données
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **bcrypt** - Hachage des mots de passe

### Frontend  
- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **React Hook Form** - Gestion des formulaires
- **React Hot Toast** - Notifications
- **Feather Icons** - Icônes

---

## 🚀 Déploiement en Production

### Backend (Node.js)
1. **Serveur VPS/Cloud** (DigitalOcean, AWS, etc.)
2. **Configuration environnement** :
```env
NODE_ENV=production
DATABASE_URL="mysql://user:password@host:3306/database"
JWT_SECRET="your-production-secret-very-long-and-secure"
PORT=5000
```

3. **Commandes déploiement** :
```bash
npm ci --production
npx prisma generate
npx prisma db push
npm start
```

### Frontend (React)
1. **Build de production** :
```bash
npm run build
```

2. **Hébergement** :
   - **Vercel** (recommandé)
   - **Netlify**
   - **Firebase Hosting**
   - Serveur web classique

### Base de Données
- **MySQL** en production
- **PlanetScale** (recommandé pour le cloud)
- **Amazon RDS**
- **Google Cloud SQL**

---

## 📊 Données d'Exemple Incluses

### 8 Catégories de Services
- Salles de réception
- Traiteurs  
- Photographes
- Coiffure
- Maquillage
- Bijouterie
- Couture
- Voyage de noces

### 15+ Prestataires d'Exemple
- Informations complètes
- Villes tunisiennes réelles
- Prix réalistes
- Descriptions professionnelles

### Avis Authentiques
- Notes variées
- Commentaires réalistes
- Différents statuts de modération

---

## 🔧 Personnalisation

### Couleurs et Design
Modifier dans `frontend/tailwind.config.js` :
```js
colors: {
  primary: {
    50: '#fdf2f8',   // Rose clair
    600: '#ec4899',  // Rose principal
    // ...
  }
}
```

### Informations de Contact
Modifier dans `frontend/src/utils/constants.js` :
```js
export const APP_CONFIG = {
  name: 'Votre Nom',
  contact: {
    email: 'votre@email.com',
    phone: '+216 XX XXX XXX',
    address: 'Votre Adresse'
  }
}
```

### Ajout de Catégories
Via l'interface admin ou directement en base :
```sql
INSERT INTO Category (nom, description) 
VALUES ('Nouvelle Catégorie', 'Description...');
```

---

## 🛡️ Sécurité

### Mesures Implémentées
- ✅ **JWT** sécurisé
- ✅ **Hachage bcrypt** des mots de passe  
- ✅ **Validation** des données
- ✅ **Protection CORS**
- ✅ **Sanitisation** des entrées
- ✅ **Gestion d'erreurs** sécurisée

### Recommandations Production
- Utiliser HTTPS
- Variables d'environnement sécurisées
- Sauvegardes automatiques
- Monitoring et logs
- Rate limiting API

---

## 📈 Performance et SEO

### Optimisations Incluses
- ✅ **Lazy loading** des pages
- ✅ **Images optimisées** avec fallbacks
- ✅ **Meta tags** dynamiques
- ✅ **Loading states** partout
- ✅ **Gestion d'erreurs** complète
- ✅ **Design responsive**

### Améliorations Possibles
- Service Worker (PWA)
- Compression d'images
- CDN pour les assets
- Cache Redis
- Analytics

---

## 🐛 Dépannage

### Problèmes Courants

**XAMPP ne démarre pas** :
- Vérifier les ports (80, 3306)
- Redémarrer les services
- Vérifier les logs XAMPP

**Base de données inaccessible** :
- Vérifier MySQL dans XAMPP
- Contrôler l'URL de connexion
- Tester phpMyAdmin

**Frontend ne charge pas l'API** :
- Vérifier VITE_API_URL dans .env
- S'assurer que le backend tourne
- Contrôler la console navigateur

**Erreurs de permissions** :
- Vérifier les droits sur /uploads
- Contrôler les permissions fichiers
- Redémarrer les services

---

## 🎯 Prochaines Évolutions Possibles

### Fonctionnalités Avancées
- 💬 **Chat en temps réel** 
- 📱 **Application mobile**
- 🔔 **Notifications push**
- 💳 **Paiement en ligne**
- 📍 **Géolocalisation**
- 📊 **Analytics avancées**
- 🌙 **Mode sombre**
- 🌍 **Multi-langues**

---

## 💡 Support et Assistance

### Documentation
- [README.md](README.md) - Vue d'ensemble
- [XAMPP_SETUP.md](XAMPP_SETUP.md) - Configuration XAMPP
- [INSTALL_QUICK.md](INSTALL_QUICK.md) - Installation rapide

### Code Source
- Backend complet dans `/backend`
- Frontend complet dans `/frontend`
- Documentation dans `/docs`

### Maintenance
- Code bien structuré et commenté
- Conventions de nommage respectées
- Séparation des responsabilités
- Architecture modulaire

---

## 🎊 Félicitations !

Votre **Annuaire Mariage Tunisie** est maintenant **100% fonctionnel** ! 

L'application inclut toutes les fonctionnalités demandées et est prête pour :
- ✅ **Tests utilisateurs**
- ✅ **Démonstrations clients** 
- ✅ **Mise en production**
- ✅ **Développement futur**

**Bonne utilisation de votre nouvelle plateforme !** 🎉