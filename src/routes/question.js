const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const AnswerModel = require("../models/answerModel.js");
const QuestionModel = require("../models/questionModel.js");
const ProfileModel = require("../models/profileModel.js");
const answerModel = require("../models/answerModel.js");

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
        
        return res.status(200).json({ success: true, message: "Question updated", value: savedQuestion});
    }
    catch (err) {
    }
});

router.post('/addbookmarkquestion', async (req, res) => {
    const { questionId, userId } = req.body;


    try {
        let question = await QuestionModel.findOne({ _id: questionId})
        let profile = await ProfileModel.findOne({ userId: userId });
        
        profile.bookmarkedQuestions.push(questionId);
        question.bookmarkedUsers.push(userId)
        let bookmarkprofile = await profile.save();
        let bookmarkques = await question.save();

        return res.status(200).json({ success: true, message: "Question Bookmarked", value1: bookmarkprofile, value2: bookmarkques});
    }
    catch (err) {
    }
});

router.post('/removebookmarkquestion', async (req, res) => {
    const { questionId, userId } = req.body;
    

    try {
        await ProfileModel.updateOne(
            { userId: userId },
            { $pull: { bookmarkedQuestions: questionId } }
        );
        
        await QuestionModel.updateOne(
            { _id: questionId },
            { $pull: { bookmarkedUsers: userId } }
        );
        
        let profile = await ProfileModel.findOne({ userId: userId });
        let question = await QuestionModel.findOne({ _id: questionId })
        // let bookmarkprofile = await p.save();
        // let bookmarkques = await question.save();

        return res.status(200).json({ success: true, message: "Question Bookmarked removed", value1: profile, value2: question });
    }
    catch (err) {
    }
});


router.get('/allquestionlist', async (req, res) => {
    try {
        let questionList = await QuestionModel.find({}).populate('postedBy').sort({ postedOn: -1 });
        res.send(questionList);
    }
    catch (err) {
    }
})


router.get('/searchquestion', async (req, res) => {
    const query = req.query.query;
    try {
        
        let result = await QuestionModel.find({
            title: { $regex: query, $options: 'i' } // 'i' makes it case-insensitive
        })
            .populate('postedBy')
            .sort({ postedOn: -1 });

        res.send(result);
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while searching for questions' });
    }
});


router.get('/questionlistofuser', async (req, res) => {
    const userId = req.query.userId;
    // console.log(userId);
    try {
        let userQuestionList = await QuestionModel.find({postedBy:userId}).sort({ postedOn: -1 }).populate('postedBy');
        res.send(userQuestionList);
    }
    catch (err){

    }
})

router.get('/questionbyid', async (req, res) => {
    const Id = req.query._id;
    // console.log(Id);
    try {
        let Question = await QuestionModel.find({_id: Id}).populate({
            path: 'answersList',
            populate: { path: 'answeredBy' }
        }).populate('postedBy');
        // console.log(Question[0].answersList[0]);
        Question[0].answersList = Question[0].answersList.map((answer) => {
            let upvotesCount = answer.upvotesList.filter(upvote => upvote.isUpvote).length;
            let downvotesCount = answer.upvotesList.filter(upvote => !upvote.isUpvote).length;
            let result = upvotesCount - downvotesCount;

            // Add the new property `abc` to the answer object
            return {
                ...answer,  // Spread the original answer object
                totalVotecount: result      // Add the new property
            };
        });
        Question[0].answersList.sort((a, b) => b.totalVotecount - a.totalVotecount);
        // console.log(Question[0].answersList[0])
        res.send(Question);
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
        
        return res.status(200).json({ success: true, message: "Question updated", value: updatedQuestion });
    }
    catch (err){
    }
})



router.delete('/deletequestion', async (req, res) => {
    const { questionId } = req.query;
    console.log('id hai: '+questionId);

    try {

        let answers = await AnswerModel.find({ answerFor: questionId })
        
        answers.map(async(answer)=>{
            await ProfileModel.updateOne(
                { userId: answer.answeredBy },
                { $pull: { answersList: answer._id } }
            )
        })
    
        await AnswerModel.deleteMany({ answerFor: questionId })

        let deletedQuestion = await QuestionModel.findOneAndDelete({ _id: questionId});
        await ProfileModel.updateOne(
            { userId: deletedQuestion.postedBy },
            { $pull: { questionsList: questionId } }
        );

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
        res.send({"VoteCount":upvotesCount-downvotesCount});

    }
    catch (err) {
    }
})

router.get('/votecount', async (req, res) => {
    const { questionId } = req.query;

    try {
        let question = await QuestionModel.findOne({ _id: questionId });
        let upvotesCount = question.upvotesList.filter(upvote => upvote.isUpvote).length;
        let downvotesCount = question.upvotesList.filter(upvote => !upvote.isUpvote).length;
        res.send({ "VoteCount": upvotesCount - downvotesCount });

    }
    catch (err) {
    }
})



module.exports = router;