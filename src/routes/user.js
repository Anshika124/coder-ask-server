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
        console.log(userSaveResult);
        const profile = new ProfileModel({
            userId : userSaveResult._id
        })

        let profileSaveResult = await profile.save();
        console.log(profileSaveResult);
        

        res.send(userSaveResult);
    }
    catch (err) {
        console.log(err);
    }


});

router.get('/login', async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = await UserModel.findOne({email : email });
        if (!user) {
            res.send("User not found");
        }
        else if (password !== user.password) {
            res.send("Invalid password");
        }
        else {
            res.send("User login successful");
        }
    }
    catch(err){
        console.log(err);
    }
});


router.put('/forgotpassword', async(req, res) => {
    const {email, userName,password} = req.body;

    try {
        const updatedUserData = await UserModel.findOneAndUpdate(
            { email: email,  userName: userName },
            { $set: { password: password } },
            { new: true} // Return the updated document
        );

        if (!updatedUserData) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.send(updatedUserData);
    }
    catch(err){
    }

})

router.delete('/deletebyusername', async(req, res) => {
    const userName = req.body.userName;

    try {
        let userDataDelete = await UserModel.findOneAndDelete({userName: userName});
        if (userDataDelete) {
            res.send(userDataDelete);
        }
        else {
            res.send({ error: 'User not found.' });
        }
    }
    catch(err){
    }
})




router.get('/getdata', async(req, res) => {
    try {
        let data = await UserModel.find();
        res.send(data);
    }
    catch (err)
    {

    }
})



module.exports = router;