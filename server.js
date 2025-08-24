
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
let version = "1.0.0";
// Middleware pour analyser les requêtes au format JSON
app.use(express.json());

// Middleware pour analyser les requêtes au format x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Configuration des options CORS en fonction de l'environnement
var corsOptionsProd = {
  origin: process.env.PROD_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var corsOptionsDev = {
  origin: process.env.DEV_URL,
  optionsSuccessStatus: 200
}
var corsOptions = process.env.ENV_TYPE == "prod" ? corsOptionsProd : process.env.ENV_TYPE == "dev" ? corsOptionsDev : null
app.use(cors(corsOptions));

// Connexion à la base de données MongoDB via Mongoose
const db = require("./app/models");
db.mongoose.connect(db.url, { useNewUrlParser: true })
  .then(() => {
  
    console.log("Connecté à la base de données! ");
    console.log(`version : ${version}`)
  })
  .catch(err => {
    console.log("Impossible de se connecter à la base de données!",err);
    process.exit();
  });

// Import et configuration des routes de l'application
const gameRoute = require("./app/routes/GameRoute");
gameRoute(app, corsOptions);


app.get("/", (req, res) => {
  res.status(200)
  res.json({ message: `Bienvenue sur l'application Memoire44 : ${version}` });
});

// Configuration du port d'écoute du serveur
const PORT = process.env.NODE_DOCKER_PORT || 8080;
console.log("port : ",PORT)
app.listen(PORT);

module.exports= app