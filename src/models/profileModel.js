const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        bio: { 
            type: String 
        },
        profilePicture: { 
            type: String 
        },
        socialMediaLinks: { 
            type: Map, of: String 
        }, // e.g., { twitter: 'url', facebook: 'url' }
        questionsList: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Question' 
            }
        ],
        answersList: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Answer' 
            }
        ],
        bookmarkedQuestions: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Question' 
            }
        ],
        draftQuestions: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Question' 
            }
        ],
        savedBookmarks: [
            { 
                type: String 
            }
        ], 
        notebook: [
            { 
                type: String 
            }
        ] 
    } , 
    { 
        timestamps: true 
    }
);
  
  module.exports = mongoose.model('Profile', profileSchema);
  