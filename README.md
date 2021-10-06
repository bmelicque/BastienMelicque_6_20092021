## À propos du projet...

Piiquante est un projet issu de la formation de développeur web d'openclassrooms.
L'objectif est de développeur le backend d'une application web (dont le frontend est déjà fourni) en utilisant Node, Express et MongoDB.
Ce projet vise à évaluer les compétences suivantes :

* Implémenter un modèle logique de données conformément à la réglementation
* Stocker des données de manière sécurisée
* Mettre en œuvre des opérations CRUD de manière sécurisée

## Pour commencer
### Côté backend

1. Cloner le repo du backend
```sh
https://github.com/bmelicque/BastienMelicque_6_20092021.git
```

2. Installer les dépendances
```sh
npm install
```

3. Créer un fichier .env à la racine du projet qui contiendra :
```sh
PORT= Le port utilisé (par défaut 3000)
DB_USER_PASS= nom_utilisateur_mongodb:mot_de_passe
TOKEN_SECRET= Le secret utilisé pour chiffrer le mot de passe
DB_SECRET= Le secret utilisé pour hasher les adresses email dans la base de données
```

4. Démarrer le serveur
```sh
npm start
```

### Côté frontend

1. Cloner le repo du frontend
```sh
https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git
```

2. Installer les dépendances
```sh
npm install
```

4. Démarrer le front
```sh
npm start
```