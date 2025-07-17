# 💍 Annuaire Mariage Tunisie

Un annuaire complet des services de mariage en Tunisie développé avec React, Node.js et PostgreSQL.

## 🚀 Fonctionnalités

### Pour les utilisateurs
- 🔍 Recherche avancée de prestataires par catégorie, ville et prix
- 📱 Interface responsive et moderne
- ⭐ Système d'avis et de notes
- 💬 Formulaire de contact direct avec les prestataires
- 📧 Contact WhatsApp et Instagram intégré

### Pour les prestataires
- 👤 Compte prestataire pour gérer sa fiche
- 📸 Galerie photos et description détaillée
- 📊 Gestion des messages clients
- 📈 Statistiques des consultations

### Pour les administrateurs
- 🎛️ Dashboard complet d'administration
- 👥 Gestion des utilisateurs et prestataires
- 📊 Statistiques détaillées
- 📝 Gestion des catégories et contenus

## 🛠️ Stack Technique

- **Frontend**: React 18, Tailwind CSS, React Router, React Query
- **Backend**: Node.js, Express, Prisma ORM
- **Base de données**: MySQL (compatible XAMPP)
- **Authentification**: JWT
- **Upload**: Multer (stockage local)
- **Icons**: React Icons

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [XAMPP](https://www.apachefriends.org/) (avec MySQL activé) ou MySQL standalone
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd wedding-directory
```

### 2. Configuration de la base de données MySQL

#### Option A: Utilisation de XAMPP (Recommandée)

1. Téléchargez et installez [XAMPP](https://www.apachefriends.org/)
2. Démarrez XAMPP et activez **Apache** et **MySQL**
3. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
4. Créez une nouvelle base de données nommée `wedding_directory`

#### Option B: MySQL standalone

```sql
-- Connectez-vous à MySQL
mysql -u root -p

-- Créez la base de données
CREATE DATABASE wedding_directory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créez un utilisateur (optionnel)
CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON wedding_directory.* TO 'wedding_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Option C: Utilisation de Docker

```bash
# Démarrer MySQL avec Docker
docker run --name wedding-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=wedding_directory \
  -p 3306:3306 \
  -d mysql:8.0
```

### 3. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier de configuration
cp .env.example .env
```

Modifiez le fichier `.env` avec vos paramètres :

```env
# Base de données MySQL (XAMPP par défaut)
DATABASE_URL="mysql://root:@localhost:3306/wedding_directory"

# Ou avec utilisateur personnalisé :
# DATABASE_URL="mysql://wedding_user:votre_mot_de_passe@localhost:3306/wedding_directory"

# JWT
JWT_SECRET="votre_secret_jwt_tres_securise_ici_changez_le"
JWT_EXPIRES_IN="7d"

# Serveur
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"

# Admin par défaut
ADMIN_EMAIL="admin@wedding-directory.com"
ADMIN_PASSWORD="AdminSecure123!"
```

### 4. Initialisation de la base de données

```bash
# Dans le dossier backend

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Peupler la base de données avec des données d'exemple
npm run db:seed
```

### 5. Configuration du Frontend

```bash
# Aller dans le dossier frontend
cd ../frontend

# Installer les dépendances
npm install
```

Créez un fichier `.env` dans le dossier frontend :

```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Démarrage

### 1. Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 2. Démarrer le Frontend

```bash
# Dans un nouveau terminal
cd frontend
npm run dev
```

L'application frontend sera accessible sur `http://localhost:3000`

## 👤 Comptes par défaut

Après avoir exécuté le script de seed :

### Administrateur
- **Email**: admin@wedding-directory.com
- **Mot de passe**: AdminSecure123! (ou celui défini dans .env)

### Prestataires d'exemple
- **Email**: prestataire1@example.com à prestataire5@example.com
- **Mot de passe**: prestataire123

## 📁 Structure du projet

```
wedding-directory/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   ├── routes/         # Routes API
│   │   ├── middleware/     # Middlewares
│   │   ├── utils/          # Utilitaires
│   │   └── index.js        # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de base de données
│   │   └── seed.js         # Script de peuplement
│   ├── uploads/            # Images uploadées
│   └── package.json
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Services API
│   │   ├── context/        # Contextes React
│   │   ├── utils/          # Utilitaires
│   │   └── styles/         # Styles CSS
│   └── package.json
└── README.md
```

## 🔧 Scripts disponibles

### Backend

```bash
npm run dev          # Démarrage en mode développement
npm start            # Démarrage en production
npm run db:push      # Appliquer les migrations
npm run db:seed      # Peupler la base de données
npm run db:studio    # Interface Prisma Studio
```

### Frontend

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
```

## 🌐 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Profil utilisateur

### Prestataires
- `GET /api/prestataires` - Liste des prestataires
- `GET /api/prestataires/:id` - Détail d'un prestataire
- `POST /api/prestataires` - Créer un prestataire (Auth)
- `PUT /api/prestataires/:id` - Modifier un prestataire (Auth)

### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:nom/prestataires` - Prestataires par catégorie

### Messages
- `POST /api/messages` - Envoyer un message
- `GET /api/messages/prestataire/:id` - Messages d'un prestataire (Auth)

### Avis
- `POST /api/avis` - Ajouter un avis
- `GET /api/avis/prestataire/:id` - Avis d'un prestataire

## 🎨 Personnalisation

### Couleurs (Tailwind)

Le thème de couleurs est défini dans `frontend/tailwind.config.js` :

- **Primary** : Rose/Magenta (couleurs de mariage)
- **Secondary** : Gris neutre
- **Accent** : Jaune/Or

### Catégories de services

Les catégories sont définies dans `backend/prisma/seed.js` :

1. Espaces de fêtes 🏛️
2. Coiffeurs 💇‍♀️
3. Maquilleurs 💄
4. Traiteurs 🍽️
5. Location de voitures 🚗
6. Bijouteries 💍
7. Tailleurs 👗
8. Agences de voyages ✈️

## 🔒 Sécurité

- Authentification JWT
- Validation des données avec express-validator
- Protection CORS
- Rate limiting
- Hashage des mots de passe avec bcrypt
- Validation des fichiers uploadés

## 📱 Responsive Design

L'application est entièrement responsive avec Tailwind CSS :
- Mobile First design
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation adaptative
- Grilles flexibles

## 🚀 Déploiement

### Backend (Heroku, Railway, etc.)

1. Configurez les variables d'environnement
2. Utilisez une base PostgreSQL cloud (Supabase, Neon, etc.)
3. Build : `npm install && npx prisma generate && npx prisma db push`
4. Start : `npm start`

### Frontend (Vercel, Netlify, etc.)

1. Build : `npm run build`
2. Servir le dossier `dist/`
3. Configurez les variables d'environnement

## 🐛 Dépannage

### Erreur de connexion à la base de données

1. Vérifiez que XAMPP est démarré et MySQL est actif (voyant vert)
2. Vérifiez l'URL de connexion dans `.env`
3. Testez la connexion : `mysql -u root -p wedding_directory`
4. Si vous utilisez XAMPP, le mot de passe root est généralement vide

### Erreur de CORS

1. Vérifiez l'URL frontend dans `.env` backend
2. Redémarrez le serveur backend

### Images non affichées

1. Vérifiez que le dossier `backend/uploads` existe
2. Vérifiez la configuration du proxy Vite

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Email : support@annuaire-mariage-tunisie.com

---

**Développé avec ❤️ pour les futurs mariés tunisiens**