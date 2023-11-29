const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config")
const passport = require('passport')
const session = require('express-session')
const swaggerUI = require('swagger-ui-express')
const swaggerConfig = require('./SwaggerConfig')
const bodyParser = require('body-parser')

require('./auth')

const app = express();

const swaggerDocs = swaggerConfig
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use(bodyParser.json())

app.use(session({
    secret: 'qwertyuiopasdfghjklzxcvbnm1234567890',
    resave: false,
    saveUninitialized: true,
}))


//convert data into json format
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

//ues EJS as the view engine 
app.set('view engine', 'ejs');

//static file
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("login")
});

app.get("/signup", (req, res) => {
    res.render("signup")
}
)

app.get("/home", (req, res) => {
    res.render("home")
}
)

app.get("/passforgot", (req, res) => {
    res.render("passforgot")
}
)

//Register User
app.post("/signup", async (req, res) => {

    try {
        const data = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            sexe: req.body.sexe,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        }

        // Fonction pour calculer l'âge à partir de la date de naissance
        const dateNaissance = data.dateOfBirth

        function calculerAge(dateNaissance) {
            const dob = new Date(dateNaissance)
            const today = new Date()

            if (today < dob) {
                res.status(400).json({ message: 'Veuillez renseigner des informations valides !' })
            } else {
                const age = today.getFullYear() - dob.getFullYear()
                const moisDifference = today.getMonth() - dob.getMonth()
                if (moisDifference < 0 || (moisDifference === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }
                return age
            }
        }

        function verifierMotDePasse(motDePasse) {
            const regexMotDePasse = /^(?=.*[A-Z])(?=.*[!@#$%^&*]+)(?=.*[0-9]).{8,}$/;
            return regexMotDePasse.test(motDePasse);
        }

        function verifierNomPrenom(nomPrenom) {
            const regexNomPrenom = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{4,}$/;
            return regexNomPrenom.test(nomPrenom);
        }

        function verifierAdresseEmail(email) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            return regexEmail.test(email);
        }

        function verifierDateNaissance(dateNaissance) {
            const regexDateNaissance = /^\d{4}-\d{2}-\d{2}$/;

            if (!regexDateNaissance.test(dateNaissance)) {
                // La date de naissance n'est pas dans le format attendu (AAAA-MM-JJ)
                return false;
            }

            const anneeNaissance = parseInt(dateNaissance.substring(0, 4), 10);
            const moisNaissance = parseInt(dateNaissance.substring(5, 7), 10);
            const jourNaissance = parseInt(dateNaissance.substring(8, 10), 10);

            // Vérifier si la personne a au moins 18 ans
            const dateActuelle = new Date();
            const anneeActuelle = dateActuelle.getFullYear();
            const moisActuel = dateActuelle.getMonth() + 1; // Mois est 0-indexé, donc on ajoute 1
            const jourActuel = dateActuelle.getDate();

            const ageMinimum = 18;

            if (
                anneeActuelle - anneeNaissance < ageMinimum ||
                (anneeActuelle - anneeNaissance === ageMinimum &&
                    (moisActuel < moisNaissance ||
                        (moisActuel === moisNaissance && jourActuel < jourNaissance)))
            ) {
                // La personne n'a pas encore atteint l'âge minimum requis
                return false;
            }

            // La date de naissance est valide
            return true;
        }

        if(!verifierNomPrenom(data.firstname)){
            return res.status(400).json({error : "firstname invalid"})
        }else{
            console.log(verifierNomPrenom(data.firstname))
        }
        if(!verifierNomPrenom(data.lastname)){
            return res.status(400).json({error : "lastname invalid"})
        }else{
            console.log(verifierNomPrenom(data.lastname))
        }
        if(!verifierNomPrenom(data.username)){
            return res.status(400).json({error : "username invalid"})
        }else{
            console.log(verifierNomPrenom(data.username))
        }
        if(!verifierAdresseEmail(data.email)){
            return res.status(400).json({error : "email invalid"})

        }else{
            console.log(verifierAdresseEmail(data.email))
        }
        if(!verifierDateNaissance(data.dateOfBirth)){
            return res.status(400).json({error : "dateOfBirth invalid"})

        }else{
            console.log(verifierDateNaissance(data.dateOfBirth))
        }
        if(!verifierMotDePasse(data.password)){
            return res.status(400).json({error : "password invalid"})

        }else{
            console.log(verifierMotDePasse(data.password))
        }

        const dataTrue = {
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            age: calculerAge(dateNaissance),
            sexe: data.sexe,
            password: data.password
        }

        if (verifierNomPrenom(data.firstname) && verifierNomPrenom(data.username) && verifierAdresseEmail(data.email) && verifierDateNaissance(data.dateOfBirth) && verifierMotDePasse(data.password)) {

            //check if the user already exists in database
            const existingUser = await collection.findOne({ email: data.email })
            if (existingUser) {
                res.status(409).render("signup", { message: "L'utilisateur existe deja. Veuillez choisir une autre adresse email !" })
            } else {
                //Verification du mot de passe
                if (data.confirmPassword === data.password) {

                    // hash the password using bcrypt
                    const saltRounds = 10; //Number of salt round for bcrypt
                    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

                    dataTrue.password = hashedPassword;

                    const userdata = await collection.insertMany(dataTrue)
                    console.log(userdata)
                    res.status(201).render("login", { message: "Utilisateur enregistre avec succes !" })
                }
                else {
                    res.status(400).json({ error: "Veuillez renseigner des informations valides !" })
                }
            }
        } else {
            res.status(400).json({ error: "Veuillez renseigner des informations valides !" })
        }
    } catch (error) {
        res.status(400).json({ error: "Veuillez renseigner des informations valides !" })
    }
}
)

//Reinitialise password
app.put("/passforgot", async (req, res) => {

    try {
        const check = await collection.findOne({ email: req.body.email })
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if (check && isPasswordMatch) {
            console.log("Modification en cours de traitement !")
            const userId = check._id
            let pass = req.body.password
            pass = req.body.newpassword
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(pass, saltRounds)
            const update = await collection.findByIdAndUpdate(
                { _id: userId },
                { $set: { password: hashedPassword } }, { new: true })
            res.status(201).render("login", { message: "Mise a jour effectuee avec succes !" })
        } else {
            res.status(401).render("passforgot", { message: "identifiant ou mot de passe incorrect !" })
        }
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la'analyse des informations !" })
    }

}
)

//Get a specify user by email
app.get("/get", async (req, res) => {

    try {
        const check = await collection.findOne({ email: req.body.email })
        if (!check) {
            res.status(409).json({ message: "Utilisateur n'existe pas !" })
        } else {
            res.status(200).json({ message: "OK" })
            res.json(check)
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Erreur lors de la rechercher de l\'utilisateur !' })
    }



})

