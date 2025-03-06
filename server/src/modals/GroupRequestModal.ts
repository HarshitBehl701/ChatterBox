import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupRequest extends Document {
    _id: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    request_by: 'group' | 'user';
    userId: mongoose.Types.ObjectId;
    status: 'request' | 'accepted' | 'rejected';
    is_active: 0 | 1;
}

const groupRequestSchema = new Schema<IGroupRequest>({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    request_by: {
        type: String,
        enum: ['group', 'user'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['request', 'accepted', 'rejected'],
        default: 'request'
    },
    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, { timestamps: true });

const GroupRequestModal = mongoose.model<IGroupRequest>('groupRequest', groupRequestSchema);
export default GroupRequestModal;