# Api de Login 

## Description
Cette application permet d'enregistrer un utilisateur avec des informations specifiques, de modifier ces informations, les lire et les supprimer.

## Installation 
1. Cloner ce depot: `git clone https://github.com/SteveElouga/Login`.
2. Executer la commande `npm install` pour installer les dependances.

## Utilisation
1. Executer l'application: `nodemon src/index.js`.
2. Ouvrir le navigateur et aller sur `http://localhost:5000`.
3. Commencer a utiliser l'application.

## Fonctionnalites

- Creer un nouvel utilisateur.
- Authentification d'un utilisateur.
- Modifier les informations d'un utilisateur.
- Supprimer un compte utilisateur.
- Creation de compte et authentification via Google API.

## Description des fonctionnalites
- Creer un nouvel utilisateur.
{
  "firstname": "string",
  "lastname": "string",
  "username": "string",
  "email": "string",
  "dateOfBirth": "string",
  "sexe": "string",
  "password": "string",
  "confirmPassword": "string"
}

- Authentification d'un utilisateur.
{
  "email": "string",
  "password": "string"
}

- Modifier les informations d'un utilisateur.
{
  "email": "string",
  "password": "string",
  "newpassword": "string"
}

- Supprimer un compte utilisateur.
{
  "email": "string",
  "password": "string"
}

## Description des champs
- "firstname", "lastname", "username"
//Au moins 4 caracteres
// Exemples d'utilisation
const nomPrenom1 = "John";
const nomPrenom2 = "Alice123"; // Ne satisfait pas aux critères

console.log(verifierNomPrenom(nomPrenom1)); // true
console.log(verifierNomPrenom(nomPrenom2)); // false

- "email"
//Au moins un @, un . et minimum 5 caracteres
// Exemples d'utilisation
const email1 = "test@example.com";
const email2 = "invalid.email"; // Ne satisfait pas aux critères

console.log(verifierAdresseEmail(email1)); // true
console.log(verifierAdresseEmail(email2)); // false

- "dateOfBirth"
format: AAAA-MM-JJ,  >= 18 ans par rapport a l'annee actuelle.

- "password"
 // Au moins une lettre majuscule, un caractère spécial(!@#$%^&), un chiffre, et une longueur d'au moins 8

 // Exemples d'utilisation
const motDePasse1 = "Motdepasse1!";
const motDePasse2 = "mdp2"; // Ne satisfait pas aux critères

console.log(verifierMotDePasse(motDePasse1)); // true
console.log(verifierMotDePasse(motDePasse2)); // false



