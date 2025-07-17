# 🚀 Installation Rapide - Annuaire Mariage Tunisie

## Installation Automatique (Recommandée)

```bash
# Cloner le projet
git clone <votre-repo>
cd wedding-directory

# Lancer l'installation automatique
./install.sh
```

## Installation Manuelle

### 1. Prérequis
- Node.js 16+ installé
- XAMPP installé avec MySQL activé (ou MySQL standalone)
- Git installé

### 2. Installation Backend

```bash
cd backend
npm install
cp .env.example .env
# Modifiez le fichier .env avec vos paramètres de base de données
```

### 3. Configuration Base de Données

1. Démarrez XAMPP et activez MySQL
2. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
3. Créez une base nommée `wedding_directory`

```bash
# Créer les tables
npx prisma db push

# Peupler avec des données d'exemple
npm run db:seed
```

### 4. Installation Frontend

```bash
cd ../frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 5. Démarrage

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Accès à l'application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin**: admin@wedding-directory.com / AdminSecure123!

## Fonctionnalités disponibles

✅ Page d'accueil avec design moderne
✅ Navigation responsive
✅ Système d'authentification
✅ Base de données avec données d'exemple
✅ API REST complète
✅ Architecture modulaire

## Problèmes courants

### Base de données
Si erreur de connexion MySQL:
1. Vérifiez que XAMPP est démarré et MySQL est activé (voyant vert)
2. Vérifiez que la base `wedding_directory` existe dans phpMyAdmin
3. Modifiez DATABASE_URL dans backend/.env si nécessaire
4. Créez les tables avec `npx prisma db push`

### CORS
Si erreur CORS:
1. Vérifiez FRONTEND_URL dans backend/.env
2. Redémarrez le backend

## Support

- Documentation complète: README.md
- Schéma API: backend/src/routes/
- Architecture frontend: frontend/src/

---

**Bon développement ! 🎉**