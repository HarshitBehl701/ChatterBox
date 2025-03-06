import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    socketId: string;
    is_active: 0 | 1;
}

const connectionSchema = new Schema<IConnection>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, { timestamps: true });

const ConnectionModal = mongoose.model<IConnection>('connection', connectionSchema);
export default ConnectionModal;