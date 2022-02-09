"use strict"
const express = require("express");
const router = express.Router();
const Trivia = require('trivia-api');
const mdlUsers = require("../models/mdlUsers");
const cloudinery = require("cloudinary").v2;
const encode = require("html-entities");

router.get("/", async (req, res) => {
  
  const trivia = new Trivia({ codificación: 'urlLegacy, url3986, base64' });
  if(Vidas.vidas > 0) {

  //config de api trivia  
  let options = {
    type: 'multiple',
    amount: 1,
    difficulty: 'easy',
    //category: 18,
  }

  //segun config trae pregunta tipo choise 
  const pregunta = await trivia.getQuestions(options);
  const { results } = pregunta;

  //guardo la pregunta en un objeto
  const data = {
    category: results[0].category,
    type: results[0].type,
    difficulty: results[0].difficulty,
    question: encode.decode(results[0].question),
    correct_answer: results[0].correct_answer,
    incorrect_answer: results[0].incorrect_answers,
  };
   
  //desestructuro el array de respuestas incorrectas
  let[x,y,z] = data.incorrect_answer;

  //le agrego la respuesta correcta y las desordeno para mostrar
  let questions = [data.correct_answer,x,y,z];
  questions.sort(() => Math.random() - 0.5);
  let [a,b,c,d] = questions;
  let score= Score.score;
  let vidas= Vidas.vidas;
  const row = await mdlUsers.getUserName(req.session.user);
  const navImg = { imagen: cloudinery.url(row[0].imagen) };

  res.render("secret", {user: req.session.user,data,a,b,c,d,score,vidas,navImg});
}
  else{

    const row = await mdlUsers.getUserName(req.session.user);
    const prevMax = { 
      prevScore: row[0].score 
    };
    let score= Score.score;
    //actualizo el score actual para mostrar al final
    await mdlUsers.updateScoreNow(score,req.session.user);

    //actualizo el score del usuario solo si es mayor al anterior
    if(score>prevMax.prevScore){
    await mdlUsers.updateScore(score,req.session.user);
    }

    //Muestro y reinicio score y vidas
    res.redirect("endgame");
    Vidas.vidas=5;
    Score.score=0;
  }
});

router.post("/", async (req, res) => {
  let { correct, btn } = req.body;

   if(btn===correct){
       Score.staticMethod();
       res.render("correct");
      }
    else{
      Vidas.staticMethod();
      res.render("incorrect");
    }
});

class Vidas {
  static vidas = 5;
  static  staticMethod() {  
  return this.vidas= this.vidas-1;
}
}

class Score {
  static score = 0;
  static staticMethod() {
   return this.score= this.score+10;
  }
}

module.exports = router;


