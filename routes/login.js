"use strict"
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");
const md5 = require("md5");

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/forgetPass", (req, res) => {
    res.render("forgetPass");
});

router.get("/logout", (req,res) => {
    req.session.destroy();
    res.redirect("/");
})

router.post("/", async (req, res) => {
    try{
    const { user, password } = req.body;
    const data = await mdlUsers.getUser(user, password);

    if (data === undefined) {
        const message = "Incorrect user or password"
        res.render("login", {message});
    }
    else if(data.token !== "VERIFIED"){
        const message = "Unverified email account"
        res.render("login", {message});  
    }
    else if((data.username == user) && (data.password == md5(password)) && (data.token == "VERIFIED")){
        req.session.user = user;
        res.redirect("secret");
    }
    }
    catch (Error){
        console.log(Error);
    };
});

module.exports = router;
