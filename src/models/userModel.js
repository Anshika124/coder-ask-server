const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullName: { 
            type: String, 
            required: true 
        },
        userName: { 
            type: String, 
            unique: true, 
            required: true 
        },
        email: { 
            type: String, 
            unique: true, 
            required: true 
        },
        password: { 
            type: String 
        },
        googleId: { 
            type: String 
        }, 
    }, 
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('User', userSchema);
