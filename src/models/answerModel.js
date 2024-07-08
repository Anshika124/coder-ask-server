const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema(
    {
        answerFor: { 
            type: Schema.Types.ObjectId, 
            ref: 'Question', 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        upvotesList: [
            { 
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                isUpvote: { type: Boolean, required: true }
            }
        ],
        answeredOn: { 
            type: Date, 
            default: Date.now 
        },
        editedOn: { 
            type: Date 
        },
        answeredBy: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }
    }, 
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('Answer', answerSchema);
