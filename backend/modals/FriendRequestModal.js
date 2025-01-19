const mongoose  = require('mongoose');

const friendRequestSchema  = mongoose.Schema({
    request_sent_by_user_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    request_sent_to_user_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    status:{
        type: String,
        enum:  ['request','accepted','rejected'],
    },
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('friendRequest',friendRequestSchema);