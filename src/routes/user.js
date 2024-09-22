const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel.js");
const ProfileModel = require("../models/profileModel.js");

router.get('/', (req, res) => {
    res.send("user model");
});

router.post('/register', async (req, res) => {
    const fullName = req.body.fullName;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const googleId = req.body.googleId;

    try {
        let emailExist = await UserModel.findOne({ email: email });
        if (emailExist !== null && Object.keys(emailExist).length > 0) {
            return res.status(200).json({ success: false, value: "email", message: "This email is used by another account. Please use another email." });
        }

        let userNameExist = await UserModel.findOne({ userName: userName });
        if (userNameExist !== null && Object.keys(userNameExist).length > 0) {
            return res.status(200).json({ success: false, value: "username", message: "This username is used by another account. Please use another username." });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            fullName: fullName,
            userName: userName,
            email: email,
            password: hashedPassword,  // Save the hashed password
            googleId: googleId
        });

        let userSaveResult = await user.save();
        console.log(userSaveResult);

        const profile = new ProfileModel({
            userId: userSaveResult._id
        });

        let profileSaveResult = await profile.save();
        console.log(profileSaveResult);

        return res.status(200).json({ success: true, value: userSaveResult, message: "Register successful" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({ success: false, message: "Invalid email/password" });
        }

        return res.status(200).json({ success: true, message: "User login successful", value: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

router.put('/forgotpassword', async (req, res) => {
    const { email, userName, password } = req.body;

    try {
        // Hash the new password before updating
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUserData = await UserModel.findOneAndUpdate(
            { email: email, userName: userName },
            { $set: { password: hashedPassword } },  // Save the hashed password
            { new: true }
        );

        if (!updatedUserData) {
            return res.status(404).send({ error: 'User not found.' });
        }

        res.send(updatedUserData);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});




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




router.get('/getalluser', async(req, res) => {
    try {
        let data = await ProfileModel.find().populate('userId' );
        res.send(data);
    }
    catch (err)
    {

    }
})

router.post('/getuser', async(req, res) => {
    const userId = req.body.userId;
    try {
        let data = await ProfileModel.findOne({ userId: userId }).populate({
            path: 'bookmarkedQuestions',
            populate: {path: 'postedBy'}
        }).populate('userId' );
        res.send(data);
    }
    catch (err)
    {

    }
})

router.put('/editprofile', async(req, res) => {
    const _id = req.body._id;
    const userId = req.body.userId;
    const fullName = req.body.userId.fullName;
    const userName = req.body.userId.userName;
    const bio = req.body.bio;
    // console.log(req.body);
    const socialMediaLinks = req.body.socialMediaLinks;
    let userNameExist = await UserModel.findOne({ userName: userName });

    if (userNameExist && userNameExist._id.equals(userId._id)) { 
        userNameExist = null;
    }
    
    if (userNameExist !== null && Object.keys(userNameExist).length > 0) {
        return res.status(200).json({ success: false, value: "username", message: "This username is used by another account. Please use another username." });
    }

    try {
        let userData = await UserModel.findOneAndUpdate(
            {_id: userId._id},
            {$set: {fullName: fullName, userName: userName}},
            {new: true}
        );
        // console.log("user: "+userData);   

        let profileData = await ProfileModel.findOneAndUpdate(
            {_id: _id},
            {$set: {bio: bio, socialMediaLinks: socialMediaLinks}},
            {new: true}
        ).populate('userId');
        console.log("profile"+profileData);

        return res.status(200).json({ success: true, message: "profile updated", value: profileData});
    }
    catch (err) {
    }
})



module.exports = router;