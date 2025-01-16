const mongoose  = require('mongoose');

const roomSchema  = mongoose.Schema({
    room_id:  {
        type: String,
    },
    user_admin_token:  {
        type: String,
        ref: 'user',
    },
    size:{
        type:  Number,
        default: 1
    },
    members:[
        {
            type:  String,
            ref: 'user'
        }
    ],
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('room',roomSchema);