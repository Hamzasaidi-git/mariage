# 🛠️ Configuration XAMPP pour l'Annuaire Mariage

Ce guide vous explique comment configurer XAMPP pour utiliser MySQL avec le projet.

## 📥 Installation XAMPP

### Windows
1. Téléchargez XAMPP depuis [apachefriends.org](https://www.apachefriends.org/)
2. Exécutez l'installateur en tant qu'administrateur
3. Sélectionnez **Apache**, **MySQL** et **phpMyAdmin**
4. Installez dans le répertoire par défaut (`C:\xampp`)

### macOS
1. Téléchargez XAMPP pour macOS
2. Montez le fichier DMG et glissez XAMPP dans Applications
3. Lancez XAMPP depuis Applications

### Linux
```bash
# Téléchargez et rendez exécutable
wget https://www.apachefriends.org/xampp-files/8.2.4/xampp-linux-x64-8.2.4-0-installer.run
chmod +x xampp-linux-x64-8.2.4-0-installer.run

# Installez
sudo ./xampp-linux-x64-8.2.4-0-installer.run
```

## 🚀 Démarrage XAMPP

### Interface graphique
1. Ouvrez **XAMPP Control Panel**
2. Cliquez sur **Start** pour **Apache** (optionnel, pour phpMyAdmin)
3. Cliquez sur **Start** pour **MySQL** ⚠️ **OBLIGATOIRE**
4. Vérifiez que les voyants sont **verts**

### Ligne de commande (Linux/macOS)
```bash
# Démarrer tous les services
sudo /opt/lampp/lampp start

# Ou seulement MySQL
sudo /opt/lampp/lampp startmysql
```

## 🗄️ Configuration de la base de données

### Méthode 1: Via phpMyAdmin (Facile)
1. Ouvrez votre navigateur
2. Allez sur http://localhost/phpmyadmin
3. Cliquez sur **"Nouvelle base de données"** (ou "New")
4. Nom: `wedding_directory`
5. Encodage: `utf8mb4_unicode_ci`
6. Cliquez **"Créer"**

### Méthode 2: Via ligne de commande
```bash
# Connectez-vous à MySQL
mysql -u root -p

# Entrez le mot de passe (généralement vide pour XAMPP)
# Puis exécutez:
CREATE DATABASE wedding_directory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

## ⚙️ Configuration du projet

### 1. Fichier `.env` backend
```env
# Configuration XAMPP par défaut
DATABASE_URL="mysql://root:@localhost:3306/wedding_directory"

# Si vous avez défini un mot de passe root:
# DATABASE_URL="mysql://root:votre_mot_de_passe@localhost:3306/wedding_directory"
```

### 2. Test de connexion
```bash
cd backend
npx prisma db push
```

Si ça marche, vous verrez :
```
✔ Generated Prisma Client
✔ The database is now in sync with the schema
```

## 🔧 Problèmes courants et solutions

### ❌ "Port 3306 already in use"
**Cause :** Un autre service MySQL est déjà actif
**Solutions :**
```bash
# Windows - Arrêter MySQL service
net stop mysql80

# Linux/macOS - Trouver et arrêter le processus
sudo lsof -i :3306
sudo kill -9 [PID]

# Ou changer le port XAMPP MySQL
# Dans XAMPP Control Panel > MySQL > Config > my.ini
# Changer: port = 3306 vers port = 3307
# Puis adapter l'URL: DATABASE_URL="mysql://root:@localhost:3307/wedding_directory"
```

### ❌ "Access denied for user 'root'"
**Solutions :**
1. Vérifiez que MySQL XAMPP est démarré
2. Essayez sans mot de passe: `mysql -u root`
3. Réinitialisez le mot de passe root:
```sql
-- Dans phpMyAdmin > Comptes utilisateurs > root > Modifier les privilèges
-- Ou via command line:
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
```

### ❌ "Database 'wedding_directory' does not exist"
**Solution :** Créez la base via phpMyAdmin ou:
```sql
mysql -u root -p
CREATE DATABASE wedding_directory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ Prisma ne peut pas se connecter
**Vérifications :**
1. XAMPP MySQL est-il démarré ? (voyant vert)
2. La base `wedding_directory` existe-t-elle ?
3. L'URL dans `.env` est-elle correcte ?
4. Test direct:
```bash
mysql -u root -p wedding_directory
# Si ça marche, le problème vient d'ailleurs
```

## 📊 Vérification que tout fonctionne

### 1. Test MySQL direct
```bash
mysql -u root -p
SHOW DATABASES;
# Vous devriez voir 'wedding_directory'
```

### 2. Test Prisma
```bash
cd backend
npx prisma studio
# Ouvre une interface web pour voir la BDD
```

### 3. Test complet
```bash
# Peupler la base avec des données de test
npm run db:seed

# Démarrer le serveur
npm run dev
# Devrait afficher: "Serveur démarré sur le port 5000"
```

## 🎯 URLs importantes

- **XAMPP Control Panel** : Application locale
- **phpMyAdmin** : http://localhost/phpmyadmin
- **Statut MySQL** : http://localhost/dashboard
- **API Backend** : http://localhost:5000
- **Frontend** : http://localhost:3000

## 🛡️ Sécurité (Production)

⚠️ **XAMPP est pour le développement local uniquement !**

Pour la production :
- Utilisez MySQL server dédié
- Configurez des mots de passe forts
- Limitez les accès réseau
- Utilisez des services cloud (PlanetScale, AWS RDS, etc.)

---

## 🆘 Besoin d'aide ?

1. **XAMPP ne démarre pas** : Vérifiez les ports (80, 443, 3306)
2. **MySQL ne se connecte pas** : Redémarrez XAMPP en admin
3. **phpMyAdmin erreur** : Activez Apache dans XAMPP
4. **Prisma erreur** : Vérifiez l'URL DATABASE_URL dans .env

**Support communautaire :**
- [Forum XAMPP](https://community.apachefriends.org/)
- [Documentation Prisma MySQL](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-mysql)

---

**Happy coding! 🚀**