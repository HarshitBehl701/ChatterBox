import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupChat extends Document {
    _id: mongoose.Types.ObjectId;
    sender_user_id: mongoose.Types.ObjectId;
    group_id: mongoose.Types.ObjectId;
    message: string;
    status: 'sent' | 'delivered' | 'read';
    is_active: 0 | 1;
}

const groupChatSchema = new Schema<IGroupChat>({
    sender_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, { timestamps: true });

const GroupChatModal = mongoose.model<IGroupChat>('groupChat', groupChatSchema);
export default GroupChatModal;