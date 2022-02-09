"use strict"
const express = require("express");
const router = express.Router();
const req = require("express/lib/request");

router.get("/", (req, res) => {
    res.render("correct");
});

module.exports = router;