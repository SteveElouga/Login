const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const collection = require("./config")
const bcrypt = require('bcrypt');

const GOOGLE_CLIENT_ID = '798567632618-jpa1vjht1pgsd47i7kg7598di12nj7mm.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            // Vérifier si l'utilisateur existe dans la base de données
            let user = await collection.findOne({ email: profile.emails[0].value });
            // Récupérer la date de naissance du profil
            let dateNaissance = profile._json.birthday;
            const dd = new Date('1800-01-01')


            if (!dateNaissance) {
                dateNaissance = dd
            }

            let sexe = profile.gender
            if(!sexe){
                sexe = "None"
            }

            // Calculer l'âge à partir de la date de naissance
            const age = calculerAge(dateNaissance, dd);

            if (!user) {
                // Si l'utilisateur n'existe pas, créez-le dans la base de données
                const saltRounds = 10; //Number of salt round for bcrypt
                const hashedPassword = await bcrypt.hash(profile.id, saltRounds)

                user = new collection({
                    googleId: profile.id,
                    password: hashedPassword,
                    email: profile.emails[0].value,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    username: profile.name.givenName + ' ' + profile.name.familyName,
                    dateOfBirth: dateNaissance,
                    age: age,
                    sexe: sexe
                    // Ajoutez d'autres champs au besoin
                })

                await user.save();
            }else{
                res.status(409).json({ message: "L'utilisateur existe deja. Veuillez choisir une autre adresse email !" })
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

// Fonction pour calculer l'âge à partir de la date de naissance
function calculerAge(dateNaissance, dd) {
    if (dateNaissance === dd) {
        return null
    } else {
        const today = new Date();
        const birthDate = new Date(dateNaissance);
        let age = today.getFullYear() - birthDate.getFullYear();
        const moisDifference = today.getMonth() - birthDate.getMonth();

        if (moisDifference < 0 || (moisDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await collection.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

