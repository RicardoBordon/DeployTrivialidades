"use strict"
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");
const nodemailer = require("nodemailer");
const md5 = require("md5");
const { v4: uuidv4 } = require('uuid');
const util= require("util");
const cloudinery = require("cloudinary").v2;
const uploader = util.promisify(cloudinery.uploader.upload);
const {body, validationResult} = require("express-validator");


router.get("/", async (req, res) => {
    res.render("register");
});

router.get("/sendMail", (req, res) => {
  res.render("sendMail");
});

router.get("/emailOk", (req, res) => {
  res.render("emailOk");
});

router.post("/",[
  body('re-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
], async (req, res) => {

const errors = validationResult(req);
if(!errors.isEmpty()){
  const msg = "passwords are not the same";
  res.render("register", {msg});
}  
else{
//obtengo datos del formulario 
const {username, email, nombre, apellido, password } = req.body;

//leo el archivo de imagen

  let imgFile = req.files.imagen;

  //obtengo id de referencia de cloudinary(servidor de imagenes)
  const img_id = (await uploader(imgFile.tempFilePath)).public_id;

  //datos guardados en el objeto data
  const data = {
  username,
  email,
  password:md5(password),
  imagen:img_id,
  nombre,
  apellido,
  }
  let finderr = await mdlUsers.addUser(data);

  
  if( finderr === true ){
    await destroy(img_id);
    const msg = "user exist or email exist";
    res.render("register", {msg});
  }
  else{
   
  //creo conexion con servidor de email smtp
  const transport = nodemailer.createTransport({
    host: process.env.ML_HOST,
    port: process.env.ML_NAME,
    segure: false,
    auth: {
        user: process.env.ML_USER,
        pass: process.env.ML_PASS,
    }
    });
    
  //genero el token a partir de un cod aleatorio y mail  
  let code = uuidv4();
  const token = mdlUsers.getToken({email, code });
  const link = `<a href=http://localhost:3000/register/confirm/${ token }>CONFIRMAR EMAIL</a>`;

  const emailMsg = {
    to: email,
    from: process.env.ML_USER,
    subject: "TRIVIA-API-TP-FINAL",
    html: link
  }
  //envio mail con token
  transport.sendMail(emailMsg);
  res.redirect("/register/sendMail");
  }
 }
});
  //Si se presiona en el boton del correo deberia llegar a esta ruta 
  //la cual es unica, se cambiara el campo token segun email a VERIFIED
router.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;
  const data = mdlUsers.getTokenData(token);
  const { email, code } = data.data;
  mdlUsers.verified(data.data.email);
  res.redirect("/register/emailOk");
});


module.exports = router;