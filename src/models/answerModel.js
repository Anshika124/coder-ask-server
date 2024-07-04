const mongoose = require('mongoose');
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
        upvoteCounts: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'User' 
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
