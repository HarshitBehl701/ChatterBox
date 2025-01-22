const mongoose  =  require('mongoose');

const groupSchema =  mongoose.Schema({
    name:  {
        type:  String,
        unique:  true
    },
    adminUserId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    picture:  {
        type: String,
    },
    members:  [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref:  'user'
        }
    ],
    status:  {
        type:  String,
        enum: ['active','inactive'],
        default:  'active'
    },
    is_active:  {
        type:  Number,
        enum: [0,1],
        default: 1
    }
},{timestamps: true});

module.exports =    mongoose.model('group',groupSchema);