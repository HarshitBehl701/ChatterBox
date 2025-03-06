import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendRequest extends Document {
    _id: mongoose.Types.ObjectId;
    request_sent_by_user_id: mongoose.Types.ObjectId;
    request_sent_to_user_id: mongoose.Types.ObjectId;
    status: 'request' | 'accepted' | 'rejected';
    is_active: 0 | 1;
}

const friendRequestSchema = new Schema<IFriendRequest>({
    request_sent_by_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    request_sent_to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['request', 'accepted', 'rejected'],
        required: true
    },
    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, { timestamps: true });

const FriendRequestModal = mongoose.model<IFriendRequest>('friendRequest', friendRequestSchema);
export default FriendRequestModal;
