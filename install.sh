#!/bin/bash

# Script d'installation automatique pour l'Annuaire Mariage Tunisie
# Ce script installe toutes les dépendances et configure l'environnement

echo "🎊 Installation de l'Annuaire Mariage Tunisie 🎊"
echo "================================================="

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier que PostgreSQL est accessible
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL n'est pas détecté. Assurez-vous qu'il soit installé et accessible."
    echo "   Vous pouvez continuer si vous utilisez Docker ou une base cloud."
fi

echo "📦 Installation des dépendances du backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances backend"
    exit 1
fi

echo "📦 Installation des dépendances du frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances frontend"
    exit 1
fi

echo "⚙️  Configuration de l'environnement..."
cd ../backend

# Copier les fichiers .env.example si ils n'existent pas
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé depuis .env.example"
    echo "⚠️  IMPORTANT: Modifiez le fichier backend/.env avec vos paramètres de base de données"
else
    echo "ℹ️  Le fichier .env existe déjà"
fi

cd ../frontend
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo "✅ Fichier .env frontend créé"
else
    echo "ℹ️  Le fichier .env frontend existe déjà"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez PostgreSQL et modifiez backend/.env"
echo "2. Exécutez 'cd backend && npx prisma db push' pour créer la base"
echo "3. Exécutez 'cd backend && npm run db:seed' pour peupler la base"
echo "4. Démarrez le backend: 'cd backend && npm run dev'"
echo "5. Démarrez le frontend: 'cd frontend && npm run dev'"
echo ""
echo "📖 Consultez le README.md pour plus d'informations"
echo ""
echo "🚀 Bon développement !"