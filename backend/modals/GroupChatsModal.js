const mongoose  = require('mongoose');

const groupChatSchema  = mongoose.Schema({
    sender_unique_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    group_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
    },
    message:{
        type:  String
    },
    status:{
        type: String,
        enum:  ['sent','delivered','read'],
        default:   'sent'
    },
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('groupChat',groupChatSchema);