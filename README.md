# Mon vieux Grimoire

# Comment lancer le projet ?

# Base de donnée mongoDB

Créez un compte gratuitement sur `mongoDB Atlas` : https://www.mongodb.com/cloud/atlas/register .

Créez un utilisateur avec accès admin `readWriteAnyDatabase`.

Déployez un premier `Cluster` en version gratuite et récupérez les données de connexion via le bouton `CONNECT` à mettre en variables d'environnement.

# Variables d'environnement

Créez un fichier `.env` dans le dossier `Backend`.

Composition du fichier `.env` :
    
    `````
    FRONTEND_URL=

    MONGO_USER=
    MONGO_PASSWORD=
    MONGO_CLUSTER=
    MONGO_DBNAME=

    JWT_SECRET=
    
    ````
# La DB du projet sera créée automatiquement avec le nom spécifié s'il n'existe pas dans le cluster
# Exemple :
    
    FRONTEND_URL=http://localhost:3000

    MONGO_USER=vieuxgrimoire200
    MONGO_PASSWORD=mypassword300
    MONGO_CLUSTER=cluster0.urzpb.mongodb.net
    MONGO_DBNAME=mon-vieux-grimoire

    JWT_SECRET=totallysecretkey

      
# Avec npm

Faites la commande `npm install` dans les dossiers `Backend` et `Frontend` pour installer les dépendances.

Après l'installation faites la commande `npm start` dans les dossiers `Backend` et `Frontend` dans des terminaux séparés.