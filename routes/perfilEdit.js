"use strict"
const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers");
const util= require("util");
const cloudinery = require("cloudinary").v2;
const uploader = util.promisify(cloudinery.uploader.upload);
const destroy = util.promisify(cloudinery.uploader.destroy);

router.get("/", async (req, res) => {
    const row = await mdlUsers.getUserName(req.session.user);
    const usuario = {
        user: row[0].username,
        email: row[0].email,
        nombre: row[0].nombre,
        apellido: row[0].apellido,
        imagen: row[0].imagen
    };
    let imgURL = cloudinery.url(row[0].imagen);

    res.render("perfilEdit", {usuario, imgURL});
});

//Borrar usuario de DB y foto de cloudinary
router.get("/deleteUser", async (req,res) => {
    const row = await mdlUsers.getUserName(req.session.user);
    await destroy(row[0].imagen);
    await mdlUsers.deleteUser(req.session.user);
    res.redirect("/");
});

//Actualiza datos editados de usuario
router.post("/", async (req,res) => {
    let { userprev, username, nombre , apellido, img_id } = req.body;   
if (req.files != undefined) {
    await destroy(img_id);
    let img_file = req.files.img_fl;
    img_id = (await uploader(img_file.tempFilePath)).public_id;
}  
    const data = { username, nombre, apellido, imagen:img_id };
    await mdlUsers.updateUser(data, req.session.user);
    if (username !== userprev){
        res.redirect("/login/logout");
    }
    else{
    res.redirect("perfil");
    }
})

module.exports = router;