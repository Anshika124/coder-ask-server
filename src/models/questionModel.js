const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        tags: [
            { 
                type: String 
            }
        ],
        description: { 
            type: String 
        },
        upvotesList: [
            { 
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                isUpvote: { type: Boolean, required: true }
            }
        ],
        answersList: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Answer' 
            }
        ],
        postedOn: { 
            type: Date, 
            default: Date.now 
        },
        editedOn: { 
            type: Date 
        },
        postedBy: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        bookmarkedUsers: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'User' 
            }
        ]
    }, 
    { 
        timestamps: true 
    }
);
  
  module.exports = mongoose.model('Question', questionSchema);
  