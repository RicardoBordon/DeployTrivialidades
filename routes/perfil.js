"use strict"
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");
const cloudinery = require("cloudinary").v2;

router.get("/", async (req, res) => {
    const row = await mdlUsers.getUserName(req.session.user);
    const usuario = {
        user: row[0].username,
        email: row[0].email,
        nombre: row[0].nombre,
        apellido: row[0].apellido,
        imagen: row[0].imagen,
        score: row[0].score
      };
      
      let imgURL = cloudinery.url(row[0].imagen);
      console.log(imgURL);
      res.render("perfil", {usuario, imgURL});
});

router.post("/", async (req, res) => {
      res.redirect("perfilEdit");
});

module.exports = router;