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
            type: String ,
            default: ""
        },
        profilePicture: { 
            type: String ,
            default: ""
        },
        socialMediaLinks: { 
            type: Map, of: String ,
            default: () => ({linkedin: '', github:'', twitter:''})
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
  