const express = require("express");
const app = express();
const path = require("path");
const fileupload = require("express-fileupload");
const hbs = require("hbs");
const session = require("express-session");
require("dotenv").config();
const PORT = process.env.PORT || 3000;;

app.use(express.json());

//middleware de config Express-fileupload
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

//habilitamos la lectura de datos en campos del formulario
app.use(express(path.join(__dirname, "public")));
//habilitamos la lectura de datos en campos del formulario
app.use(express.urlencoded({extended: false}));

//Rutas 
const routeIndex = require("./routes/index");
const routeLogin = require("./routes/login");
const routeSecret = require("./routes/secret");
const routeRegister = require("./routes/register");
const routePerfil = require("./routes/perfil");
const routePerfilEdit = require("./routes/perfilEdit");
const routeCorrect = require("./routes/correct");
const routeIncorrect = require("./routes/incorrect");
const routeEndGame = require("./routes/endGame");

//establecer el motor de plantillas
app.set("view engine", "hbs");

//registramos el directorio para los parciales
hbs.registerPartials(path.join(__dirname, "./views/partials"));

app.use(express.static("public"));

app.use(
    session({
        secret: "keyboard dog",
        resave: false,
        saveUninitialized: true
    })
);
const secured = async (req,res,next) => {
    if (req.session.user){
        next();
    }
    else {
        const message = "Primero debe loguearse"
        res.render("login", {message}); 
    }
}

//uso de rutas
app.use("/", routeIndex);
app.use("/login", routeLogin);
app.use("/register", routeRegister);
app.use("/correct", secured, routeCorrect);
app.use("/incorrect", secured, routeIncorrect);
app.use("/perfil", secured, routePerfil);
app.use("/perfilEdit", secured, routePerfilEdit);
app.use("/secret", secured, routeSecret);
app.use("/endGame", secured, routeEndGame);

app.listen(PORT, (err) => {
    err
    ? console.log("no anda ni pinga")
    : console.log(`todo marcha bien corriendo en http://localhost:${PORT}/}`)
})

