const mongoose  = require('mongoose');

const chatSchema  = mongoose.Schema({
    sender_unique_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    receiver_unique_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    message:{
        type:  String
    },
    status:{
        type: String,
        enum:  ['sent','delivered','read'],
        default: 'sent'
    },
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('chat',chatSchema);