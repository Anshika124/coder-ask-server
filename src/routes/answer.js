const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const AnswerModel = require("../models/answerModel.js");
const QuestionModel = require("../models/questionModel.js");
const ProfileModel = require("../models/profileModel.js");

router.post('/addanswer', async (req, res) => {
    const {answerFor, description, answeredBy} = req.body;

    const answer = new AnswerModel({
        answerFor, description, answeredBy
    });

    try {
        const savedAnswer = await answer.save();
        let question = await QuestionModel.findOne({ _id : answerFor });
        question.answersList.push(savedAnswer._id);
        await question.save();
        let profile = await ProfileModel.findOne({userId:answeredBy});
        profile.answersList.push(savedAnswer._id);
        await profile.save();
        res.send(savedAnswer);

    }
    catch (err) {
    };
})

router.get('/answerlistofquestion', async (req, res) => {
    const {questionId} = req.body;

    try {
        let answerList = await AnswerModel.find({answerFor : questionId});
        res.send(answerList);

    }
    catch (err) {
    }
})

router.get('/answerlistofuser', async (req, res) => {
    const userId = req.query.userId;

    try {
        let answerList = await AnswerModel.find({answeredBy : userId}).sort({ postedOn: -1 }).populate('answerFor');
        res.send(answerList);
    }
    catch (err){

    }
})

router.put('/updateanswer', async (req, res) => {
    const {answerId, description} = req.body;

    try {
        let updatedAnswer = await AnswerModel.findOneAndUpdate(
            {_id: answerId },
            {$set : {description: description, editedOn: Date.now()}},
            {new:true}
        );
        res.send(updatedAnswer);
    }
    catch (err) {
    }
})
router.delete('/deleteanswer', async (req, res) => {
    const { answerId } = req.query;

    try {
        let deletedAnswer = await AnswerModel.findOneAndDelete({ _id: answerId});

        await QuestionModel.updateOne(
            {_id: deletedAnswer.answerFor},
            {$pull : {answersList: answerId}}
        )
        await ProfileModel.updateOne(
            { userId: deletedAnswer.answeredBy },
            { $pull: { answersList: answerId } }
        );

        res.send(deletedAnswer);

    }
    catch (err){
    }
    
})

router.put('/updateupvotecount', async (req, res) => {
    const { answerId, userId, isUpvote} = req.body;

    try {
        let answer = await AnswerModel.findOne({ _id : answerId });
        let userUpvoteIndex = answer.upvotesList.findIndex(vote => vote.userId.equals(userId));
        if (userUpvoteIndex != -1)
        {
            answer.upvotesList[userUpvoteIndex].isUpvote = isUpvote;
        }
        else {
            answer.upvotesList.push({ userId: userId, isUpvote:isUpvote });
        }
        let upvotesCount = answer.upvotesList.filter(upvote => upvote.isUpvote).length;
        let downvotesCount = answer.upvotesList.filter(upvote => !upvote.isUpvote).length;
        await answer.save();
        res.send({"VoteCount":upvotesCount-downvotesCount});

    }
    catch (err) {
    }
})

module.exports = router;