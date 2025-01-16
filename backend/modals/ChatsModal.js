const mongoose  = require('mongoose');

const chatSchema  = mongoose.Schema({
    room_id:  {
        type: String,
        ref: 'room'
    },
    user_unique_token:  {
        type: String,
        ref: 'user',
    },
    message:{
        type:  String
    },
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('chat',chatSchema);