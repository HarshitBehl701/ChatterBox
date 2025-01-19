const  mongoose  = require('mongoose');

const userSchema =  mongoose.Schema({
    name: {
        type: String
    },
    picture:{
        type: String,
    },
    email:{
        type: String,
    },
    username:{
        type: String,
    },
    password: {
        type: String,
    },
    status:{
        type: String,
        enum: ['online','offline'],
        default: "offline"
    },
    friendsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'user'
        }
    ],
    is_active:{
        type: Number,
        enum:  [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('user',userSchema);