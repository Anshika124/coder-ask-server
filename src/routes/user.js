const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const UserModel = require("../models/userModel.js");
const ProfileModel = require("../models/profileModel.js");

router.get('/', (req, res) => {
    res.send("user model");
});

router.post('/register', async(req, res) => {
    const fullName = req.body.fullName;
    const userName = req.body.userName;  
    const email = req.body.email;
    const password = req.body.password;
    const googleId = req.body.googleId;

    const user = new UserModel({
        fullName: fullName,
        userName: userName,
        email: email,
        password: password,
        googleId: googleId
    })

    try {
        let userSaveResult = await user.save();
        res.send(userSaveResult);
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/getdata', async(req, res) => {
    try {
        let data = await UserModel.find({},{email:1, _id:0});
        res.send(data);
    }
    catch (err)
    {

    }
})

module.exports = router;