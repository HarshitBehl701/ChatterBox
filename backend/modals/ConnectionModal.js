const mongoose  = require('mongoose');

const connectionSchema = mongoose.Schema({
    username:  {
        type: String,
    },
    socketId: {
        type:  String,
    },
    is_active:{
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports  = mongoose.model('connection',connectionSchema);