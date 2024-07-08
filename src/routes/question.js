const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const AnswerModel = require("../models/answerModel.js");
const QuestionModel = require("../models/questionModel.js");
const ProfileModel = require("../models/profileModel.js");

router.post('/addquestion', async (req, res) => {
    const { title, tags, description, postedBy} = req.body;

    const question = new QuestionModel({
        title, tags, description, postedBy
    })

    try {
        const savedQuestion = await question.save();
        let profile = await ProfileModel.findOne({userId:postedBy});
        profile.questionsList.push(savedQuestion._id);
        await profile.save();
        res.send(savedQuestion);
    }
    catch (err) {
    }
});

router.get('/allquestionlist', async (req, res) => {
    try {
        let questionList = await QuestionModel.find({}).populate('postedBy');
        res.send(questionList);
    }
    catch (err) {
    }
})

router.get('/questionlistofuser', async (req, res) => {
    const userId = req.body.userId;
    try {
        let userQuestionList = await QuestionModel.find({postedBy:userId});
        res.send(userQuestionList);
    }
    catch (err){

    }
})

router.put('/updatequestion', async (req, res) => {
    const { questionId, title, tags, description } = req.body;

    try {
        let updatedQuestion = await QuestionModel.findOneAndUpdate(
            { _id : questionId},
            { $set : { title: title, tags:tags, description: description, editedOn: Date.now()}},
            { new: true}
        );
        res.send(updatedQuestion);
    }
    catch (err){
    }
})

router.delete('/deletequestion', async (req, res) => {
    const { questionId } = req.body;

    try {
        let deletedQuestion = await QuestionModel.findOneAndDelete({ _id: questionId});
        await ProfileModel.updateOne(
            { userId: deletedQuestion.postedBy },
            { $pull: { questionsList: questionId } }
        );

        let answers = await AnswerModel.findMany({answeredFor: questionId})

        for (let answer in answers) {
            await ProfileModel.updateOne(
                {userId: answer.answeredBy},
                { $pull: { answersList: answer._id}}
            )
        }

        await AnswerModel.deleteMany({answeredFor: questionId})

        res.send(deletedQuestion);
    }
    catch (err){
    }
})

router.put('/updateupvotecount', async (req, res) => {
    const { questionId, userId, isUpvote} = req.body;

    try {
        let question = await QuestionModel.findOne({ _id : questionId });
        let userUpvoteIndex = question.upvotesList.findIndex(vote => vote.userId.equals(userId));
        if (userUpvoteIndex != -1)
        {
            question.upvotesList[userUpvoteIndex].isUpvote = isUpvote;
        }
        else {
            question.upvotesList.push({ userId: userId, isUpvote:isUpvote });
        }
        let upvotesCount = question.upvotesList.filter(upvote => upvote.isUpvote).length;
        let downvotesCount = question.upvotesList.filter(upvote => !upvote.isUpvote).length;
        await question.save();
        res.send({"upVoteCount":upvotesCount-downvotesCount});

    }
    catch (err) {
    }
})



module.exports = router;