//Get all users
app.get("/getAll", async (req, res) => {

    try {
        const users = await collection.find()
        if (!users) {
            res.status(404).json({ message: "Liste des utilisateurs est vide !" })
        } else {
            res.status(200).json(users)
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Erreur lors de la recuperation de la liste des utilisateurs !' })
    }
})

//Delete user by Admin
app.delete("/delete", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email })
        if (check) {
            const id = check._id
            const del = await collection.deleteOne({ _id: id })
            if (del.deletedCount > 0) {
                res.status(200).json({ message: "Utilisateur supprime avec succes !" })

            }

        } else {
            res.status(404).json({
                message: "Utilisateur non trouve !"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Une erreur est survenue lors de la suppression du compte !' })
    }
})

app.delete("/deleteAll", async (req, res) => {
    collection.deleteMany({})
        .then(result => {
            res.status(200).json({ message: "Tous les documents ont été supprimés avec succès !" })
            console.log('Tous les documents ont été supprimés avec succès !');

        }).catch(error => {
            res.status(400).json({ message: 'Une erreur est survenue lors de la suppression des comptes !' })
            console.log('Une erreur est survenue lors de la suppression des comptes !');
        })

})

app.delete("/deleteUser", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email })
        if (check) {

            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
            const id = check._id
            const deleteUser = await collection.deleteOne({ _id: id })
            res.status(200).json({ message: "Compte supprime avec succes !" })
        }else{
            res.status(404).json({error: "Aucun utilisateur avec cette adresse mail n'a ete trouve dans la base de donnees !"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Une erreur est survenue lors de la suppression du compte, Veuillez renseigner tous les champs' })
    }
})

//Login user
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email })
        //Compare the hash password from database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)

        if (!(check || isPasswordMatch)) {
            res.statut(401).render("login", { message: "identifiant ou mot de passe incorrect !" })
        } else {
            res.status(200).render("home", { message: "Authentification reussie !" })
        }
    } catch (error) {
        res.statut(400).json({ error: "Les informations fournies sont incorrectes !" })
    }
})








//google athenticate

// ... Autres configurations ...

// Route d'authentification Google

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({
    secret: 'cats', resave: false, saveUninitialized: true, cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// app.get('/signup', (req, res) => {
//     res.send('<a href="/auth/google">Authenticate with Google</a>');
// });

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'consent' }
    ));

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/home',
        failureRedirect: '/signup'
    })
);


// Middleware pour vérifier si l'utilisateur est authentifié
const ensureAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/erreurAuthentification');
};

app.get('/erreurAuthentification', async (req, res) => {
    res.send("<a href='/signup'>Vous ne pouver pas acceder a la page d'acceuil car vous n'etes pas utilisateur de notre plateforme redirigez vous vers la page d'enregistrement</a>")
})

// Route protégée nécessitant une authentification
app.get('/profil', ensureAuthenticated, (req, res) => {
    const userProfile = req.user;
    res.render('home', { userProfile });
});

// app.get('/protected', isLoggedIn, async (req, res) => {
//     res.send(`Hello ${req.user}`);
//   });

app.get('/logout', async (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
});

const port = 5000;
app.listen(port, () => {
    console.log('Server running on Port: ' + port);
})