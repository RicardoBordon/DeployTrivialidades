"use strict"
const express = require("express");
const router = express.Router();
const req = require("express/lib/request");

router.get("/", async (req, res) => {
    res.render("incorrect");
});



module.exports = router;