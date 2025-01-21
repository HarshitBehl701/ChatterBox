const mongoose  =  require('mongoose');

const groupRequestSchema =  mongoose.Schema({
    groupId:  {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    request_by:{
        type:  String,
        enum: ['group','user'],
    },
    username:  {
        type:  String,
    },
    status:  {
        type: String,
        enum: ['request','joined','rejected'],
        default:  'request'
    },
    is_active:  {
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports =    mongoose.model('grouprequest',groupRequestSchema);