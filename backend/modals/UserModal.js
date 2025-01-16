const  mongoose  = require('mongoose');

const userSchema =  mongoose.Schema({
    unique_token:  {
        type: String,
    },
    picture:{
        type: String,
    },
    email:{
        type: String,
    },
    user_name:{
        type: String,
    },
    password: {
        type: String,
    },
    status:{
        type: String,
        enum: ['online','offline']
    },
    is_active:{
        type: Number,
        enum:  [0,1],
        default: 1
    }
},{timestamps: true});

module.exports = mongoose.model('user',userSchema);