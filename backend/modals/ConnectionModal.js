const  mongoose = require('mongoose');

const connectionSchema =  mongoose.Schema({
    room_id:{
        type: String,
        ref: 'room'
    },
    user_unique_token:{
        type:  String,
        ref: 'user',
    },
    status:{
        type:  String,
        enum: ['request','joined','rejected','leave'],
        default: 'request'
    },
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports  =  mongoose.model('connection',connectionSchema);