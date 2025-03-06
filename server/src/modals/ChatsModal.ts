import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    _id: mongoose.Types.ObjectId;
    sender_unique_id: mongoose.Types.ObjectId;
    receiver_unique_id: mongoose.Types.ObjectId;
    message: string;
    status: 'sent' | 'delivered' | 'read';
    is_active: 0 | 1;
}

const chatSchema = new Schema<IChat>({
    sender_unique_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver_unique_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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

const ChatsModal = mongoose.model<IChat>('chat', chatSchema);
export default ChatsModal;