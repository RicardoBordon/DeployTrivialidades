"use strict"
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");


router.get("/", async (req, res) => {
    
    const row = await mdlUsers.getUserName(req.session.user);
    const usuario = { 
    user: row[0].username,
    email: row[0].email,
    nombre: row[0].nombre,
    apellido: row[0].apellido,
    imagen: row[0].imagen,
    score: row[0].score,
    scoreNow: row[0].scoreNow,
  };

  //Traigo ordenado desde DB por máximo score
    const maxScores = await mdlUsers.maxScores();
    const scores = {
      user1: maxScores[0],
      user2: maxScores[1],
      user3: maxScores[2],
    }
    res.render("endGame", {usuario, scores});
});

router.post("/", (req,res) => {
    res.redirect("login/logout");
})

module.exports = router;